import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from './models/booking.model';
import { CreateBookingDto } from './dto/createBooking.dto';
import { RestaurantService } from '../restaurant/restaurant.service';
import { GuestService } from '../guest/guest.service';
import { Table } from '../table/models/table.model';
import { ObjectId } from 'mongodb';
import { TableService } from '../table/table.service';
import { BookingState } from './models/enums';
import { ReservationDetails } from '../restaurant/models/reservation.details.model';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<Booking>,
    private restaurantService: RestaurantService,
    private guestService: GuestService,
    private tableService: TableService,
  ) {}

  async deleteBookingsByGuestId(guestId: string): Promise<void> {
    // Delete bookings associated with the deleted guest
    const deletedBookings = await this.bookingModel
      .deleteMany({ guest: guestId })
      .exec();

    if (!deletedBookings.deletedCount) {
      console.log(`No bookings found for the deleted guest`);
    }
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
    try {
      // Find the restaurant
      const restaurant = await this.restaurantService.getApprovedRestaurant(
        restaurantId,
      );

      // Find the user (guest)
      const user = await this.guestService.getGuestById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const dateTime = new Date(createBookingDto.dateTime);

      // Check table availability and get available tables
      for (const tableId of createBookingDto.bookedTables) {
        if (
          !(await this.isTableAvailable(
            restaurantId,
            tableId.toString(),
            dateTime,
          ))
        ) {
          throw new ConflictException('The selected table is not available');
        }
      }

      // Create a new booking instance
      const booking = new this.bookingModel({
        guest: userId,
        restaurant: restaurantId,
        dateTime: dateTime,
        partySize: createBookingDto.partySize,
        bookedTables: createBookingDto.bookedTables,
        specialRequest: createBookingDto.specialRequest,
      });

      // Save the booking
      await booking.save();

      // Add the booking to guest, restaurant, and tables
      await this.guestService.addBookingToGuest(user, booking._id);
      await this.restaurantService.addBookingToRestaurant(
        restaurant,
        booking._id,
      );
      await this.tableService.addBookingToTables(
        createBookingDto.bookedTables,
        booking._id,
      );

      return booking;
    } catch (error) {
      console.log(error);
      throw error;
    }
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

    await this.restaurantService.calculateBookingDetails(booking);
    return booking;
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

  async checkAvailability(
    restaurantId: string,
    partySize: number,
    dateTime: Date,
  ): Promise<Table[]> {
    try {
      const restaurant = await this.restaurantService.getApprovedRestaurant(
        restaurantId,
      );

      const tables = await this.restaurantService.findRestaurantTables(
        restaurantId,
      );

      const availableTables = [];

      for (const table of tables) {
        const isAvailable = await this.isTableAvailable(
          restaurantId,
          table._id,
          dateTime,
        );

        if (isAvailable && table.capacity >= partySize) {
          availableTables.push(table);
        }
      }

      return availableTables;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async isTableAvailable(
    restaurantId: string,
    tableId: string,
    dateTime: Date,
  ): Promise<boolean> {
    // Get the current date and time
    const currentDateTime = new Date();

    // Check if dateTime is in the past
    if (dateTime < currentDateTime) {
      throw new ConflictException(`the dateTime is not valid`);
    }

    const restaurant = await this.restaurantService.getApprovedRestaurant(
      restaurantId,
    );

    const reservationDetails: ReservationDetails =
      restaurant.reservationDetails;

    const reservationDuration = reservationDetails.reservationDuration;
    const preparationTime = reservationDetails.preparationTime;
    const bookingBufferTime = reservationDetails.bookingBufferTime;

    const requestedStartTime = new Date(dateTime);
    requestedStartTime.setMinutes(
      requestedStartTime.getMinutes() - (preparationTime + bookingBufferTime),
    );

    const requestedEndTime = new Date(requestedStartTime);
    requestedEndTime.setMinutes(
      requestedEndTime.getMinutes() + reservationDuration,
    );

    const operatingHours = restaurant.operatingHours.days.find(
      (day) =>
        day.day === dateTime.toLocaleDateString('en-US', { weekday: 'long' }),
    );

    if (!operatingHours) {
      throw new NotFoundException('Restaurant is closed on that day');
    }

    const openingTime = new Date(dateTime);
    openingTime.setHours(
      parseInt(operatingHours.intervals[0].openingTime.split(':')[0]),
      parseInt(operatingHours.intervals[0].openingTime.split(':')[1]),
    );

    const closingTime = new Date(dateTime);
    closingTime.setHours(
      parseInt(operatingHours.intervals[0].closingTime.split(':')[0]),
      parseInt(operatingHours.intervals[0].closingTime.split(':')[1]),
    );

    if (
      requestedEndTime <= openingTime ||
      requestedStartTime >= closingTime ||
      requestedEndTime >= closingTime ||
      requestedStartTime <= openingTime ||
      closingTime.getTime() - dateTime.getTime() <
        reservationDuration * 60 * 1000
    ) {
      throw new ConflictException('reservation not possible ');
    }

    console.log(requestedStartTime);
    console.log(requestedEndTime);

    const tableBookings = await this.bookingModel
      .find({
        bookedTables: tableId,
        dateTime: {
          $gte: requestedStartTime,
          $lt: requestedEndTime,
        },
        bookingState: {
          $in: ['pending', 'approved'],
        },
      })
      .exec();

    if (!tableBookings || tableBookings.length === 0) {
      // No bookings for this table during the specified time, it's available
      return true;
    } else {
      return false;
    }
  }
  async checkPaymentDeadlines() {
    try {
      const currentDate = new Date();

      // Find bookings that are pending and have exceeded the payment deadline
      const overdueBookings = await this.bookingModel.find({
        bookingState: BookingState.APPROVED,
        paymentDelay: { $lte: currentDate },
        cautionPayed: false,
      });

      // Update the state of overdue bookings to "cancelled"
      for (const booking of overdueBookings) {
        booking.bookingState = BookingState.CANCELLED;
        await booking.save();
      }

      console.log(`Updated ${overdueBookings.length} bookings to CANCELLED.`);
    } catch (error) {
      console.error('Error updating booking states:', error);
    }
  }
}
