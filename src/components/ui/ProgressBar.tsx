'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  percent: number;
  color?: string;
  trackColor?: string;
  height?: string;
  className?: string;
  label?: string;
  showValue?: boolean;
}

export function ProgressBar({
  percent,
  color = 'bg-emerald-600 dark:bg-emerald-500',
  trackColor = 'bg-muted',
  height = 'h-2',
  className,
  label,
  showValue = false,
}: ProgressBarProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <span className="text-sm text-muted-foreground">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-foreground">
              {Math.round(clampedPercent)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full',
          trackColor,
          height,
        )}
        role="progressbar"
        aria-valuenow={clampedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            color,
          )}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
    </div>
  );
}