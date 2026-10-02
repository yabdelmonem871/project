import { Star } from 'lucide-react';
import { cn } from '@/utils/format';

interface RatingProps {
  value: number;
  reviewsCount?: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
}

export default function Rating({ value, reviewsCount, size = 'sm', showCount = true }: RatingProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map((i) => {
          const isFull = i < full;
          const isHalf = i === full && hasHalf;
          return (
            <span key={i} className="relative">
              <Star className={cn(starSize, 'text-slate-300 dark:text-slate-600')} />
              {(isFull || isHalf) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: isHalf ? '50%' : '100%' }}
                >
                  <Star className={cn(starSize, 'fill-amber-400 text-amber-400')} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showCount && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {value.toFixed(1)}
          {reviewsCount !== undefined && ` (${reviewsCount})`}
        </span>
      )}
    </div>
  );
}
