import {Injectable, NotFoundException} from '@nestjs/common';
import {Model, Types} from 'mongoose';
import { RestaurantRepository } from './restaurant.repository';
import {InjectModel} from "@nestjs/mongoose";
import {Restaurant} from "./models/restaurant.model";
import {CreateRestaurantDto} from "./dto/createRestaurant.dto";
import {Table, TableDescription} from "../table/table.model";
import {CreateTableDto} from "../table/createTable.dto";
import {TableService} from "../table/table.service";

@Injectable()
export class RestaurantService {
  //getCancelationDeadline
  //GetPayementdeadline
    constructor(
        @InjectModel(Restaurant.name) private readonly restaurantModel: Model<Restaurant>,
        private readonly tableService: TableService
    ) {}

    async create(createRestaurantDto: CreateRestaurantDto) {
        const createdRestaurant = new this.restaurantModel(createRestaurantDto);
        return await createdRestaurant.save();
    }

    async findOne(id: string) {
        return await this.restaurantModel.findById(id);
    }

    async findAll(query: any) {
        return await this.restaurantModel.find(query);
    }

    async update(id: string, updateRestaurantDto: Partial<Restaurant>) {
        return await this.restaurantModel.findByIdAndUpdate(id, updateRestaurantDto, {new: true,});
    }

    async remove(id: string) {
        return await this.restaurantModel.findByIdAndRemove(id);
    }

    async findRestaurantsByName(name: string): Promise<Restaurant[]> {
        return this.restaurantModel.find({ name:name }).exec();
    }

    async findRestaurantsByCuisine(cuisine: string): Promise<Restaurant[]> {
        return this.restaurantModel.find({ cuisine: cuisine }).exec();
    }

    async findRestaurantsByCity(city: string): Promise<Restaurant[]> {
        return this.restaurantModel.find({ city: city }).exec();
    }

    async findRestaurantsByMeal(meal: string): Promise<Restaurant[]> {
        return this.restaurantModel.find({ meals: { $in: [meal] } }).exec();
    }

    async findRestaurantsByFeature(feature: string): Promise<Restaurant[]> {
        return this.restaurantModel.find({ features: { $in: [feature] } }).exec();
    }

    async addTableToRestaurant(createTableDto: CreateTableDto): Promise<Table> {
        const restaurant = await this.restaurantModel.findById(createTableDto.restaurantId).exec();
        if (!restaurant) {
            throw new NotFoundException(`Restaurant with id ${createTableDto.restaurantId} not found`);
        }
        const createdTable = await this.tableService.createTable(createTableDto);
        restaurant.tables.push(createdTable._id);
        await restaurant.save();
        return createdTable;
    }

    async findRestaurantTables(restaurantId: string): Promise<Table[]> {
        const restaurant = await this.restaurantModel
            .findById(restaurantId)
            .populate({
                path: 'tables',
                model: 'Table', // The 'ref' value of the Table schema
            })
            .exec();

        if (!restaurant) {
            throw new NotFoundException(`Restaurant with id ${restaurantId} not found`);
        }

        // Use type assertion to cast the populated 'tables' array
        const tables: Table[] = restaurant.tables as unknown as Table[];

        return tables;
    }


    async findRestaurantTableById(restaurantId: string, tableId: string): Promise<Table> {
        const restaurant = await this.restaurantModel
            .findById(restaurantId)
            .populate('tables')
            .exec();

        if (!restaurant) {
            throw new NotFoundException(`Restaurant with id ${restaurantId} not found`);
        }

        // Use type assertion to cast the populated 'tables' array
        const populatedTables: Table[] = restaurant.tables as unknown as Table[];

        const table = populatedTables.find(t => t._id.toString() === tableId);
        if (!table) {
            throw new NotFoundException(`Table with id ${tableId} not found in the restaurant`);
        }

        return table;
    }

    async findRestaurantTableByNumber(restaurantId: string, tableNumber: number): Promise<Table> {
        const restaurant = await this.restaurantModel
            .findById(restaurantId)
            .populate('tables')
            .exec();
        if (!restaurant) {
            throw new NotFoundException(`Restaurant with id ${restaurantId} not found`);
        }
        const populatedTables: Table[] = restaurant.tables as unknown as Table[];
        const table = populatedTables.find(t => t.number === tableNumber);
        if (!table) {
            throw new NotFoundException(`Table with number ${tableNumber} not found in the restaurant`);
        }
        return table;
    }

    async findRestaurantTablesByCapacity(restaurantId: string, capacity: number): Promise<Table[]> {
        const restaurant = await this.restaurantModel
            .findById(restaurantId)
            .populate('tables') // Populate the 'tables' field with actual 'Table' objects
            .exec();

        if (!restaurant) {
            throw new NotFoundException(`Restaurant with id ${restaurantId} not found`);
        }

        // Use type assertion to cast the populated 'tables' array
        const populatedTables: Table[] = restaurant.tables as unknown as Table[];

        // Filter tables by capacity
        const tablesWithCapacity = populatedTables.filter(table => table.capacity === capacity);

        return tablesWithCapacity;
    }

    async findRestaurantTablesByDescription(restaurantId: string, description: string): Promise<Table[]> {
        const restaurant = await this.restaurantModel
            .findById(restaurantId)
            .populate('tables')
            .exec();

        if (!restaurant) {
            throw new NotFoundException(`Restaurant with id ${restaurantId} not found`);
        }

        const populatedTables: Table[] = restaurant.tables as unknown as Table[];

        // Filter tables by description
        const tablesWithDescription = populatedTables.filter(table => table.description === description);

        return tablesWithDescription;
    }




    async updateRestaurantTable(restaurantId: string, tableId: string, updateTableDto: Partial<Table>): Promise<Table> {
        const restaurant = await this.restaurantModel.findById(restaurantId).exec();
        if (!restaurant) {
            throw new NotFoundException(`Restaurant with id ${restaurantId} not found`);
        }
        const table = await this.findRestaurantTableById(restaurantId,tableId);
        if (!table) {
            throw new NotFoundException(`Table with id ${tableId} not found`);
        }
        // Ensure the updated properties are valid
        if (updateTableDto.number) table.number = updateTableDto.number;
        if (updateTableDto.capacity) table.capacity = updateTableDto.capacity;
        if (updateTableDto.description) table.description = updateTableDto.description;

        await table.save();

        return table;
    }


    async deleteRestaurantTable(restaurantId: string, tableId: string): Promise<void> {
        const restaurant = await this.restaurantModel.findById(restaurantId).exec();
        if (!restaurant) {
            throw new NotFoundException(`Restaurant with id ${restaurantId} not found`);
        }

        const tableIndex = restaurant.tables.findIndex(t => t._id.toString() === tableId);
        if (tableIndex === -1) {
            throw new NotFoundException(`Table with id ${tableId} not found in the restaurant`);
        }

        restaurant.tables.splice(tableIndex, 1);
        await restaurant.save();
        await this.tableService.removeTable(tableId);

    }



}
