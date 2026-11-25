'use client';

// Lightweight analytics event tracker
// In production, replace with PostHog/Plausible/GA4

type EventName =
  | 'page_view'
  | 'search'
  | 'view_detail'
  | 'rate_book'
  | 'submit_review'
  | 'status_change'
  | 'login'
  | 'register'
  | 'logout'
  | 'admin_action'
  | 'export_report'
  | 'import_book';

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

const isDev = process.env.NODE_ENV === 'development';

export function trackEvent(name: EventName, properties?: EventProperties) {
  if (isDev) {
    console.log(`[Analytics] ${name}`, properties || {});
  }

  // Send to analytics provider (PostHog/Plausible/GA4)
  // Example for Plausible:
  // if (typeof window !== 'undefined' && (window as any).plausible) {
  //   (window as any).plausible(name, { props: properties });
  // }

  // Example for GA4:
  // if (typeof window !== 'undefined' && (window as any).gtag) {
  //   (window as any).gtag('event', name, properties);
  // }
}

export function trackPageView(path: string) {
  trackEvent('page_view', { path });
}

// Convenience functions for common events
export const analytics = {
  search: (query: string, resultCount: number) => trackEvent('search', { query, resultCount }),
  viewDetail: (bookId: string, bookTitle: string) => trackEvent('view_detail', { bookId, bookTitle }),
  rateBook: (bookId: string, rating: number) => trackEvent('rate_book', { bookId, rating }),
  submitReview: (bookId: string, hasComment: boolean) => trackEvent('submit_review', { bookId, hasComment }),
  statusChange: (bookId: string, status: string) => trackEvent('status_change', { bookId, status }),
  login: (role: string) => trackEvent('login', { role }),
  register: () => trackEvent('register'),
  logout: () => trackEvent('logout'),
  adminAction: (action: string, target: string) => trackEvent('admin_action', { action, target }),
  exportReport: (format: string) => trackEvent('export_report', { format }),
  importBook: (source: string) => trackEvent('import_book', { source }),
};