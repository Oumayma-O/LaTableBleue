import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreateOperatingHoursDto } from '../dto/createOperatingHours.dto';

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

@Schema()
export class Interval {
  @Prop({ required: true })
  openingTime: string;

  @Prop({ required: true })
  closingTime: string;

  constructor(partial: Partial<Interval>) {
    Object.assign(this, partial);
  }
}

@Schema()
export class OperatingHoursPerDay {
  @Prop({ required: true, enum: DayOfWeek })
  day: string;

  @Prop({ type: [Interval], required: true })
  intervals: Interval[];

  constructor(partial: Partial<OperatingHoursPerDay>) {
    Object.assign(this, partial);
  }
}

export class OperatingHours {
  @Prop({ type: [OperatingHoursPerDay], required: true })
  days: OperatingHoursPerDay[];

  constructor(partial: CreateOperatingHoursDto) {
    Object.assign(this, partial);
  }
}

export const OperatingHoursSchema =
  SchemaFactory.createForClass(OperatingHours);
