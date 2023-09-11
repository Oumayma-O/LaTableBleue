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

  constructor(partial: Partial<Interval>) {
    Object.assign(this, partial);
  }
}
export const IntervalSchema = SchemaFactory.createForClass(Interval);

@Schema()
export class OperatingHoursPerDay {
  @Prop({ required: true, enum: DayOfWeek })
  day: string;

  @Prop({ type: [IntervalSchema], required: true })
  intervals: Interval[];

  constructor(partial: Partial<OperatingHoursPerDay>) {
    Object.assign(this, partial);
  }
}

export const OperatingHoursPerDaySchema =
  SchemaFactory.createForClass(OperatingHoursPerDay);

export class OperatingHours {
  @Prop({ type: [OperatingHoursPerDaySchema], required: true })
  days: OperatingHoursPerDay[];

  constructor(partial: Partial<OperatingHours>) {
    Object.assign(this, partial);
  }
}

export const OperatingHoursSchema =
  SchemaFactory.createForClass(OperatingHours);
