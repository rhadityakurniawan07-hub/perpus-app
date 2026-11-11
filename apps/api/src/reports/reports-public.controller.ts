import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsPublicController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('public')
  getPublicStatistics() {
    return this.reportsService.getPublicStatistics();
  }
}
