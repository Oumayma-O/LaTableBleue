import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './models/restaurant.model';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { UpdateRestaurantDto } from './dto/updateRestaurant.dto';
import { Table } from '../table/models/table.model';
import { Review } from '../review/models/review.model';
import { ObjectId } from 'mongodb';
import { EventEmitter2 } from 'eventemitter2';
import { RestaurantDeletedEvent } from './restaurant.events';
import { RestaurantStatus } from './models/enums';
import { Booking } from '../booking/models/booking.model';
import { OperatingHours } from './models/operatingHours.model';
import { CreateOperatingHoursDto } from './dto/createOperatingHours.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    private eventEmitter: EventEmitter2,
  ) {}

  async deleteByRestaurateur(
    restaurateurId: string,
    restaurantId: string,
  ): Promise<void> {
    const restaurant = await this.getApprovedRestaurant(restaurantId);

    if (restaurateurId !== restaurant.manager.toString()) {
      throw new UnauthorizedException(
        'you are not authorized to delete this restaurant',
      );
    }
    this.deleteRestaurantAndAssociatedData(restaurantId);
  }

  async deleteRestaurantAndAssociatedData(restaurantId: string): Promise<void> {
    // Delete the restaurant
    const deletedRestaurant = await this.restaurantModel
      .findByIdAndDelete(restaurantId)
      .exec();

    console.log(`deleted restaurant : ${deletedRestaurant}`);
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
    const restaurant = await this.findRestaurantById(restaurantId);
    restaurant.status = RestaurantStatus.APPROVED;
    restaurant.approvalTimestamp = new Date();

    await restaurant.save();
    return restaurant;
  }

  async rejectRestaurant(restaurantId: string): Promise<Restaurant> {
    const restaurant = await this.findRestaurantById(restaurantId);
    restaurant.status = RestaurantStatus.REJECTED;
    restaurant.RejectionTimestamp = new Date();

    await restaurant.save();
    return restaurant;
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

  async findAll(query: any) {
    return await this.restaurantModel.find(query);
  }

  async getPendingRestaurants(): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({ status: RestaurantStatus.PENDING })
      .exec();
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
    const restaurant = await this.getApprovedRestaurant(restaurantId);

    if (restaurateurId !== restaurant.manager.toString()) {
      throw new UnauthorizedException(
        'you are not authorized to update the restaurant',
      );
    }
    return this.restaurantModel.findByIdAndUpdate(
      restaurantId,
      updateRestaurantDto,
      { new: true },
    );
  }

  async addMenuToResto(restaurantId: ObjectId, menuId): Promise<void> {
    await this.restaurantModel.updateOne(
      { _id: restaurantId },
      { $push: { menus: menuId } },
    );
  }

  async removeMenuFromResto(restaurantId, menuId): Promise<void> {
    await this.restaurantModel.updateOne(
      { _id: restaurantId },
      { $pull: { menus: menuId } },
    );
  }

  async addOperatingHours(
    restaurateurId: ObjectId,
    restaurantId: string,
    createOperatingHoursDto: CreateOperatingHoursDto,
  ) {
    try {
      // Find the restaurant by ID
      const restaurant = await this.getApprovedRestaurant(restaurantId);
      if (restaurateurId !== restaurant.manager) {
        throw new UnauthorizedException(
          `You are not authorized to add operating hours to this restaurant`,
        );
      }

      // Create an instance of OperatingHours and assign it
      const operatingHours = new OperatingHours(createOperatingHoursDto);

      // Assign the operatingHours to the restaurant's property
      restaurant.operatingHours = operatingHours;

      // Save the updated restaurant document
      await restaurant.save();

      // Return the updated restaurant document
      return restaurant;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // ********************

  async findRestaurantById(restaurantId: any): Promise<Restaurant> {
    const restaurant = await this.restaurantModel
      .findOne({
        _id: restaurantId,
      })
      .exec();

    if (!restaurant) {
      throw new NotFoundException(
        ` restaurant with id ${restaurantId} not found`,
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
    const restaurant = await this.getApprovedRestaurant(restaurantId);
    return restaurant.tables as unknown as Table[]; // Already populated
  }

  async findRestaurantTableById(
    restaurantId: string,
    tableId: string,
  ): Promise<Table> {
    const tables = await this.findRestaurantTables(restaurantId);
    const table = tables.find((t) => t._id.toString() === tableId);

    if (!table) {
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
    const tables = await this.findRestaurantTables(restaurantId);
    const table = tables.find((t) => t.number === tableNumber);

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
    const tables = await this.findRestaurantTables(restaurantId);
    const tablesWithCapacity = tables.filter(
      (table) => table.capacity === capacity,
    );

    return tablesWithCapacity;
  }

  async findRestaurantTablesByDescription(
    restaurantId: string,
    description: string,
  ): Promise<Table[]> {
    const tables = await this.findRestaurantTables(restaurantId);
    const tablesWithDescription = tables.filter(
      (table) => table.description === description,
    );

    return tablesWithDescription;
  }

  async getApprovedRestaurant(restaurantId: string) {
    const restaurant = await this.restaurantModel
      .findOne({
        _id: restaurantId,
        status: RestaurantStatus.APPROVED,
      })
      .populate({
        path: 'tables',
        model: Table.name,
      })
      .exec();

    if (!restaurant) {
      throw new NotFoundException(
        `Approved Restaurant with id ${restaurantId} not found`,
      );
    }

    return restaurant;
  }

  async addTableToRestaurant(
    restaurantId: ObjectId,
    tableId: ObjectId,
  ): Promise<void> {
    await this.restaurantModel.updateOne(
      { _id: restaurantId },
      { $push: { tables: tableId } },
    );
  }

  async addTablesToRestaurant(
    restaurantId: string,
    tableIds: ObjectId[],
  ): Promise<void> {
    try {
      await this.restaurantModel
        .updateOne(
          { _id: restaurantId },
          { $push: { tables: { $each: tableIds } } },
        )
        .exec();
    } catch (error) {
      // Handle any errors that may occur during the update
      throw new Error(`Failed to add tables to restaurant: ${error.message}`);
    }
  }

  async removeTableFromRestaurant(
    restaurantId: Types.ObjectId,
    tableId: string,
  ) {
    await this.restaurantModel.updateOne(
      { _id: restaurantId },
      { $pull: { tables: tableId } },
    );
  }

  // ****** Reviews *******

  async getReviewsForRestaurant(restaurantId: ObjectId): Promise<Review[]> {
    const restaurant = await this.restaurantModel
      .findOne({
        _id: restaurantId,
        status: RestaurantStatus.APPROVED,
      })
      .populate({
        path: 'reviews',
        model: 'Review',
        match: { hidden: false }, // Filter out hidden reviews
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
    const restaurant = await this.getApprovedRestaurant(
      restaurantId.toString(),
    );
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
    const restaurant = await this.getApprovedRestaurant(
      restaurantId.toString(),
    );
    restaurant.reviews.push(reviewId);
    await restaurant.save();
    await this.updateAverageRating(restaurantId);
  }

  async removeReviewFromRestaurant(
    restaurantId: ObjectId,
    reviewId: ObjectId,
  ): Promise<void> {
    const restaurant = await this.getApprovedRestaurant(
      restaurantId.toString(),
    );
    const reviewIndex = restaurant.reviews.indexOf(reviewId);
    if (reviewIndex !== -1) {
      restaurant.reviews.splice(reviewIndex, 1);
      await restaurant.save();
      await this.updateAverageRating(restaurantId);
    }
  }

  // ****** Bookings *******

  async calculateBookingDetails(booking: Booking): Promise<void> {
    try {
      // Find the restaurant associated with the booking
      const restaurant = await this.getApprovedRestaurant(
        booking.restaurant.toString(),
      );

      // Find the caution details for the restaurant
      const cautionDetails = restaurant.caution;

      // Calculate caution amount based on restaurant's caution details
      let cautionAmount = cautionDetails.fixedAmount;

      // Check if it's a weekend booking and apply the multiplier
      const bookingDay = booking.dateTime.getDay(); // 0 for Sunday, 1 for Monday, etc.
      if (bookingDay === 5 || bookingDay === 6) {
        cautionAmount *= cautionDetails.weekendMultiplier;
      }

      // Check if it's a special occasion booking and apply the multiplier
      // Replace this condition with your logic for detecting special occasions
      const isSpecialOccasion = false; // Replace with your logic
      if (isSpecialOccasion) {
        cautionAmount *= cautionDetails.specialOccasionMultiplier;
      }

      // Apply the party size multiplier
      cautionAmount *= cautionDetails.partySizeMultiplier * booking.partySize;
      booking.cautionAmount = cautionAmount;

      // Calculate payment deadline and set it in the booking
      const paymentDelayHours = cautionDetails.paymentDelay;
      const paymentDeadline = new Date(booking.dateTime);
      paymentDeadline.setHours(paymentDeadline.getHours() + paymentDelayHours);
      booking.paymentDelay = paymentDeadline;

      // Calculate cancellation deadline and set it in the booking
      const cancellationDeadline = new Date(booking.dateTime);
      cancellationDeadline.setHours(
        cancellationDeadline.getHours() + restaurant.cancellationDeadline,
      );
      booking.cancellationDeadline = cancellationDeadline;

      booking.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addBookingToRestaurant(restaurant: Restaurant, booking: ObjectId) {
    restaurant.bookingHistory.push(booking);
    await restaurant.save();
  }

  async getSavedRestaurantsByIds(
    savedRestaurantIds: ObjectId[],
  ): Promise<Restaurant[]> {
    // Fetch the actual Restaurant documents using the savedRestaurantIds
    const savedRestaurants = await this.restaurantModel
      .find({ _id: { $in: savedRestaurantIds } })
      .exec();

    return savedRestaurants;
  }
}
