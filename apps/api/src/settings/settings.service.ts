import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.setting.findMany();
  }

  async create(data: any) {
    return this.prisma.setting.upsert({
      where: { key: data.key },
      update: { value: data.value },
      create: data,
    });
  }
}
