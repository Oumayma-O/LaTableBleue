import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table } from './models/table.model';
import { CreateTableDto } from './dto/createTable.dto';
import { UpdateTableDto } from './dto/updateTable.dto';
import EventEmitter2 from 'eventemitter2';
import { RestaurantDeletedEvent } from '../restaurant/restaurant..events';
import { Restaurant } from '../restaurant/models/restaurant.model';

@Injectable()
export class TableService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<Table>,
    @Inject('EventEmitter2') private readonly eventEmitter: EventEmitter2, // Inject the EventEmitter2
  ) {
    // Listen for the restaurantDeleted event
    this.eventEmitter.on(
      'restaurantDeleted',
      (event: RestaurantDeletedEvent) => {
        this.handleRestaurantDeleted(event.deletedRestaurant);
      },
    );
  }

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

  // remove it from the booking   nd resto
  async deleteTable(tableId: string): Promise<Table> {
    const table = await this.tableModel.findByIdAndDelete(tableId).exec();
    if (!table) {
      throw new NotFoundException(`Table with id ${tableId} not found`);
    }
    return table;
  }

  async createTable(createTableDto: CreateTableDto): Promise<Table> {
    const newTable = new this.tableModel(createTableDto);
    return newTable.save();
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
}
