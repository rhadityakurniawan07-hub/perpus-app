import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: any) {
    const {
      search,
      category,
      available,
      minRating,
      sortBy = 'title',
      order = 'asc',
    } = query || {};

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

    if (minRating) {
      const rating = Number(minRating);
      if (!Number.isNaN(rating)) {
        where.averageRating = { gte: rating };
      }
    }

    const sortField =
      sortBy === 'rating' ? 'averageRating' : sortBy === 'reviews' ? 'reviewCount' : sortBy;

    return this.prisma.book.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        [sortField]: order,
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
    if (data?.isbn) {
      const existing = await this.prisma.book.findUnique({
        where: { isbn: data.isbn },
        select: { id: true },
      });
      if (existing) {
        throw new ConflictException('Buku dengan ISBN yang sama sudah terdaftar.');
      }
    }

    const bookData = {
      ...data,
      availableStock: data.availableStock !== undefined ? data.availableStock : data.totalStock,
    };
    
    return this.prisma.book.create({
      data: bookData,
      include: {
        category: true,
      },
    });
  }

  async update(id: string, data: any) {
    if (data?.isbn) {
      const existing = await this.prisma.book.findUnique({
        where: { isbn: data.isbn },
        select: { id: true },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Buku dengan ISBN yang sama sudah terdaftar.');
      }
    }

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
