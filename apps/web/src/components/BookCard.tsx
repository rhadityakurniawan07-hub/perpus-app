import Link from 'next/link';
import { Book, ReadingStatusValue } from '@/types';
import RatingStars from '@/components/RatingStars';

interface BookCardProps {
  book: Book;
  readingStatus?: ReadingStatusValue | null;
}

const statusConfig: Record<ReadingStatusValue, { label: string; className: string }> = {
  FINISHED: { label: 'Sudah Selesai', className: 'bg-emerald-100 text-emerald-800' },
  READING: { label: 'Sedang Dibaca', className: 'bg-amber-100 text-amber-800' },
  WISHLIST: { label: 'Belum Dibaca', className: 'bg-slate-100 text-slate-600' },
};

export default function BookCard({ book, readingStatus }: BookCardProps) {
  const status = readingStatus
    ? statusConfig[readingStatus]
    : book.reviewCount === 0 && (book.averageRating ?? 0) === 0
    ? { label: 'Baru Ditambahkan', className: 'bg-brand-100 text-brand-800' }
    : statusConfig.WISHLIST;

  return (
    <article className="card flex flex-col overflow-hidden transition hover:shadow-soft">
      {/* Cover */}
      <Link href={`/books/${book.id}`} className="relative block h-56 shrink-0 select-none overflow-hidden bg-gradient-to-br from-brand-800 via-ink to-slate-900">
        {book.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg className="h-16 w-16 text-brand-300" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
        )}

        <span className="badge absolute left-2 top-2 bg-white/90 text-brand-800 shadow-soft backdrop-blur">
          {book.category?.name || 'Umum'}
        </span>
        <span className="badge absolute right-2 top-2 bg-white/85 text-slate-700 shadow-soft backdrop-blur">
          {book.year}
        </span>
        <span className={`badge absolute bottom-2 right-2 shadow-soft backdrop-blur ${status.className}`}>
          {status.label}
        </span>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <RatingStars rating={book.averageRating || 0} size="sm" />
            <span className="text-sm font-extrabold text-ink">
              {(book.averageRating || 0).toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">({book.reviewCount || 0} ulasan)</span>
          </div>
          <span className="shrink-0 text-xs font-bold text-emerald-600">
            {book.positivePercent || 0}% Positif
          </span>
        </div>

        <p className="mt-2 truncate text-[11px] text-slate-400">
          ISBN {book.isbn || '-'} · {book.shelfLocation || 'Rak -'}{' '}
          {book.category?.name ? `• ${book.category.name}` : ''}
        </p>

        <h3 className="mt-1.5 line-clamp-2 font-bold leading-snug text-ink">{book.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">oleh {book.author}</p>

        {book.description && (
          <p className="mt-2 line-clamp-2 text-xs italic leading-relaxed text-slate-500">
            “{book.description}”
          </p>
        )}

        <Link
          href={`/books/${book.id}`}
          className="btn-primary mt-4 w-full !py-2.5 text-center text-xs"
        >
          Lihat Detail &amp; Beri Rating
        </Link>
      </div>
    </article>
  );
}
