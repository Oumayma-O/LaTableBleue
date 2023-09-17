import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GuestDeletedEvent } from '../guest/guest.events';
import { RestaurantDeletedEvent } from '../restaurant/restaurant.events';
import { BookingService } from './booking.service';
import { ReportCreatedEvent } from '../report/reportCreated.event';

@Injectable()
export class BookingEventHandlers {
  constructor(private readonly bookingService: BookingService) {}

  @OnEvent('guestDeleted')
  async handleGuestDeleted(deletedGuest: GuestDeletedEvent) {
    // Delete bookings associated with the deleted guest
    await this.bookingService.deleteBookingsByGuestId(
      deletedGuest.deletedGuest._id,
    );
  }

  @OnEvent('restaurantDeleted')
  async handleRestaurantDeleted(deletedRestaurant: RestaurantDeletedEvent) {
    const restaurantId = deletedRestaurant.deletedRestaurant._id;

    // Delete bookings associated with the deleted restaurant
    await this.bookingService.deleteBookingsByRestaurantId(restaurantId);
  }

  @OnEvent('reportCreated')
  async handleReportCreated(event: ReportCreatedEvent) {
    console.log(
      `handling report created event guest event hadlners with id ${event.report._id}`,
    );
  }
}
