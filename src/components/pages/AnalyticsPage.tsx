'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  Target,
  Trophy,
  Lightbulb,
  Zap,
  GraduationCap,
  Award,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TrendLineChart } from '@/components/charts/TrendLineChart';
import { SimpleBarChart } from '@/components/charts/SimpleBarChart';
import { DonutChart } from '@/components/charts/DonutChart';
import {
  getExams,
  getScoreTrend,
  getSubjectPerformance,
  getCutoffGaps,
  getCategoryPerformance,
  getMistakeAnalysis,
  getJourneyTimeline,
  getAnalyticsInsights,
  type Exam,
} from '@/lib/api';
import { useNavigationStore } from '@/store/navigation';

/* ─── Period Options ──────────────────────────────────────── */
const PERIODS = [
  { label: '3 Months', value: '3m' },
  { label: '6 Months', value: '6m' },
  { label: '1 Year', value: '1y' },
  { label: 'All Time', value: 'all' },
] as const;

function filterByPeriod(exams: Exam[], period: string): Exam[] {
  if (period === 'all') return exams;
  const now = new Date();
  const monthsMap: Record<string, number> = { '3m': 3, '6m': 6, '1y': 12 };
  const months = monthsMap[period] ?? 999;
  const cutoff = new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
  return exams.filter((e) => new Date(e.examDate) >= cutoff);
}

/* ─── Section Skeleton ─────────────────────────────────────── */
function SectionSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-1 h-3 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[280px] w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

/* ─── Stat Cards Skeleton ──────────────────────────────────── */
function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent className="pb-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="mt-1 h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ─── Empty Illustration ───────────────────────────────────── */
function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <BarChart3 className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Add more exam data to see analytics here.
        </p>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */
