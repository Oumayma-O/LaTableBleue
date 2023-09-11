import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from './models/booking.model';
import { Guest } from '../guest/models/guest.model';
import { Restaurant } from '../restaurant/models/restaurant.model';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateBookingDto } from './dto/createBooking.dto';
import { RestaurantService } from '../restaurant/restaurant.service';
import { GuestService } from '../guest/guest.service';
import { Table } from '../table/models/table.model';
import { ObjectId } from 'mongodb';
import { TableService } from '../table/table.service';
import { BookingState } from './models/enums';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<Booking>,
    private restaurantService: RestaurantService,
    private guestService: GuestService,
    private tableService: TableService,
  ) {}

  @OnEvent('guestDeleted')
  async handleGuestDeleted(deletedGuest: Guest) {
    // Delete bookings associated with the deleted guest
    const deletedBookings = await this.bookingModel
      .deleteMany({ guest: deletedGuest._id })
      .exec();

    if (!deletedBookings.deletedCount) {
      console.log(`No bookings found for the deleted guest`);
    }
  }

  @OnEvent('restaurantDeleted')
  async handleRestaurantDeleted(deletedRestaurant: Restaurant) {
    const restaurantId = deletedRestaurant._id;

    // Delete bookings associated with the deleted restaurant
    await this.deleteBookingsByRestaurantId(restaurantId);
  }

  async deleteBookingsByRestaurantId(restaurantId: string): Promise<void> {
    const deletedBookings = await this.bookingModel
      .deleteMany({ restaurant: restaurantId })
      .exec();

    if (!deletedBookings.deletedCount) {
      console.log(`No bookings found for the restaurant`);
    }
  }

  async createBooking(
    createBookingDto: CreateBookingDto,
    restaurantId: string,
    userId: string,
  ): Promise<Booking> {
    // Find the restaurant
    const restaurant = await this.restaurantService.getApprovedRestaurant(
      restaurantId,
    );

    // Find the user (guest)
    const user = await this.guestService.getGuestById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check table availability and get available tables
    const availableTables: Table[] = await this.tableService.checkAvailability(
      restaurantId,
      createBookingDto.partySize,
      createBookingDto.dateTime,
    );

    // Check if the requested tables are available
    const requestedTableIds = createBookingDto.bookedTables;
    const areRequestedTablesAvailable = this.areRequestedTablesAvailable(
      requestedTableIds,
      availableTables,
    );

    if (!areRequestedTablesAvailable) {
      throw new ConflictException('Requested tables are not available');
    }

    // Create a new booking instance
    const booking = new this.bookingModel({
      guest: userId,
      restaurant: restaurantId,
      dateTime: createBookingDto.dateTime,
      partySize: createBookingDto.partySize,
      bookedTables: createBookingDto.bookedTables,
      specialRequest: createBookingDto.specialRequest,
    });

    // Calculate booking details and update the booking
    await this.restaurantService.calculateBookingDetails(booking);

    // Save the booking
    await booking.save();

    // Add the booking to guest, restaurant, and tables
    await this.guestService.addBookingToGuest(user, booking._id);
    await this.restaurantService.addBookingToRestaurant(
      restaurant,
      booking._id,
    );
    await this.tableService.addBookingToTables(availableTables, booking._id);

    return booking;
  }

  areRequestedTablesAvailable(
    requestedTableIds: ObjectId[],
    availableTables: Table[],
  ): boolean {
    for (const tableId of requestedTableIds) {
      const isTableAvailable = availableTables.some(
        (table) => table._id === tableId,
      );

      if (!isTableAvailable) {
        return false; // At least one requested table is not available
      }
    }

    return true; // All requested tables are available
  }

  async getGuestBookings(guestId: string): Promise<Booking[]> {
    return this.bookingModel.find({ guest: guestId }).exec();
  }

  async getRestaurantBookings(
    restaurateurId: ObjectId,
    restaurantId: string,
  ): Promise<Booking[]> {
    const restaurant = await this.restaurantService.getApprovedRestaurant(
      restaurantId,
    );
    if (restaurateurId !== restaurant.manager) {
      throw new UnauthorizedException(`You are not authorized to access`);
    }

    return this.bookingModel.find({ restaurant: restaurantId }).exec();
  }

  async getTableBookings(tableId: string): Promise<Booking[]> {
    return this.bookingModel.find({ bookedTables: tableId }).exec();
  }

  async approveBooking(
    restaurateurId: ObjectId,
    bookingId: string,
  ): Promise<Booking> {
    const booking = await this.bookingModel.findById(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    const restaurant = await this.restaurantService.getApprovedRestaurant(
      booking.restaurant.toString(),
    );
    if (restaurateurId !== restaurant.manager) {
      throw new UnauthorizedException(
        `You are not authorized to manage this booking`,
      );
    }

    booking.bookingState = BookingState.APPROVED;
    booking.stateChanges.push({
      state: BookingState.APPROVED,
      timestamp: new Date(),
    });

    return booking.save();
  }

  async disapproveBooking(
    restaurateurId: ObjectId,
    bookingId: string,
  ): Promise<Booking> {
    const booking = await this.bookingModel.findById(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    const restaurant = await this.restaurantService.getApprovedRestaurant(
      booking.restaurant.toString(),
    );
    if (restaurateurId !== restaurant.manager) {
      throw new UnauthorizedException(
        `You are not authorized to manage this booking`,
      );
    }

    booking.bookingState = BookingState.DISAPPROVED;
    booking.stateChanges.push({
      state: BookingState.DISAPPROVED,
      timestamp: new Date(),
    });

    return booking.save();
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.bookingModel.find().exec();
  }

  async getAllBookingsByDate(date: Date): Promise<Booking[]> {
    // Assuming you want bookings for a specific date.
    // You may need to adjust the query based on your data model.

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.bookingModel
      .find({
        dateTime: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .exec();
  }
}
