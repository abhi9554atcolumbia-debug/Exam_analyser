'use client';

import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

type Trend = 'up' | 'down' | 'neutral';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  trend?: Trend;
  colorClass?: string;
  /** Border accent color: 'emerald' | 'teal' | 'amber' | 'red' | 'blue' */
  color?: string;
  /** Show a subtle dot pattern overlay */
  pattern?: boolean;
  className?: string;
}

const trendConfig: Record<
  Trend,
  { icon: LucideIcon; colorClass: string }
> = {
  up: {
    icon: TrendingUp,
    colorClass: 'text-emerald-600 dark:text-emerald-400',
  },
  down: {
    icon: TrendingDown,
    colorClass: 'text-red-600 dark:text-red-400',
  },
  neutral: {
    icon: Minus,
    colorClass: 'text-muted-foreground',
  },
};

const borderColors: Record<string, string> = {
  emerald: 'border-l-emerald-500 dark:border-l-emerald-400',
  teal: 'border-l-teal-500 dark:border-l-teal-400',
  amber: 'border-l-amber-500 dark:border-l-amber-400',
  red: 'border-l-red-500 dark:border-l-red-400',
  blue: 'border-l-blue-500 dark:border-l-blue-400',
};

const iconGradients: Record<string, string> = {
  emerald: 'bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700',
  teal: 'bg-gradient-to-br from-teal-400 to-teal-600 dark:from-teal-500 dark:to-teal-700',
  amber: 'bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700',
  red: 'bg-gradient-to-br from-red-400 to-red-600 dark:from-red-500 dark:to-red-700',
  blue: 'bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700',
};

const hoverGradients: Record<string, string> = {
  emerald: 'from-emerald-50/80 via-white to-teal-50/30 dark:from-emerald-950/20 dark:via-card dark:to-teal-950/10',
  teal: 'from-teal-50/80 via-white to-cyan-50/30 dark:from-teal-950/20 dark:via-card dark:to-cyan-950/10',
  amber: 'from-amber-50/80 via-white to-orange-50/30 dark:from-amber-950/20 dark:via-card dark:to-orange-950/10',
  red: 'from-red-50/80 via-white to-rose-50/30 dark:from-red-950/20 dark:via-card dark:to-rose-950/10',
  blue: 'from-blue-50/80 via-white to-indigo-50/30 dark:from-blue-950/20 dark:via-card dark:to-indigo-950/10',
};

const patternColors: Record<string, string> = {
  emerald: '[--pattern-color:rgba(16,185,129,0.04)] dark:[--pattern-color:rgba(16,185,129,0.03)]',
  teal: '[--pattern-color:rgba(20,184,166,0.04)] dark:[--pattern-color:rgba(20,184,166,0.03)]',
  amber: '[--pattern-color:rgba(245,158,11,0.04)] dark:[--pattern-color:rgba(245,158,11,0.03)]',
  red: '[--pattern-color:rgba(239,68,68,0.04)] dark:[--pattern-color:rgba(239,68,68,0.03)]',
  blue: '[--pattern-color:rgba(59,130,246,0.04)] dark:[--pattern-color:rgba(59,130,246,0.03)]',
};

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend = 'neutral',
  colorClass = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  color = 'emerald',
  pattern = false,
  className,
}: StatCardProps) {
  const TrendIcon = trendConfig[trend].icon;
  const trendColor = trendConfig[trend].colorClass;

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm',
        'border-l-[3px]',
        borderColors[color] || borderColors.emerald,
        'transition-all duration-200 ease-out',
        'hover:scale-[1.02] hover:shadow-md',
        'hover:border-border',
        className,
      )}
    >
      {/* Hover gradient overlay */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          hoverGradients[color] || hoverGradients.emerald,
        )}
      />

      {/* Optional dot pattern overlay */}
      {pattern && (
        <div
          className={cn(
            'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
            patternColors[color] || patternColors.emerald,
          )}
          style={{
            backgroundImage: 'radial-gradient(var(--pattern-color, rgba(16,185,129,0.04)) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />
      )}

      {/* Content */}
      <div className="relative px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {value}
            </p>
            {(change || trend !== 'neutral') && (
              <div className="flex items-center gap-1.5">
                {trend !== 'neutral' && (
                  <span
                    className={cn(
                      'flex items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-bold',
                      trend === 'up' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
                      trend === 'down' && 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
                      trend === 'neutral' && 'bg-muted text-muted-foreground',
                    )}
                  >
                    <TrendIcon className={cn('size-3', trend === 'up' ? '-rotate-0' : trend === 'down' ? 'rotate-0' : '')} />
                    {trend === 'up' && '↑'}
                    {trend === 'down' && '↓'}
                  </span>
                )}
                {change && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {change}
                  </span>
                )}
              </div>
            )}
          </div>
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-xl shadow-sm sm:size-11',
              iconGradients[color] || iconGradients.emerald,
            )}
          >
            <Icon className="size-5 text-white drop-shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}