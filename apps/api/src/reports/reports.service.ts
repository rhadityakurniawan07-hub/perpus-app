import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getStatistics() {
    const [totalBooks, totalMembers, borrowedBooks, pendingLoans, overdueLoans] = await Promise.all([
      this.prisma.book.count(),
      this.prisma.user.count({ where: { role: 'MEMBER' } }),
      this.prisma.loan.count({ where: { status: 'BORROWED' } }),
      this.prisma.loan.count({ where: { status: 'PENDING' } }),
      this.prisma.loan.count({ where: { status: 'OVERDUE' } }),
    ]);

    const popularBooks = await this.prisma.loan.groupBy({
      by: ['bookId'],
      _count: { bookId: true },
      orderBy: {
        _count: {
          bookId: 'desc',
        },
      },
      take: 5,
    });

    const recentLoans = await this.prisma.loan.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true },
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
    };
  }
}
