'use client';

import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  FileQuestion,
  Flame,
  Target,
  TrendingDown,
  XCircle,
  Shield,
  Crosshair,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatCard } from '@/components/ui/StatCard';
import { DonutChart } from '@/components/charts/DonutChart';
import {
  getWeaknessSummary,
  getWeaknessHeatmap,
  getWeaknessByStage,
  getWeaknessByExam,
  getTopWeaknesses,
  getWeaknessRecommendations,
  type WeaknessRow,
} from '@/lib/api';

/* ─── Heatmap Cell Color Logic (gradient) ──────────────────── */
function getHeatmapCellClasses(value: number): string {
  if (value <= 20) return 'bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-300';
  if (value <= 30) return 'bg-red-400/15 text-red-600 dark:bg-red-400/25 dark:text-red-400';
  if (value <= 40) return 'bg-orange-400/15 text-orange-700 dark:bg-orange-400/25 dark:text-orange-300';
  if (value <= 50) return 'bg-amber-400/15 text-amber-700 dark:bg-amber-400/25 dark:text-amber-300';
  if (value <= 60) return 'bg-yellow-400/15 text-yellow-700 dark:bg-yellow-400/25 dark:text-yellow-300';
  if (value <= 70) return 'bg-lime-400/15 text-lime-700 dark:bg-lime-400/25 dark:text-lime-300';
  if (value <= 80) return 'bg-emerald-400/15 text-emerald-700 dark:bg-emerald-400/25 dark:text-emerald-300';
  return 'bg-emerald-500/20 text-emerald-600 dark:bg-emerald-500/30 dark:text-emerald-400';
}

function getHeatmapDotColor(value: number): string {
  if (value <= 30) return 'bg-red-500';
  if (value <= 50) return 'bg-amber-500';
  if (value <= 70) return 'bg-yellow-500';
  return 'bg-emerald-500';
}

