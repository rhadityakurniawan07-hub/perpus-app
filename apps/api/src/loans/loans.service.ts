import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: string, status?: string) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;
    
    return this.prisma.loan.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        book: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async request(userId: string, bookId: string) {
    // Check if user has active loan for this book
    const existingLoan = await this.prisma.loan.findFirst({
      where: {
        userId,
        bookId,
        status: { in: ['PENDING', 'APPROVED', 'BORROWED'] },
      },
    });
    
    if (existingLoan) {
      throw new BadRequestException('Anda sudah mengajukan atau meminjam buku ini');
    }
    
    // Check book availability
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });
    
    if (!book || book.availableStock <= 0) {
      throw new BadRequestException('Buku tidak tersedia');
    }
    
    // Check if user has overdue loans
    const overdueLoan = await this.prisma.loan.findFirst({
      where: {
        userId,
        status: 'OVERDUE',
      },
    });
    
    if (overdueLoan) {
      throw new BadRequestException('Anda memiliki peminjaman yang terlambat');
    }
    
    // Check loan limit (max 3 books)
    const activeLoansCount = await this.prisma.loan.count({
      where: {
        userId,
        status: { in: ['APPROVED', 'BORROWED'] },
      },
    });
    
    if (activeLoansCount >= 3) {
      throw new BadRequestException('Maksimal peminjaman adalah 3 buku');
    }
    
    return this.prisma.loan.create({
      data: {
        userId,
        bookId,
        requestDate: new Date(),
        status: 'PENDING',
      },
      include: {
        book: true,
        user: true,
      },
    });
  }

  async approve(loanId: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        book: true,
      },
    });
    
    if (!loan) {
      throw new BadRequestException('Peminjaman tidak ditemukan');
    }
    
    if (loan.status !== 'PENDING') {
      throw new BadRequestException('Peminjaman tidak dalam status menunggu persetujuan');
    }
    
    if (loan.book.availableStock <= 0) {
      throw new BadRequestException('Stok buku habis');
    }
    
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // 7 days
    
    const [updatedLoan] = await this.prisma.$transaction([
      this.prisma.loan.update({
        where: { id: loanId },
        data: {
          status: 'BORROWED',
          borrowDate,
          dueDate,
        },
        include: {
          user: true,
          book: true,
        },
      }),
      this.prisma.book.update({
        where: { id: loan.bookId },
        data: {
          availableStock: { decrement: 1 },
        },
      }),
    ]);
    
    return updatedLoan;
  }

  async reject(loanId: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
    });
    
    if (!loan) {
      throw new BadRequestException('Peminjaman tidak ditemukan');
    }
    
    if (loan.status !== 'PENDING') {
      throw new BadRequestException('Peminjaman tidak dalam status menunggu persetujuan');
    }
    
    return this.prisma.loan.update({
      where: { id: loanId },
      data: { status: 'REJECTED' },
      include: {
        user: true,
        book: true,
      },
    });
  }

  async return(loanId: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        book: true,
      },
    });
    
    if (!loan) {
      throw new BadRequestException('Peminjaman tidak ditemukan');
    }
    
    if (loan.status !== 'BORROWED') {
      throw new BadRequestException('Buku tidak sedang dipinjam');
    }
    
    const returnDate = new Date();
    const isOverdue = loan.dueDate && returnDate > loan.dueDate;
    
    const [updatedLoan] = await this.prisma.$transaction([
      this.prisma.loan.update({
        where: { id: loanId },
        data: {
          status: isOverdue ? 'OVERDUE' : 'RETURNED',
          returnDate,
        },
        include: {
          user: true,
          book: true,
        },
      }),
      this.prisma.book.update({
        where: { id: loan.bookId },
        data: {
          availableStock: { increment: 1 },
        },
      }),
    ]);
    
    return updatedLoan;
  }
}