export default function AnalyticsPage() {
  const navigate = useNavigationStore((s) => s.navigate);
  const [period, setPeriod] = useState<string>('all');

  /* ── Queries ── */
  const examsQuery = useQuery({ queryKey: ['exams-all'], queryFn: () => getExams({ limit: 100 }) });
  const scoreTrendQuery = useQuery({ queryKey: ['score-trend'], queryFn: getScoreTrend });
  const subjectPerfQuery = useQuery({ queryKey: ['subject-perf'], queryFn: getSubjectPerformance });
  const cutoffGapsQuery = useQuery({ queryKey: ['cutoff-gaps'], queryFn: getCutoffGaps });
  const categoryPerfQuery = useQuery({ queryKey: ['category-perf'], queryFn: getCategoryPerformance });
  const mistakeQuery = useQuery({ queryKey: ['mistake-analysis'], queryFn: getMistakeAnalysis });
  const timelineQuery = useQuery({ queryKey: ['journey-timeline'], queryFn: getJourneyTimeline });
  const insightsQuery = useQuery({ queryKey: ['analytics-insights'], queryFn: getAnalyticsInsights });

  const allExams: Exam[] = examsQuery.data?.data ?? [];
  const exams = filterByPeriod(allExams, period);

  /* ── Derived Stats ── */
  const totalExams = exams.length;
  const qualified = exams.filter((e) => e.result === 'qualified').length;
  const avgScore =
    totalExams > 0
      ? Math.round(exams.reduce((a, e) => a + (e.score / e.maxScore) * 100, 0) / totalExams)
      : 0;
  const avgCutoffGap =
    totalExams > 0
      ? (
          exams.reduce((a, e) => a + (e.cutoffGap ?? 0), 0) / totalExams
        ).toFixed(1)
      : '0';

  // Best exam
  const bestExam = exams.length > 0
    ? exams.reduce((best, e) => {
        const pct = (e.score / e.maxScore) * 100;
        const bestPct = (best.score / best.maxScore) * 100;
        return pct > bestPct ? e : best;
      })
    : null;

  // Improvement rate
  let improvementRate = 0;
  if (exams.length >= 4) {
    const sorted = [...exams].sort(
      (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime(),
    );
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
    const firstAvg =
      firstHalf.reduce((a, e) => a + (e.score / e.maxScore) * 100, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((a, e) => a + (e.score / e.maxScore) * 100, 0) / secondHalf.length;
    improvementRate = secondAvg > 0 ? Math.round(((secondAvg - firstAvg) / firstAvg) * 100) : 0;
  }

  const trendData = scoreTrendQuery.data ?? [];
  let trendMessage = '';
  if (trendData.length >= 2) {
    const first = trendData[0].score;
    const last = trendData[trendData.length - 1].score;
    const diff = last - first;
    if (diff > 0) trendMessage = `Your score has improved by ${diff.toFixed(1)} points over your journey. Keep going!`;
    else if (diff < 0) trendMessage = `Your score decreased by ${Math.abs(diff).toFixed(1)} points. Focus on weak areas to bounce back.`;
    else trendMessage = `Your score has remained consistent. Try pushing for a higher target.`;
  }

  /* ── Subject color gradient ── */
  const subjectColor = (score: number) => {
    if (score >= 75) return 'bg-emerald-600 dark:bg-emerald-500';
    if (score >= 50) return 'bg-teal-600 dark:bg-teal-500';
    if (score >= 35) return 'bg-amber-600 dark:bg-amber-500';
    return 'bg-red-600 dark:bg-red-500';
  };

  /* ── Insight config ── */
  const insightConfig = [
    { icon: TrendingUp, border: 'border-l-emerald-500', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' },
    { icon: Target, border: 'border-l-teal-500', bg: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300' },
    { icon: Lightbulb, border: 'border-l-amber-500', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
    { icon: Zap, border: 'border-l-rose-500', bg: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header + Period Selector ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Deep insights into your exam performance and progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  period === p.value
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5 Stat Cards ── */}
      {examsQuery.isLoading ? (
        <StatCardsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard
            icon={BarChart3}
            label="Total Exams"
            value={totalExams}
            change={`${qualified} qualified`}
            trend={qualified > 0 ? 'up' : 'neutral'}
          />
          <StatCard
            icon={Trophy}
            label="Qualified"
            value={qualified}
            change={
              totalExams > 0
                ? `${Math.round((qualified / totalExams) * 100)}% rate`
                : undefined
            }
            trend={qualified > 0 ? 'up' : 'neutral'}
            colorClass="bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
          />
          <StatCard
            icon={Target}
            label="Avg Score"
            value={`${avgScore}%`}
            change={avgScore >= 60 ? 'Above average' : 'Needs improvement'}
            trend={avgScore >= 60 ? 'up' : 'down'}
            colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
          />
          <StatCard
            icon={TrendingUp}
            label="Cutoff Gap (avg)"
            value={avgCutoffGap}
            change={Number(avgCutoffGap) > 0 ? 'Above cutoff' : 'Below cutoff'}
            trend={Number(avgCutoffGap) > 0 ? 'up' : 'up'}
            colorClass="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
          />
          <StatCard
            icon={Zap}
            label="Improvement Rate"
            value={exams.length >= 4 ? `${improvementRate}%` : 'N/A'}
            change={improvementRate > 0 ? 'Improving' : improvementRate < 0 ? 'Declining' : 'Stable'}
            trend={improvementRate > 0 ? 'up' : improvementRate < 0 ? 'down' : 'neutral'}
            colorClass="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
          />
        </div>
      )}

      {/* ── Performance Summary Card ── */}
      {!examsQuery.isLoading && totalExams > 0 && (
        <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-md">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Award className="h-4 w-4" />
                Performance Summary
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4 lg:grid-cols-6">
              {[
                { label: 'Total Exams', value: String(totalExams), icon: BarChart3 },
                { label: 'Qualification Rate', value: totalExams > 0 ? `${Math.round((qualified / totalExams) * 100)}%` : '0%', icon: CheckCircle2 },
                { label: 'Average Score', value: `${avgScore}%`, icon: Target },
                { label: 'Best Score', value: bestExam ? `${Math.round((bestExam.score / bestExam.maxScore) * 100)}%` : '—', icon: GraduationCap },
                { label: 'Best Exam', value: bestExam?.name ?? '—', icon: Trophy },
                { label: 'Improvement', value: exams.length >= 4 ? `${improvementRate > 0 ? '+' : ''}${improvementRate}%` : 'N/A', icon: TrendingUp },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-background px-4 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                    <p className="mt-1.5 text-lg font-bold text-foreground">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Score Trend ── */}
      {scoreTrendQuery.isLoading ? (
        <ChartSkeleton />
      ) : (
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Score Trend</CardTitle>
                <CardDescription className="text-xs">
                  Track how your scores have changed over time across all exams
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <>
                <TrendLineChart
                  data={trendData}
                  dataKey="score"
                  xKey="label"
                  height={300}
                />
                {trendMessage && (
                  <div className={cn(
                    'mt-3 flex items-center gap-2 rounded-lg border p-3 text-sm',
                    trendMessage.includes('improved')
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : trendMessage.includes('decreased')
                        ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
                        : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400',
                  )}>
                    <TrendingUp className="h-4 w-4 flex-shrink-0" />
                    {trendMessage}
                  </div>
                )}
              </>
            ) : (
              <EmptyChart message="No exam data available yet. Add exams to see your score trend." />
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Subject Performance + Category Performance ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subject Performance */}
        {subjectPerfQuery.isLoading ? (
          <SectionSkeleton lines={5} />
        ) : (
          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/50">
                  <BookOpen className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Subject Performance</CardTitle>
                  <CardDescription className="text-xs">
                    Average scores per subject across all your exams
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {subjectPerfQuery.data && subjectPerfQuery.data.length > 0 ? (
                <div className="space-y-4">
                  {subjectPerfQuery.data.map((s) => (
                    <div key={s.subject} className="group">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {s.subject}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs font-semibold',
                            s.score >= 75
                              ? 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400'
                              : s.score >= 50
                                ? 'border-teal-300 text-teal-700 dark:border-teal-700 dark:text-teal-400'
                                : s.score >= 35
                                  ? 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400'
                                  : 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400',
                          )}
                        >
                          {Math.round(s.score)}%
                        </Badge>
                      </div>
                      <ProgressBar
                        percent={s.score}
                        color={subjectColor(s.score)}
                        height="h-2.5"
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                  >
                    View Detailed Breakdown
                  </Button>
                </div>
              ) : (
                <EmptyChart message="No subject data available yet." />
              )}
            </CardContent>
          </Card>
        )}

        {/* Category Performance */}
        {categoryPerfQuery.isLoading ? (
          <SectionSkeleton lines={3} />
        ) : (
          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Category Performance</CardTitle>
                  <CardDescription className="text-xs">
                    How you perform across different exam categories
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {categoryPerfQuery.data && categoryPerfQuery.data.length > 0 ? (
                <>
                  <DonutChart
                    data={categoryPerfQuery.data}
                    dataKey="score"
                    nameKey="category"
                    centerLabel="Avg"
                    centerValue={
                      categoryPerfQuery.data.length > 0
                        ? Math.round(
                            categoryPerfQuery.data.reduce((a, c) => a + c.score, 0) /
                              categoryPerfQuery.data.length,
                          )
                        : 0
                    }
                    height={260}
                  />
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {categoryPerfQuery.data.map((c) => (
                      <div key={c.category} className="flex items-center gap-1.5 text-xs">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-muted-foreground">{c.category}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                  >
                    View Category Insights
                  </Button>
                </>
              ) : (
                <EmptyChart message="No category data available yet." />
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Cutoff Gap Analysis ── */}
      {cutoffGapsQuery.isLoading ? (
        <ChartSkeleton />
      ) : (
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
                <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Cutoff Gap Analysis</CardTitle>
                <CardDescription className="text-xs">
                  How far above or below the cutoff you scored in each exam
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {cutoffGapsQuery.data && cutoffGapsQuery.data.length > 0 ? (
              <>
                <SimpleBarChart
                  data={cutoffGapsQuery.data}
                  dataKey="gap"
                  xKey="exam"
                  height={280}
                />
                <div className="mt-3 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    Above cutoff (positive)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600" />
                    Below cutoff (negative)
                  </div>
                </div>
              </>
            ) : (
              <EmptyChart message="No cutoff data available yet." />
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Mistake Analysis + Journey Timeline ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mistake Analysis */}
        {mistakeQuery.isLoading ? (
          <SectionSkeleton lines={4} />
        ) : (
          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/50">
                  <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Mistake Analysis</CardTitle>
                  <CardDescription className="text-xs">
                    Distribution of your common mistake types across reflections
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {mistakeQuery.data && mistakeQuery.data.length > 0 ? (
                <>
                  <DonutChart
                    data={mistakeQuery.data}
                    dataKey="count"
                    nameKey="type"
                    centerLabel="Mistakes"
                    centerValue={mistakeQuery.data.reduce((a, c) => a + c.count, 0)}
                    height={240}
                  />
                  <div className="mt-2 flex max-h-28 flex-col gap-1 overflow-y-auto">
                    {mistakeQuery.data.map((m) => (
                      <div key={m.type} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: m.color }}
                          />
                          <span className="text-muted-foreground">{m.type}</span>
                        </div>
                        <span className="font-medium text-foreground">{m.percent}%</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                    onClick={() => navigate('reflections')}
                  >
                    View All Reflections
                  </Button>
                </>
              ) : (
                <EmptyChart message="No mistake data yet. Write exam reflections to track mistakes." />
              )}
            </CardContent>
          </Card>
        )}

        {/* Journey Timeline */}
        {timelineQuery.isLoading ? (
          <SectionSkeleton lines={6} />
        ) : (
          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <CalendarDays className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Journey Timeline</CardTitle>
                  <CardDescription className="text-xs">
                    Your complete exam journey with results and progress
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {timelineQuery.data && timelineQuery.data.length > 0 ? (
                <div className="max-h-[400px] space-y-0 overflow-y-auto pr-1">
                  {timelineQuery.data.map((item, idx) => {
                    const isQualified = item.status === 'qualified';
                    return (
                      <div key={idx} className="relative flex gap-4 pb-6 last:pb-0 group">
                        {/* Vertical line */}
                        {idx < timelineQuery.data.length - 1 && (
                          <div className="absolute bottom-0 left-[9px] top-6 w-px bg-gradient-to-b from-border to-border/40" />
                        )}
                        {/* Dot */}
                        <div className="relative z-10 mt-1 flex-shrink-0">
                          <div
                            className={cn(
                              'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-transform duration-200 group-hover:scale-110',
                              isQualified
                                ? 'border-emerald-500 bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-900/50'
                                : 'border-red-400 bg-red-100 dark:border-red-500 dark:bg-red-900/50',
                            )}
                          >
                            {isQualified && (
                              <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </div>
                        </div>
                        {/* Content */}
                        <div className="min-w-0 flex-1 pt-0 rounded-lg p-2 -m-2 transition-colors duration-200 group-hover:bg-muted/50">
                          <p className="text-sm font-semibold text-foreground">{item.name}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(item.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">
                              {item.score}%
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[11px] font-semibold transition-colors',
                                isQualified
                                  ? 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400'
                                  : 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400',
                              )}
                            >
                              {isQualified ? '✓ Qualified' : '✗ Not Qualified'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyChart message="No journey data yet. Add exams to build your timeline." />
              )}
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}