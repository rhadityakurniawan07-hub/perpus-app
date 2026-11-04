import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@perpus-app/prisma-client';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    if (user.role === Role.ADMIN) {
      return this.loansService.findAll();
    }
    return this.loansService.findAll(user.sub);
  }

  @Post('request')
  request(@CurrentUser('sub') userId: string, @Body('bookId') bookId: string) {
    return this.loansService.request(userId, bookId);
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
  return(@Param('id') id: string) {
    return this.loansService.return(id);
  }
}
