import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsPublicController } from './reports-public.controller';
import { ReportsController } from './reports.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReportsPublicController, ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
