import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseFilters} from '@nestjs/common';
import { DuplicateKeyExceptionFilter } from '../filters/DuplicateKeyExceptionFilter';
import {RestaurantService} from "./restaurant.service";
import {CreateRestaurantDto} from "./dto/createRestaurant.dto";
import {Restaurant} from "./models/restaurant.model";
import {TableService} from "../table/table.service";
import {Table} from "../table/table.model";
import {CreateTableDto} from "../table/createTable.dto";
import {Review} from "../review/review.model";

@Controller('restaurant')
@UseFilters(DuplicateKeyExceptionFilter)
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService,
                private readonly tableService: TableService) {}

    @Post()
    async create(@Body() createRestaurantDto: CreateRestaurantDto) {
        return await this.restaurantService.create(createRestaurantDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.restaurantService.findOne(id);
    }

    @Get()
    async findAll(@Query() query: any) {
        return await this.restaurantService.findAll(query);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateRestaurantDto: Partial<Restaurant>) {
        return await this.restaurantService.update(id, updateRestaurantDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.restaurantService.remove(id);
    }


    @Get('byName/:name')
    async findRestaurantsByName(@Param('name') name: string) {
        return await this.restaurantService.findRestaurantsByName(name);
    }

    @Get('byCuisine/:cuisine')
    async findRestaurantsByCuisine(@Param('cuisine') cuisine: string) {
        return await this.restaurantService.findRestaurantsByCuisine(cuisine);
    }

    @Get('byCity/:city')
    async findRestaurantsByCity(@Param('city') city: string) {
        return await this.restaurantService.findRestaurantsByCity(city);
    }

    @Get('byMeal/:meal')
    async findRestaurantsByMeal(@Param('meal') meal: string) {
        return await this.restaurantService.findRestaurantsByMeal(meal);
    }

    @Get('byFeature/:feature')
    async findRestaurantsByFeature(@Param('feature') feature: string) {
        return await this.restaurantService.findRestaurantsByFeature(feature);
    }

    @Post(':id/tables')
    async addTableToRestaurant(
        @Param('id') restaurantId: string,
        @Body() createTableDto: CreateTableDto,
    ): Promise<Table> {
        createTableDto.restaurant = restaurantId;
        const createdTable = await this.restaurantService.addTableToRestaurant(createTableDto);
        return createdTable;
    }

    @Get(':id/tables')
    async findAllRestaurantTables(
        @Param('id') restaurantId: string,
    ): Promise<Table[]> {
        return this.restaurantService.findRestaurantTables(restaurantId);
    }

    @Get(':id/tableById/:tableId')
    async findRestaurantTableById(
        @Param('id') restaurantId: string,
        @Param('tableId') tableId: string,
    ): Promise<Table> {
        return this.restaurantService.findRestaurantTableById(restaurantId, tableId);
    }

    @Get(':id/tableByNumber/:tableNumber')
    async findRestaurantTableByNumber(
        @Param('id') restaurantId: string,
        @Param('tableNumber', ParseIntPipe) tableNumber:number,
    ): Promise<Table> {
        return this.restaurantService.findRestaurantTableByNumber(restaurantId, tableNumber);
    }

    @Get(':id/tablesByCapacity/:capacity')
    async findRestaurantTableByCapacity(
        @Param('id') restaurantId: string,
        @Param('capacity', ParseIntPipe) capacity:number,
    ): Promise<Table[]> {
        return this.restaurantService.findRestaurantTablesByCapacity(restaurantId, capacity);
    }

    @Get(':id/tablesByDescription/:description')
    async findRestaurantTableByDescription(
        @Param('id') restaurantId: string,
        @Param('description') description:string,
    ): Promise<Table[]> {
        return this.restaurantService.findRestaurantTablesByDescription(restaurantId, description);
    }

    @Put(':id/tables/:tableId')
    async updateRestaurantTable(
        @Param('id') restaurantId: string,
        @Param('tableId') tableId: string,
        @Body() updateTableDto: Partial<Table>,
    ): Promise<Table> {
        return this.restaurantService.updateRestaurantTable(restaurantId, tableId, updateTableDto);
    }

    @Delete(':id/tables/:tableId')
    async deleteRestaurantTable(
        @Param('id') restaurantId: string,
        @Param('tableId') tableId: string,
    ): Promise<void> {
        await this.restaurantService.deleteRestaurantTable(restaurantId, tableId);
    }

    @Get(':id/reviews')
    async getReviewsForRestaurant(
        @Param('id') restaurantId: string,
    ): Promise<Review[]> {
        return this.restaurantService.getReviewsForRestaurant(restaurantId);
    }


}
