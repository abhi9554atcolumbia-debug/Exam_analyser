'use client';

import { useQuery } from '@tanstack/react-query';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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

/* ─── Section Skeleton ─────────────────────────────────────── */
function SectionSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <Card>
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
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-48" />
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

/* ─── Main Component ───────────────────────────────────────── */
export default function AnalyticsPage() {
  const navigate = useNavigationStore((s) => s.navigate);

  /* ── Queries ── */
  const examsQuery = useQuery({ queryKey: ['exams-all'], queryFn: () => getExams({ limit: 100 }) });
  const scoreTrendQuery = useQuery({ queryKey: ['score-trend'], queryFn: getScoreTrend });
  const subjectPerfQuery = useQuery({ queryKey: ['subject-perf'], queryFn: getSubjectPerformance });
  const cutoffGapsQuery = useQuery({ queryKey: ['cutoff-gaps'], queryFn: getCutoffGaps });
  const categoryPerfQuery = useQuery({ queryKey: ['category-perf'], queryFn: getCategoryPerformance });
  const mistakeQuery = useQuery({ queryKey: ['mistake-analysis'], queryFn: getMistakeAnalysis });
  const timelineQuery = useQuery({ queryKey: ['journey-timeline'], queryFn: getJourneyTimeline });
  const insightsQuery = useQuery({ queryKey: ['analytics-insights'], queryFn: getAnalyticsInsights });

  const exams: Exam[] = examsQuery.data?.data ?? [];

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

  // Improvement rate: compare last 3 exams avg to first 3 exams avg
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

  /* ── Trend message ── */
  const trendData = scoreTrendQuery.data ?? [];
  let trendMessage = '';
  if (trendData.length >= 2) {
    const first = trendData[0].score;
    const last = trendData[trendData.length - 1].score;
    const diff = last - first;
    if (diff > 0) trendMessage = `📈 Your score has improved by ${diff.toFixed(1)} points over your journey. Keep going!`;
    else if (diff < 0) trendMessage = `📉 Your score decreased by ${Math.abs(diff).toFixed(1)} points. Focus on weak areas to bounce back.`;
    else trendMessage = `➡️ Your score has remained consistent. Try pushing for a higher target.`;
  }

  /* ── Subject color gradient based on score ── */
  const subjectColor = (score: number) => {
    if (score >= 75) return 'bg-emerald-600 dark:bg-emerald-500';
    if (score >= 50) return 'bg-teal-600 dark:bg-teal-500';
    if (score >= 35) return 'bg-amber-600 dark:bg-amber-500';
    return 'bg-red-600 dark:bg-red-500';
  };

  /* ── Insight icons ── */
  const insightIcons = [TrendingUp, Target, BookOpen, Clock];
  const insightColors = [
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Deep insights into your exam performance and progress
        </p>
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
            icon={TrendingUp}
            label="Improvement Rate"
            value={exams.length >= 4 ? `${improvementRate}%` : 'N/A'}
            change={improvementRate > 0 ? 'Improving' : improvementRate < 0 ? 'Declining' : 'Stable'}
            trend={improvementRate > 0 ? 'up' : improvementRate < 0 ? 'down' : 'neutral'}
            colorClass="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
          />
        </div>
      )}

      {/* ── Score Trend ── */}
      {scoreTrendQuery.isLoading ? (
        <ChartSkeleton />
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Score Trend
            </CardTitle>
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
                  <p className="mt-3 text-sm text-muted-foreground">{trendMessage}</p>
                )}
              </>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                No exam data available yet. Add exams to see your score trend.
              </div>
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <BookOpen className="h-4 w-4 text-teal-600" />
                Subject Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subjectPerfQuery.data && subjectPerfQuery.data.length > 0 ? (
                <div className="space-y-4">
                  {subjectPerfQuery.data.map((s) => (
                    <div key={s.subject}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {s.subject}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {Math.round(s.score)}%
                        </span>
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
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No subject data available yet.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Category Performance */}
        {categoryPerfQuery.isLoading ? (
          <SectionSkeleton lines={3} />
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <BarChart3 className="h-4 w-4 text-emerald-600" />
                Category Performance
              </CardTitle>
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
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No category data available yet.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Cutoff Gap Analysis ── */}
      {cutoffGapsQuery.isLoading ? (
        <ChartSkeleton />
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Target className="h-4 w-4 text-amber-600" />
              Cutoff Gap Analysis
            </CardTitle>
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
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                No cutoff data available yet.
              </div>
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <TrendingDown className="h-4 w-4 text-rose-600" />
                Mistake Analysis
              </CardTitle>
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
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No mistake data yet. Write exam reflections to track mistakes.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Journey Timeline */}
        {timelineQuery.isLoading ? (
          <SectionSkeleton lines={6} />
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <CalendarDays className="h-4 w-4 text-emerald-600" />
                Journey Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timelineQuery.data && timelineQuery.data.length > 0 ? (
                <div className="max-h-[400px] space-y-0 overflow-y-auto pr-1">
                  {timelineQuery.data.map((item, idx) => {
                    const isQualified = item.status === 'qualified';
                    return (
                      <div key={idx} className="relative flex gap-4 pb-6 last:pb-0">
                        {/* Vertical line */}
                        {idx < timelineQuery.data.length - 1 && (
                          <div className="absolute bottom-0 left-[9px] top-6 w-px bg-border" />
                        )}
                        {/* Dot */}
                        <div className="relative z-10 mt-1 flex-shrink-0">
                          <div
                            className={`h-5 w-5 rounded-full border-2 ${
                              isQualified
                                ? 'border-emerald-500 bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-900/50'
                                : 'border-red-400 bg-red-100 dark:border-red-500 dark:bg-red-900/50'
                            }`}
                          />
                        </div>
                        {/* Content */}
                        <div className="min-w-0 flex-1 pt-0">
                          <p className="text-sm font-semibold text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {item.score}%
                            </span>
                            <Badge
                              variant="outline"
                              className={
                                isQualified
                                  ? 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400'
                                  : 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400'
                              }
                            >
                              {isQualified ? 'Qualified' : 'Not Qualified'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No journey data yet. Add exams to build your timeline.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── AI Insights ── */}
      {insightsQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SectionSkeleton key={i} lines={3} />
          ))}
        </div>
      ) : (
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            AI Insights
          </h2>
          {insightsQuery.data && insightsQuery.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {insightsQuery.data.slice(0, 4).map((insight, idx) => {
                const Icon = insightIcons[idx] || TrendingUp;
                const colorClass = insightColors[idx] || insightColors[0];
                return (
                  <Card key={idx}>
                    <CardContent className="flex items-start gap-3 p-4">
                      <div
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${colorClass}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {insight}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex h-24 items-center justify-center text-sm text-muted-foreground">
                Add more exam data to generate AI insights.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}