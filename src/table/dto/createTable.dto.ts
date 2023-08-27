import { IsNumber, IsEnum, IsNotEmpty, IsMongoId } from 'class-validator';
import { TableDescription } from '../models/table.model';

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
  restaurant: string;
}
