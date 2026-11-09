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

    const [totalReviews, ratingAgg, topRatedBooks, recentReviews, readingGroups] =
      await Promise.all([
        this.prisma.review.count(),
        this.prisma.review.aggregate({ _avg: { rating: true } }),
        this.prisma.book.findMany({
          where: { reviewCount: { gt: 0 } },
          orderBy: [{ averageRating: 'desc' }, { reviewCount: 'desc' }],
          take: 5,
          include: { category: true },
        }),
        this.prisma.review.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { name: true, email: true } },
            book: { select: { title: true, author: true } },
          },
        }),
        this.prisma.readingStatus.groupBy({
          by: ['status'],
          _count: { _all: true },
        }),
      ]);

    const averageRating = Math.round((ratingAgg._avg.rating || 0) * 10) / 10;

    const readingSummary = { WISHLIST: 0, READING: 0, FINISHED: 0 } as Record<
      string,
      number
    >;
    for (const group of readingGroups) {
      readingSummary[group.status] = group._count._all;
    }

    return {
      totalBooks,
      totalMembers,
      borrowedBooks,
      pendingLoans,
      overdueLoans,
      popularBooks,
      recentLoans,
      lateLoans,
      totalReviews,
      averageRating,
      topRatedBooks,
      recentReviews,
      readingSummary,
    };
  }
}
