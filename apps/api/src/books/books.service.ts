import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: any) {
    const { search, category, available } = query || {};
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.categoryId = category;
    }
    
    if (available === 'true') {
      where.availableStock = { gt: 0 };
    }
    
    return this.prisma.book.findMany({
      where,
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.book.create({
      data,
      include: {
        category: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.book.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    // Check if there are active loans
    const activeLoans = await this.prisma.loan.findFirst({
      where: {
        bookId: id,
        status: { in: ['PENDING', 'APPROVED', 'BORROWED'] },
      },
    });
    
    if (activeLoans) {
      throw new Error('Buku tidak dapat dihapus karena masih ada peminjaman aktif');
    }
    
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
