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
  Calendar,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  Sparkles,

  Flame,
  Zap,
  Activity,
  FileText,
  Timer,
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

function getMotivationalQuote(): string {
  const quotes = [
    '"The secret of getting ahead is getting started." — Mark Twain',
    '"Success is the sum of small efforts, repeated day in and day out." — Robert Collier',
    '"It always seems impossible until it\'s done." — Nelson Mandela',
    '"Don\'t watch the clock; do what it does. Keep going." — Sam Levenson',
    '"Hard work beats talent when talent doesn\'t work hard." — Tim Notke',
    '"The only way to do great work is to love what you do." — Steve Jobs',
    '"Believe you can and you\'re halfway there." — Theodore Roosevelt',
  ];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
    86400000,
  );
  return quotes[dayOfYear % quotes.length];
}


function getWeekStreakDots(): boolean[] {
  // Simulated 7-day streak: last 7 days (today = last)
  const today = new Date();
  const dots: boolean[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    // Pseudo-random based on day — always mark today and 4 others as active
    const dayHash = (d.getDate() * 7 + d.getMonth() * 31) % 10;
    dots.push(i === 0 || dayHash < 5);
  }
  return dots;
}

function getDayLabel(index: number): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  return days[(today - 6 + index + 7) % 7];
}

const categoryColors: Record<string, string> = {
  Banking: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  SSC: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Railway: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300 border-sky-200 dark:border-sky-800',
  Insurance: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  Other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300 border-gray-200 dark:border-gray-800',
};

