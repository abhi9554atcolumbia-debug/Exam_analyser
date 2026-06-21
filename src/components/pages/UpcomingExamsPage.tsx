'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  CalendarClock,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  FileDown,
  ExternalLink,
  AlertTriangle,
  CalendarDays,
  ClipboardCheck,
  Loader2,
  CircleDot,
  Lightbulb,
  X,
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
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { StatCard } from '@/components/ui/StatCard';
import {
  getUpcomingExams,
  createUpcomingExam,
  updateUpcomingExam,
  deleteUpcomingExam,
  getReminders,
  createReminder,
  deleteReminder,
  type UpcomingExam,
  type Reminder,
} from '@/lib/api';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, parseISO, differenceInDays } from 'date-fns';

// ─── Helpers ───────────────────────────────────────────────
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getRelativeDate(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return formatDate(dateStr);
  }
}

function getCountdownLabel(days: number | null): {
  label: string;
  className: string;
  urgent: boolean;
} {
  if (days === null || days === undefined)
    return { label: '—', className: 'text-muted-foreground', urgent: false };
  if (days === 0) return { label: 'Today!', className: 'text-red-600 font-bold', urgent: true };
  if (days === 1) return { label: 'Tomorrow', className: 'text-amber-600 font-semibold', urgent: true };
  if (days <= 7) return { label: `${days} days left`, className: 'text-red-600 font-semibold', urgent: true };
  if (days <= 30) return { label: `${days} days left`, className: 'text-amber-600 font-medium', urgent: false };
  return { label: `${days} days left`, className: 'text-emerald-600', urgent: false };
}

function getPriorityConfig(priority: string) {
  switch (priority) {
    case 'High':
      return {
        borderColor: 'border-l-red-500',
        bgClass: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
        badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-0',
        dotClass: 'bg-red-500',
        gradientFrom: 'from-red-600',
        gradientVia: 'via-red-700',
        gradientTo: 'to-orange-600',
        headerBg: 'bg-gradient-to-r from-red-500 to-red-600',
      };
    case 'Medium':
      return {
        borderColor: 'border-l-amber-500',
        bgClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
        badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-0',
        dotClass: 'bg-amber-500',
        gradientFrom: 'from-amber-600',
        gradientVia: 'via-amber-700',
        gradientTo: 'to-orange-600',
        headerBg: 'bg-gradient-to-r from-amber-500 to-amber-600',
      };
    case 'Low':
      return {
        borderColor: 'border-l-emerald-500',
        bgClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
        badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-0',
        dotClass: 'bg-emerald-500',
        gradientFrom: 'from-emerald-600',
        gradientVia: 'via-emerald-700',
        gradientTo: 'to-teal-600',
        headerBg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      };
    default:
      return {
        borderColor: 'border-l-muted',
        bgClass: 'bg-muted text-muted-foreground',
        badgeClass: 'bg-muted text-muted-foreground border-0',
        dotClass: 'bg-muted-foreground',
        gradientFrom: 'from-gray-600',
        gradientVia: 'via-gray-700',
        gradientTo: 'to-gray-600',
        headerBg: 'bg-gradient-to-r from-gray-500 to-gray-600',
      };
  }
}

