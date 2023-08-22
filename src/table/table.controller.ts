import {Controller, Get, Post, Put, Delete, Body, Param, Query} from '@nestjs/common';
import { TableService } from './table.service';
import { Table } from './table.model';
import {CreateTableDto} from "./createTable.dto";
import {RestaurantService} from "../restaurant/restaurant.service";

@Controller('tables')
export class TableController {
    constructor(private readonly tableService: TableService) {}

    @Post()
    async createTable(@Body() createTableDto: CreateTableDto): Promise<Table> {
        return await this.tableService.createTable(createTableDto);
    }

    @Get(':id')
    async findTableById(@Param('id') id: string): Promise<Table | null> {
        return this.tableService.findTableById(id);
    }

    @Get()
    async findAllTables(): Promise<Table[]> {
        return this.tableService.findAllTables();
    }

    /*@Get('restaurant/number')
    async findRestaurantTableByNumber(
        @Query('restaurantId') restaurantId: string,
        @Query('number') number: number
    ) {
        return await this.tableService.findRestaurantTableByNumber(restaurantId, number);
    }

    @Get('restaurant/:restaurantId')
    async findAllRestaurantTables(@Param('restaurantId') restaurantId: string) {
        return await this.tableService.findAllRestaurantTables(restaurantId);
    }

    @Get('restaurant/capacity')
    async findRestaurantTablesByCapacity(
        @Query('restaurantId') restaurantId: string,
        @Query('capacity') capacity: number
    ) {
        return await this.tableService.findRestaurantTablesByCapacity(restaurantId, capacity);
    }

    @Get('restaurant/description')
    async findRestaurantTablesByDescription(
        @Query('restaurantId') restaurantId: string,
        @Query('description') description: string
    ) {
        return await this.tableService.findRestaurantTablesByDescription(restaurantId, description);
    }


@Put(':id')
    async updateTable(@Param('id') id: string, @Body() updateTableData: Partial<Table>): Promise<Table | null> {
        return this.tableService.updateTable(id, updateTableData);
    }

    @Delete(':id')
    async removeTable(@Param('id') id: string): Promise<Table | null> {
        return this.tableService.removeTable(id);
    }*/
}