function getSeverityBadge(value: number) {
  if (value <= 30) return { label: 'Critical', cls: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800' };
  if (value <= 50) return { label: 'Moderate', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
  return { label: 'Minor', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
}

/* ─── Skeletons ────────────────────────────────────────────── */
function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent className="pb-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="mt-1 h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-56" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SectionSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

/* ─── Empty State ──────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
        <FileQuestion className="h-8 w-8 text-amber-600 dark:text-amber-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">No Weakness Data Yet</h3>
      <p className="max-w-md text-sm text-muted-foreground">
        Start writing exam reflections to see your weakness patterns here. The heatmap will
        automatically identify your weak areas, common mistakes, and improvement opportunities.
      </p>
      <Button
        className="mt-6 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
      >
        Write Your First Reflection
      </Button>
    </div>
  );
}

/* ─── Heatmap Column Definitions ───────────────────────────── */
const HEATMAP_COLUMNS: { key: keyof WeaknessRow; label: string }[] = [
  { key: 'timeManagement', label: 'Time Mgmt' },
  { key: 'conceptGap', label: 'Concept Gap' },
  { key: 'sillyMistakes', label: 'Silly Mistakes' },
  { key: 'revisionGap', label: 'Revision Gap' },
  { key: 'calculationErrors', label: 'Calc Errors' },
  { key: 'pressureHandling', label: 'Pressure' },
  { key: 'guessing', label: 'Guessing' },
  { key: 'overall', label: 'Overall' },
];

/* ─── Color Legend ─────────────────────────────────────────── */
const COLOR_SCALE = [
  { range: '0–20', label: 'Critical', color: 'bg-red-500' },
  { range: '21–40', label: 'Weak', color: 'bg-orange-500' },
  { range: '41–60', label: 'Moderate', color: 'bg-amber-500' },
  { range: '61–80', label: 'Good', color: 'bg-yellow-500' },
  { range: '81–100', label: 'Strong', color: 'bg-emerald-500' },
];

/* ─── Main Component ───────────────────────────────────────── */
export default function WeaknessHeatmapPage() {
  /* ── Queries ── */
  const summaryQuery = useQuery({ queryKey: ['weakness-summary'], queryFn: getWeaknessSummary });
  const heatmapQuery = useQuery({ queryKey: ['weakness-heatmap'], queryFn: getWeaknessHeatmap });
  const stageQuery = useQuery({ queryKey: ['weakness-by-stage'], queryFn: getWeaknessByStage });
  const examQuery = useQuery({ queryKey: ['weakness-by-exam'], queryFn: getWeaknessByExam });
  const topQuery = useQuery({ queryKey: ['top-weaknesses'], queryFn: getTopWeaknesses });
  const recsQuery = useQuery({ queryKey: ['weakness-recs'], queryFn: getWeaknessRecommendations });

  const summary = summaryQuery.data ?? [];
  const heatmap = heatmapQuery.data ?? [];
  const isEmpty = heatmap.length === 0;

  /* ── Derive stat card values from summary ── */
  const mostWeakSubject = summary.find((s) => s.label.toLowerCase().includes('subject'));
  const mostRepeatedMistake = summary.find((s) => s.label.toLowerCase().includes('mistake'));
  const weakestStage = summary.find((s) => s.label.toLowerCase().includes('stage'));
  const improvementNeeded = summary.find((s) => s.label.toLowerCase().includes('improvement'));

  /* ── Top weaknesses ── */
  const topWeaknesses = topQuery.data ?? [];

  /* ── Recommendations ── */
  const recommendations = recsQuery.data ?? [];

  /* ── Stage data ── */
  const stageData = stageQuery.data ?? [];

  /* ── Exam data ── */
  const examData = examQuery.data ?? [];

  /* ── Focus Areas: Top 3 weakest subjects from heatmap ── */
  const focusAreas = [...heatmap]
    .sort((a, b) => a.overall - b.overall)
    .slice(0, 3)
    .map((row) => {
      // Find the weakest column for this subject
      let weakestCol = HEATMAP_COLUMNS[0];
      let weakestVal = 100;
      for (const col of HEATMAP_COLUMNS) {
        if (col.key === 'overall') continue;
        const val = row[col.key] as number;
        if (val < weakestVal) {
          weakestVal = val;
          weakestCol = col;
        }
      }
      return {
        subject: row.subject,
        overall: row.overall,
        weakestArea: weakestCol.label,
        weakestScore: weakestVal,
      };
    });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Weakness Heatmap
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visual breakdown of your weak areas across subjects and mistake types
        </p>
      </div>

      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
          {/* ── 4 Stat Cards ── */}
          {summaryQuery.isLoading ? (
            <StatCardsSkeleton />
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                icon={Target}
                label="Most Weak Subject"
                value={mostWeakSubject?.value ?? 'N/A'}
                change={mostWeakSubject?.sub}
                trend="down"
                colorClass="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
              />
              <StatCard
                icon={Flame}
                label="Most Repeated Mistake"
                value={mostRepeatedMistake?.value ?? 'N/A'}
                change={mostRepeatedMistake?.sub}
                trend="down"
                colorClass="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
              />
              <StatCard
                icon={AlertTriangle}
                label="Weakest Stage"
                value={weakestStage?.value ?? 'N/A'}
                change={weakestStage?.sub}
                trend="down"
                colorClass="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
              />
              <StatCard
                icon={TrendingDown}
                label="Improvement Needed"
                value={improvementNeeded?.value ?? 'N/A'}
                change={improvementNeeded?.sub}
                trend={improvementNeeded ? 'down' : 'neutral'}
                colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
              />
            </div>
          )}

          {/* ── Heatmap Table (HERO) ── */}
          {heatmapQuery.isLoading ? (
            <TableSkeleton />
          ) : (
            <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                    <Brain className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Subject × Weakness Type Heatmap
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Color intensity shows the severity of each weakness type per subject. Lower scores indicate weaker areas.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="sticky left-0 z-10 min-w-[160px] bg-background text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Subject
                        </TableHead>
                        {HEATMAP_COLUMNS.map((col) => (
                          <TableHead
                            key={col.key}
                            className={cn(
                              'min-w-[90px] text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                              col.key === 'overall' && 'bg-muted/50',
                            )}
                          >
                            {col.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {heatmap.map((row) => {
                        const severity = getSeverityBadge(row.overall);
                        return (
                          <TableRow key={row.subject} className="group transition-colors hover:bg-muted/30">
                            <TableCell className="sticky left-0 z-10 bg-background font-medium text-foreground group-hover:bg-muted/30">
                              <div className="flex items-center gap-2">
                                <span className="truncate">{row.subject}</span>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'ml-auto shrink-0 border text-[10px] font-bold',
                                    severity.cls,
                                  )}
                                >
                                  {severity.label}
                                </Badge>
                              </div>
                            </TableCell>
                            {HEATMAP_COLUMNS.map((col) => {
                              const val = row[col.key] as number;
                              return (
                                <TableCell
                                  key={col.key}
                                  className={cn(
                                    'text-center font-semibold transition-colors',
                                    getHeatmapCellClasses(val),
                                    col.key === 'overall' && 'font-bold',
                                  )}
                                >
                                  {val}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Color Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 border-t bg-muted/20 px-4 py-3">
                  <span className="text-xs font-semibold text-muted-foreground">Severity Scale:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground mr-1">Weak</span>
                    {COLOR_SCALE.map((item) => (
                      <div key={item.range} className="flex items-center gap-0.5">
                        <div className={cn('h-4 w-8 rounded-sm', item.color)} />
                      </div>
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1">Strong</span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  {COLOR_SCALE.map((item) => (
                    <div key={item.range} className="flex items-center gap-1.5">
                      <span className={cn('inline-block h-3 w-3 rounded-sm', item.color)} />
                      <span className="text-[11px] text-muted-foreground">
                        {item.range}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Focus Areas ── */}
          {heatmap.length > 0 && (
            <Card className="border-l-4 border-l-rose-500 transition-shadow duration-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/50">
                    <Crosshair className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">Focus Areas</CardTitle>
                    <CardDescription className="text-xs">
                      Top 3 subjects that need your immediate attention
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {focusAreas.map((area, idx) => {
                    const sev = getSeverityBadge(area.overall);
                    return (
                      <div
                        key={area.subject}
                        className={cn(
                          'rounded-xl border p-4 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5',
                          idx === 0 && 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20',
                          idx === 1 && 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20',
                          idx === 2 && 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20',
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white',
                              idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-amber-500' : 'bg-yellow-500',
                            )}>
                              {idx + 1}
                            </span>
                            <span className="text-sm font-semibold text-foreground">{area.subject}</span>
                          </div>
                          <Badge variant="outline" className={cn('border text-[10px] font-bold', sev.cls)}>
                            {sev.label}
                          </Badge>
                        </div>
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Overall Score</span>
                            <span className="font-bold text-foreground">{area.overall}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Weakest In</span>
                            <span className="font-medium text-foreground">{area.weakestArea} ({area.weakestScore})</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Top 3 Weaknesses + Recommended Actions ── */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top 3 Weaknesses */}
            {topQuery.isLoading ? (
              <SectionSkeleton />
            ) : (
              <Card className="transition-shadow duration-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
                      <Flame className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">Top 3 Weaknesses</CardTitle>
                      <CardDescription className="text-xs">
                        Most critical areas identified from your reflections
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {topWeaknesses.length > 0 ? (
                    <div className="space-y-3">
                      {topWeaknesses.slice(0, 3).map((item) => {
                        const severityCls = [
                          'border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
                          'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
                          'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20',
                        ];
                        const badgeCls = [
                          'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
                        ];
                        const severityLabels = ['Critical', 'High', 'Moderate'];
                        return (
                          <div
                            key={item.rank}
                            className={cn(
                              'flex items-start gap-3 rounded-lg border-l-4 p-3 transition-all duration-200 hover:shadow-sm',
                              severityCls[item.rank - 1] ?? severityCls[2],
                            )}
                          >
                            <span
                              className={cn(
                                'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold',
                                badgeCls[item.rank - 1] ?? badgeCls[2],
                              )}
                            >
                              #{item.rank}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'border text-[10px] font-bold',
                                    badgeCls[item.rank - 1] ?? badgeCls[2],
                                  )}
                                >
                                  {severityLabels[item.rank - 1] ?? 'Moderate'}
                                </Badge>
                              </div>
                              <p className="mt-0.5 text-xs text-muted-foreground">{item.sub}</p>
                            </div>
                            {item.rank === 1 && (
                              <XCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No top weaknesses identified yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recommended Actions */}
            {recsQuery.isLoading ? (
              <SectionSkeleton />
            ) : (
              <Card className="transition-shadow duration-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">Recommended Actions</CardTitle>
                      <CardDescription className="text-xs">
                        Prioritized steps to improve your weak areas
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {recommendations.length > 0 ? (
                    <ol className="space-y-3">
                      {recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                            {idx + 1}
                          </span>
                          <span className="pt-0.5 text-sm leading-relaxed text-muted-foreground">
                            {rec}
                          </span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      Complete more reflections to get personalized recommendations.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Weakness by Exam Stage + Weakness by Exam ── */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Weakness by Exam Stage */}
            {stageQuery.isLoading ? (
              <SectionSkeleton lines={3} />
            ) : (
              <Card className="transition-shadow duration-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/50">
                      <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">Weakness by Exam Stage</CardTitle>
                      <CardDescription className="text-xs">
                        Compare weakness levels across different exam stages
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {stageData.length > 0 ? (
                    <>
                      <DonutChart
                        data={stageData}
                        dataKey="value"
                        nameKey="stage"
                        centerLabel="Stages"
                        centerValue={stageData.length}
                        height={260}
                      />
                      <div className="mt-2 flex flex-wrap justify-center gap-3">
                        {stageData.map((s) => (
                          <div key={s.stage} className="flex items-center gap-1.5 text-xs">
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: s.color }}
                            />
                            <span className="text-muted-foreground">{s.stage}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No stage-wise weakness data yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Weakness by Exam */}
            {examQuery.isLoading ? (
              <SectionSkeleton lines={4} />
            ) : (
              <Card className="transition-shadow duration-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
                      <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">Weakness by Exam</CardTitle>
                      <CardDescription className="text-xs">
                        How weakness scores vary across individual exams
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {examData.length > 0 ? (
                    <div className="max-h-[340px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Exam</TableHead>
                            <TableHead className="text-center text-xs">Score</TableHead>
                            <TableHead className="text-center text-xs">Weakness</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {examData.map((row, idx) => {
                            const r = row as Record<string, unknown>;
                            const weaknessScore = Number(r.weaknessScore ?? r.score ?? 0);
                            const sev = getSeverityBadge(weaknessScore);
                            return (
                              <TableRow key={idx} className="transition-colors hover:bg-muted/30">
                                <TableCell className="max-w-[140px] truncate text-xs font-medium text-foreground">
                                  {String(r.exam ?? r.name ?? `Exam ${idx + 1}`)}
                                </TableCell>
                                <TableCell className="text-center text-xs">
                                  {String(r.score ?? '-')}
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <span className={cn('inline-block h-2 w-2 rounded-full', getHeatmapDotColor(weaknessScore))} />
                                    <Badge
                                      variant="outline"
                                      className={cn('border text-[11px] font-semibold', sev.cls)}
                                    >
                                      {weaknessScore}
                                    </Badge>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No exam-wise weakness data yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}