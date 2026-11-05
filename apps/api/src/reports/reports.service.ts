import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getStatistics(query?: any) {
    const { startDate, endDate } = query || {};
    
    const dateFilter = startDate && endDate ? {
      requestDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    } : {};
    
    const [totalBooks, totalMembers, borrowedBooks, pendingLoans, overdueLoans] = await Promise.all([
      this.prisma.book.count(),
      this.prisma.user.count({ where: { role: 'MEMBER' } }),
      this.prisma.loan.count({ where: { status: 'BORROWED', ...dateFilter } }),
      this.prisma.loan.count({ where: { status: 'PENDING', ...dateFilter } }),
      this.prisma.loan.count({ where: { status: 'OVERDUE', ...dateFilter } }),
    ]);

    const loansByBook = await this.prisma.loan.groupBy({
      by: ['bookId'],
      _count: { bookId: true },
      where: dateFilter,
      orderBy: {
        _count: {
          bookId: 'desc',
        },
      },
      take: 5,
    });

    const popularBooks = await Promise.all(
      loansByBook.map(async (item) => {
        const book = await this.prisma.book.findUnique({
          where: { id: item.bookId },
        });
        return {
          book,
          count: item._count.bookId,
        };
      })
    );

    const recentLoans = await this.prisma.loan.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
        book: {
          select: { title: true, author: true },
        },
      },
    });

    const lateLoans = await this.prisma.loan.findMany({
      where: {
        status: 'OVERDUE',
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
        book: {
          select: { title: true },
        },
      },
    });

    return {
      totalBooks,
      totalMembers,
      borrowedBooks,
      pendingLoans,
      overdueLoans,
      popularBooks,
      recentLoans,
      lateLoans,
    };
  }
}
