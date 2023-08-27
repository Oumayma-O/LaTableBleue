import { IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMenuItemDto {
  category: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDishDto)
  items: UpdateDishDto[];
}

export class UpdateDishDto {
  @IsString()
  name: string;

  @IsString()
  price: string;

  @IsString()
  description: string;
}
