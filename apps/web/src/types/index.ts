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
  createdAt: string;
  updatedAt: string;
  category?: Category;
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
}