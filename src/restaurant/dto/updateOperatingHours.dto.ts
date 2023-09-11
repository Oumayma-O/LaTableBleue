import {
  IsEnum,
  IsNotEmpty,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayOfWeek } from '../models/operatingHours.model';

export class CreateIntervalDto {
  @IsNotEmpty()
  openingTime: string;

  @IsNotEmpty()
  closingTime: string;
}

export class OperatingHoursDto {
  @IsNotEmpty({ message: 'day needs to be indicated' })
  @IsEnum(DayOfWeek)
  days: DayOfWeek;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateIntervalDto)
  intervals: CreateIntervalDto[];
}
