import {
  IsNotEmpty,
  IsDate,
  IsPositive,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class CreateBookingDto {
  @IsDate({ message: 'Date and time must be a valid date' })
  dateTime: Date;

  @IsNotEmpty({ message: 'Number of persons is required' })
  @IsPositive({ message: 'Number of persons must be a positive number' })
  partySize: number;

  @IsNotEmpty()
  @IsArray({ message: 'Booked tables must be an array' })
  bookedTables: ObjectId[];

  @IsOptional()
  @IsString({ message: 'Special request must be a string' })
  specialRequest?: string;
}
