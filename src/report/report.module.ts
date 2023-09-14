import { Global, Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './models/report.model';
import { EventEmitter2 } from 'eventemitter2';
import { ReportEventHandlersService } from './report.EventHandlers';
import { ReportCreatedEvent } from './reportCreated.event';
@Global()
@Module({
  controllers: [ReportController],
  providers: [
    ReportService,
    {
      provide: 'EventEmitter2',
      useValue: new EventEmitter2(),
    },
    ReportCreatedEvent,
    ReportEventHandlersService,
  ],
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
  ],
  exports: [ReportService, ReportEventHandlersService],
})
export class ReportModule {}
