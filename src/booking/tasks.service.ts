import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BookingService } from './booking.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly bookingService: BookingService) {}

  @Cron('0 0 * * * *')
  handleCron() {
    this.logger.debug('Check payment deadline');
    this.bookingService.checkPaymentDeadlines();
  }
}
