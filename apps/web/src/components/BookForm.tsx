'use client';

import { useState, useEffect, FormEvent } from 'react';
import api from '@/lib/axios';
import { Book, Category } from '@/types';

export interface BookFormValues {
  title: string;
  author: string;
  publisher: string;
  categoryId: string;
  isbn: string;
  year: string;
  description: string;
  coverImage: string;
  totalStock: string;
  availableStock: string;
  shelfLocation: string;
}

interface BookFormProps {
  initialData?: Book;
  submitLabel: string;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

const emptyValues: BookFormValues = {
  title: '',
  author: '',
  publisher: '',
  categoryId: '',
  isbn: '',
  year: '',
  description: '',
  coverImage: '',
  totalStock: '',
  availableStock: '',
  shelfLocation: '',
};

const inputClass =
  'mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500';
const labelClass = 'block text-sm font-medium text-gray-700';

export default function BookForm({ initialData, submitLabel, onSubmit }: BookFormProps) {
  const [values, setValues] = useState<BookFormValues>(emptyValues);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setValues({
        title: initialData.title || '',
        author: initialData.author || '',
        publisher: initialData.publisher || '',
        categoryId: initialData.categoryId || '',
        isbn: initialData.isbn || '',
        year: initialData.year ? String(initialData.year) : '',
        description: initialData.description || '',
        coverImage: initialData.coverImage || '',
        totalStock: initialData.totalStock != null ? String(initialData.totalStock) : '',
        availableStock:
          initialData.availableStock != null ? String(initialData.availableStock) : '',
        shelfLocation: initialData.shelfLocation || '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    api
      .get('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setError('Gagal memuat daftar kategori.'));
  }, []);

  function setField(field: keyof BookFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): string {
    if (!values.title.trim()) return 'Judul wajib diisi.';
    if (!values.author.trim()) return 'Penulis wajib diisi.';
    if (!values.publisher.trim()) return 'Penerbit wajib diisi.';
    if (!values.categoryId) return 'Kategori wajib dipilih.';
    if (!values.year.trim() || isNaN(Number(values.year)) || Number(values.year) < 1000) {
      return 'Tahun terbit wajib diisi dengan angka yang valid.';
    }
    if (!values.totalStock.trim() || isNaN(Number(values.totalStock)) || Number(values.totalStock) < 0) {
      return 'Total stok wajib diisi dengan angka yang valid.';
    }
    if (
      values.availableStock.trim() &&
      (isNaN(Number(values.availableStock)) || Number(values.availableStock) < 0)
    ) {
      return 'Stok tersedia harus berupa angka 0 atau lebih.';
    }
    return '';
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: Record<string, unknown> = {
      title: values.title.trim(),
      author: values.author.trim(),
      publisher: values.publisher.trim(),
      categoryId: values.categoryId,
      year: Number(values.year),
      totalStock: Number(values.totalStock),
    };

    if (values.isbn.trim()) payload.isbn = values.isbn.trim();
    if (values.description.trim()) payload.description = values.description.trim();
    if (values.coverImage.trim()) payload.coverImage = values.coverImage.trim();
    if (values.availableStock.trim()) payload.availableStock = Number(values.availableStock);
    if (values.shelfLocation.trim()) payload.shelfLocation = values.shelfLocation.trim();

    setSaving(true);
    try {
      await onSubmit(payload);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan buku.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="title" className={labelClass}>
            Judul Buku *
          </label>
          <input
            id="title"
            type="text"
            required
            value={values.title}
            onChange={(e) => setField('title', e.target.value)}
            className={inputClass}
            placeholder="Contoh: Laskar Pelangi"
          />
        </div>

        <div>
          <label htmlFor="author" className={labelClass}>
            Penulis *
          </label>
          <input
            id="author"
            type="text"
            required
            value={values.author}
            onChange={(e) => setField('author', e.target.value)}
            className={inputClass}
            placeholder="Nama penulis"
          />
        </div>

        <div>
          <label htmlFor="publisher" className={labelClass}>
            Penerbit *
          </label>
          <input
            id="publisher"
            type="text"
            required
            value={values.publisher}
            onChange={(e) => setField('publisher', e.target.value)}
            className={inputClass}
            placeholder="Nama penerbit"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className={labelClass}>
            Kategori *
          </label>
          <select
            id="categoryId"
            required
            value={values.categoryId}
            onChange={(e) => setField('categoryId', e.target.value)}
            className={inputClass}
          >
            <option value="">-- Pilih kategori --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="year" className={labelClass}>
            Tahun Terbit *
          </label>
          <input
            id="year"
            type="number"
            required
            min={1000}
            max={2100}
            value={values.year}
            onChange={(e) => setField('year', e.target.value)}
            className={inputClass}
            placeholder="Contoh: 2020"
          />
        </div>

        <div>
          <label htmlFor="isbn" className={labelClass}>
            ISBN
          </label>
          <input
            id="isbn"
            type="text"
            value={values.isbn}
            onChange={(e) => setField('isbn', e.target.value)}
            className={inputClass}
            placeholder="Opsional"
          />
        </div>

        <div>
          <label htmlFor="shelfLocation" className={labelClass}>
            Lokasi Rak
          </label>
          <input
            id="shelfLocation"
            type="text"
            value={values.shelfLocation}
            onChange={(e) => setField('shelfLocation', e.target.value)}
            className={inputClass}
            placeholder="Contoh: Rak A-3"
          />
        </div>

        <div>
          <label htmlFor="totalStock" className={labelClass}>
            Total Stok *
          </label>
          <input
            id="totalStock"
            type="number"
            required
            min={0}
            value={values.totalStock}
            onChange={(e) => setField('totalStock', e.target.value)}
            className={inputClass}
            placeholder="Jumlah total"
          />
        </div>

        <div>
          <label htmlFor="availableStock" className={labelClass}>
            Stok Tersedia
          </label>
          <input
            id="availableStock"
            type="number"
            min={0}
            value={values.availableStock}
            onChange={(e) => setField('availableStock', e.target.value)}
            className={inputClass}
            placeholder="Kosongkan = sama dengan total stok"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="coverImage" className={labelClass}>
            URL Cover
          </label>
          <input
            id="coverImage"
            type="url"
            value={values.coverImage}
            onChange={(e) => setField('coverImage', e.target.value)}
            className={inputClass}
            placeholder="https://example.com/cover.jpg (opsional)"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Deskripsi
          </label>
          <textarea
            id="description"
            rows={4}
            value={values.description}
            onChange={(e) => setField('description', e.target.value)}
            className={inputClass}
            placeholder="Deskripsi singkat buku (opsional)"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className={`px-6 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            saving ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {saving ? 'Menyimpan...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}