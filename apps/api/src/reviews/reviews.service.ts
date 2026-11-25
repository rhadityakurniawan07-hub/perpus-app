import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReadingStatusValue } from './dto/reading-status.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  private async recomputeBookAggregates(bookId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { bookId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: { _all: true },
    });
    const reviewCount = agg._count._all;
    const averageRating = Math.round((agg._avg.rating || 0) * 10) / 10;
    const positiveCount = await this.prisma.review.count({
      where: { bookId, status: 'APPROVED', rating: { gte: 4 } },
    });
    const positivePercent =
      reviewCount > 0 ? Math.round((positiveCount / reviewCount) * 100) : 0;
    await this.prisma.book.update({
      where: { id: bookId },
      data: { averageRating, reviewCount, positivePercent },
    });
  }

  private async ensureBookExists(bookId: string) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true },
    });
    if (!book) {
      throw new NotFoundException('Buku tidak ditemukan');
    }
  }

  async getBookReviews(bookId: string) {
    await this.ensureBookExists(bookId);

    const reviews = await this.prisma.review.findMany({
      where: { bookId, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true } } },
    });

    const reviewCount = reviews.length;
    const average =
      reviewCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;
    const positivePercent =
      reviewCount > 0
        ? Math.round((reviews.filter((r) => r.rating >= 4).length / reviewCount) * 100)
        : 0;

    return {
      averageRating: Math.round(average * 10) / 10,
      reviewCount,
      positivePercent,
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        status: r.status,
        createdAt: r.createdAt,
        user: { id: r.user.id, name: r.user.name },
      })),
    };
  }

  async getBookUserState(userId: string, bookId: string) {
    const [review, reading] = await Promise.all([
      this.prisma.review.findUnique({
        where: { userId_bookId: { userId, bookId } },
      }),
      this.prisma.readingStatus.findUnique({
        where: { userId_bookId: { userId, bookId } },
      }),
    ]);

    return {
      review: review
        ? { id: review.id, rating: review.rating, comment: review.comment, status: review.status }
        : null,
      status: reading?.status ?? null,
    };
  }

  async upsertReview(userId: string, bookId: string, dto: CreateReviewDto) {
    await this.ensureBookExists(bookId);

    const review = await this.prisma.review.upsert({
      where: { userId_bookId: { userId, bookId } },
      create: {
        userId,
        bookId,
        rating: dto.rating,
        comment: dto.comment,
        status: 'APPROVED',
      },
      update: {
        rating: dto.rating,
        comment: dto.comment,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    await this.recomputeBookAggregates(bookId);

    return review;
  }

  async deleteReview(userId: string, id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException('Ulasan tidak ditemukan');
    }
    if (review.userId !== userId) {
      throw new ForbiddenException('Anda tidak dapat menghapus ulasan ini');
    }

    await this.prisma.review.delete({ where: { id } });
    await this.recomputeBookAggregates(review.bookId);

    return { success: true };
  }

  async getMyReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        book: { include: { category: true } },
        user: { select: { id: true, name: true } },
      },
    });
  }

  async getMyStats(userId: string) {
    const [groups, reviewCount] = await Promise.all([
      this.prisma.readingStatus.groupBy({
        by: ['status'],
        where: { userId },
        _count: { _all: true },
      }),
      this.prisma.review.count({ where: { userId } }),
    ]);

    const counts: Record<ReadingStatusValue, number> = {
      WISHLIST: 0,
      READING: 0,
      FINISHED: 0,
    };
    for (const group of groups) {
      counts[group.status as ReadingStatusValue] = group._count._all;
    }

    return {
      wishlist: counts.WISHLIST,
      reading: counts.READING,
      finished: counts.FINISHED,
      reviews: reviewCount,
    };
  }

  async setReadingStatus(userId: string, bookId: string, status: ReadingStatusValue) {
    await this.ensureBookExists(bookId);

    return this.prisma.readingStatus.upsert({
      where: { userId_bookId: { userId, bookId } },
      create: { userId, bookId, status: status as any },
      update: { status: status as any },
    });
  }

  async getMyReading(userId: string, status?: string) {
    return this.prisma.readingStatus.findMany({
      where: {
        userId,
        ...(status ? { status: status as any } : {}),
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        book: { include: { category: true } },
      },
    });
  }

  async getUserBadges(userId: string) {
    const [finishedCount, reviewCount, categoriesRead, recentFinished] = await Promise.all([
      this.prisma.readingStatus.count({ where: { userId, status: 'FINISHED' } }),
      this.prisma.review.count({ where: { userId } }),
      this.prisma.readingStatus.findMany({
        where: { userId, status: 'FINISHED' },
        select: { book: { select: { categoryId: true } } },
      }),
      this.prisma.readingStatus.count({
        where: {
          userId,
          status: 'FINISHED',
          updatedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    const uniqueCategories = new Set(categoriesRead.map((r) => r.book?.categoryId).filter(Boolean));
    const avgRating = await this.prisma.review.aggregate({
      where: { userId },
      _avg: { rating: true },
    });

    const badges: { id: string; name: string; description: string; icon: string; earned: boolean }[] = [
      {
        id: 'active_reader',
        name: 'Pembaca Aktif',
        description: 'Menyelesaikan 10+ buku',
        icon: '📚',
        earned: finishedCount >= 10,
      },
      {
        id: 'critic',
        name: 'Kritikus',
        description: 'Menulis 20+ ulasan',
        icon: '✍️',
        earned: reviewCount >= 20,
      },
      {
        id: 'explorer',
        name: 'Penjelajah',
        description: 'Membaca 5+ kategori berbeda',
        icon: '🧭',
        earned: uniqueCategories.size >= 5,
      },
      {
        id: 'speed_reader',
        name: 'Pembaca Cepat',
        description: '5+ buku selesai dalam 1 bulan',
        icon: '⚡',
        earned: recentFinished >= 5,
      },
      {
        id: 'top_reviewer',
        name: 'Reviewer Top',
        description: 'Rating rata-rata ulasan ≥ 4.5',
        icon: '⭐',
        earned: (avgRating._avg.rating || 0) >= 4.5 && reviewCount >= 5,
      },
    ];

    return badges;
  }

  async moderateReview(reviewId: string, status: 'APPROVED' | 'HIDDEN') {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('Ulasan tidak ditemukan');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: { status },
      include: { user: { select: { id: true, name: true } }, book: { select: { id: true, title: true } } },
    });

    await this.recomputeBookAggregates(review.bookId);

    return updated;
  }

  async getPendingReviews() {
    return this.prisma.review.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        book: { select: { id: true, title: true } },
      },
    });
  }

  async getAllReviewsForModeration() {
    return this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        book: { select: { id: true, title: true } },
      },
    });
  }
}
