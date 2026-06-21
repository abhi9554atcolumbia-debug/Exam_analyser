'use client';

import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Trend = 'up' | 'down' | 'neutral';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  trend?: Trend;
  colorClass?: string;
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
    colorClass: 'text-destructive',
  },
  neutral: {
    icon: Minus,
    colorClass: 'text-muted-foreground',
  },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend = 'neutral',
  colorClass = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  className,
}: StatCardProps) {
  const TrendIcon = trendConfig[trend].icon;
  const trendColor = trendConfig[trend].colorClass;

  return (
    <Card className={cn('gap-0 py-0', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div className={cn('flex size-8 items-center justify-center rounded-lg', colorClass)}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        {(change || trend !== 'neutral') && (
          <div className="mt-1 flex items-center gap-1">
            <TrendIcon className={cn('size-3.5', trendColor)} />
            {change && (
              <span
                className={cn(
                  'text-xs font-medium',
                  trendColor,
                )}
              >
                {change}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}