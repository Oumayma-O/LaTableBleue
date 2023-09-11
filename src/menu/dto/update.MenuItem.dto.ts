import { IsString} from 'class-validator';

export class UpdateMenuDto {
  @IsString()
  name: string;
}

export class UpdateMenuItemDto {
  @IsString()
  category: string;
}

export class UpdateDishDto {
  @IsString()
  name: string;

  @IsString()
  price: string;

  @IsString()
  description: string;
}
