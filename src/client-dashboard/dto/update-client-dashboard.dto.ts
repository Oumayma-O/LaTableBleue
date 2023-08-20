import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDashboardDto } from './create-client-dashboard.dto';

export class UpdateClientDashboardDto extends PartialType(
  CreateClientDashboardDto,
) {}
