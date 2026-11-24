import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHello() {
    return { message: 'PERPUS API is running' };
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  async getHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        message: 'PERPUS API is running',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Database connection failed',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      };
    }
  }
}