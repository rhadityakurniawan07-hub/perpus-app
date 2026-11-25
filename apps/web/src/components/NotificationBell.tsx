'use client';

import { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Selamat datang!',
      message: 'Terima kasih telah bergabung di PERPUS.',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeColors: Record<string, string> = {
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        aria-label="Notifikasi"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-bold text-ink">Notifikasi</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500">Tidak ada notifikasi.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`border-b border-slate-50 px-4 py-3 ${n.read ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${typeColors[n.type]}`}>
                      {n.type === 'info' ? 'Info' : n.type === 'success' ? 'Sukses' : n.type === 'warning' ? 'Peringatan' : 'Error'}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">{n.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}