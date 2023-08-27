import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}
export const IntervalSchema = SchemaFactory.createForClass(Interval);

@Schema()
export class OperatingHoursPerDay {
  @Prop({ required: true, enum: DayOfWeek })
  day: string;

  @Prop({ type: [IntervalSchema], required: true })
  intervals: Interval[];
}

export const OperatingHoursPerDaySchema =
  SchemaFactory.createForClass(OperatingHoursPerDay);
