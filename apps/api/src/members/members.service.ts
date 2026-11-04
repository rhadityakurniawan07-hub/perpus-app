import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      where: { role: 'MEMBER' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        loans: {
          include: {
            book: true,
          },
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    const activeLoans = await this.prisma.loan.findFirst({
      where: {
        userId: id,
        status: { in: ['PENDING', 'APPROVED', 'BORROWED'] },
      },
    });
    
    if (activeLoans) {
      throw new Error('Anggota tidak dapat dihapus karena masih ada peminjaman aktif');
    }
    
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
