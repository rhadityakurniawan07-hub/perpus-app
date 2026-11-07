import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token dari localStorage ke setiap request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor untuk handle error
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      // Sertakan pesan siap tampil (Bahasa Indonesia) di objek error
      (error as AxiosError & { userMessage?: string }).userMessage = getErrorMessage(error);
    } else {
      console.error('Network Error:', error.message);
      (error as AxiosError & { userMessage?: string }).userMessage = getErrorMessage(error);
    }
    return Promise.reject(error);
  }
);

/**
 * Mengubah error axios menjadi pesan ramah Bahasa Indonesia.
 */
export function getErrorMessage(error: unknown): string {
  const err = error as AxiosError<{ message?: string | string[] }> & { message?: string };

  if (err?.response) {
    const data = err.response.data;
    if (Array.isArray(data?.message)) return data.message.join(', ');
    if (data?.message) return data.message;

    switch (err.response.status) {
      case 401:
        return 'Sesi Anda berakhir atau email/password salah. Silakan masuk kembali.';
      case 403:
        return 'Anda tidak memiliki akses ke fitur ini.';
      case 404:
        return 'Data tidak ditemukan.';
      case 409:
        return 'Data sudah terdaftar sebelumnya.';
      default:
        if (err.response.status >= 500) {
          return 'Terjadi kesalahan pada server. Coba lagi nanti.';
        }
        return 'Permintaan gagal diproses. Periksa kembali data Anda.';
    }
  }

  if (err?.request) {
    return 'Tidak dapat terhubung ke server. Pastikan backend berjalan di port 3001.';
  }

  return err?.message || 'Terjadi kesalahan yang tidak diketahui.';
}

export default api;