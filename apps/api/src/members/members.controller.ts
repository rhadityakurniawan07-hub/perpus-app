import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.guard';
import { Role } from '@perpus-app/prisma-client';
import { CreateMemberDto } from './dto/create-member.dto';

@Controller('members')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Post()
  create(@Body() data: CreateMemberDto) {
    return this.membersService.create(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.membersService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
