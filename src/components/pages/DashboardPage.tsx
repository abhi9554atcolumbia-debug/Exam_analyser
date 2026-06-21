'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  GraduationCap,
  Trophy,
  BarChart3,
  Target,
  Plus,
  CalendarPlus,
  Upload,
  BookOpen,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TrendLineChart } from '@/components/charts/TrendLineChart';
import {
  getDashboard,
  createExam,
  type DashboardData,
  type Exam,
} from '@/lib/api';
import { useNavigationStore } from '@/store/navigation';
import { cn } from '@/lib/utils';

// ─── Helpers ───────────────────────────────────────────────
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatCountdown(days: number | null): string {
  if (days === null || days === undefined) return '—';
  if (days === 0) return 'Today!';
  if (days === 1) return 'Tomorrow';
  return `${days} days left`;
}

// ─── Add Exam Dialog ────────────────────────────────────────
function AddExamDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: '',
    org: '',
    category: 'Banking',
    stage: 'Prelims',
    examDate: '',
    score: '',
    maxScore: '100',
    cutoff: '',
    result: 'Not Qualified',
    sections: [] as { section: string; score: string; max: string }[],
  });

  const mutation = useMutation({
    mutationFn: () =>
      createExam({
        name: form.name,
        org: form.org || undefined,
        category: form.category,
        stage: form.stage,
        examDate: form.examDate,
        score: Number(form.score),
        maxScore: Number(form.maxScore),
        cutoff: Number(form.cutoff),
        result: form.result,
        sectionalScores: form.sections
          .filter((s) => s.section)
          .map((s) => ({
            section: s.section,
            score: Number(s.score),
            max: Number(s.max),
          })),
      }),
    onSuccess: () => {
      toast.success('Exam added successfully!');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onOpenChange(false);
      setForm({
        name: '',
        org: '',
        category: 'Banking',
        stage: 'Prelims',
        examDate: '',
        score: '',
        maxScore: '100',
        cutoff: '',
        result: 'Not Qualified',
        sections: [],
      });
    },
    onError: () => {
      toast.error('Failed to add exam. Please try again.');
    },
  });

  const addSection = () => {
    setForm((f) => [
      ...f.sections,
      { section: '', score: '', max: '' },
    ]);
  };

  const removeSection = (idx: number) => {
    setForm((f) => f.sections.filter((_, i) => i !== idx));
  };

  const updateSection = (
    idx: number,
    field: 'section' | 'score' | 'max',
    value: string,
  ) => {
    setForm((f) =>
      f.sections.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Exam Result</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="exam-name">Exam Name</Label>
            <Input
              id="exam-name"
              placeholder="e.g. SBI PO 2025"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="exam-org">Organization</Label>
              <Input
                id="exam-org"
                placeholder="e.g. SBI"
                value={form.org}
                onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Banking">Banking</SelectItem>
                  <SelectItem value="SSC">SSC</SelectItem>
                  <SelectItem value="Railway">Railway</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Stage</Label>
              <Select
                value={form.stage}
                onValueChange={(v) => setForm((f) => ({ ...f, stage: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prelims">Prelims</SelectItem>
                  <SelectItem value="Mains">Mains</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-date">Exam Date</Label>
              <Input
                id="exam-date"
                type="date"
                value={form.examDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, examDate: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                placeholder="0"
                value={form.score}
                onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max-score">Max Score</Label>
              <Input
                id="max-score"
                type="number"
                placeholder="100"
                value={form.maxScore}
                onChange={(e) =>
                  setForm((f) => ({ ...f, maxScore: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cutoff">Cutoff</Label>
              <Input
                id="cutoff"
                type="number"
                placeholder="0"
                value={form.cutoff}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cutoff: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Result</Label>
            <Select
              value={form.result}
              onValueChange={(v) => setForm((f) => ({ ...f, result: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Not Qualified">Not Qualified</SelectItem>
                <SelectItem value="Awaited">Result Awaited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sectional Scores */}
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label>Sectional Scores (optional)</Label>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={addSection}
              >
                <Plus className="mr-1 size-3.5" />
                Add Section
              </Button>
            </div>
            {form.sections.map((sec, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_80px_80px_auto] gap-2">
                <Input
                  placeholder="Section name"
                  value={sec.section}
                  onChange={(e) =>
                    updateSection(idx, 'section', e.target.value)
                  }
                />
                <Input
                  type="number"
                  placeholder="Score"
                  value={sec.score}
                  onChange={(e) =>
                    updateSection(idx, 'score', e.target.value)
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={sec.max}
                  onChange={(e) =>
                    updateSection(idx, 'max', e.target.value)
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSection(idx)}
                >
                  <XCircle className="size-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !form.name || !form.examDate || !form.score}
          >
            {mutation.isPending ? 'Saving...' : 'Add Exam'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Dashboard Page ─────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigationStore((s) => s.navigate);
  const [addExamOpen, setAddExamOpen] = useState(false);

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  });

  const qualificationRate = useMemo(() => {
    if (!data) return 0;
    return data.stats.totalExams > 0
      ? Math.round(
          (data.stats.qualified / data.stats.totalExams) * 100,
        )
      : 0;
  }, [data]);

  const now = new Date();

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-r from-emerald-50 to-transparent px-5 py-4 dark:from-emerald-950/20 dark:to-transparent sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {getGreeting()}, Aman 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s your exam journey overview
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          <span>Last updated: {formatDate(now.toISOString())}</span>
        </div>
      </div>

      {/* Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[108px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="transition-shadow duration-200 hover:shadow-md">
            <StatCard
              icon={GraduationCap}
              label="Total Exams"
              value={data?.stats.totalExams ?? 0}
              change="+2 this month"
              trend="up"
            />
          </div>
          <div className="transition-shadow duration-200 hover:shadow-md">
            <StatCard
              icon={Trophy}
              label="Qualified"
              value={`${qualificationRate}%`}
              change={`${data?.stats.qualified ?? 0} exams`}
              trend={qualificationRate >= 50 ? 'up' : 'down'}
              colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
            />
          </div>
          <div className="transition-shadow duration-200 hover:shadow-md">
            <StatCard
              icon={BarChart3}
              label="Average Score"
              value={`${data?.stats.avgScore ?? 0}%`}
              change="+3.2% from last"
              trend="up"
              colorClass="bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
            />
          </div>
          <div className="transition-shadow duration-200 hover:shadow-md">
            <StatCard
              icon={Target}
              label="Avg Cutoff Gap"
              value={data?.stats.avgCutoffGap ?? 0}
              change={data && data.stats.avgCutoffGap > 0 ? 'Above cutoff' : 'Below cutoff'}
              trend={data && data.stats.avgCutoffGap <= 0 ? 'up' : 'down'}
              colorClass="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 rounded-xl border py-4 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-sm dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
            onClick={() => setAddExamOpen(true)}
          >
            <Plus className="size-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium">Add Exam</span>
            <span className="text-[11px] text-muted-foreground">Record a new result</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 rounded-xl border py-4 transition-all duration-200 hover:border-teal-300 hover:bg-teal-50 hover:shadow-sm dark:hover:border-teal-700 dark:hover:bg-teal-950/30"
            onClick={() => navigate('upcoming')}
          >
            <CalendarPlus className="size-5 text-teal-600 dark:text-teal-400" />
            <span className="text-sm font-medium">Schedule Exam</span>
            <span className="text-[11px] text-muted-foreground">Plan your next attempt</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 rounded-xl border py-4 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-sm dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
            onClick={() => navigate('documents')}
          >
            <div className="flex items-center gap-1">
              <Upload className="size-5 text-emerald-600 dark:text-emerald-400" />
              <Badge className="bg-emerald-600 text-[10px] px-1.5 py-0">NEW</Badge>
            </div>
            <span className="text-sm font-medium">Upload Scorecard</span>
            <span className="text-[11px] text-muted-foreground">Attach your score PDF</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 rounded-xl border py-4 transition-all duration-200 hover:border-teal-300 hover:bg-teal-50 hover:shadow-sm dark:hover:border-teal-700 dark:hover:bg-teal-950/30"
            onClick={() => navigate('reflections')}
          >
            <BookOpen className="size-5 text-teal-600 dark:text-teal-400" />
            <span className="text-sm font-medium">Add Reflection</span>
            <span className="text-[11px] text-muted-foreground">Analyze your performance</span>
          </Button>
        </div>
      </div>

      {/* Score Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Score Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[280px] w-full rounded-lg" />
          ) : data && data.scoreTrend.length > 0 ? (
            <TrendLineChart
              data={data.scoreTrend}
              dataKey="score"
              xKey="name"
              height={280}
            />
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No exam data yet. Add your first exam to see trends.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two column grid: Weak Areas + Upcoming Deadlines */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weak Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weak Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))
            ) : data && data.weakAreas.length > 0 ? (
              data.weakAreas.map((area, idx) => (
                <div key={area.section} className={cn('space-y-1.5 rounded-lg p-2.5 -mx-1', idx % 2 === 1 && 'bg-muted/40')}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {area.section}
                    </span>
                    <span className="text-muted-foreground">
                      {area.avgScore}% avg across {area.exams} exam
                      {area.exams !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <ProgressBar
                    percent={area.avgScore}
                    color={
                      area.avgScore >= 60
                        ? 'bg-emerald-600 dark:bg-emerald-500'
                        : area.avgScore >= 40
                          ? 'bg-amber-500 dark:bg-amber-400'
                          : 'bg-red-500 dark:bg-red-400'
                    }
                    height="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {area.avgScore >= 60
                      ? 'Good performance. Maintain consistency.'
                      : area.avgScore >= 40
                        ? 'Needs improvement. Practice more problems.'
                        : 'Critical area. Focus on fundamentals.'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No weak areas identified yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="mb-3 h-12 rounded-lg" />
              ))
            ) : data && data.upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {data.upcomingDeadlines.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-9 items-center justify-center rounded-lg ${
                          (item.daysLeft ?? 0) <= 7
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                            : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                        }`}
                      >
                        <Clock className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(item.examDate)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        (item.daysLeft ?? 0) <= 7 ? 'destructive' : 'secondary'
                      }
                    >
                      {formatCountdown(item.daysLeft)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No upcoming deadlines. Add exams to stay on track.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Exams Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Exams</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-emerald-600 dark:text-emerald-400"
            onClick={() => navigate('history')}
          >
            View All
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : data && data.recentExams.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {formatDate(exam.date)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{exam.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {exam.score}%
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={
                          exam.result === 'Qualified'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                        }
                      >
                        {exam.result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-[120px] items-center justify-center text-sm text-muted-foreground">
              No exams recorded yet. Start by adding your first exam!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart Insights */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
            Smart Insights
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-emerald-600 dark:text-emerald-400"
            onClick={() => navigate('analytics')}
          >
            See All Insights
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : data && data.smartInsights.length > 0 ? (
            <ul className="space-y-3">
              {data.smartInsights.map((insight, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                    {insight.includes('improvement') || insight.includes('momentum') ? (
                      <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />
                    ) : insight.includes('⚠️') ? (
                      <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                    ) : insight.includes('weak') || insight.includes('dipped') ? (
                      <Target className="size-4 text-red-600 dark:text-red-400" />
                    ) : (
                      <Lightbulb className="size-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {insight}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Add more exam data to generate personalized insights.
            </p>
          )}
        </CardContent>
      </Card>

      {/* View Full Analytics */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
          onClick={() => navigate('analytics')}
        >
          <BarChart3 className="size-4" />
          View Full Analytics
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {/* Add Exam Dialog */}
      <AddExamDialog open={addExamOpen} onOpenChange={setAddExamOpen} />
    </div>
  );
}
