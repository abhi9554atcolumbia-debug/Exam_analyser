'use client';

import { useState, useMemo } from 'react';
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
  type UpcomingExam,
  type Reminder,
} from '@/lib/api';

// ─── Helpers ───────────────────────────────────────────────
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getCountdownLabel(days: number | null): {
  label: string;
  className: string;
} {
  if (days === null || days === undefined)
    return { label: '—', className: 'text-muted-foreground' };
  if (days === 0) return { label: 'Today!', className: 'text-red-600 font-bold' };
  if (days === 1) return { label: 'Tomorrow', className: 'text-amber-600 font-semibold' };
  if (days <= 7) return { label: `${days} days`, className: 'text-red-600 font-semibold' };
  if (days <= 30) return { label: `${days} days`, className: 'text-amber-600 font-medium' };
  return { label: `${days} days`, className: 'text-emerald-600' };
}

function getPriorityConfig(priority: string) {
  switch (priority) {
    case 'High':
      return {
        borderColor: 'border-l-red-500',
        bgClass: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
        badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
      };
    case 'Medium':
      return {
        borderColor: 'border-l-amber-500',
        bgClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
        badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      };
    case 'Low':
      return {
        borderColor: 'border-l-emerald-500',
        bgClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
        badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
      };
    default:
      return {
        borderColor: 'border-l-muted',
        bgClass: 'bg-muted text-muted-foreground',
        badgeClass: 'bg-muted text-muted-foreground',
      };
  }
}

function getAppStatusBadge(appStatus: string) {
  switch (appStatus) {
    case 'completed':
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
          Completed
        </Badge>
      );
    case 'in-progress':
      return (
        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
          In Progress
        </Badge>
      );
    case 'not-started':
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Not Started
        </Badge>
      );
    default:
      return <Badge variant="outline">{appStatus}</Badge>;
  }
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
      toast.success(
        isEdit ? 'Exam updated successfully!' : 'Upcoming exam added!',
      );
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
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="ue-name">Exam Name</Label>
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
            <Label htmlFor="ue-date">Exam Date</Label>
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

  // Timeline: next 4 exams
  const timeline = useMemo(() => exams.slice(0, 4), [exams]);

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

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-16 w-full rounded-lg" />
          ) : timeline.length > 0 ? (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {timeline.map((exam, idx) => {
                const countdown = getCountdownLabel(exam.daysLeft);
                const isLast = idx === timeline.length - 1;
                return (
                  <div key={exam.id} className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5 min-w-[120px]">
                      <div
                        className={`flex size-10 items-center justify-center rounded-full border-2 ${
                          (exam.daysLeft ?? 99) <= 7
                            ? 'border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-950/40'
                            : 'border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40'
                        }`}
                      >
                        <CircleDot className="size-4" />
                      </div>
                      <p className="text-xs font-semibold text-foreground text-center max-w-[120px] truncate">
                        {exam.name}
                      </p>
                      <span className={`text-xs font-medium ${countdown.className}`}>
                        {countdown.label}
                      </span>
                    </div>
                    {!isLast && (
                      <div className="mx-1 h-0.5 w-8 bg-border flex-shrink-0" />
                    )}
                  </div>
                );
              })}
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
                <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
              ))}
            </div>
          ) : exams.length > 0 ? (
            <div className="space-y-4">
              {exams.map((exam) => {
                const priorityConfig = getPriorityConfig(exam.priority);
                const countdown = getCountdownLabel(exam.daysLeft);

                return (
                  <Card
                    key={exam.id}
                    className={`border-l-4 ${priorityConfig.borderColor} transition-all hover:shadow-md`}
                  >
                    <CardContent className="p-4">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <span
                              className={`text-3xl font-bold ${countdown.className}`}
                            >
                              {exam.daysLeft ?? '—'}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase">
                              days
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {exam.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {exam.org || 'Unknown'} · {formatDate(exam.examDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={priorityConfig.badgeClass}>
                            {exam.priority}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setEditExam(exam)}
                              >
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

                      <Separator className="my-3" />

                      {/* Details grid */}
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                                  Available
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
                            Application
                          </p>
                          {getAppStatusBadge(exam.applicationStatus)}
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase text-muted-foreground">
                            Reflection
                          </p>
                          <div className="flex items-center gap-1.5">
                            {exam.hasReflection ? (
                              <>
                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm text-emerald-600 dark:text-emerald-400">
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

                      <Separator className="my-3" />

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
                          <Button variant="outline" size="sm" className="text-xs">
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
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Important Reminders
          </h2>
          <Card>
            <CardContent className="space-y-3 p-4">
              {reminders && reminders.length > 0 ? (
                <>
                  {reminders.slice(0, 8).map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-start gap-2 rounded-lg border p-2.5 transition-colors hover:bg-muted/50"
                    >
                      <div
                        className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${
                          reminder.isRead
                            ? 'bg-muted'
                            : 'bg-emerald-100 dark:bg-emerald-900/40'
                        }`}
                      >
                        <Bell
                          className={`size-3.5 ${
                            reminder.isRead
                              ? 'text-muted-foreground'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {reminder.name}
                        </p>
                        {reminder.text && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {reminder.text}
                          </p>
                        )}
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {formatDate(reminder.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <Bell className="mb-2 size-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No reminders set
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Set reminders from the exam dropdown menu.
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

      {/* Add/Edit Dialog - key forces remount when switching between add/edit */}
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
    </div>
  );
}


