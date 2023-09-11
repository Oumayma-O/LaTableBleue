import { IsNumber, IsEnum } from 'class-validator';
import { TableDescription } from '../models/table.model';

export class UpdateTableDto {
  @IsNumber()
  number: number;

  @IsNumber()
  capacity: number;

  @IsEnum(TableDescription)
  description: TableDescription;
}
