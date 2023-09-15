import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RestaurantService } from './restaurant.service';
import { UserRole } from '../users/UserRole.enum';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { Restaurant } from './models/restaurant.model';
import { Public } from '../auth/decorators/public.decorator';
import { UpdateRestaurantDto } from './dto/updateRestaurant.dto';
import { Table } from '../table/models/table.model';
import { Review } from '../review/models/review.model';
import { ObjectId } from 'mongodb';
import { ParseObjectIdPipe } from '../Pipes/parse-object-id.pipe';
import { CreateOperatingHoursDto } from './dto/createOperatingHours.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Delete(':restaurantId')
  @Roles(UserRole.RESTAURATEUR)
  async deleteByRestaurateur(
    @Req() req,
    @Param('restaurantId') restaurantId: string,
  ): Promise<void> {
    await this.restaurantService.deleteByRestaurateur(
      req.jwtPayload.sub,
      restaurantId,
    );
  }

  @Delete('admin/:restaurantId')
  @Roles(UserRole.ADMIN)
  async deleteRestaurantAndAssociatedData(
    @Param('restaurantId') restaurantId: string,
  ): Promise<void> {
    await this.restaurantService.deleteRestaurantAndAssociatedData(
      restaurantId,
    );
  }

  @Post()
  @Roles(UserRole.RESTAURATEUR)
  async create(
    @Req() req,
    @Body() createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurateurId = req.jwtPayload.sub;
    return this.restaurantService.create(restaurateurId, createRestaurantDto);
  }

  @Patch('approve/:restaurantId')
  @Roles(UserRole.ADMIN)
  async approveRestaurant(
    @Param('restaurantId') restaurantId: string,
  ): Promise<Restaurant> {
    return this.restaurantService.approveRestaurant(restaurantId);
  }

  @Patch('reject/:restaurantId')
  @Roles(UserRole.ADMIN)
  async rejectRestaurant(
    @Param('restaurantId') restaurantId: string,
  ): Promise<Restaurant> {
    return this.restaurantService.rejectRestaurant(restaurantId);
  }

  @Get('pending')
  @Roles(UserRole.ADMIN)
  async getPendingRestaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getPendingRestaurants();
  }

  @Public()
  @Get('approved')
  async getApprovedRestaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getApprovedRestaurants();
  }

  @Get('rejected')
  @Roles(UserRole.ADMIN)
  async getRejectedRestaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getRejectedRestaurants();
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query() query: any): Promise<Restaurant[]> {
    return this.restaurantService.findAll(query);
  }

  @Public()
  @Get('approved/:restaurantId')
  async getApprovedRestaurantById(
    @Param('restaurantId') restaurantId: string,
  ): Promise<Restaurant> {
    return this.restaurantService.getApprovedRestaurant(restaurantId);
  }

  @Patch(':restaurantId')
  @Roles(UserRole.RESTAURATEUR)
  async update(
    @Req() req,
    @Param('restaurantId') restaurantId: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurateurId = req.jwtPayload.sub;
    return this.restaurantService.update(
      restaurateurId,
      restaurantId,
      updateRestaurantDto,
    );
  }

  @Get(':restaurantId')
  @Roles(UserRole.ADMIN)
  async findRestaurantById(
    @Param('restaurantId') restaurantId: string,
  ): Promise<Restaurant> {
    return this.restaurantService.findRestaurantById(restaurantId);
  }

  @Public()
  @Get('search/name')
  async findRestaurantsByName(
    @Query('name') name: string,
  ): Promise<Restaurant[]> {
    return this.restaurantService.findRestaurantsByName(name);
  }

  @Public()
  @Get('search/cuisine')
  async findRestaurantsByCuisine(
    @Query('cuisine') cuisine: string,
  ): Promise<Restaurant[]> {
    return this.restaurantService.findRestaurantsByCuisine(cuisine);
  }

  @Public()
  @Get('search/city')
  async findRestaurantsByCity(
    @Query('city') city: string,
  ): Promise<Restaurant[]> {
    return this.restaurantService.findRestaurantsByCity(city);
  }

  @Public()
  @Get('search/meal')
  async findRestaurantsByMeal(
    @Query('meal') meal: string,
  ): Promise<Restaurant[]> {
    return this.restaurantService.findRestaurantsByMeal(meal);
  }

  @Public()
  @Get('search/feature')
  async findRestaurantsByFeature(
    @Query('feature') feature: string,
  ): Promise<Restaurant[]> {
    return this.restaurantService.findRestaurantsByFeature(feature);
  }

  @Public()
  @Get('search/dish')
  async findRestaurantsByDish(
    @Query('dishName') dishName: string,
  ): Promise<Restaurant[]> {
    return this.restaurantService.findRestaurantsByDish(dishName);
  }

  @Public()
  @Get(':restaurantId/tables')
  async findRestaurantTables(
    @Param('restaurantId') restaurantId: string,
  ): Promise<Table[]> {
    return this.restaurantService.findRestaurantTables(restaurantId);
  }

  @Get(':restaurantId/tables/:tableId')
  @Roles(UserRole.RESTAURATEUR)
  async findRestaurantTableById(
    @Param('restaurantId') restaurantId: string,
    @Param('tableId') tableId: string,
  ): Promise<Table> {
    return this.restaurantService.findRestaurantTableById(
      restaurantId,
      tableId,
    );
  }

  @Public()
  @Get(':restaurantId/tables/search/number')
  async findRestaurantTableByNumber(
    @Param('restaurantId') restaurantId: string,
    @Query('number') tableNumber: number,
  ): Promise<Table> {
    return this.restaurantService.findRestaurantTableByNumber(
      restaurantId,
      tableNumber,
    );
  }

  @Public()
  @Get(':restaurantId/tables/search/capacity')
  async findRestaurantTablesByCapacity(
    @Param('restaurantId') restaurantId: string,
    @Query('capacity') capacity: number,
  ): Promise<Table[]> {
    return this.restaurantService.findRestaurantTablesByCapacity(
      restaurantId,
      capacity,
    );
  }

  @Public()
  @Get(':restaurantId/tables/search/description')
  async findRestaurantTablesByDescription(
    @Param('restaurantId') restaurantId: string,
    @Query('description') description: string,
  ): Promise<Table[]> {
    return this.restaurantService.findRestaurantTablesByDescription(
      restaurantId,
      description,
    );
  }

  @Public()
  @Get(':restaurantId/reviews')
  async getReviewsForRestaurant(
    @Param('restaurantId', ParseObjectIdPipe) restaurantId: ObjectId,
  ): Promise<Review[]> {
    return this.restaurantService.getReviewsForRestaurant(restaurantId);
  }

  @Post('OperatingHours/:restaurantId')
  @Roles(UserRole.RESTAURATEUR)
  async addOperatingHours(
    @Req() req,
    @Param('restaurantId') restaurantId: string,
    @Body() createOperatingHoursDto: CreateOperatingHoursDto,
  ) {
    // Replace 'authUserId' with the actual method to get the authenticated user's ID
    const authUserId = req.jwtPayload.sub;
    console.log(restaurantId);

    const updatedRestaurant = await this.restaurantService.addOperatingHours(
      authUserId,
      restaurantId,
      createOperatingHoursDto,
    );

    return updatedRestaurant;
  }
}
