import { Global, Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './models/report.model';
import { EventEmitter2 } from 'eventemitter2';
@Global()
@Module({
  controllers: [ReportController],
  providers: [
    ReportService,
    {
      provide: 'EventEmitter2', // Provide the EventEmitter2 token
      useValue: new EventEmitter2(), // Create a new instance of EventEmitter2
    },
  ],
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
  ],
  exports: [ReportService],
})
export class ReportModule {}
