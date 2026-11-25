// i18n configuration for PERPUS
// Default language: Indonesian (id)
// Supported: id, en

export type Locale = 'id' | 'en';

export const defaultLocale: Locale = 'id';
export const locales: Locale[] = ['id', 'en'];

export const localeNames: Record<Locale, string> = {
  id: 'Bahasa Indonesia',
  en: 'English',
};

// Translation keys
export const translations = {
  id: {
    common: {
      search: 'Cari',
      loading: 'Memuat...',
      error: 'Terjadi kesalahan',
      retry: 'Coba Lagi',
      save: 'Simpan',
      cancel: 'Batal',
      delete: 'Hapus',
      edit: 'Edit',
      create: 'Tambah',
      back: 'Kembali',
    },
    nav: {
      home: 'Beranda',
      catalog: 'Katalog Buku',
      dashboard: 'Dashboard',
      myCollection: 'Koleksi Saya',
      reviews: 'Ulasan & Rating',
      profile: 'Profil',
      login: 'Masuk',
      register: 'Daftar',
      logout: 'Keluar',
    },
    books: {
      title: 'Katalog Koleksi',
      searchPlaceholder: 'Cari judul buku, pengarang, ISBN...',
      sortBy: 'Urutkan',
      ratingHigh: 'Rating Tertinggi',
      titleAZ: 'Judul A-Z',
      newest: 'Terbaru',
      minRating: '4.5+ Saja',
      noResults: 'Tidak ada buku yang ditemukan',
      tryAgain: 'Coba ubah kata kunci atau filter Anda.',
      loadMore: 'Muat lebih banyak',
      loading: 'Memuat...',
    },
    auth: {
      login: 'Masuk',
      register: 'Daftar',
      email: 'Email',
      password: 'Kata Sandi',
      name: 'Nama Lengkap',
      welcomeBack: 'Selamat Datang Kembali',
      joinCommunity: 'Gabung dengan Komunitas',
      alreadyHaveAccount: 'Sudah punya akun?',
      noAccount: 'Belum punya akun?',
      loginHere: 'Masuk di sini',
      registerHere: 'Daftar di sini',
    },
    reviews: {
      writeReview: 'Beri Rating & Ulasan',
      selectRating: 'Pilih rating',
      writeComment: 'Tulis refleksi atau tanggapan Anda...',
      submit: 'Kirim Ulasan',
      saving: 'Menyimpan...',
      saved: 'Ulasan Anda berhasil disimpan. Terima kasih!',
      maxChars: 'maksimal 2000 karakter',
      noReviews: 'Belum ada ulasan untuk buku ini.',
      firstReview: 'Jadilah pembaca pertama yang menulis.',
    },
    reading: {
      wishlist: 'Ingin Dibaca',
      reading: 'Sedang Dibaca',
      finished: 'Sudah Selesai',
      status: 'Status Baca',
    },
  },
  en: {
    common: {
      search: 'Search',
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Try Again',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Add',
      back: 'Back',
    },
    nav: {
      home: 'Home',
      catalog: 'Book Catalog',
      dashboard: 'Dashboard',
      myCollection: 'My Collection',
      reviews: 'Reviews & Ratings',
      profile: 'Profile',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
    },
    books: {
      title: 'Book Catalog',
      searchPlaceholder: 'Search book title, author, ISBN...',
      sortBy: 'Sort by',
      ratingHigh: 'Highest Rating',
      titleAZ: 'Title A-Z',
      newest: 'Newest',
      minRating: '4.5+ Only',
      noResults: 'No books found',
      tryAgain: 'Try changing your search or filters.',
      loadMore: 'Load more',
      loading: 'Loading...',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      welcomeBack: 'Welcome Back',
      joinCommunity: 'Join the Community',
      alreadyHaveAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      loginHere: 'Login here',
      registerHere: 'Register here',
    },
    reviews: {
      writeReview: 'Rate & Review',
      selectRating: 'Select rating',
      writeComment: 'Write your reflection or response...',
      submit: 'Submit Review',
      saving: 'Saving...',
      saved: 'Your review has been saved. Thank you!',
      maxChars: 'maximum 2000 characters',
      noReviews: 'No reviews for this book yet.',
      firstReview: 'Be the first to write a review.',
    },
    reading: {
      wishlist: 'Want to Read',
      reading: 'Currently Reading',
      finished: 'Finished',
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.id;