function getSeverityColor(avgScore: number): string {
  if (avgScore >= 60) return 'bg-emerald-500';
  if (avgScore >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

function getSeverityLabel(avgScore: number): string {
  if (avgScore >= 60) return 'Good';
  if (avgScore >= 40) return 'Needs Work';
  return 'Critical';
}

function getCountdown(examDate: string): { days: number; hours: number; isPast: boolean } {
  const target = new Date(examDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, isPast: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    isPast: false,
  };
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
    setForm((f) => ({
      ...f,
      sections: [...f.sections, { section: '', score: '', max: '' }],
    }));
  };

  const removeSection = (idx: number) => {
    setForm((f) => ({
      ...f,
      sections: f.sections.filter((_, i) => i !== idx),
    }));
  };

  const updateSection = (
    idx: number,
    field: 'section' | 'score' | 'max',
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    }));
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

  const weekDots = useMemo(() => getWeekStreakDots(), []);
  const nextExamCountdown = useMemo(() => {
    if (!data?.nextExam?.examDate) return null;
    return getCountdown(data.nextExam.examDate);
  }, [data]);

  // Build recent activity from recent exams
  const recentActivity = useMemo(() => {
    if (!data?.recentExams?.length) return [];
    return data.recentExams.slice(0, 4).map((exam) => ({
      id: exam.id,
      type: exam.result === 'Qualified' ? 'success' : exam.result === 'Awaited' ? 'pending' : 'info',
      title: exam.name,
      description: `Scored ${exam.score}% — ${exam.result}`,
      time: formatDate(exam.date),
      icon: exam.result === 'Qualified' ? CheckCircle2 : exam.result === 'Awaited' ? Clock : FileText,
    }));
  }, [data]);

  return (
    <div className="relative space-y-6 pb-20 md:pb-6" style={{ zoom: 0.8 }}>
      {/* ─── Motivational Quote ─────────────────────────────── */}
      <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-gradient-to-r from-teal-50/60 to-transparent px-4 py-3 dark:from-teal-950/15 dark:to-transparent">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-teal-600 dark:text-teal-400" />
        <p className="text-sm italic leading-relaxed text-muted-foreground">
          {getMotivationalQuote()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Exams */}
        <StatCard
          icon={GraduationCap}
          label="Total Exams"
          value={data?.stats.totalExams ?? 0}
          change="+2 this month"
          trend="up"
          color="emerald"
          pattern
        />

        {/* Next Exam */}
        <StatCard
          icon={Calendar}
          label="Next Exam"
          value={data?.nextExam?.examName ?? "No Exam"}
          change={
            data?.nextExam
              ? `${Math.ceil(
                (new Date(data.nextExam.examDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
              )} days left`
              : "No upcoming exam"
          }
          trend="up"
          color="blue"
          pattern
        />

        {/* Average Score */}
        <StatCard
          icon={BarChart3}
          label="Average Score"
          value={`${data?.stats.avgScore ?? 0}%`}
          change="+3.2% from last"
          trend="up"
          color="amber"
          pattern
        />

        {/* Percentile */}
        <StatCard
          icon={Target}
          label="Top"
          value={`${data?.stats.percentile ?? 0}%`}
          change="Percentile Rank"
          trend="up"
          color="emerald"
          pattern
        />
      </div>

      {/* ─── Section Divider ────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ─── Next Exam Countdown + Study Streak ────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Next Exam Countdown */}
        {isLoading ? (
          <Skeleton className="h-[120px] rounded-2xl" />
        ) : data?.nextExam ? (
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
            <div className="pointer-events-none absolute -right-4 -top-4 size-20 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/5 blur-xl dark:from-emerald-500/5 dark:to-teal-500/5" />
            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <Timer className="size-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-semibold text-foreground">Next Exam Countdown</h3>
              </div>
              <p className="mb-3 text-base font-semibold text-foreground">
                {data.nextExam.name}
              </p>
              {nextExamCountdown && !nextExamCountdown.isPast ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center rounded-xl bg-emerald-50 px-4 py-2.5 dark:bg-emerald-950/30">
                    <span className="text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
                      {nextExamCountdown.days}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70">
                      Days
                    </span>
                  </div>
                  <span className="text-lg font-light text-muted-foreground">:</span>
                  <div className="flex flex-col items-center rounded-xl bg-teal-50 px-4 py-2.5 dark:bg-teal-950/30">
                    <span className="text-2xl font-bold tabular-nums text-teal-700 dark:text-teal-300">
                      {nextExamCountdown.hours}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-600/70 dark:text-teal-400/70">
                      Hours
                    </span>
                  </div>
                  <div className="ml-auto">
                    <Badge
                      variant={nextExamCountdown.days <= 7 ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {formatDate(data.nextExam.examDate)}
                    </Badge>
                  </div>
                </div>
              ) : (
                <Badge variant="secondary">Date passed</Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground">
            No upcoming exams scheduled
          </div>
        )}

        {/* Study Streak */}
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Flame className="size-4 text-orange-500" />
            <h3 className="text-sm font-semibold text-foreground">Study Streak</h3>
            <span className="ml-auto text-xs font-medium text-muted-foreground">Last 7 days</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            {weekDots.map((active, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'size-9 rounded-full transition-all duration-200 sm:size-10',
                    active
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/20 dark:from-emerald-600 dark:to-teal-500'
                      : 'bg-muted',
                    i === 6 && active && 'ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-background dark:ring-emerald-500/30',
                  )}
                >
                  {/* {active && (
                    <CheckCircle2 className="size-4 text-white sm:size-5 sm:p-0.5" />
                  )} */}
                </div>
                <span className={cn(
                  'text-[10px] font-medium',
                  i === 6 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
                )}>
                  {i === 6 ? 'Today' : getDayLabel(i)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 dark:bg-orange-950/20">
            <Zap className="size-3.5 text-orange-500" />
            <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
              {weekDots.filter(Boolean).length} of 7 days active — keep it up!
            </span>
          </div>
        </div>
      </div>
  
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ─── Score Trend ────────────────────────────────────── */}
      <Card className="overflow-hidden rounded-2xl border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Activity className="size-4 text-emerald-600 dark:text-emerald-400" />
            Score Trend
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-emerald-600 dark:text-emerald-400"
            onClick={() => navigate('analytics')}
          >
            View Analytics
            <ArrowRight className="ml-1 size-4" />
          </Button>
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
            <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="size-8 text-muted-foreground/40" />
              No exam data yet. Add your first exam to see trends.
            </div>
          )}
        </CardContent>
      </Card>



      {/* ─── Recent Exams Table ─────────────────────────────── */}
      <Card className="overflow-hidden rounded-2xl border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <GraduationCap className="size-4 text-emerald-600 dark:text-emerald-400" />
            Recent Exams
          </CardTitle>
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
                <TableRow className="hover:bg-transparent">
                  <TableHead>Exam</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentExams.map((exam) => (
                  <TableRow
                    key={exam.id}
                    className="group transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {formatDate(exam.date)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="outline"
                        className={cn(
                          'border text-xs font-medium',
                          categoryColors[exam.category] || categoryColors.Other,
                        )}
                      >
                        {exam.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold tabular-nums">{exam.score}%</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={cn(
                          'border-0 text-xs font-medium',
                          exam.result === 'Qualified'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                            : exam.result === 'Awaited'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
                        )}
                      >
                        {exam.result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-[120px] flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="size-8 text-muted-foreground/40" />
              No exams recorded yet. Start by adding your first exam!
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Section Divider ────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ─── Smart Insights ─────────────────────────────────── */}


      {/* ─── View Full Analytics ────────────────────────────── */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="gap-2 rounded-xl border-emerald-200 px-6 py-2.5 text-emerald-700 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-50 hover:shadow-md hover:text-emerald-800 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
          onClick={() => navigate('analytics')}
        >
          <BarChart3 className="size-4" />
          View Full Analytics
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {/* ─── Floating Action Button (Mobile) ────────────────── */}
      <button
        onClick={() => setAddExamOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 transition-all duration-200 hover:scale-110 hover:shadow-xl hover:shadow-emerald-600/40 active:scale-95 md:hidden"
        aria-label="Add Exam"
      >
        <Plus className="size-6" />
      </button>

      {/* Add Exam Dialog */}
      <AddExamDialog open={addExamOpen} onOpenChange={setAddExamOpen} />
    </div>
  );
}