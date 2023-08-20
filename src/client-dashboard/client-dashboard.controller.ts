import { Controller } from '@nestjs/common';
import { ClientDashboardService } from './client-dashboard.service';


@Controller('client-dashboard')
export class ClientDashboardController {
  constructor(
    private readonly clientDashboardService: ClientDashboardService,
  ) {}
}
