import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Table } from './models/table.model';
import { CreateTableDto } from './dto/createTable.dto';
import { UpdateTableDto } from './dto/updateTable.dto';
import { EventEmitter2 } from 'eventemitter2';
import { Restaurant } from '../restaurant/models/restaurant.model';
import { TableDeletedEvent } from './table.events';
import { ObjectId } from 'mongodb';
import { RestaurantService } from '../restaurant/restaurant.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ReservationDetails } from '../restaurant/models/reservation.details.model';

@Injectable()
export class TableService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<Table>,
    private eventEmitter: EventEmitter2,
    private restaurantService: RestaurantService,
  ) {}

  handleRestaurantDeleted(deletedRestaurant: Restaurant) {
    // Delete tables associated with the deleted restaurant
    this.deleteTablesByRestaurantId(deletedRestaurant._id);
  }

  async deleteTablesByRestaurantId(restaurantId: string): Promise<void> {
    const deletedTables = await this.tableModel
      .deleteMany({ restaurant: restaurantId })
      .exec();

    if (!deletedTables.deletedCount) {
      console.log(`No tables found for the restaurant`);
    }
  }

  async deleteTable(tableId: string): Promise<Table> {
    const table = await this.tableModel.findById(tableId).exec();

    if (!table) {
      throw new NotFoundException(`Table with id ${tableId} not found`);
    }

    if (table.bookings && table.bookings.length > 0) {
      throw new ConflictException('Cannot delete a table with bookings');
    }

    this.eventEmitter.emit('tableDeleted', new TableDeletedEvent(table));

    await table.deleteOne();
    return table;
  }

  @OnEvent('restaurantDeleted')
  private async removeTableFromRestaurant(
    restaurantId: Types.ObjectId,
    tableId: string,
  ) {
    await this.tableModel.updateOne(
      { _id: restaurantId },
      { $pull: { tables: tableId } },
    );
  }

  async createTable(createTableDto: CreateTableDto): Promise<Table> {
    try {
      const createdTable = new this.tableModel(createTableDto);
      console.log(createdTable);
      return await createdTable.save();
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }

  async findTableById(tableId: string): Promise<Table> {
    try {
      const table = await this.tableModel
        .findById(tableId)
        .populate('bookings')
        .exec();
      if (!table) {
        throw new NotFoundException('Table not found');
      }
      return table;
    } catch (error) {
      throw new NotFoundException('Table not found');
    }
  }

  async createManyTables(createTableDtos: CreateTableDto[]): Promise<Table[]> {
    const createdTables: Table[] = [];

    for (const createTableDto of createTableDtos) {
      const newTable = new this.tableModel(createTableDto);
      const createdTable = await newTable.save();
      createdTables.push(createdTable);
    }

    return createdTables;
  }

  async updateTable(
    tableId: string,
    updateTableDto: UpdateTableDto,
  ): Promise<Table> {
    const existingTable = await this.tableModel.findById(tableId).exec();
    if (!existingTable) {
      throw new NotFoundException('Table not found');
    }

    for (const key in updateTableDto) {
      if (updateTableDto.hasOwnProperty(key)) {
        existingTable[key] = updateTableDto[key];
      }
    }
    // Save the updated table
    await existingTable.save();

    return existingTable;
  }

  async addTableByRestaurateur(
    restaurateurId: ObjectId,
    restaurantId: string,
    createTableDto: CreateTableDto,
  ): Promise<Table> {
    const restaurant = await this.restaurantService.getApprovedRestaurant(
      restaurantId,
    );

    if (restaurant.manager !== restaurateurId) {
      throw new NotFoundException('you are not authorized to add a table');
    }
    const createdTable = await this.createTable(createTableDto);
    await this.restaurantService.addTableToRestaurant(
      restaurant._id,
      createdTable._id,
    );
    return createdTable;
  }

  async addTablesByRestaurateur(
    restaurateurId: ObjectId,
    restaurantId: string,
    createTableDtos: CreateTableDto[],
  ): Promise<string> {
    const restaurant = await this.restaurantService.getApprovedRestaurant(
      restaurantId,
    );

    if (restaurant.manager !== restaurateurId) {
      throw new NotFoundException('You are not authorized to add tables');
    }

    const currentTableCount = await this.tableModel.countDocuments({
      restaurant: restaurantId,
    });

    const totalTablesToAdd = createTableDtos.length;
    const maxTableNumber = restaurant.tableNumber;

    // Add the tables directly
    const createdTables = await this.createManyTables(createTableDtos);
    await this.restaurantService.addTablesToRestaurant(
      restaurant._id,
      createdTables.map((table) => table._id),
    );

    if (currentTableCount + totalTablesToAdd <= maxTableNumber) {
      return 'Tables added successfully';
    } else {
      // Update the restaurant's maximum table number
      restaurant.tableNumber = currentTableCount + totalTablesToAdd;
      await restaurant.save();

      return 'The number of tables has been updated, and tables added successfully';
    }
  }

  async updateTableByRestaurateur(
    restaurateurId: ObjectId,
    tableId: string,
    updateTableDto: UpdateTableDto,
  ): Promise<Table> {
    const table = await this.findTableById(tableId);
    const restaurant = await this.restaurantService.getApprovedRestaurant(
      table.restaurant.toString(),
    );

    if (restaurant.manager !== restaurateurId) {
      throw new NotFoundException('you are not authorized to delete the table');
    }

    const updatedTable = await this.updateTable(tableId, updateTableDto);

    return updatedTable;
  }

  async deleteTableByRestaurateur(
    restaurateurId: ObjectId,
    tableId: string,
  ): Promise<Table> {
    const table = await this.findTableById(tableId);
    const restaurant = await this.restaurantService.getApprovedRestaurant(
      table.restaurant.toString(),
    );

    if (restaurant.manager !== restaurateurId) {
      throw new NotFoundException('you are not authorized to delete the table');
    }
    return await this.deleteTable(tableId);
  }

  async checkAvailability(
    restaurantId: string,
    partySize: number,
    dateTime: Date,
  ): Promise<Table[]> {
    // Get the current date and time
    const currentDateTime = new Date();

    // Check if dateTime is in the past
    if (dateTime < currentDateTime) {
      throw new ConflictException(`the dateTime is not valid`);
    }

    const restaurant = await this.restaurantService.getApprovedRestaurant(
      restaurantId,
    );

    const reservationDetails: ReservationDetails =
      restaurant.reservationDetails;

    const reservationDuration = reservationDetails.reservationDuration;
    const preparationTime = reservationDetails.preparationTime;
    const bookingBufferTime = reservationDetails.bookingBufferTime;

    const requestedStartTime = new Date(dateTime);
    requestedStartTime.setMinutes(
      requestedStartTime.getMinutes() - (preparationTime + bookingBufferTime),
    );

    const requestedEndTime = new Date(requestedStartTime);
    requestedEndTime.setMinutes(
      requestedEndTime.getMinutes() + reservationDuration,
    );

    const operatingHours = restaurant.operatingHours.days.find(
      (day) =>
        day.day === dateTime.toLocaleDateString('en-US', { weekday: 'long' }),
    );

    if (!operatingHours) {
      throw new NotFoundException('Restaurant is closed on that day');
    }

    const openingTime = new Date(dateTime);
    openingTime.setHours(
      parseInt(operatingHours.intervals[0].openingTime.split(':')[0]),
      parseInt(operatingHours.intervals[0].openingTime.split(':')[1]),
    );

    const closingTime = new Date(dateTime);
    closingTime.setHours(
      parseInt(operatingHours.intervals[0].closingTime.split(':')[0]),
      parseInt(operatingHours.intervals[0].closingTime.split(':')[1]),
    );

    if (
      requestedEndTime <= openingTime ||
      requestedStartTime >= closingTime ||
      closingTime.getTime() - dateTime.getTime() <
        reservationDuration * 60 * 1000
    ) {
      throw new ConflictException('reservation not possible ');
    }

    const availableTables = await this.tableModel.find({
      restaurant: restaurantId,
      bookings: {
        $not: {
          $elemMatch: {
            dateTime: {
              $lte: requestedEndTime,
              $gte: requestedStartTime,
            },
          },
        },
      },
      capacity: { $gte: partySize },
    });

    return availableTables;
  }

  async addBookingToTables(tables: Table[], booking: ObjectId) {
    for (const table of tables) {
      table.bookings.push(booking);
      await table.save();
    }
  }
}
