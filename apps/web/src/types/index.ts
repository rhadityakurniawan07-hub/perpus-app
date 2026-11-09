export type ReadingStatusValue = 'WISHLIST' | 'READING' | 'FINISHED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  categoryId: string;
  isbn?: string;
  year: number;
  description?: string;
  coverImage?: string;
  totalStock: number;
  availableStock: number;
  shelfLocation?: string;
  averageRating: number;
  reviewCount: number;
  positivePercent: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface Review {
  id: string;
  userId?: string;
  bookId?: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt?: string;
  user?: { id: string; name: string };
  book?: Book;
}

export interface BookReviewSummary {
  averageRating: number;
  reviewCount: number;
  positivePercent: number;
  reviews: Review[];
}

export interface BookUserState {
  review: { id: string; rating: number; comment?: string | null } | null;
  status: ReadingStatusValue | null;
}

export interface ReadingStatusItem {
  id: string;
  userId: string;
  bookId: string;
  status: ReadingStatusValue;
  createdAt: string;
  updatedAt: string;
  book?: Book;
}

export interface MyStats {
  wishlist: number;
  reading: number;
  finished: number;
  reviews: number;
}

export interface Loan {
  id: string;
  userId: string;
  bookId: string;
  requestDate: string;
  borrowDate?: string;
  dueDate?: string;
  returnDate?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'BORROWED' | 'RETURNED' | 'OVERDUE';
  createdAt: string;
  updatedAt: string;
  user?: User;
  book?: Book;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MEMBER';
  };
}

export interface PopularBookItem {
  book: Book | null;
  count: number;
}

export interface ReportStats {
  totalBooks: number;
  totalMembers: number;
  borrowedBooks: number;
  pendingLoans: number;
  overdueLoans: number;
  popularBooks: PopularBookItem[];
  recentLoans: Loan[];
  lateLoans: Loan[];
  totalReviews: number;
  averageRating: number;
  topRatedBooks: Book[];
  recentReviews: Review[];
  readingSummary: Record<ReadingStatusValue, number>;
}