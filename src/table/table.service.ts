import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Table } from './table.model';
import {CreateTableDto} from "./createTable.dto";
import * as mongoose from "mongoose";

@Injectable()
export class TableService {
  constructor(@InjectModel(Table.name) private readonly tableModel: Model<Table>) {}



  /*async createTable(createTableDto: CreateTableDto): Promise<Table> {
    const newTable = new this.tableModel(createTableDto);
    return await newTable.save();
  }*/
  async createTable(createTableDto: CreateTableDto): Promise<Table> {
    const restaurantId = new mongoose.Types.ObjectId(createTableDto.restaurant); // Convert string to ObjectId

    const newTable = new this.tableModel({
      ...createTableDto,
      restaurant: restaurantId,
    });

    return await newTable.save();
  }

  async findTableById(id: string): Promise<Table | null> {
    return await this.tableModel.findById(id).exec();
  }
//all tables in the system
  async findAllTables(): Promise<Table[]> {
    return await this.tableModel.find().exec();
  }

  /*
//find table by number in a restaurant
  async findRestaurantTableByNumber(restaurantId: string,number: number): Promise<Table | null> {
    return await this.tableModel.findOne({restaurant:restaurantId, number: number}).exec();
  }
//all tables in a restaurant
  async findAllRestaurantTables(restaurantId: string): Promise<Table[]> {
    return await this.tableModel.find({restaurant:restaurantId}).exec();
  }
  //tables in a restaurant with a specific capacity
  async findRestaurantTablesByCapacity(restaurantId: string, capacity: number): Promise<Table[]> {
    return await this.tableModel.find({restaurant:restaurantId,capacity:capacity}).exec();
  }
//tables in a restaurant with a specific description
  async findRestaurantTablesByDescription(restaurantId: string, description:string): Promise<Table[]> {
    return await this.tableModel.find({restaurant:restaurantId,description:description}).exec();
  }*/

  async updateTable(id: string, updateTableData: Partial<Table>): Promise<Table | null> {
    return await this.tableModel.findByIdAndUpdate(id, updateTableData, { new: true }).exec();
  }

  async removeTable(id: string): Promise<Table | null> {
    return await this.tableModel.findByIdAndDelete(id).exec();
  }
}
