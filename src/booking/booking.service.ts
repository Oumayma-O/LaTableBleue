import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from './models/booking.model';
import { GuestDeletedEvent } from "../guest/guest.events";
import { EventEmitter2 } from 'eventemitter2';
import { Guest } from "../guest/models/guest.model";
import { RestaurantDeletedEvent } from "../restaurant/restaurant.events";
import { Restaurant } from "../restaurant/models/restaurant.model";

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<Booking>,
    @Inject('EventEmitter2') private readonly eventEmitter: EventEmitter2, // Inject the EventEmitter2
  ) {
    // Listen for the guestDeleted event
    this.eventEmitter.on('guestDeleted', (event: GuestDeletedEvent) => {
      this.handleGuestDeleted(event.deletedGuest);
    });
    // Listen for the restaurantDeleted event
    this.eventEmitter.on('restaurantDeleted', (event: RestaurantDeletedEvent) => {
      this.handleRestaurantDeleted(event.deletedRestaurant);
    });
  }
  //getC
  async handleGuestDeleted(deletedGuest: Guest) {
    // Delete bookings associated with the deleted guest
    const deletedBookings = await this.bookingModel
      .deleteMany({ guest: deletedGuest._id })
      .exec();

    if (!deletedBookings.deletedCount) {
      console.log(`No bookings found for the deleted guest`);
    }
  }

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
}
