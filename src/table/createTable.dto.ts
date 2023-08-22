import {IsNumber, IsEnum, IsNotEmpty, IsMongoId, IsOptional} from 'class-validator';
import { TableDescription } from './table.model';
import {Types} from "mongoose";
import {Restaurant} from "../restaurant/models/restaurant.model";

export class CreateTableDto {
    @IsNumber()
    @IsNotEmpty()
    number: number;

    @IsNumber()
    @IsNotEmpty()
    capacity: number;

    @IsEnum(TableDescription)
    @IsNotEmpty()
    description: TableDescription;

    @IsMongoId() // Ensure it's a valid MongoDB ObjectId
    @IsNotEmpty()
    restaurantId: string;


}
