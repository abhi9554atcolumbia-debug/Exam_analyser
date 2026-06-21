'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  GraduationCap,
  Trophy,
  BarChart3,
  Star,
  Filter,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  CheckCircle2,
  XCircle,
  BookOpen,
  ExternalLink,
  ArrowUpDown,
  Eye,
  FileText,
  Loader2,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  getExams,
  createExam,
  getReflections,
  type Exam,
  type ExamListResponse,
  type Reflection,
} from '@/lib/api';
import { useNavigationStore } from '@/store/navigation';

// ─── Helpers ───────────────────────────────────────────────
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function groupExamsByYear(exams: Exam[]): Record<string, Exam[]> {
  const groups: Record<string, Exam[]> = {};
  for (const exam of exams) {
    const year = new Date(exam.examDate).getFullYear().toString();
    if (!groups[year]) groups[year] = [];
    groups[year].push(exam);
  }
  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a)),
  );
}

// ─── Add Exam Dialog (same as dashboard) ───────────────────
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
      queryClient.invalidateQueries({ queryKey: ['exams'] });
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

  const addSection = () =>
    setForm((f) => [...f.sections, { section: '', score: '', max: '' }]);

  const removeSection = (idx: number) =>
    setForm((f) => f.sections.filter((_, i) => i !== idx));

  const updateSection = (
    idx: number,
    field: 'section' | 'score' | 'max',
    value: string,
  ) =>
    setForm((f) =>
      f.sections.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Exam Result</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="hist-exam-name">Exam Name</Label>
            <Input
              id="hist-exam-name"
              placeholder="e.g. SBI PO 2025"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="hist-exam-org">Organization</Label>
              <Input
                id="hist-exam-org"
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
              <Label htmlFor="hist-exam-date">Exam Date</Label>
              <Input
                id="hist-exam-date"
                type="date"
                value={form.examDate}
                onChange={(e) => setForm((f) => ({ ...f, examDate: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="hist-score">Score</Label>
              <Input
                id="hist-score"
                type="number"
                placeholder="0"
                value={form.score}
                onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hist-max">Max Score</Label>
              <Input
                id="hist-max"
                type="number"
                placeholder="100"
                value={form.maxScore}
                onChange={(e) => setForm((f) => ({ ...f, maxScore: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hist-cutoff">Cutoff</Label>
              <Input
                id="hist-cutoff"
                type="number"
                placeholder="0"
                value={form.cutoff}
                onChange={(e) => setForm((f) => ({ ...f, cutoff: e.target.value }))}
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
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label>Sectional Scores (optional)</Label>
              <Button variant="outline" size="sm" type="button" onClick={addSection}>
                <Plus className="mr-1 size-3.5" />
                Add Section
              </Button>
            </div>
            {form.sections.map((sec, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_80px_80px_auto] gap-2">
                <Input
                  placeholder="Section name"
                  value={sec.section}
                  onChange={(e) => updateSection(idx, 'section', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Score"
                  value={sec.score}
                  onChange={(e) => updateSection(idx, 'score', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={sec.max}
                  onChange={(e) => updateSection(idx, 'max', e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => removeSection(idx)}>
                  <X className="size-4 text-muted-foreground" />
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

// ─── Exam Detail Panel Content ─────────────────────────────
function ExamDetailContent({
  exam,
  activeTab,
}: {
  exam: Exam;
  activeTab: string;
}) {
  const { data: reflections } = useQuery<Reflection[]>({
    queryKey: ['reflections', exam.id],
    queryFn: () => getReflections({ examId: exam.id }),
  });

  const reflection = reflections?.[0] ?? null;
  const scorePercent = exam.maxScore > 0
    ? Math.round((exam.score / exam.maxScore) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Category</p>
              <Badge variant="outline">{exam.category}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Stage</p>
              <Badge variant="outline">{exam.stage}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Organization</p>
              <p className="text-sm font-medium">{exam.org || '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Attempt</p>
              <p className="text-sm font-medium">#{exam.attempt}</p>
            </div>
          </div>

          <Separator />

          {/* Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Score</span>
              <span className="font-bold">{exam.score}/{exam.maxScore} ({scorePercent}%)</span>
            </div>
            <ProgressBar
              percent={scorePercent}
              color="bg-emerald-600 dark:bg-emerald-500"
              height="h-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground">Cutoff</p>
              <p className="text-lg font-bold">{exam.cutoff}</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground">Gap</p>
              <p className={`text-lg font-bold ${exam.cutoffGap !== null && exam.cutoffGap >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {exam.cutoffGap !== null ? exam.cutoffGap : '—'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Sectional Scores */}
          {exam.sectionalScores.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Sectional Scores</h4>
              {exam.sectionalScores.map((sec) => {
                const pct = sec.max > 0
                  ? Math.round((sec.score / sec.max) * 100)
                  : 0;
                return (
                  <div key={sec.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{sec.section}</span>
                      <span className="text-muted-foreground">
                        {sec.score}/{sec.max} ({pct}%)
                      </span>
                    </div>
                    <ProgressBar
                      percent={pct}
                      color={
                        pct >= 60
                          ? 'bg-emerald-600 dark:bg-emerald-500'
                          : pct >= 40
                            ? 'bg-amber-500 dark:bg-amber-400'
                            : 'bg-red-500 dark:bg-red-400'
                      }
                      height="h-2"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {exam.rank !== null && (
            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground">Rank</p>
              <p className="text-lg font-bold">{exam.rank}</p>
            </div>
          )}
        </>
      )}

      {/* Reflection Tab */}
      {activeTab === 'reflection' && (
        <>
          {reflection ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold">Reflection exists</span>
              </div>

              <div className="space-y-3">
                {reflection.whatWentWell && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      What went well
                    </p>
                    <p className="text-sm text-foreground">{reflection.whatWentWell}</p>
                  </div>
                )}
                {reflection.whatWentWrong && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-red-600 dark:text-red-400">
                      What went wrong
                    </p>
                    <p className="text-sm text-foreground">{reflection.whatWentWrong}</p>
                  </div>
                )}
                {reflection.biggestLesson && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      Biggest lesson
                    </p>
                    <p className="text-sm text-foreground">{reflection.biggestLesson}</p>
                  </div>
                )}
                {reflection.actionPlan && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-teal-600 dark:text-teal-400">
                      Action plan
                    </p>
                    <p className="text-sm text-foreground">{reflection.actionPlan}</p>
                  </div>
                )}
                {reflection.difficulty && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Difficulty</p>
                    <p className="text-sm">{reflection.difficulty}</p>
                  </div>
                )}
                {reflection.confidence !== null && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Confidence</p>
                    <ProgressBar
                      percent={reflection.confidence}
                      color="bg-teal-600 dark:bg-teal-500"
                      height="h-2"
                      showValue
                    />
                  </div>
                )}
                {reflection.sections.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Section Analysis</p>
                    {reflection.sections.map((sec) => (
                      <div key={sec.id} className="rounded-lg border p-2.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{sec.section}</span>
                          {sec.score !== null && (
                            <span className="text-xs text-muted-foreground">{sec.score}%</span>
                          )}
                        </div>
                        {sec.strength && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            ✅ {sec.strength}
                          </p>
                        )}
                        {sec.weakness && (
                          <p className="text-xs text-red-600 dark:text-red-400">
                            ❌ {sec.weakness}
                          </p>
                        )}
                        {sec.actionPlan && (
                          <p className="text-xs text-muted-foreground">
                            📋 {sec.actionPlan}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BookOpen className="mb-3 size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                No reflection yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Add a reflection to analyze your performance.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Exam History Page ─────────────────────────────────────
export default function ExamHistoryPage() {
  const navigate = useNavigationStore((s) => s.navigate);
  const queryClient = useQueryClient();

  const [category, setCategory] = useState('all');
  const [year, setYear] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('examDate:desc');
  const [page, setPage] = useState(1);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState('overview');
  const [addExamOpen, setAddExamOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data, isLoading, isFetching } = useQuery<ExamListResponse>({
    queryKey: ['exams', category, year, status, sort, page],
    queryFn: () =>
      getExams({
        page,
        limit: 12,
        sort,
        category: category !== 'all' ? category : undefined,
        year: year !== 'all' ? year : undefined,
        status: status !== 'all' ? status : undefined,
      }),
  });

  const exams = data?.data ?? [];
  const pagination = data?.pagination;
  const hasMore = pagination ? page < pagination.pages : false;

  const grouped = useMemo(() => groupExamsByYear(exams), [exams]);

  // Stats computed from all loaded exams
  const stats = useMemo(() => {
    const total = exams.length;
    const qualified = exams.filter((e) => e.result === 'Qualified').length;
    const avgScore =
      total > 0
        ? Math.round(
            (exams.reduce(
              (s, e) => s + (e.score / e.maxScore) * 100,
              0,
            ) /
              total) *
              10,
          ) / 10
        : 0;
    const bestScore =
      total > 0
        ? Math.round(
            (Math.max(...exams.map((e) => e.score / e.maxScore)) * 100) * 10,
          ) / 10
        : 0;
    return { total, qualified, avgScore, bestScore };
  }, [exams]);

  const selectedExam = useMemo(
    () => exams.find((e) => e.id === selectedExamId) ?? null,
    [exams, selectedExamId],
  );

  const openDetail = (examId: string) => {
    setSelectedExamId(examId);
    setDetailTab('overview');
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Exam History
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse and manage all your past exam results
          </p>
        </div>
        <Button
          onClick={() => setAddExamOpen(true)}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Plus className="mr-2 size-4" />
          Add Exam
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          icon={GraduationCap}
          label="Total Exams"
          value={stats.total}
          colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
        />
        <StatCard
          icon={Trophy}
          label="Qualified"
          value={stats.qualified}
          change={
            stats.total > 0
              ? `${Math.round((stats.qualified / stats.total) * 100)}% rate`
              : undefined
          }
          trend={stats.qualified >= stats.total * 0.5 ? 'up' : 'neutral'}
        />
        <StatCard
          icon={BarChart3}
          label="Avg Score"
          value={`${stats.avgScore}%`}
          colorClass="bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
        />
        <StatCard
          icon={Star}
          label="Best Score"
          value={`${stats.bestScore}%`}
          trend="up"
          colorClass="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
        />
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 py-3">
          <Filter className="size-4 text-muted-foreground" />
          <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Banking">Banking</SelectItem>
              <SelectItem value="SSC">SSC</SelectItem>
              <SelectItem value="Railway">Railway</SelectItem>
              <SelectItem value="Insurance">Insurance</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={(v) => { setYear(v); setPage(1); }}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Qualified">Qualified</SelectItem>
              <SelectItem value="Not Qualified">Not Qualified</SelectItem>
              <SelectItem value="Awaited">Result Awaited</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="examDate:desc">Newest First</SelectItem>
              <SelectItem value="examDate:asc">Oldest First</SelectItem>
              <SelectItem value="score:desc">Highest Score</SelectItem>
              <SelectItem value="score:asc">Lowest Score</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Exam Cards */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-24" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
            ))}
          </div>
        ) : Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([yearLabel, yearExams]) => (
            <div key={yearLabel}>
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                {yearLabel}
              </h2>
              <div className="space-y-3">
                {yearExams.map((exam) => {
                  const gap = exam.cutoffGap;
                  const gapColor =
                    gap !== null && gap > 0
                      ? 'text-red-600 dark:text-red-400'
                      : gap !== null && gap <= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-muted-foreground';

                  return (
                    <Card
                      key={exam.id}
                      className="cursor-pointer transition-all hover:border-emerald-200 hover:shadow-md dark:hover:border-emerald-800"
                      onClick={() => openDetail(exam.id)}
                    >
                      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Left info */}
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {exam.category}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {exam.stage}
                            </Badge>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {exam.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {exam.org || 'Unknown'} ·{' '}
                              {formatDate(exam.examDate)} · Attempt #
                              {exam.attempt}
                            </p>
                          </div>
                        </div>

                        {/* Right stats */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold">{exam.score}/{exam.maxScore}</p>
                            <p className="text-xs text-muted-foreground">
                              Cutoff: {exam.cutoff}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-semibold ${gapColor}`}>
                              {gap !== null ? (gap > 0 ? `+${gap}` : `${gap}`) : '—'}
                            </p>
                            <p className="text-[10px] text-muted-foreground">gap</p>
                          </div>
                          <Badge
                            className={
                              exam.result === 'Qualified'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                                : exam.result === 'Awaited'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            }
                          >
                            {exam.result}
                          </Badge>
                          {exam.reflection && (
                            <BookOpen className="size-4 text-emerald-600 dark:text-emerald-400" />
                          )}
                          <Eye className="size-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
            <GraduationCap className="mb-3 size-10 text-muted-foreground/40" />
            <p className="font-medium text-muted-foreground">
              No exams found
            </p>
            <p className="mt-1 text-sm text-muted-foreground/60">
              Try adjusting your filters or add your first exam.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setAddExamOpen(true)}
            >
              <Plus className="mr-2 size-4" />
              Add Exam
            </Button>
          </div>
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : null}
            Load More
          </Button>
        </div>
      )}

      {/* Detail Side Sheet (Mobile) */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selectedExam && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg">{selectedExam.name}</SheetTitle>
              </SheetHeader>
              <Tabs value={detailTab} onValueChange={setDetailTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="reflection">Reflection</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <ExamDetailContent exam={selectedExam} activeTab="overview" />
                </TabsContent>
                <TabsContent value="reflection">
                  <ExamDetailContent exam={selectedExam} activeTab="reflection" />
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Exam Dialog */}
      <AddExamDialog open={addExamOpen} onOpenChange={setAddExamOpen} />
    </div>
  );
}
