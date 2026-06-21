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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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

/* ─── Heatmap Cell Color Logic ─────────────────────────────── */
function getHeatmapCellClasses(value: number): string {
  if (value <= 30) return 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400';
  if (value <= 50) return 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400';
  if (value <= 70) return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950/60 dark:text-yellow-400';
  return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400';
}

function getHeatmapBadgeClasses(value: number): string {
  if (value <= 30) return 'bg-red-500';
  if (value <= 50) return 'bg-amber-500';
  if (value <= 70) return 'bg-yellow-500';
  return 'bg-emerald-500';
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
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Brain className="h-4 w-4 text-emerald-600" />
                  Subject × Weakness Type Heatmap
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Color intensity shows the severity of each weakness type per subject. Higher scores
                  indicate weaker areas.
                </p>
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
                            className="min-w-[90px] text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                          >
                            {col.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {heatmap.map((row) => (
                        <TableRow key={row.subject}>
                          <TableCell className="sticky left-0 z-10 bg-background font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              {row.subject}
                              <Badge
                                variant="outline"
                                className={`ml-auto text-[10px] font-semibold ${getHeatmapCellClasses(row.overall)}`}
                              >
                                {row.overall}
                              </Badge>
                            </div>
                          </TableCell>
                          {HEATMAP_COLUMNS.map((col) => {
                            const val = row[col.key] as number;
                            return (
                              <TableCell
                                key={col.key}
                                className={`text-center font-semibold ${getHeatmapCellClasses(val)}`}
                              >
                                {val}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Color Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 border-t px-4 py-3">
                  <span className="text-xs font-medium text-muted-foreground">Severity:</span>
                  {[
                    { range: '0–30', label: 'Critical', cls: 'bg-red-500' },
                    { range: '31–50', label: 'Weak', cls: 'bg-amber-500' },
                    { range: '51–70', label: 'Moderate', cls: 'bg-yellow-500' },
                    { range: '71–100', label: 'Strong', cls: 'bg-emerald-500' },
                  ].map((item) => (
                    <div key={item.range} className="flex items-center gap-1.5">
                      <span className={`inline-block h-3 w-3 rounded-sm ${item.cls}`} />
                      <span className="text-xs text-muted-foreground">
                        {item.range} {item.label}
                      </span>
                    </div>
                  ))}
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
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Flame className="h-4 w-4 text-amber-600" />
                    Top 3 Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {topWeaknesses.length > 0 ? (
                    <div className="space-y-3">
                      {topWeaknesses.slice(0, 3).map((item) => {
                        const rankColors = [
                          'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
                        ];
                        return (
                          <div
                            key={item.rank}
                            className="flex items-start gap-3 rounded-lg border p-3"
                          >
                            <span
                              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${rankColors[item.rank - 1] ?? rankColors[2]}`}
                            >
                              #{item.rank}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-foreground">{item.label}</p>
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
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Recommended Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recommendations.length > 0 ? (
                    <ul className="space-y-3">
                      {recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                          <span className="text-sm leading-relaxed text-muted-foreground">
                            {rec}
                          </span>
                        </li>
                      ))}
                    </ul>
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
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    Weakness by Exam Stage
                  </CardTitle>
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
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Target className="h-4 w-4 text-amber-600" />
                    Weakness by Exam
                  </CardTitle>
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
                            return (
                              <TableRow key={idx}>
                                <TableCell className="max-w-[140px] truncate text-xs font-medium text-foreground">
                                  {String(r.exam ?? r.name ?? `Exam ${idx + 1}`)}
                                </TableCell>
                                <TableCell className="text-center text-xs">
                                  {String(r.score ?? '-')}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge
                                    variant="outline"
                                    className={`text-[11px] font-semibold ${getHeatmapCellClasses(weaknessScore)}`}
                                  >
                                    {weaknessScore}
                                  </Badge>
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