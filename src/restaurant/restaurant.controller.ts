import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './restaurant.model';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    return this.restaurantService.createRestaurant(createRestaurantDto);
  }

  @Get()
  findAll(): Promise<Restaurant[]> {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Restaurant | null> {
    return this.restaurantService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRestaurantDto: CreateRestaurantDto): Promise<Restaurant | null> {
    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Restaurant | null> {
    return this.restaurantService.remove(id);
  }
}
