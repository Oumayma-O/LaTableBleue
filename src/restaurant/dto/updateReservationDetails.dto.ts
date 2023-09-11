import { IsNumber, Min, IsPositive } from 'class-validator';

export class UpdateReservationDetailsDto {
  @IsNumber()
  @Min(1)
  @IsPositive()
  reservationDuration: number; // Duration of a single reservation in minutes

  @IsNumber()
  @Min(0)
  preparationTime: number; // Preparation time in minutes

  @IsNumber()
  @Min(0)
  bookingBufferTime: number; // Booking buffer time in minutes
}
