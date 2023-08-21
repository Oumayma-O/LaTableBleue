import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseFilters} from '@nestjs/common';
import { DuplicateKeyExceptionFilter } from '../filters/DuplicateKeyExceptionFilter';
import {RestaurantService} from "./restaurant.service";
import {CreateRestaurantDto} from "./dto/createRestaurant.dto";
import {Restaurant} from "./models/restaurant.model";

@Controller('restaurant')
@UseFilters(DuplicateKeyExceptionFilter)
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {}

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
}
