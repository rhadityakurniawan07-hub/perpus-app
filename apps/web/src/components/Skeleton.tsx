'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'title' | 'avatar' | 'image' | 'button' | 'card' | 'table-row' | 'stat';
  width?: string;
  height?: string;
}

export default function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
  const base = 'animate-pulse rounded bg-slate-200';

  const variants: Record<string, string> = {
    text: 'h-3 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    image: 'h-48 w-32 rounded-xl',
    button: 'h-10 w-24 rounded-xl',
    card: 'h-48 w-full rounded-2xl',
    'table-row': 'h-12 w-full rounded-lg',
    stat: 'h-24 w-full rounded-2xl',
  };

  return (
    <div
      className={`${base} ${variants[variant]} ${className || ''}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

// Compound skeleton components for common patterns

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex gap-4">
        <div className="h-48 w-32 shrink-0 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-3/4 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-200" />
          <div className="h-3 w-2/3 rounded bg-slate-200" />
          <div className="mt-4 h-8 w-full rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 rounded bg-slate-200" />
          <div className="h-6 w-1/3 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <div className="animate-pulse flex items-center gap-4 rounded-lg border border-slate-100 bg-white p-4">
      <div className="h-10 w-10 rounded-full bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="h-3 w-1/4 rounded bg-slate-200" />
      </div>
      <div className="h-8 w-20 rounded-lg bg-slate-200" />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  );
}