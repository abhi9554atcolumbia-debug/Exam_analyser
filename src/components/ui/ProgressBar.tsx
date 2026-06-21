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
  /** Show animated stripes (for in-progress items) */
  animated?: boolean;
  /** Show percentage text at the end of the bar */
  showPercentAtEnd?: boolean;
}

export function ProgressBar({
  percent,
  color,
  trackColor = 'bg-muted',
  height = 'h-2.5',
  className,
  label,
  showValue = false,
  animated = false,
  showPercentAtEnd = false,
}: ProgressBarProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  // Use gradient by default, custom color overrides
  const fillClass = color
    ? cn('rounded-full transition-all duration-500 ease-out', color)
    : 'rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-500 dark:to-teal-400';

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-foreground">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {Math.round(clampedPercent)}%
            </span>
          )}
        </div>
      )}
      <div className="relative">
        {/* Glow effect behind the bar */}
        {clampedPercent > 0 && (
          <div
            className="absolute inset-0 rounded-full opacity-30 blur-sm transition-opacity duration-500"
            style={{
              width: `${clampedPercent}%`,
              background: color
                ? 'currentColor'
                : 'linear-gradient(to right, #10b981, #2dd4bf)',
            }}
          />
        )}
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-full',
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
              'relative h-full overflow-hidden',
              fillClass,
              animated && clampedPercent > 0 && clampedPercent < 100 && 'animate-progress-stripes',
            )}
            style={{ width: `${clampedPercent}%` }}
          />
        </div>
        {/* Percentage at end of bar */}
        {showPercentAtEnd && clampedPercent > 0 && (
          <span
            className={cn(
              'absolute top-1/2 -translate-y-1/2 text-[11px] font-bold tabular-nums leading-none text-white drop-shadow-sm',
              clampedPercent >= 15 ? 'ml-1.5' : '-left-8',
            )}
            style={{
              left: `${clampedPercent}%`,
            }}
          >
            {Math.round(clampedPercent)}%
          </span>
        )}
      </div>
    </div>
  );
}