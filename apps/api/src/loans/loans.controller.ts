import { BadRequestException, Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@perpus-app/prisma-client';
import { LoanStatus } from './enums/loan-status.enum';
import { RequestLoanDto } from './dto/request-loan.dto';
import { ReturnLoanDto } from './dto/return-loan.dto';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Get()
  findAll(@CurrentUser() user: any, @Query('status') status?: string) {
    if (status && !Object.values(LoanStatus).includes(status as LoanStatus)) {
      throw new BadRequestException(
        `Status tidak valid. Gunakan salah satu: ${Object.values(LoanStatus).join(', ')}`
      );
    }

    if (user.role === Role.ADMIN) {
      return this.loansService.findAll(undefined, status as LoanStatus | undefined);
    }
    return this.loansService.findAll(user.sub, status as LoanStatus | undefined);
  }

  @Get('my-loans')
  myLoans(@CurrentUser('sub') userId: string) {
    return this.loansService.findAll(userId);
  }

  @Post('request')
  request(@CurrentUser('sub') userId: string, @Body() dto: RequestLoanDto) {
    return this.loansService.request(userId, dto.bookId);
  }

  @Post(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  approve(@Param('id') id: string) {
    return this.loansService.approve(id);
  }

  @Post(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  reject(@Param('id') id: string) {
    return this.loansService.reject(id);
  }

  @Post(':id/return')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  return(@Param('id') id: string, @Body() dto: ReturnLoanDto) {
    return this.loansService.return(id, dto);
  }
}
