import { IsNumber, IsEnum, IsNotEmpty } from 'class-validator';
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
}
