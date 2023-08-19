import { Module } from '@nestjs/common';
import { RestaurateurDashboardService } from './restaurateur-dashboard.service';
import { RestaurateurDashboardController } from './restaurateur-dashboard.controller';

@Module({
  controllers: [RestaurateurDashboardController],
  providers: [RestaurateurDashboardService]
})
export class RestaurateurDashboardModule {}
