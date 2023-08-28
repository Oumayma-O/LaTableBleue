import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { Report } from './models/report.model';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/UserRole.enum';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post(':reviewId')
  @Roles(UserRole.GUEST, UserRole.RESTAURATEUR)
  async createReport(
    @Req() req,
    @Param('reviewId') reviewId: string,
    @Body() createReportDto: CreateReportDto,
  ): Promise<Report> {
    return this.reportService.createReport(
      req.jwtPayload.sub,
      reviewId,
      createReportDto,
    );
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  @Get('review/:reviewId')
  @Roles(UserRole.ADMIN)
  async findReportsByReviewId(
    @Param('reviewId') reviewId: string,
  ): Promise<Report[]> {
    return this.reportService.findReportsByReviewId(reviewId);
  }

  @Delete(':reportId')
  @Roles(UserRole.ADMIN)
  async deleteReport(@Param('reportId') reportId: string): Promise<Report> {
    return this.reportService.deleteReport(reportId);
  }
}
