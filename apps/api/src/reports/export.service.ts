import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocumentWithTables from 'pdfkit-table';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async exportPDF(): Promise<Buffer> {
    const stats = await this.gatherStats();

    return new Promise((resolve, reject) => {
      const doc = new (PDFDocumentWithTables as any)({ size: 'A4', margin: 40 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Title
      doc.fontSize(20).font('Helvetica-Bold').text('PERPUS — Laporan Katalog & Ulasan', { align: 'center' });
      doc.fontSize(10).font('Helvetica').text(`Dibuat: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}`, { align: 'center' });
      doc.moveDown(2);

      // Summary stats
      doc.fontSize(14).font('Helvetica-Bold').text('Ringkasan Statistik');
      doc.moveDown(0.5);
      const statsData = [
        ['Total Koleksi Buku', String(stats.totalBooks)],
        ['Total Anggota', String(stats.totalMembers)],
        ['Total Ulasan', String(stats.totalReviews)],
        ['Rating Rata-rata', String(stats.averageRating)],
        ['Wishlist (Ingin Dibaca)', String(stats.readingSummary.WISHLIST || 0)],
        ['Sedang Dibaca', String(stats.readingSummary.READING || 0)],
        ['Sudah Selesai', String(stats.readingSummary.FINISHED || 0)],
      ];
      doc.table({
        title: '',
        headers: ['Metrik', 'Nilai'],
        rows: statsData,
      }, { width: 300 });
      doc.moveDown(1);

      // Top Rated Books
      doc.fontSize(14).font('Helvetica-Bold').text('Buku Rating Tertinggi');
      doc.moveDown(0.5);
      const topBooksData = stats.topRatedBooks.map((b: any, i: number) => [
        String(i + 1),
        b.title,
        b.author,
        String(b.averageRating),
        String(b.reviewCount),
      ]);
      doc.table({
        title: '',
        headers: ['#', 'Judul', 'Penulis', 'Rating', 'Ulasan'],
        rows: topBooksData,
      }, { width: 500 });
      doc.moveDown(1);

      // Recent Reviews
      doc.fontSize(14).font('Helvetica-Bold').text('Ulasan Terbaru');
      doc.moveDown(0.5);
      const recentReviewsData = stats.recentReviews.map((r: any) => [
        r.user?.name || 'Pembaca',
        r.book?.title || '-',
        String(r.rating),
        (r.comment || '-').slice(0, 60),
      ]);
      doc.table({
        title: '',
        headers: ['Penulis', 'Buku', 'Rating', 'Ulasan'],
        rows: recentReviewsData,
      }, { width: 500 });

      doc.end();
    });
  }

  async exportExcel(): Promise<Buffer> {
    const stats = await this.gatherStats();

    const workbook = new (ExcelJS as any).Workbook();
    workbook.creator = 'PERPUS';
    workbook.created = new Date();

    // Sheet 1: Summary
    const summarySheet = workbook.addWorksheet('Ringkasan');
    summarySheet.columns = [
      { header: 'Metrik', key: 'metric', width: 30 },
      { header: 'Nilai', key: 'value', width: 15 },
    ];
    const summaryData = [
      { metric: 'Total Koleksi Buku', value: stats.totalBooks },
      { metric: 'Total Anggota', value: stats.totalMembers },
      { metric: 'Total Ulasan', value: stats.totalReviews },
      { metric: 'Rating Rata-rata', value: stats.averageRating },
      { metric: 'Wishlist (Ingin Dibaca)', value: stats.readingSummary.WISHLIST || 0 },
      { metric: 'Sedang Dibaca', value: stats.readingSummary.READING || 0 },
      { metric: 'Sudah Selesai', value: stats.readingSummary.FINISHED || 0 },
    ];
    summarySheet.addRows(summaryData);
    summarySheet.getRow(1).font = { bold: true };

    // Sheet 2: Top Rated Books
    const topBooksSheet = workbook.addWorksheet('Buku Rating Tertinggi');
    topBooksSheet.columns = [
      { header: '#', key: 'no', width: 5 },
      { header: 'Judul', key: 'title', width: 40 },
      { header: 'Penulis', key: 'author', width: 25 },
      { header: 'Rating', key: 'rating', width: 10 },
      { header: 'Ulasan', key: 'reviews', width: 10 },
      { header: 'Kategori', key: 'category', width: 20 },
    ];
    stats.topRatedBooks.forEach((b: any, i: number) => {
      topBooksSheet.addRow({
        no: i + 1,
        title: b.title,
        author: b.author,
        rating: b.averageRating,
        reviews: b.reviewCount,
        category: b.category?.name || '-',
      });
    });
    topBooksSheet.getRow(1).font = { bold: true };

    // Sheet 3: Recent Reviews
    const reviewsSheet = workbook.addWorksheet('Ulasan Terbaru');
    reviewsSheet.columns = [
      { header: 'Penulis', key: 'author', width: 20 },
      { header: 'Buku', key: 'book', width: 35 },
      { header: 'Rating', key: 'rating', width: 8 },
      { header: 'Ulasan', key: 'comment', width: 50 },
      { header: 'Tanggal', key: 'date', width: 15 },
    ];
    stats.recentReviews.forEach((r: any) => {
      reviewsSheet.addRow({
        author: r.user?.name || 'Pembaca',
        book: r.book?.title || '-',
        rating: r.rating,
        comment: r.comment || '-',
        date: new Date(r.createdAt).toLocaleDateString('id-ID'),
      });
    });
    reviewsSheet.getRow(1).font = { bold: true };

    // Sheet 4: Reading Summary
    const readingSheet = workbook.addWorksheet('Jejak Membaca');
    readingSheet.columns = [
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Jumlah', key: 'count', width: 10 },
    ];
    readingSheet.addRows([
      { status: 'Ingin Dibaca (Wishlist)', count: stats.readingSummary.WISHLIST || 0 },
      { status: 'Sedang Dibaca (Reading)', count: stats.readingSummary.READING || 0 },
      { status: 'Sudah Selesai (Finished)', count: stats.readingSummary.FINISHED || 0 },
    ]);
    readingSheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private async gatherStats() {
    const [totalBooks, totalMembers, totalReviews, ratingAgg, topRatedBooks, recentReviews, readingGroups] =
      await Promise.all([
        this.prisma.book.count(),
        this.prisma.user.count({ where: { role: 'MEMBER' } }),
        this.prisma.review.count({ where: { status: 'APPROVED' } }),
        this.prisma.review.aggregate({ where: { status: 'APPROVED' }, _avg: { rating: true } }),
        this.prisma.book.findMany({
          where: { reviewCount: { gt: 0 } },
          orderBy: [{ averageRating: 'desc' }, { reviewCount: 'desc' }],
          take: 10,
          include: { category: true },
        }),
        this.prisma.review.findMany({
          where: { status: 'APPROVED' },
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

    const readingSummary = { WISHLIST: 0, READING: 0, FINISHED: 0 } as Record<string, number>;
    for (const group of readingGroups) {
      readingSummary[group.status] = group._count._all;
    }

    return {
      totalBooks,
      totalMembers,
      totalReviews,
      averageRating,
      topRatedBooks,
      recentReviews,
      readingSummary,
    };
  }
}