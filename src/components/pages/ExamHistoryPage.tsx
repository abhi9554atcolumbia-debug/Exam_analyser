'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  GraduationCap,
  Trophy,
  BarChart3,
  Star,
  Filter,
  Plus,
  X,
  CheckCircle2,
  XCircle,
  BookOpen,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  SearchX,
  Search,
  Pencil,
  Trash2,
  Download,
  LayoutList,
  LayoutGrid,
  CalendarDays,
  Target,
  Brain,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  getExams,
  createExam,
  updateExam,
  deleteExam,
  getReflections,
  type Exam,
  type ExamListResponse,
  type Reflection,
} from '@/lib/api';
import { useNavigationStore } from '@/store/navigation';
import { cn } from '@/lib/utils';

// ─── Helpers ───────────────────────────────────────────────
const CATEGORY_BORDER: Record<string, string> = {
  Banking: 'border-l-emerald-500',
  SSC: 'border-l-amber-500',
  Railway: 'border-l-sky-500',
  Insurance: 'border-l-violet-500',
  Other: 'border-l-muted-foreground/30',
};

const CATEGORY_BADGE: Record<string, string> = {
  Banking: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  SSC: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  Railway: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
  Insurance: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
  Other: 'bg-muted text-muted-foreground',
};

function getCategoryBorder(category: string): string {
  return CATEGORY_BORDER[category] ?? 'border-l-muted-foreground/30';
}

function getCategoryBadge(category: string): string {
  return CATEGORY_BADGE[category] ?? 'bg-muted text-muted-foreground';
}

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

// ─── Exam Form Fields (shared by Add & Edit) ───────────────
interface ExamFormState {
  name: string;
  org: string;
  category: string;
  stage: string;
  examDate: string;
  score: string;
  maxScore: string;
  cutoff: string;
  result: string;
  sections: { section: string; score: string; max: string }[];
}

const EMPTY_FORM: ExamFormState = {
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
};

function examToForm(exam: Exam): ExamFormState {
  return {
    name: exam.name,
    org: exam.org ?? '',
    category: exam.category,
    stage: exam.stage,
    examDate: exam.examDate.split('T')[0],
    score: String(exam.score),
    maxScore: String(exam.maxScore),
    cutoff: String(exam.cutoff),
    result: exam.result,
    sections: exam.sectionalScores.map((s) => ({
      section: s.section,
      score: String(s.score),
      max: String(s.max),
    })),
  };
}

