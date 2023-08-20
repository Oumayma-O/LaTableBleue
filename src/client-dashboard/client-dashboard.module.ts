import { Module } from '@nestjs/common';
import { ClientDashboardService } from './client-dashboard.service';
import { ClientDashboardController } from './client-dashboard.controller';

@Module({
  controllers: [ClientDashboardController],
  providers: [ClientDashboardService],
})
export class ClientDashboardModule {}
