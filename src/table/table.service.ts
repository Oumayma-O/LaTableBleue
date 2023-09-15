import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table } from './models/table.model';
import { CreateTableDto } from './dto/createTable.dto';
import { UpdateTableDto } from './dto/updateTable.dto';
import { EventEmitter2 } from 'eventemitter2';
import { TableDeletedEvent } from './table.events';
import { ObjectId } from 'mongodb';
import { RestaurantService } from '../restaurant/restaurant.service';
import { ReservationDetails } from '../restaurant/models/reservation.details.model';

@Injectable()
export class TableService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<Table>,
    private eventEmitter: EventEmitter2,
    private restaurantService: RestaurantService,
  ) {}

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

  async createTable(
    createTableDto: CreateTableDto,
    restaurantId: ObjectId,
  ): Promise<Table> {
    try {
      const createdTable = new this.tableModel({
        ...createTableDto,
        restaurant: restaurantId,
      });
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

  async createManyTables(
    createTableDtos: CreateTableDto[],
    restaurantId: ObjectId,
  ): Promise<Table[]> {
    const createdTables: Table[] = [];

    for (const createTableDto of createTableDtos) {
      const newTable = new this.tableModel({
        ...createTableDto,
        restaurant: restaurantId,
      });
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
    restaurantId: ObjectId,
    createTableDto: CreateTableDto,
  ): Promise<Table> {
    const restaurant = await this.restaurantService.getApprovedRestaurant(
      restaurantId.toString(),
    );

    if (restaurant.manager !== restaurateurId) {
      throw new NotFoundException('you are not authorized to add a table');
    }
    const createdTable = await this.createTable(createTableDto, restaurantId);
    await this.restaurantService.addTableToRestaurant(
      restaurant._id,
      createdTable._id,
    );
    return createdTable;
  }

  async addTablesByRestaurateur(
    restaurateurId: ObjectId,
    restaurantId: ObjectId,
    createTableDtos: CreateTableDto[],
  ): Promise<string> {
    const restaurant = await this.restaurantService.getApprovedRestaurant(
      restaurantId.toString(),
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
    const createdTables = await this.createManyTables(
      createTableDtos,
      restaurantId,
    );
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
  async addBookingToTables(tableIds: ObjectId[], booking: ObjectId) {
    for (const tableId of tableIds) {
      await this.tableModel.updateOne(
        { _id: tableId },
        { $push: { bookings: booking } },
      );
    }
  }
}
