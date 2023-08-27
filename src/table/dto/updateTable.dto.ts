import { IsNumber, IsEnum, IsMongoId } from 'class-validator';
import { TableDescription } from '../models/table.model';

export class UpdateTableDto {
  @IsNumber()
  number: number;

  @IsNumber()
  capacity: number;

  @IsEnum(TableDescription)
  description: TableDescription;

  @IsMongoId() // Ensure it's a valid MongoDB ObjectId
  restaurant: string;
}
