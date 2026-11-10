// Util untuk memetakan kategori Google Books -> kategori lokal (per keyword).
// Dipakai juga oleh chips dynamic di halaman katalog terpadu.

export interface LocalCategoryRef {
  id: string;
  name: string;
}

const KEYWORDS: Array<{ id: string; name: string; regex: RegExp }> = [
  { id: 'cat_fiksi', name: 'Fiksi Sastra & Klasik', regex: /(fiction|novel|literature|poetry|drama|fantasy|mystery|romance|short story|love story|fairy)/i },
  { id: 'cat_sains', name: 'Sains & Teknologi', regex: /(science|technology|medicine|medical|computer|programming|engineering|mathematics|math|psychology|biology|chemistry|physics|nature|health|nursing)/i },
  { id: 'cat_sejarah', name: 'Sejarah & Dokumenter', regex: /(history|biography|memoir|war|military|historical)/i },
  { id: 'cat_filsafat', name: 'Filsafat & Humaniora', regex: /(philosophy|religion|spirituality|ethics|theology|islam|christian|buddha|hindu|mythology|faith)/i },
  { id: 'cat_sosial', name: 'Kajian Sosial & Budaya', regex: /(social|economics|business|politics|political|education|law|legal|sociology|psychology)/i },
];

export function mapGoogleCategoriesToLocal(
  googleCategories: string[],
  localCategories: LocalCategoryRef[]
): string | null {
  const text = (googleCategories ?? []).join(' ').toLowerCase();

  for (const entry of KEYWORDS) {
    if (entry.regex.test(text)) {
      const found = localCategories.find((c) => c.id === entry.id || c.name === entry.name);
      if (found) return found.id;
    }
  }

  // Fallback: kategori "Google Books" yang auto-dibuat backend jika tidak ada
  const fallback = localCategories.find((c) => c.name === 'Google Books');
  return fallback?.id ?? null;
}

export function localCategoryIdsFromGoogle(
  googleCategories: string[],
  localCategories: LocalCategoryRef[]
): string[] {
  const mapped = mapGoogleCategoriesToLocal(googleCategories, localCategories);
  return mapped ? [mapped] : [];
}
