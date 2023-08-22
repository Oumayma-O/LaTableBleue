import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './models/restaurant.model';
import { TableModule } from '../table/table.module';
import { RestaurantRepository } from './restaurant.repository';
import { ReviewModule } from '../review/review.module';
import { APP_FILTER } from '@nestjs/core';
import { DuplicateKeyExceptionFilter } from '../filters/DuplicateKeyExceptionFilter';
import {TableService} from "../table/table.service";
import {Table, TableSchema} from "../table/table.model";

@Module({
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
      TableService,
    RestaurantRepository,
    {
      provide: APP_FILTER,
      useClass: DuplicateKeyExceptionFilter,
    },
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },{ name: Table.name, schema: TableSchema }
    ]),
      TableModule,
    ReviewModule,
  ],
})
export class RestaurantModule {}
