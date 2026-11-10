import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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
        readingStatuses: {
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            status: true,
            updatedAt: true,
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                coverImage: true,
                averageRating: true,
                reviewCount: true,
              },
            },
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                coverImage: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: any) {
    const { name, email, password, status = 'ACTIVE' } = data;
    
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'MEMBER',
        status,
      },
    });

    const { password: _, ...result } = user;
    return result;
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
