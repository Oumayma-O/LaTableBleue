import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './models/restaurant.model';
import { TableService } from '../table/table.service';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { UpdateRestaurantDto } from './dto/updateRestaurant.dto';
import { CreateTableDto } from '../table/dto/createTable.dto';
import { Table } from '../table/models/table.model';
import { UpdateTableDto } from '../table/dto/updateTable.dto';
import { Review } from '../review/models/review.model';
import { ObjectId } from 'mongodb';
import EventEmitter2 from 'eventemitter2';
import { ReviewDeletedEvent } from '../review/review.events';
import { RestaurantDeletedEvent } from './restaurant..events';
import { RestaurantStatus } from "./models/enums";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    @Inject('EventEmitter2')
    private readonly eventEmitter: EventEmitter2,
    private tableService: TableService,
  ) {
    // Listen for the reviewDeleted event
    this.eventEmitter.on('reviewDeleted', (event: ReviewDeletedEvent) => {
      this.handleReviewDeleted(event.deletedReview);
    });
  }

  async deleteByRestaurateur(
    restaurateurId: string,
    restaurantId: string,
  ): Promise<void> {
    const restaurant = await this.restaurantModel.findById(restaurantId).exec();
    if (restaurant) {
      await restaurant.deleteOne();
    } else {
      throw new NotFoundException(`Restaurant not found`);
    }
    if (restaurateurId !== restaurant.manager.toString()) {
      throw new UnauthorizedException(
        'you are not authorized to delete the restaurant',
      );
    }
    this.deleteRestaurantAndAssociatedData(restaurantId);
  }

  async deleteRestaurantAndAssociatedData(restaurantId: string): Promise<void> {
    // Delete the restaurant
    const deletedRestaurant = await this.restaurantModel
      .findByIdAndDelete(restaurantId)
      .exec();

    // Emit the restaurantDeleted event
    this.eventEmitter.emit(
      'restaurantDeleted',
      new RestaurantDeletedEvent(deletedRestaurant),
    );
    console.log('restaurant successfully deleted');
  }

  async create(
    restaurateurId: string,
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    const createdRestaurant = new this.restaurantModel({
      ...createRestaurantDto,
      manager: restaurateurId,
    });
    return createdRestaurant.save();
  }

  async approveRestaurant(restaurantId: string): Promise<Restaurant> {
    return this.changeRestaurantStatus(restaurantId, RestaurantStatus.APPROVED);
  }

  async rejectRestaurant(restaurantId: string): Promise<Restaurant> {
    return this.changeRestaurantStatus(restaurantId, RestaurantStatus.REJECTED);
  }

  private async changeRestaurantStatus(
    restaurantId: string,
    status: RestaurantStatus,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantModel
      .findByIdAndUpdate(restaurantId, { status })
      .exec();
    return restaurant;
  }

  async getPendingRestaurants(): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({ status: RestaurantStatus.PENDING })
      .exec();
  }

  async findAll(query: any) {
    return await this.restaurantModel.find(query);
  }

  async getApprovedRestaurants(): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({ status: RestaurantStatus.APPROVED })
      .exec();
  }

  async getRejectedRestaurants(): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({ status: RestaurantStatus.REJECTED })
      .exec();
  }

  async update(
    restaurateurId: string,
    restaurantId: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    // restaurateur verif
    const restaurant = await this.restaurantModel.findById(restaurantId).exec();
    if (restaurant) {
      await restaurant.deleteOne();
    } else {
      throw new NotFoundException(`Restaurant not found`);
    }
    if (restaurateurId !== restaurant.manager.toString()) {
      throw new UnauthorizedException(
        'you are not authorized to delete the restaurant',
      );
    }
    return await this.restaurantModel.findByIdAndUpdate(
      restaurantId,
      updateRestaurantDto,
      { new: true },
    );
  }

  // update Menu / update Operating Hours

  async findRestaurantById(restaurantId: any): Promise<Restaurant> {
    const restaurant = await this.restaurantModel
      .findOne({
        _id: restaurantId,
        status: RestaurantStatus.APPROVED,
      })
      .exec();

    if (!restaurant) {
      throw new NotFoundException(
        `Approved restaurant with id ${restaurantId} not found`,
      );
    }
    return restaurant;
  }

  async findRestaurantsByName(name: string): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({
        restaurantName: name,
        status: RestaurantStatus.APPROVED,
      })
      .exec();
  }

  async findRestaurantsByCuisine(cuisine: string): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({
        cuisine: cuisine,
        status: RestaurantStatus.APPROVED,
      })
      .exec();
  }

  async findRestaurantsByCity(city: string): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({
        'address.city': city,
        status: RestaurantStatus.APPROVED,
      })
      .exec();
  }

  async findRestaurantsByMeal(meal: string): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({
        meals: meal,
        status: RestaurantStatus.APPROVED,
      })
      .exec();
  }

  async findRestaurantsByFeature(feature: string): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({
        features: feature,
        status: RestaurantStatus.APPROVED,
      })
      .exec();
  }

  async findRestaurantsByDish(dishName: string): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({
        'menu.dishName': dishName,
        status: RestaurantStatus.APPROVED,
      })
      .exec();
  }

  // ******* Tables *******

  async findRestaurantTables(restaurantId: string): Promise<Table[]> {
    const restaurant = await this.restaurantModel
      .findOne({
        _id: restaurantId,
        status: RestaurantStatus.APPROVED,
      })
      .populate({
        path: 'tables',
        model: Table.name, // Use Table.name instead of 'Table'
      })
      .exec();

    if (!restaurant) {
      throw new NotFoundException(
        `Approved Restaurant with id ${restaurantId} not found`,
      );
    }

    const tables: Table[] = restaurant.tables as unknown as Table[];

    if (tables.length === 0) {
      console.log('The restaurant has no table details saved');
    }

    return tables;
  }

  async findRestaurantTableById(
    restaurantId: string,
    tableId: string,
  ): Promise<Table> {
    const restaurant = await this.restaurantModel
      .findOne({
        _id: restaurantId,
        status: RestaurantStatus.APPROVED,
      })
      .populate({
        path: 'tables',
        model: Table.name, // Use Table.name instead of 'Table'
      })
      .exec();
    if (!restaurant) {
      throw new NotFoundException(
        `Approved Restaurant with id ${restaurantId} not found`,
      );
    }
    const table = await this.tableService.findTableById(tableId); // Use the new method here
    if (table.restaurant.toString() !== restaurantId) {
      throw new NotFoundException(
        `Table with id ${tableId} not found in the restaurant`,
      );
    }
    return table;
  }

  async findRestaurantTableByNumber(
    restaurantId: string,
    tableNumber: number,
  ): Promise<Table> {
    const restaurant = await this.restaurantModel
      .findOne({
        _id: restaurantId,
        status: RestaurantStatus.APPROVED,
      })
      .populate({
        path: 'tables',
        model: Table.name, // Use Table.name instead of 'Table'
      })
      .exec();
    if (!restaurant) {
      throw new NotFoundException(
        `Approved Restaurant with id ${restaurantId} not found`,
      );
    }
    const populatedTables: Table[] = restaurant.tables as unknown as Table[];
    const table = populatedTables.find((t) => t.number === tableNumber);
    if (!table) {
      throw new NotFoundException(
        `Table with number ${tableNumber} not found in the restaurant`,
      );
    }
    return table;
  }

  async findRestaurantTablesByCapacity(
    restaurantId: string,
    capacity: number,
  ): Promise<Table[]> {
    const restaurant = await this.restaurantModel
      .findOne({
        _id: restaurantId,
        status: RestaurantStatus.APPROVED,
      })
      .populate({
        path: 'tables',
        model: Table.name, // Use Table.name instead of 'Table'
      }) // Populate the 'tables' field with actual 'Table' objects
      .exec();
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id ${restaurantId} not found`,
      );
    }
    // Use type assertion to cast the populated 'tables' array
    const populatedTables: Table[] = restaurant.tables as unknown as Table[];
    // Filter tables by capacity
    const tablesWithCapacity = populatedTables.filter(
      (table) => table.capacity === capacity,
    );
    return tablesWithCapacity;
  }

  async findRestaurantTablesByDescription(
    restaurantId: string,
    description: string,
  ): Promise<Table[]> {
    const restaurant = await this.restaurantModel
      .findOne({
        _id: restaurantId,
        status: RestaurantStatus.APPROVED,
      })
      .populate({
        path: 'tables',
        model: Table.name, // Use Table.name instead of 'Table'
      }) // Populate the 'tables' field with actual 'Table' objects
      .exec();
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id ${restaurantId} not found`,
      );
    }
    const populatedTables: Table[] = restaurant.tables as unknown as Table[];
    // Filter tables by description
    const tablesWithDescription = populatedTables.filter(
      (table) => table.description === description,
    );
    return tablesWithDescription;
  }

  async addTableByRestaurateur(
    restaurateurId: ObjectId,
    createTableDto: CreateTableDto,
  ): Promise<Table> {
    const restaurant = await this.restaurantModel
      .findById(createTableDto.restaurant)
      .exec();
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id ${createTableDto.restaurant} not found`,
      );
    }
    if (restaurant.manager !== restaurateurId) {
      throw new NotFoundException('you are not authorized to add a table');
    }
    const createdTable = await this.tableService.createTable(createTableDto);
    restaurant.tables.push(createdTable._id);
    await restaurant.save();
    return createdTable;
  }

  async updateTableByRestaurateur(
    restaurateurId: ObjectId,
    restaurantId: string,
    tableId: string,
    updateTableDto: UpdateTableDto,
  ): Promise<Table> {
    const restaurant = await this.restaurantModel
      .findOne({ tables: { $in: [tableId] } })
      .exec();

    if (!restaurant) {
      throw new NotFoundException('Table not found in the restaurant');
    }
    if (restaurant.manager !== restaurateurId) {
      throw new NotFoundException('you are not authorized to delete the table');
    }

    const updatedTable = await this.tableService.updateTable(
      tableId,
      updateTableDto,
    );

    return updatedTable;
  }

  async deleteTableByRestaurateur(
    restaurateurId: ObjectId,
    restaurantId: string,
    tableId: string,
  ): Promise<Table> {
    const restaurant = await this.restaurantModel
      .findOne({ tables: { $in: [tableId] } })
      .exec();

    if (!restaurant) {
      throw new NotFoundException('Table not found in the restaurant');
    }
    if (restaurant.manager !== restaurateurId) {
      throw new NotFoundException('you are not authorized to update the table');
    }
    // should I just pull or verify bookings too ?
    return await this.tableService.deleteTable(tableId);
  }

  // ****** Reviews *******

  async getReviewsForRestaurant(restaurantId: ObjectId): Promise<Review[]> {
    const restaurant = await this.restaurantModel
      .findById(restaurantId)
      .populate({
        path: 'reviews',
        model: 'Review',
      })
      .exec();
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id ${restaurantId} not found`,
      );
    }
    const reviews: Review[] = restaurant.reviews as unknown as Review[];
    return reviews;
  }

  async updateAverageRating(restaurantId: ObjectId): Promise<void> {
    const restaurant = await this.restaurantModel.findById(restaurantId).exec();
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id ${restaurantId} not found`,
      );
    }
    const reviews = await this.getReviewsForRestaurant(restaurantId);
    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating.averageRating,
        0,
      );
      const averageRating = totalRating / reviews.length;
      restaurant.rating = averageRating;
      await restaurant.save();
    }
  }

  async addReviewToRestaurant(
    restaurantId: ObjectId,
    reviewId: ObjectId,
  ): Promise<void> {
    const restaurant = await this.restaurantModel.findById(restaurantId).exec();
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id ${restaurantId} not found`,
      );
    }
    restaurant.reviews.push(reviewId);
    await restaurant.save();
    await this.updateAverageRating(restaurantId);
  }

  async handleReviewDeleted(deletedReview: Review) {
    const restaurantId = deletedReview.restaurant; // Assuming this is how the relationship is stored
    const reviewId = deletedReview._id;

    // Remove the review ID from the restaurant's reviews array
    await this.removeReviewFromRestaurant(restaurantId, reviewId);
  }

  async removeReviewFromRestaurant(
    restaurantId: ObjectId,
    reviewId: ObjectId,
  ): Promise<void> {
    const restaurant = await this.restaurantModel.findById(restaurantId).exec();
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id ${restaurantId} not found`,
      );
    }
    const reviewIndex = restaurant.reviews.indexOf(reviewId);
    if (reviewIndex !== -1) {
      restaurant.reviews.splice(reviewIndex, 1);
      await restaurant.save();
      await this.updateAverageRating(restaurantId);
    }
  }

  // ****** Bookings *******
}
