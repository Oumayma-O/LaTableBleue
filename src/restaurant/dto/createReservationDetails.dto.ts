import { IsNotEmpty, IsNumber, Min, IsPositive } from 'class-validator';

export class CreateReservationDetailsDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @IsPositive()
  reservationDuration: number; // Duration of a single reservation in minutes

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  preparationTime: number; // Preparation time in minutes

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  bookingBufferTime: number; // Booking buffer time in minutes
}