function ExamFormFields({
  form,
  setForm,
}: {
  form: ExamFormState;
  setForm: React.Dispatch<React.SetStateAction<ExamFormState>>;
}) {
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
    <div className="grid gap-4 py-2">
      <div className="grid gap-2">
        <Label htmlFor="exam-form-name">Exam Name</Label>
        <Input
          id="exam-form-name"
          placeholder="e.g. SBI PO 2025"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="exam-form-org">Organization</Label>
          <Input
            id="exam-form-org"
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
          <Label htmlFor="exam-form-date">Exam Date</Label>
          <Input
            id="exam-form-date"
            type="date"
            value={form.examDate}
            onChange={(e) => setForm((f) => ({ ...f, examDate: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="exam-form-score">Score</Label>
          <Input
            id="exam-form-score"
            type="number"
            placeholder="0"
            value={form.score}
            onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="exam-form-max">Max Score</Label>
          <Input
            id="exam-form-max"
            type="number"
            placeholder="100"
            value={form.maxScore}
            onChange={(e) => setForm((f) => ({ ...f, maxScore: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="exam-form-cutoff">Cutoff</Label>
          <Input
            id="exam-form-cutoff"
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
  );
}

// ─── Add Exam Dialog ──────────────────────────────────────
function AddExamDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ExamFormState>({ ...EMPTY_FORM });

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
      setForm({ ...EMPTY_FORM });
    },
    onError: () => {
      toast.error('Failed to add exam. Please try again.');
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Exam Result</DialogTitle>
        </DialogHeader>
        <ExamFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !form.name || !form.examDate || !form.score}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {mutation.isPending ? 'Saving...' : 'Add Exam'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Exam Dialog ─────────────────────────────────────
function EditExamDialog({
  open,
  onOpenChange,
  exam,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: Exam | null;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ExamFormState>(
    exam ? examToForm(exam) : { ...EMPTY_FORM },
  );

  const mutation = useMutation({
    mutationFn: () => {
      if (!exam) return Promise.reject('No exam');
      return updateExam(exam.id, {
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
      });
    },
    onSuccess: () => {
      toast.success('Exam updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Failed to update exam. Please try again.');
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Exam Result</DialogTitle>
        </DialogHeader>
        <ExamFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !form.name || !form.examDate || !form.score}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirmation Dialog ──────────────────────────
function DeleteExamDialog({
  open,
  onOpenChange,
  exam,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: Exam | null;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      if (!exam) return Promise.reject('No exam');
      return deleteExam(exam.id);
    },
    onSuccess: () => {
      toast.success(`"${exam?.name}" deleted successfully!`);
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Failed to delete exam. Please try again.');
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-500" />
            Delete Exam
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>&quot;{exam?.name}&quot;</strong>?
            This action cannot be undone. All associated sectional scores will also be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            disabled={mutation.isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Exam'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Score Visualization Bar ───────────────────────────────
function ScoreVisualization({
  score,
  maxScore,
  cutoff,
}: {
  score: number;
  maxScore: number;
  cutoff: number;
}) {
  const scorePct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const cutoffPct = maxScore > 0 ? Math.round((cutoff / maxScore) * 100) : 0;
  const passed = score >= cutoff;

  return (
    <div className="space-y-3">
      <div className="relative">
        {/* Track */}
        <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
          {/* Score fill */}
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-out',
              passed
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400'
                : 'bg-gradient-to-r from-amber-500 to-red-500 dark:from-amber-400 dark:to-red-400',
            )}
            style={{ width: `${Math.min(scorePct, 100)}%` }}
          />
        </div>
        {/* Cutoff marker */}
        <div
          className="absolute top-0 h-4 w-0.5 -translate-x-1/2 bg-red-600 dark:bg-red-400"
          style={{ left: `${Math.min(cutoffPct, 100)}%` }}
          title={`Cutoff: ${cutoff}`}
        />
        <div
          className="absolute -top-5 -translate-x-1/2 text-[10px] font-medium text-red-600 dark:text-red-400"
          style={{ left: `${Math.min(cutoffPct, 100)}%` }}
        >
          cutoff
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span className={cn('font-semibold', passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
          {passed ? '✓ Above cutoff' : '✗ Below cutoff'}
        </span>
        <span>{maxScore}</span>
      </div>
    </div>
  );
}

// ─── Exam Detail Sheet Content ────────────────────────────
function ExamDetailContent({
  exam,
  activeTab,
  onEdit,
  onDelete,
  onAddReflection,
}: {
  exam: Exam;
  activeTab: string;
  onEdit: () => void;
  onDelete: () => void;
  onAddReflection: () => void;
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
    <div className="space-y-5">
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Result Badge */}
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                exam.result === 'Qualified'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                  : exam.result === 'Awaited'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
              )}
            >
              {exam.result === 'Qualified' ? (
                <CheckCircle2 className="mr-1 size-3" />
              ) : exam.result === 'Not Qualified' ? (
                <XCircle className="mr-1 size-3" />
              ) : (
                <Loader2 className="mr-1 size-3" />
              )}
              {exam.result}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Attempt #{exam.attempt}
            </span>
          </div>

          {/* Score Visualization */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Score</span>
              <span className="text-lg font-bold text-foreground">
                {exam.score}
                <span className="text-sm font-normal text-muted-foreground">
                  /{exam.maxScore}
                </span>
                <span className="ml-2 text-sm font-medium text-muted-foreground">
                  ({scorePercent}%)
                </span>
              </span>
            </div>
            <ScoreVisualization
              score={exam.score}
              maxScore={exam.maxScore}
              cutoff={exam.cutoff}
            />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 rounded-lg border p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Category
              </p>
              <Badge className={cn('text-xs', getCategoryBadge(exam.category))}>
                {exam.category}
              </Badge>
            </div>
            <div className="space-y-1 rounded-lg border p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Stage
              </p>
              <p className="text-sm font-medium">{exam.stage}</p>
            </div>
            <div className="space-y-1 rounded-lg border p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Organization
              </p>
              <p className="text-sm font-medium">{exam.org || '—'}</p>
            </div>
            <div className="space-y-1 rounded-lg border p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Exam Date
              </p>
              <p className="text-sm font-medium">{formatDate(exam.examDate)}</p>
            </div>
          </div>

          {/* Cutoff & Gap */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Cutoff
              </p>
              <p className="text-lg font-bold">{exam.cutoff}</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Gap
              </p>
              <p
                className={cn(
                  'text-lg font-bold',
                  exam.cutoffGap !== null && exam.cutoffGap > 0
                    ? 'text-red-600 dark:text-red-400'
                    : exam.cutoffGap !== null
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-muted-foreground',
                )}
              >
                {exam.cutoffGap !== null ? (exam.cutoffGap > 0 ? `+${exam.cutoffGap}` : `${exam.cutoffGap}`) : '—'}
              </p>
            </div>
            {exam.rank !== null && (
              <div className="rounded-lg border p-3 text-center">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Rank
                </p>
                <p className="text-lg font-bold">{exam.rank}</p>
              </div>
            )}
          </div>

          <Separator className="my-1" />

          {/* Sectional Scores */}
          {exam.sectionalScores.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <BarChart3 className="size-4 text-emerald-600 dark:text-emerald-400" />
                Sectional Scores
              </h4>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Section</TableHead>
                      <TableHead className="text-xs text-right">Score</TableHead>
                      <TableHead className="text-xs text-right">Max</TableHead>
                      <TableHead className="text-xs text-right">%</TableHead>
                      <TableHead className="text-xs text-right w-[120px]">Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exam.sectionalScores.map((sec) => {
                      const pct = sec.max > 0
                        ? Math.round((sec.score / sec.max) * 100)
                        : 0;
                      return (
                        <TableRow key={sec.id}>
                          <TableCell className="font-medium text-sm">
                            {sec.section}
                          </TableCell>
                          <TableCell className="text-right text-sm">{sec.score}</TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">{sec.max}</TableCell>
                          <TableCell className={cn('text-right text-sm font-medium', pct >= 60 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400')}>
                            {pct}%
                          </TableCell>
                          <TableCell className="text-right pr-3">
                            <div className="ml-auto h-2 w-[100px] overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn(
                                  'h-full rounded-full',
                                  pct >= 60
                                    ? 'bg-emerald-500 dark:bg-emerald-400'
                                    : pct >= 40
                                      ? 'bg-amber-500 dark:bg-amber-400'
                                      : 'bg-red-500 dark:bg-red-400',
                                )}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Reflection Link */}
          <Separator className="my-1" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Reflection</span>
            </div>
            {reflection ? (
              <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700">
                <FileText className="mr-1 size-3" />
                Linked
              </Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onAddReflection}
                className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
              >
                <Plus className="size-3.5" />
                Add Reflection
              </Button>
            )}
          </div>
        </>
      )}

      {/* Reflection Tab */}
      {activeTab === 'reflection' && (
        <>
          {reflection ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold">Reflection Summary</span>
              </div>

              {reflection.confidence !== null && (
                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Confidence Level</span>
                    <span className="text-sm font-bold">{reflection.confidence}%</span>
                  </div>
                  <ProgressBar
                    percent={reflection.confidence}
                    color="bg-teal-600 dark:bg-teal-500"
                    height="h-2.5"
                  />
                </div>
              )}

              <div className="space-y-3">
                {reflection.whatWentWell && (
                  <div className="space-y-1 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-800 dark:bg-emerald-950/20">
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ✅ What went well
                    </p>
                    <p className="text-sm text-foreground">{reflection.whatWentWell}</p>
                  </div>
                )}
                {reflection.whatWentWrong && (
                  <div className="space-y-1 rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-800 dark:bg-red-950/20">
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                      ❌ What went wrong
                    </p>
                    <p className="text-sm text-foreground">{reflection.whatWentWrong}</p>
                  </div>
                )}
                {reflection.biggestLesson && (
                  <div className="space-y-1 rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      💡 Biggest lesson
                    </p>
                    <p className="text-sm text-foreground">{reflection.biggestLesson}</p>
                  </div>
                )}
                {reflection.actionPlan && (
                  <div className="space-y-1 rounded-lg border border-teal-200 bg-teal-50/50 p-3 dark:border-teal-800 dark:bg-teal-950/20">
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                      📋 Action plan
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
              </div>

              {/* Section Analysis */}
              {reflection.sections.length > 0 && (
                <div className="space-y-2">
                  <Separator className="my-1" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Section Analysis
                  </p>
                  {reflection.sections.map((sec) => (
                    <div key={sec.id} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{sec.section}</span>
                        {sec.score !== null && (
                          <Badge variant="outline" className="text-xs">
                            {sec.score}%
                          </Badge>
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
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                <BookOpen className="size-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No reflection yet
              </p>
              <p className="mt-1 max-w-[200px] text-xs text-muted-foreground/60">
                Add a reflection to analyze your performance and track improvements.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                onClick={onAddReflection}
              >
                <Plus className="size-3.5" />
                Add Reflection
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── CSV Export ────────────────────────────────────────────
function exportExamsCSV(exams: Exam[]) {
  const headers = [
    'Name',
    'Organization',
    'Category',
    'Stage',
    'Date',
    'Score',
    'Max Score',
    'Cutoff',
    'Gap',
    'Result',
    'Attempt',
  ];
  const rows = exams.map((e) => [
    `"${e.name}"`,
    `"${e.org || ''}"`,
    e.category,
    e.stage,
    e.examDate,
    e.score,
    e.maxScore,
    e.cutoff,
    e.cutoffGap ?? '',
    e.result,
    e.attempt,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join(
    '\n',
  );
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `exam-history-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
  const [searchText, setSearchText] = useState('');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState('overview');
  const [addExamOpen, setAddExamOpen] = useState(false);
  const [editExamOpen, setEditExamOpen] = useState(false);
  const [deleteExamOpen, setDeleteExamOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

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

  const filteredExams = useMemo(() => {
    if (!searchText.trim()) return exams;
    const term = searchText.toLowerCase().trim();
    return exams.filter(
      (e) =>
        e.name.toLowerCase().includes(term) ||
        (e.org && e.org.toLowerCase().includes(term)) ||
        e.category.toLowerCase().includes(term) ||
        e.stage.toLowerCase().includes(term),
    );
  }, [exams, searchText]);

  const grouped = useMemo(() => groupExamsByYear(filteredExams), [filteredExams]);

  // Stats computed from all loaded exams
  const stats = useMemo(() => {
    const total = filteredExams.length;
    const qualified = filteredExams.filter((e) => e.result === 'Qualified').length;
    const avgScore =
      total > 0
        ? Math.round(
            (filteredExams.reduce(
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
            (Math.max(...filteredExams.map((e) => e.score / e.maxScore)) * 100) * 10,
          ) / 10
        : 0;
    return { total, qualified, avgScore, bestScore };
  }, [filteredExams]);

  const selectedExam = useMemo(
    () => filteredExams.find((e) => e.id === selectedExamId) ?? null,
    [filteredExams, selectedExamId],
  );

  const openDetail = useCallback((examId: string) => {
    setSelectedExamId(examId);
    setDetailTab('overview');
    setSheetOpen(true);
  }, []);

  const handleEdit = useCallback(() => {
    setSheetOpen(false);
    setTimeout(() => setEditExamOpen(true), 150);
  }, []);

  const handleDelete = useCallback(() => {
    setSheetOpen(false);
    setTimeout(() => setDeleteExamOpen(true), 150);
  }, []);

  const handleAddReflection = useCallback(() => {
    setSheetOpen(false);
    navigate('reflections');
  }, [navigate]);

  const handleExportCSV = useCallback(() => {
    if (exams.length === 0) {
      toast.info('No exams to export.');
      return;
    }
    exportExamsCSV(exams);
    toast.success(`Exported ${exams.length} exams to CSV!`);
  }, [exams]);

  const handleEditDialogClose = useCallback((open: boolean) => {
    setEditExamOpen(open);
    if (!open && selectedExam) {
      setSheetOpen(true);
    }
  }, [selectedExam]);

  const handleDeleteDialogClose = useCallback((open: boolean) => {
    setDeleteExamOpen(open);
    if (!open && selectedExam) {
      setSheetOpen(true);
    }
  }, [selectedExam]);

  // Result badge styling helper
  const getResultBadge = (result: string) =>
    result === 'Qualified'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
      : result === 'Awaited'
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
        : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';

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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5"
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
          <Button
            onClick={() => setAddExamOpen(true)}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Plus className="mr-2 size-4" />
            Add Exam
          </Button>
        </div>
      </div>

      {/* Summary Stats Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border bg-emerald-50 px-3 py-1.5 dark:bg-emerald-950/30 dark:border-emerald-800/50">
          <GraduationCap className="size-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-foreground">{stats.total}</span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-teal-50 px-3 py-1.5 dark:bg-teal-950/30 dark:border-teal-800/50">
          <Trophy className="size-4 text-teal-600 dark:text-teal-400" />
          <span className="text-sm font-medium text-foreground">{stats.qualified}</span>
          <span className="text-xs text-muted-foreground">Qualified</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-amber-50 px-3 py-1.5 dark:bg-amber-950/30 dark:border-amber-800/50">
          <BarChart3 className="size-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-foreground">{stats.avgScore}%</span>
          <span className="text-xs text-muted-foreground">Avg Score</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-violet-50 px-3 py-1.5 dark:bg-violet-950/30 dark:border-violet-800/50">
          <Star className="size-4 text-violet-600 dark:text-violet-400" />
          <span className="text-sm font-medium text-foreground">{stats.bestScore}%</span>
          <span className="text-xs text-muted-foreground">Best</span>
        </div>
      </div>

      {/* Filter Bar + View Toggle */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 py-3">
          <div className="relative flex-1 min-w-[180px] max-w-[260px]">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search exams by name, org, category..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1">
            <Filter className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Filters</span>
          </div>
          <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
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
            <SelectTrigger className="h-8 w-[100px] text-xs">
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
            <SelectTrigger className="h-8 w-[130px] text-xs">
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
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="examDate:desc">Newest First</SelectItem>
              <SelectItem value="examDate:asc">Oldest First</SelectItem>
              <SelectItem value="score:desc">Highest Score</SelectItem>
              <SelectItem value="score:asc">Lowest Score</SelectItem>
            </SelectContent>
          </Select>

          {/* Spacer */}
          <div className="flex-1" />

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-md border bg-muted/30 p-0.5">
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 gap-1 px-2.5 text-xs"
              onClick={() => setViewMode('card')}
            >
              <LayoutGrid className="size-3.5" />
              Cards
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 gap-1 px-2.5 text-xs"
              onClick={() => setViewMode('table')}
            >
              <LayoutList className="size-3.5" />
              Table
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exam Content */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-24" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
            ))}
          </div>
        ) : Object.keys(grouped).length > 0 ? (
          <>
            {/* ── Table View ──────────────────────────────── */}
            {viewMode === 'table' && (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-xs">Exam</TableHead>
                        <TableHead className="text-xs hidden sm:table-cell">Org</TableHead>
                        <TableHead className="text-xs">Category</TableHead>
                        <TableHead className="text-xs hidden md:table-cell">Stage</TableHead>
                        <TableHead className="text-xs hidden lg:table-cell">Date</TableHead>
                        <TableHead className="text-xs text-right">Score</TableHead>
                        <TableHead className="text-xs text-right hidden sm:table-cell">Cutoff</TableHead>
                        <TableHead className="text-xs text-right">Gap</TableHead>
                        <TableHead className="text-xs text-center">Result</TableHead>
                        <TableHead className="text-xs w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExams.map((exam) => {
                        const gap = exam.cutoffGap;
                        const gapColor =
                          gap !== null && gap > 0
                            ? 'text-red-600 dark:text-red-400'
                            : gap !== null && gap <= 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-muted-foreground';
                        return (
                          <TableRow
                            key={exam.id}
                            className="cursor-pointer transition-colors hover:bg-muted/50"
                            onClick={() => openDetail(exam.id)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="max-w-[180px] truncate text-sm font-medium">
                                  {exam.name}
                                </span>
                                {exam.reflection && (
                                  <BookOpen className="shrink-0 size-3 text-emerald-600 dark:text-emerald-400" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                              {exam.org || '—'}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px]">
                                {exam.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                              {exam.stage}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                              {formatDate(exam.examDate)}
                            </TableCell>
                            <TableCell className="text-right text-sm font-semibold">
                              {exam.score}/{exam.maxScore}
                            </TableCell>
                            <TableCell className="text-right hidden sm:table-cell text-xs text-muted-foreground">
                              {exam.cutoff}
                            </TableCell>
                            <TableCell className={cn('text-right text-xs font-medium', gapColor)}>
                              {gap !== null ? (gap > 0 ? `+${gap}` : `${gap}`) : '—'}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={cn('text-[10px]', getResultBadge(exam.result))}>
                                {exam.result === 'Qualified' ? '✓' : exam.result === 'Not Qualified' ? '✗' : '⏳'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Eye className="size-3.5 text-muted-foreground" />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* ── Card View ────────────────────────────────── */}
            {viewMode === 'card' &&
              Object.entries(grouped).map(([yearLabel, yearExams]) => (
                <div key={yearLabel}>
                  {/* Year Group Header */}
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 items-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3 dark:from-emerald-500 dark:to-teal-500">
                      <CalendarDays className="mr-1.5 size-3.5 text-white" />
                      <span className="text-sm font-semibold text-white">
                        {yearLabel}
                      </span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 via-muted to-transparent dark:from-emerald-800" />
                    <span className="text-xs text-muted-foreground">
                      {yearExams.length} exam{yearExams.length > 1 ? 's' : ''}
                    </span>
                  </div>
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
                          className={cn(
                            'cursor-pointer border-l-4 transition-all duration-200',
                            'hover:-translate-y-0.5 hover:shadow-md hover:border-l-6 dark:hover:shadow-lg/10',
                            getCategoryBorder(exam.category),
                          )}
                          onClick={() => openDetail(exam.id)}
                        >
                          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                            {/* Left info */}
                            <div className="flex items-start gap-3">
                              <div className="flex flex-col items-center gap-1.5">
                                <Badge className={cn('text-xs', getCategoryBadge(exam.category))}>
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
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-foreground">
                                    {exam.name}
                                  </p>
                                  {exam.reflection && (
                                    <BookOpen className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                  )}
                                </div>
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
                              <Badge className={cn('text-xs', getResultBadge(exam.result))}>
                                {exam.result}
                              </Badge>
                              <Eye className="size-4 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
          </>
        ) : (
          /* ── Empty State ──────────────────────────────── */
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
            <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-muted/50">
              <SearchX className="size-10 text-muted-foreground/30" />
            </div>
            <p className="text-lg font-semibold text-muted-foreground">
              No exams found
            </p>
            <p className="mt-1 max-w-[300px] text-sm text-muted-foreground/60">
              {searchText
                ? 'No exams match your search. Try different keywords.'
                : category !== 'all' || year !== 'all' || status !== 'all'
                  ? 'No exams match the current filters. Try adjusting them.'
                  : "You haven't added any exams yet. Start by adding your first exam result."}
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                onClick={() => setAddExamOpen(true)}
              >
                <Plus className="size-4" />
                Add Your First Exam
              </Button>
            </div>
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

      {/* ── Detail Side Sheet ──────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex w-full flex-col overflow-y-auto p-0 sm:max-w-lg">
          {selectedExam && (
            <>
              <SheetHeader className="border-b px-6 py-4">
                <SheetTitle className="flex items-center gap-2 text-lg">
                  {selectedExam.result === 'Qualified' ? (
                    <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  ) : selectedExam.result === 'Not Qualified' ? (
                    <div className="flex size-7 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                      <XCircle className="size-4 text-red-600 dark:text-red-400" />
                    </div>
                  ) : (
                    <div className="flex size-7 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                      <Loader2 className="size-4 text-amber-600 dark:text-amber-400" />
                    </div>
                  )}
                  <span className="truncate">{selectedExam.name}</span>
                </SheetTitle>
              </SheetHeader>

              <Tabs
                value={detailTab}
                onValueChange={setDetailTab}
                className="flex flex-1 flex-col overflow-hidden"
              >
                <div className="border-b px-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview" className="gap-1.5 text-xs">
                      <Eye className="size-3.5" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="reflection" className="gap-1.5 text-xs">
                      <Brain className="size-3.5" />
                      Reflection
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <TabsContent value="overview" className="mt-0">
                    <ExamDetailContent
                      exam={selectedExam}
                      activeTab="overview"
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onAddReflection={handleAddReflection}
                    />
                  </TabsContent>
                  <TabsContent value="reflection" className="mt-0">
                    <ExamDetailContent
                      exam={selectedExam}
                      activeTab="reflection"
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onAddReflection={handleAddReflection}
                    />
                  </TabsContent>
                </div>
              </Tabs>

              {/* Sheet Footer with Edit/Delete */}
              <SheetFooter className="flex-row gap-2 border-t px-6 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Exam Dialog */}
      <AddExamDialog open={addExamOpen} onOpenChange={setAddExamOpen} />

      {/* Edit Exam Dialog */}
      <EditExamDialog
        key={selectedExam?.id ?? 'none'}
        open={editExamOpen}
        onOpenChange={handleEditDialogClose}
        exam={selectedExam}
      />

      {/* Delete Exam Dialog */}
      <DeleteExamDialog
        open={deleteExamOpen}
        onOpenChange={handleDeleteDialogClose}
        exam={selectedExam}
      />
    </div>
  );
}
