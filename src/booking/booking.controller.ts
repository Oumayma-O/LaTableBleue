import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/createBooking.dto';
import { Booking } from './models/booking.model';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/UserRole.enum';
import { Public } from '../auth/decorators/public.decorator';
import { Table } from '../table/models/table.model';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/:restaurantId')
  @Roles(UserRole.GUEST)
  async createBooking(
    @Req() req,
    @Body() createBookingDto: CreateBookingDto,
    @Param('restaurantId') restaurantId: string,
  ): Promise<Booking> {
    const userId = req.jwtPayload.sub;

    return this.bookingService.createBooking(
      createBookingDto,
      restaurantId,
      userId,
    );
  }

  @Get('guest')
  @Roles(UserRole.GUEST)
  async getGuestBookings(@Req() req): Promise<Booking[]> {
    const guestId = req.jwtPayload.sub;

    return this.bookingService.getGuestBookings(guestId);
  }

  @Get('restaurant/:restaurantId')
  @Roles(UserRole.RESTAURATEUR)
  async getRestaurantBookings(
    @Req() req,
    @Param('restaurantId') restaurantId: string,
  ): Promise<Booking[]> {
    const restaurateurId = req.jwtPayload.sub;

    return this.bookingService.getRestaurantBookings(
      restaurateurId,
      restaurantId,
    );
  }

  @Get('table/:tableId')
  @Roles(UserRole.RESTAURATEUR)
  async getTableBookings(
    @Param('tableId') tableId: string,
  ): Promise<Booking[]> {
    return this.bookingService.getTableBookings(tableId);
  }

  @Put('approve/:bookingId')
  @Roles(UserRole.RESTAURATEUR)
  async approveBooking(
    @Req() req,
    @Param('bookingId') bookingId: string,
  ): Promise<Booking> {
    const restaurateurId = req.jwtPayload.sub;

    return this.bookingService.approveBooking(restaurateurId, bookingId);
  }

  @Put('disapprove/:bookingId')
  @Roles(UserRole.RESTAURATEUR)
  async disapproveBooking(
    @Req() req,
    @Param('bookingId') bookingId: string,
  ): Promise<Booking> {
    const restaurateurId = req.jwtPayload.sub;

    return this.bookingService.disapproveBooking(restaurateurId, bookingId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllBookings(): Promise<Booking[]> {
    return this.bookingService.getAllBookings();
  }

  @Get('by-date')
  @Roles(UserRole.ADMIN)
  async getAllBookingsByDate(@Query('date') date: string): Promise<Booking[]> {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.bookingService.getAllBookingsByDate(parsedDate);
  }

  @Public()
  @Get('availability/:restaurantId')
  async checkAvailability(
    @Param('restaurantId') restaurantId: string,
    @Query('partySize') partySize: number,
    @Query('dateTime') dateTime: Date,
  ): Promise<Table[]> {
    const availableTables = await this.bookingService.checkAvailability(
      restaurantId,
      partySize,
      new Date(dateTime),
    );
    return availableTables;
  }
}
