'use client';

import { useState } from 'react';

interface RatingStarsProps {
  rating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeClass = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
};

function Star({ className, filled }: { className?: string; filled: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function RatingStars({ rating = 0, size = 'md', interactive = false, onChange }: RatingStarsProps) {
  const [hover, setHover] = useState(0);
  const starSize = sizeClass[size];

  if (interactive) {
    const active = hover || Math.round(rating);
    return (
      <div className="inline-flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`Beri rating ${value} bintang`}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange?.(value)}
            className="rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <Star className={`${starSize} ${value <= active ? 'text-amber-400' : 'text-slate-300'}`} filled={value <= active} />
          </button>
        ))}
      </div>
    );
  }

  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));

  return (
    <span className="relative inline-flex align-middle" aria-label={`Rating ${rating.toFixed(1)} dari 5`}>
      <span className="flex gap-0.5 text-slate-300">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={starSize} filled={false} />
        ))}
      </span>
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${percent}%` }}>
        <span className="flex w-max gap-0.5 text-amber-400">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className={starSize} filled />
          ))}
        </span>
      </span>
    </span>
  );
}
