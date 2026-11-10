import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleBooksService } from '../google-books/google-books.service';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    private prisma: PrismaService,
    private googleBooksService: GoogleBooksService,
  ) {}

  async findAll(query?: any) {
    const {
      search,
      category,
      available,
      minRating,
      sortBy = 'title',
      order = 'asc',
      page,
      limit,
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

    const takeRaw = limit !== undefined ? Number(limit) : undefined;
    const pageRaw = page !== undefined ? Number(page) : undefined;
    const take = takeRaw && !Number.isNaN(takeRaw) && takeRaw > 0 ? Math.min(takeRaw, 100) : undefined;
    const currentPage = pageRaw && !Number.isNaN(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const skip = take !== undefined ? (currentPage - 1) * take : undefined;
    const paginate = take !== undefined;

    if (paginate) {
      const [data, total] = await Promise.all([
        this.prisma.book.findMany({
          where,
          include: { category: true },
          orderBy: { [sortField]: order },
          take,
          skip,
        }),
        this.prisma.book.count({ where }),
      ]);

      return {
        data,
        meta: {
          total,
          page: currentPage,
          limit: take,
          totalPages: Math.max(1, Math.ceil(total / take)),
        },
      };
    }

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

  private async ensureGoogleBooksCategory(): Promise<string> {
    const existing = await this.prisma.category.findUnique({
      where: { name: 'Google Books' },
      select: { id: true },
    });
    if (existing) return existing.id;

    const created = await this.prisma.category.create({
      data: {
        id: 'cat_google-books',
        name: 'Google Books',
        description: 'Buku yang diimpor otomatis dari Google Books',
      },
      select: { id: true },
    });
    return created.id;
  }

  private guessCategoryId(googleCategories: string[]): string {
    const text = (googleCategories ?? []).join(' ').toLowerCase();

    const map: Array<[RegExp, string]> = [
      [/(fiction|novel|literature|poetry|drama|fantasy|mystery|romance|short story)/i, 'cat_fiksi'],
      [/(science|technology|medicine|medical|computer|programming|engineering|mathematics|math|psychology|biology|chemistry|physics|nature|\bhealth\b|nursing)/i, 'cat_sains'],
      [/(history|historical|biography|memoir|war|military)/i, 'cat_sejarah'],
      [/(philosophy|religion|spirituality|ethics|theology|islam|christian|buddha|hindu|mythology)/i, 'cat_filsafat'],
      [/(social|economics|business|politics|political|education|law|legal|psychology|sociology|psychology)/i, 'cat_sosial'],
    ];

    for (const [regex, categoryId] of map) {
      if (regex.test(text)) return categoryId;
    }
    return ''; // kosong → pakai fallback "Google Books"
  }

  async importGoogleBooks(volumeId: string) {
    // 1. Ambil detail dari Google Books (memakai key yang sama)
    const google = await this.googleBooksService.findByVolumeId(volumeId);

    // 2. Cegah duplikat ISBN
    if (google.isbn) {
      const existing = await this.prisma.book.findUnique({
        where: { isbn: google.isbn },
        include: { category: true },
      });
      if (existing) {
        this.logger.log(`Auto-import skip: ISBN ${google.isbn} sudah ada (${existing.id})`);
        return { book: existing, imported: false };
      }
    }

    // 3. Tentukan kategori (mapping; fallback ke "Google Books")
    let categoryId = this.guessCategoryId(google.categories);
    if (!categoryId) {
      categoryId = await this.ensureGoogleBooksCategory();
    } else {
      // pastikan kategori lokal yang dipetakan benar-benar ada
      const exists = await this.prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      });
      if (!exists) {
        categoryId = await this.ensureGoogleBooksCategory();
      }
    }

    const year = google.year ?? new Date().getFullYear();

    const created = await this.prisma.book.create({
      data: {
        title: google.title || 'Tanpa Judul',
        author: google.author || 'Tidak diketahui',
        publisher: google.publisher || '-',
        categoryId,
        isbn: google.isbn,
        year,
        description: google.description || undefined,
        coverImage: google.coverImage || undefined,
        totalStock: 5,
        availableStock: 5,
        shelfLocation: 'Impor Google Books',
      },
      include: { category: true },
    });

    this.logger.log(`Auto-import: ${created.title} (${created.id}) dari volumeId ${volumeId}`);
    return { book: created, imported: true };
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
