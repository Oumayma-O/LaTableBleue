import { Controller } from '@nestjs/common';
import { RestaurateurDashboardService } from './restaurateur-dashboard.service';

@Controller('restaurateur-dashboard')
export class RestaurateurDashboardController {
  constructor(private readonly restaurateurDashboardService: RestaurateurDashboardService) {}
}
