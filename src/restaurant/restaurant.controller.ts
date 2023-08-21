import { Controller, UseFilters } from '@nestjs/common';
import { DuplicateKeyExceptionFilter } from '../filters/DuplicateKeyExceptionFilter';

@Controller('restaurant')
@UseFilters(DuplicateKeyExceptionFilter)
export class RestaurantController {}