function ApplicationProgress({ status }: { status: string }) {
  const steps = ['not-started', 'in-progress', 'completed'];
  const currentIndex = steps.indexOf(status);
  const labels = ['Not Started', 'In Progress', 'Completed'];

  return (
    <div className="flex items-center gap-1.5">
      {steps.map((step, idx) => (
        <div key={step} className="flex items-center gap-1.5">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'size-6 rounded-full flex items-center justify-center transition-all',
                idx < currentIndex
                  ? 'bg-emerald-500 text-white'
                  : idx === currentIndex
                  ? 'bg-amber-500 text-white'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {idx < currentIndex ? (
                <CheckCircle2 className="size-3.5" />
              ) : (
                <span className="text-[10px] font-bold">{idx + 1}</span>
              )}
            </div>
            <span className={cn(
              'text-[9px] leading-tight',
              idx === currentIndex ? 'font-medium text-foreground' : 'text-muted-foreground'
            )}>
              {labels[idx]}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={cn(
              'h-0.5 w-6 rounded-full mb-4',
              idx < currentIndex ? 'bg-emerald-400' : 'bg-muted'
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Add Reminder Dialog ────────────────────────────────────
function AddReminderDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', text: '', date: '' });

  const mutation = useMutation({
    mutationFn: (data: { name: string; text?: string; date: string }) =>
      createReminder(data),
    onSuccess: () => {
      toast.success('Reminder added!');
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      onOpenChange(false);
      setForm({ name: '', text: '', date: '' });
    },
    onError: () => toast.error('Failed to add reminder'),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Reminder</DialogTitle>
          <DialogDescription>Set a reminder for an important date</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="reminder-name">Title</Label>
            <Input
              id="reminder-name"
              placeholder="e.g. Submit SSC CGL application"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reminder-text">Note (optional)</Label>
            <Input
              id="reminder-text"
              placeholder="Additional details..."
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reminder-date">Date</Label>
            <Input
              id="reminder-date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            disabled={mutation.isPending || !form.name || !form.date}
            onClick={() => mutation.mutate({ name: form.name, text: form.text || undefined, date: form.date })}
          >
            {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Add Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Add/Edit Upcoming Exam Dialog ─────────────────────────
function UpcomingExamDialog({
  open,
  onOpenChange,
  editExam,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editExam: UpcomingExam | null;
}) {
  const queryClient = useQueryClient();
  const isEdit = editExam !== null;

  const [form, setForm] = useState(() =>
    editExam
      ? {
          name: editExam.name,
          org: editExam.org ?? '',
          priority: editExam.priority,
          examDate: new Date(editExam.examDate).toISOString().split('T')[0],
        }
      : { name: '', org: '', priority: 'Medium', examDate: '' },
  );

  const createMutation = useMutation({
    mutationFn: () =>
      createUpcomingExam({
        name: form.name,
        org: form.org || undefined,
        priority: form.priority,
        examDate: form.examDate,
      }),
    onSuccess: () => {
      toast.success('Upcoming exam added!');
      queryClient.invalidateQueries({ queryKey: ['upcoming-exams'] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Failed to save exam. Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateUpcomingExam(editExam!.id, {
        name: form.name,
        org: form.org || undefined,
        priority: form.priority,
        examDate: form.examDate,
      }),
    onSuccess: () => {
      toast.success('Exam updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['upcoming-exams'] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Failed to update exam. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (isEdit) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Upcoming Exam' : 'Add Upcoming Exam'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update exam details' : 'Track an upcoming exam to stay prepared'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="ue-name">Exam Name *</Label>
            <Input
              id="ue-name"
              placeholder="e.g. IBPS PO 2025"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ue-org">Organization (optional)</Label>
            <Input
              id="ue-org"
              placeholder="e.g. IBPS"
              value={form.org}
              onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label>Priority</Label>
            <Select
              value={form.priority}
              onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ue-date">Exam Date *</Label>
            <Input
              id="ue-date"
              type="date"
              value={form.examDate}
              onChange={(e) => setForm((f) => ({ ...f, examDate: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !form.name || !form.examDate}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : null}
            {isEdit ? 'Update' : 'Add Exam'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Upcoming Exams Page ───────────────────────────────────
export default function UpcomingExamsPage() {
  const queryClient = useQueryClient();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editExam, setEditExam] = useState<UpcomingExam | null>(null);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  // Update every minute for live countdowns
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const { data: upcomingExams, isLoading } = useQuery<UpcomingExam[]>({
    queryKey: ['upcoming-exams'],
    queryFn: () => getUpcomingExams(),
  });

  const { data: reminders } = useQuery<Reminder[]>({
    queryKey: ['reminders'],
    queryFn: getReminders,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUpcomingExam(id),
    onSuccess: () => {
      toast.success('Exam deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['upcoming-exams'] });
    },
    onError: () => {
      toast.error('Failed to delete exam.');
    },
  });

  const reminderMutation = useMutation({
    mutationFn: (data: { name: string; text?: string; date: string }) =>
      createReminder(data),
    onSuccess: () => {
      toast.success('Reminder set!');
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
    onError: () => {
      toast.error('Failed to set reminder.');
    },
  });

  const deleteReminderMutation = useMutation({
    mutationFn: (id: string) => deleteReminder(id),
    onSuccess: () => {
      toast.success('Reminder removed');
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
    onError: () => {
      toast.error('Failed to remove reminder.');
    },
  });

  const exams = upcomingExams ?? [];

  // Stats
  const stats = useMemo(() => {
    const completed = exams.filter(
      (e) => e.applicationStatus === 'completed',
    ).length;
    const inProgress = exams.filter(
      (e) => e.applicationStatus === 'in-progress',
    ).length;
    const notStarted = exams.filter(
      (e) => e.applicationStatus === 'not-started',
    ).length;
    return { completed, inProgress, notStarted };
  }, [exams]);

  // Timeline: next 5 exams
  const timeline = useMemo(() => exams.slice(0, 5), [exams]);

  // Nearest exam index
  const nearestIdx = useMemo(() => {
    if (timeline.length === 0) return -1;
    let minDays = Infinity;
    let minIdx = 0;
    timeline.forEach((e, idx) => {
      const d = e.daysLeft ?? Infinity;
      if (d >= 0 && d < minDays) {
        minDays = d;
        minIdx = idx;
      }
    });
    return minIdx;
  }, [timeline]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Upcoming Exams
          </h1>
          <p className="text-sm text-muted-foreground">
            Stay prepared and track your application progress
          </p>
        </div>
        <Button
          onClick={() => {
            setEditExam(null);
            setAddDialogOpen(true);
          }}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Plus className="mr-2 size-4" />
          Add Upcoming Exam
        </Button>
      </div>

      {/* Timeline - Enhanced */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exam Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-24 w-full rounded-lg" />
          ) : timeline.length > 0 ? (
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-border hidden sm:block" />
              <div className="flex items-start gap-0 overflow-x-auto pb-2 sm:justify-between">
                {timeline.map((exam, idx) => {
                  const pConfig = getPriorityConfig(exam.priority);
                  const countdown = getCountdownLabel(exam.daysLeft);
                  const isNearest = idx === nearestIdx;
                  return (
                    <div key={exam.id} className="flex flex-col items-center relative min-w-[100px] sm:min-w-0">
                      {/* Timeline dot - larger with priority color */}
                      <div className="relative z-10 mb-2">
                        {isNearest && (
                          <div className="absolute inset-0 rounded-full bg-red-400/40 animate-ping" />
                        )}
                        <div
                          className={cn(
                            'flex size-10 items-center justify-center rounded-full border-[3px] shadow-sm',
                            isNearest
                              ? 'border-red-400 bg-white dark:bg-gray-900 dark:border-red-500 shadow-red-200 dark:shadow-red-900/40 shadow-lg'
                              : `${pConfig.dotClass} border-white dark:border-gray-900`
                          )}
                        >
                          <CircleDot className={cn('size-4', isNearest ? 'text-red-500' : 'text-white')} />
                        </div>
                      </div>
                      {/* Exam name */}
                      <p className="text-xs font-semibold text-foreground text-center max-w-[120px] truncate mb-0.5">
                        {exam.name}
                      </p>
                      {/* Date */}
                      <p className="text-[10px] text-muted-foreground text-center mb-1">
                        {formatDate(exam.examDate)}
                      </p>
                      {/* Countdown badge */}
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] px-1.5 py-0 h-5',
                          isNearest && 'border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800'
                        )}
                      >
                        <Clock className={cn('size-2.5 mr-0.5', countdown.className)} />
                        <span className={countdown.className}>{countdown.label}</span>
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming exams. Add one to get started!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Application Overview */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completed}
          colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
        />
        <StatCard
          icon={Clock}
          label="In Progress"
          value={stats.inProgress}
          colorClass="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
        />
        <StatCard
          icon={ClipboardCheck}
          label="Not Started"
          value={stats.notStarted}
          colorClass="bg-muted text-muted-foreground"
        />
      </div>

      {/* Two column: Exam Cards + Reminders */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Exam Cards (2 cols) */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Your Exams
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[220px] w-full rounded-xl" />
              ))}
            </div>
          ) : exams.length > 0 ? (
            <div className="space-y-4">
              {exams.map((exam) => {
                const pConfig = getPriorityConfig(exam.priority);
                const countdown = getCountdownLabel(exam.daysLeft);
                const daysRemaining = exam.daysLeft ?? 0;
                const isNearest = exam.id === timeline[nearestIdx]?.id;

                return (
                  <Card
                    key={exam.id}
                    className={cn(
                      'overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg',
                    )}
                  >
                    {/* Gradient Header */}
                    <div className={cn('relative px-5 py-4', pConfig.headerBg, 'text-white')}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="relative flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex flex-col items-center">
                            <span className="text-3xl font-extrabold leading-none">
                              {daysRemaining}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider opacity-90 font-medium">
                              days left
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-lg truncate">{exam.name}</h3>
                            <p className="text-xs opacity-90">
                              {exam.org || 'Unknown'} &middot; {formatDate(exam.examDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isNearest && (
                            <Badge className="bg-white/20 text-white border-white/30 text-[10px]">
                              <span className="relative flex size-1.5 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                              </span>
                              Nearest
                            </Badge>
                          )}
                          <Badge className={cn('bg-white/20 text-white border-white/30', exam.priority)}>
                            {exam.priority}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8 text-white hover:bg-white/20 hover:text-white">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditExam(exam)}>
                                <Pencil className="mr-2 size-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  reminderMutation.mutate({
                                    name: `Reminder: ${exam.name}`,
                                    text: `Exam "${exam.name}" is coming up on ${formatDate(exam.examDate)}`,
                                    date: exam.examDate,
                                  });
                                }}
                              >
                                <Bell className="mr-2 size-4" />
                                Set Reminder
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={() => deleteMutation.mutate(exam.id)}
                              >
                                <Trash2 className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      {/* Application Status Progress */}
                      <div className="mb-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          Application Status
                        </p>
                        <ApplicationProgress status={exam.applicationStatus} />
                      </div>

                      {/* Details grid */}
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase text-muted-foreground">
                            Exam Date
                          </p>
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="size-3.5 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {formatDate(exam.examDate)}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase text-muted-foreground">
                            Admit Card
                          </p>
                          <div className="flex items-center gap-1.5">
                            {exam.admitCard ? (
                              <>
                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                  Ready
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="size-3.5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Not yet
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase text-muted-foreground">
                            Reflection
                          </p>
                          <div className="flex items-center gap-1.5">
                            {exam.hasReflection ? (
                              <>
                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                  Done
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="size-3.5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Pending
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <ExternalLink className="mr-1.5 size-3.5" />
                          View Details
                        </Button>
                        {exam.applicationStatus === 'not-started' && (
                          <Button
                            size="sm"
                            className="bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                          >
                            Apply Now
                            <ArrowRight className="ml-1.5 size-3.5" />
                          </Button>
                        )}
                        {exam.applicationStatus === 'in-progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-amber-300 text-amber-700 text-xs hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/30"
                          >
                            <Clock className="mr-1.5 size-3.5" />
                            Continue Form
                          </Button>
                        )}
                        {exam.admitCard && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-emerald-300 text-emerald-700 text-xs hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                          >
                            <FileDown className="mr-1.5 size-3.5" />
                            Download Admit Card
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
              <CalendarClock className="mb-3 size-10 text-muted-foreground/40" />
              <p className="font-medium text-muted-foreground">
                No upcoming exams
              </p>
              <p className="mt-1 text-sm text-muted-foreground/60">
                Add an upcoming exam to start tracking your preparation.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setEditExam(null);
                  setAddDialogOpen(true);
                }}
              >
                <Plus className="mr-2 size-4" />
                Add Upcoming Exam
              </Button>
            </div>
          )}
        </div>

        {/* Reminders Sidebar (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Important Reminders
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="size-7 p-0"
              onClick={() => setReminderDialogOpen(true)}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
          <Card>
            <CardContent className="space-y-3 p-4 max-h-96 overflow-y-auto">
              {reminders && reminders.length > 0 ? (
                <>
                  {reminders.slice(0, 8).map((reminder) => {
                    const daysUntil = differenceInDays(parseISO(reminder.date), now);
                    const isUrgent = daysUntil >= 0 && daysUntil <= 3;
                    const isPast = daysUntil < 0;

                    return (
                      <div
                        key={reminder.id}
                        className={cn(
                          'group flex items-start gap-2 rounded-lg border p-2.5 transition-all cursor-pointer hover:bg-muted/50',
                          isUrgent && 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20',
                          isPast && 'opacity-60',
                        )}
                      >
                        <div
                          className={cn(
                            'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full',
                            reminder.isRead
                              ? 'bg-muted'
                              : isUrgent
                              ? 'bg-amber-100 dark:bg-amber-900/40'
                              : 'bg-emerald-100 dark:bg-emerald-900/40'
                          )}
                        >
                          <Bell
                            className={cn(
                              'size-3.5',
                              reminder.isRead
                                ? 'text-muted-foreground'
                                : isUrgent
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {reminder.name}
                          </p>
                          {reminder.text && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {reminder.text}
                            </p>
                          )}
                          <p className={cn(
                            'mt-1 text-[10px] font-medium',
                            isUrgent ? 'text-amber-600 dark:text-amber-400' :
                            isPast ? 'text-muted-foreground/50' :
                            'text-muted-foreground'
                          )}>
                            {getRelativeDate(reminder.date)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          onClick={() => deleteReminderMutation.mutate(reminder.id)}
                        >
                          <X className="size-3 text-muted-foreground" />
                        </Button>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <Bell className="mb-2 size-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No reminders set
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Click + to add a reminder.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Tip */}
          <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
            <CardContent className="flex items-start gap-3 p-4">
              <Lightbulb className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  Pro Tip
                </p>
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                  Set reminders 1 week before each exam to plan your last-minute
                  revision effectively.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <UpcomingExamDialog
        key={editExam?.id ?? 'add'}
        open={addDialogOpen || editExam !== null}
        onOpenChange={(open) => {
          if (!open) {
            setAddDialogOpen(false);
            setEditExam(null);
          }
        }}
        editExam={editExam}
      />

      {/* Add Reminder Dialog */}
      <AddReminderDialog
        open={reminderDialogOpen}
        onOpenChange={setReminderDialogOpen}
      />
    </div>
  );
}
