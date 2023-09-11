import { Report } from './models/report.model';

export class ReportCreatedEvent {
  constructor(public readonly report: Report) {}
}
