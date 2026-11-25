import { Controller, Get, Query, UseGuards, Res, Header } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.guard';
import { Role } from '@perpus-app/prisma-client';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private exportService: ExportService,
  ) {}

  @Get()
  getStatistics(@Query() query: any) {
    return this.reportsService.getStatistics(query);
  }

  @Get('export/pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="perpus-report.pdf"')
  async exportPDF(@Res() res: any) {
    const buffer = await this.exportService.exportPDF();
    res.send(buffer);
  }

  @Get('export/excel')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="perpus-report.xlsx"')
  async exportExcel(@Res() res: any) {
    const buffer = await this.exportService.exportExcel();
    res.send(buffer);
  }
}