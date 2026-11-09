import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface GoogleBookResult {
  volumeId: string;
  title: string;
  author: string;
  publisher: string;
  year: number | null;
  isbn: string | null;
  description: string;
  coverImage: string | null;
  categories: string[];
}

@Injectable()
export class GoogleBooksService {
  constructor(private configService: ConfigService) {}

  private getApiKey(): string {
    const key = this.configService.get<string>('GOOGLE_BOOKS_API_KEY');
    if (!key || !key.trim()) {
      throw new BadRequestException(
        'API key Google Books belum dikonfigurasi. Silakan isi GOOGLE_BOOKS_API_KEY di file apps/api/.env.'
      );
    }
    return key.trim();
  }

  private async fetchVolumes(url: string): Promise<any> {
    let res: Response;
    try {
      res = await fetch(url);
    } catch {
      throw new ServiceUnavailableException(
        'Gagal terhubung ke Google Books API. Periksa koneksi internet server.'
      );
    }

    if (res.status === 429) {
      throw new ServiceUnavailableException(
        'Kuota API Google Books habis (HTTP 429). Coba lagi nanti atau gunakan API key lain.'
      );
    }
    if (res.status === 403) {
      throw new ServiceUnavailableException(
        'Akses ditolak oleh Google Books API (HTTP 403). Periksa GOOGLE_BOOKS_API_KEY Anda.'
      );
    }
    if (!res.ok) {
      throw new ServiceUnavailableException(
        `Google Books API mengembalikan error (HTTP ${res.status}).`
      );
    }

    return res.json();
  }

  private normalize(item: any): GoogleBookResult {
    const info = item?.volumeInfo ?? {};
    const identifiers: Array<{ type: string; identifier: string }> =
      info.industryIdentifiers ?? [];
    const isbn =
      identifiers.find((i) => i.type === 'ISBN_13')?.identifier ??
      identifiers.find((i) => i.type === 'ISBN_10')?.identifier ??
      null;

    let coverImage: string | null =
      info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? null;
    if (coverImage) {
      coverImage = coverImage.replace(/^http:\/\//i, 'https://');
    }

    const year = info.publishedDate
      ? parseInt(String(info.publishedDate).slice(0, 4), 10) || null
      : null;

    return {
      volumeId: item?.id ?? '',
      title: info.title ?? 'Tanpa Judul',
      author: (info.authors ?? []).join(', ') || 'Tidak diketahui',
      publisher: info.publisher ?? '',
      year,
      isbn,
      description: info.description ?? '',
      coverImage,
      categories: Array.isArray(info.categories) ? info.categories : [],
    };
  }

  async search(query: string, maxResults = 10) {
    const key = this.getApiKey();
    const url =
      `https://www.googleapis.com/books/v1/volumes` +
      `?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${encodeURIComponent(key)}`;

    const data = await this.fetchVolumes(url);
    const items: any[] = Array.isArray(data?.items) ? data.items : [];

    return {
      totalItems: data?.totalItems ?? 0,
      results: items.map((item) => this.normalize(item)),
    };
  }

  async findByVolumeId(volumeId: string) {
    const key = this.getApiKey();
    const url =
      `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(volumeId)}` +
      `?key=${encodeURIComponent(key)}`;

    const item = await this.fetchVolumes(url);
    return this.normalize(item);
  }
}
