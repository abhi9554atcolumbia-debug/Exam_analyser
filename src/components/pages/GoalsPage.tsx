'use client';

import { useState } from 'react';
import {
  Target, Plus, CheckCircle2, Clock, AlertTriangle, TrendingUp, Calendar,
  Star, ChevronRight, MoreHorizontal, Pencil, Trash2, Sparkles, Zap, BookOpen,
  Flame, Lightbulb, X, Trophy, Rocket, PartyPopper,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format, formatDistanceToNow, differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';
import {
  getGoals, getGoalStats, getGoalStreak, getGoalTemplates,
  createGoal, updateGoal, completeGoal, deleteGoal, getUpcomingExams,
  type Goal,
} from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const priorityConfig: Record<string, { color: string; badge: string; dot: string }> = {
  high: { color: 'border-l-red-500', badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', dot: 'bg-red-500' },
  medium: { color: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', dot: 'bg-amber-500' },
  low: { color: 'border-l-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', dot: 'bg-emerald-500' },
};

const DEFAULT_TEMPLATES = [
  { title: 'Daily Quant Practice', description: 'Solve 30+ quantitative aptitude questions daily covering all major topics', subject: 'Quantitative Aptitude', priority: 'high' },
  { title: 'Weekly Mock Test', description: 'Take a full-length mock test every weekend and analyze your performance', subject: 'All Sections', priority: 'medium' },
  { title: 'Current Affairs Revision', description: 'Stay updated with daily current affairs and revise weekly compilations', subject: 'General Awareness', priority: 'high' },
  { title: 'English Vocabulary 500', description: 'Learn 500 new English words with meanings, synonyms, and antonyms', subject: 'English Language', priority: 'medium' },
  { title: 'Reasoning Puzzle Practice', description: 'Practice 10+ complex puzzles daily including seating, scheduling, and coding-decoding', subject: 'Reasoning Ability', priority: 'medium' },
  { title: 'Complete Syllabus Revision', description: 'Systematically revise all subjects with focus on weak areas and important formulas', subject: 'All Sections', priority: 'high' },
  { title: 'Sectional Test Daily', description: 'Take one sectional test daily rotating through all exam sections', subject: 'All Sections', priority: 'medium' },
  { title: 'Weak Area Focus', description: 'Identify and strengthen 2-3 weak topics per week with dedicated practice sessions', subject: 'Various', priority: 'high' },
];

function getDueCountdown(dueDate: string | null): { text: string; urgent: boolean } | null {
  if (!dueDate) return null;
  const days = differenceInDays(parseISO(dueDate), new Date());
  if (days < 0) return { text: `Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`, urgent: true };
  if (days === 0) return { text: 'Due today', urgent: true };
  if (days === 1) return { text: 'Due tomorrow', urgent: true };
  if (days <= 7) return { text: `Due in ${days} days`, urgent: true };
  return { text: `Due in ${days} days`, urgent: false };
}

function CelebrationOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
          <div className="relative size-20 rounded-full bg-emerald-500 flex items-center justify-center">
            <PartyPopper className="size-10 text-white" />
          </div>
        </div>
        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 animate-in slide-in-from-bottom-4 duration-500">
          Goal Completed! 🎉
        </p>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [progressValue, setProgressValue] = useState(50);
  const [celebratingId, setCelebratingId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({ title: '', priority: 'medium', linkedExam: '', subject: '', dueDate: '', description: '' });
  const resetForm = () => setForm({ title: '', priority: 'medium', linkedExam: '', subject: '', dueDate: '', description: '' });

  // Queries
  const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ['goalStats'], queryFn: getGoalStats });
  const { data: activeGoals, isLoading: activeLoading } = useQuery({ queryKey: ['goals', 'active'], queryFn: () => getGoals({ status: 'active' }) });
  const { data: completedGoals, isLoading: completedLoading } = useQuery({ queryKey: ['goals', 'completed'], queryFn: () => getGoals({ status: 'completed' }) });
  const { data: streak } = useQuery({ queryKey: ['goalStreak'], queryFn: getGoalStreak });
  const { data: templates } = useQuery({ queryKey: ['goalTemplates'], queryFn: getGoalTemplates });
  const { data: upcomingExams } = useQuery({ queryKey: ['upcomingExams'], queryFn: () => getUpcomingExams() });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['goals'] }); queryClient.invalidateQueries({ queryKey: ['goalStats'] }); setCreateOpen(false); resetForm(); toast.success('Goal created!'); },
    onError: () => toast.error('Failed to create goal'),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Goal> }) => updateGoal(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['goals'] }); queryClient.invalidateQueries({ queryKey: ['goalStats'] }); setEditOpen(false); resetForm(); toast.success('Goal updated!'); },
    onError: () => toast.error('Failed to update goal'),
  });
  const completeMutation = useMutation({
    mutationFn: (goalId: string) => completeGoal(goalId),
    onSuccess: (_data, goalId) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goalStats'] });
      toast.success('Goal completed! 🎉');
      setCelebratingId(goalId);
      setTimeout(() => setCelebratingId(null), 2500);
    },
    onError: () => toast.error('Failed to complete goal'),
  });
  const progressMutation = useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) => updateGoal(id, { progress }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['goals'] }); setProgressOpen(false); toast.success('Progress updated!'); },
    onError: () => toast.error('Failed to update progress'),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['goals'] }); queryClient.invalidateQueries({ queryKey: ['goalStats'] }); toast.success('Goal deleted'); },
    onError: () => toast.error('Failed to delete goal'),
  });

  const handleCreate = () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.dueDate) { toast.error('Due date is required'); return; }
    createMutation.mutate({
      title: form.title,
      priority: form.priority,
      linkedExam: form.linkedExam || undefined,
      subject: form.subject || undefined,
      dueDate: form.dueDate,
      description: form.description || undefined,
    });
  };

  const handleEdit = () => {
    if (!selectedGoal || !form.title.trim()) { toast.error('Title is required'); return; }
    updateMutation.mutate({ id: selectedGoal.id, data: form });
  };

  const openEdit = (goal: Goal) => {
    setSelectedGoal(goal);
    setForm({ title: goal.title, priority: goal.priority, linkedExam: goal.linkedExam || '', subject: goal.subject || '', dueDate: goal.dueDate || '', description: goal.description || '' });
    setEditOpen(true);
  };

  const openProgress = (goal: Goal) => {
    setSelectedGoal(goal);
    setProgressValue(goal.progress);
    setProgressOpen(true);
  };

  const applyTemplate = (t: { title: string; description: string; subject: string; priority: string }) => {
    setForm(f => ({ ...f, title: t.title, description: t.description, subject: t.subject, priority: t.priority }));
    setTemplatesOpen(false);
    setCreateOpen(true);
  };

  const completionRate = stats ? (stats.active + stats.completed > 0 ? Math.round((stats.completed / (stats.active + stats.completed)) * 100) : 0) : 0;
  const weekDots = streak?.weekDots || '0000000';
  const allTemplates = templates && templates.length > 0 ? templates : DEFAULT_TEMPLATES;

  if (statsLoading || activeLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-32 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Celebration Overlay */}
      <CelebrationOverlay show={!!celebratingId} />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Goals</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              <Target className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold">{stats?.active ?? 0}</div>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
              <CheckCircle2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold">{stats?.completed ?? 0}</div>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
              <AlertTriangle className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold">{stats?.overdue ?? 0}</div>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold">{completionRate}%</div>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0 col-span-2 sm:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Goal Due</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-lg font-bold truncate">
              {stats?.nextDue ? formatDistanceToNow(parseISO(stats.nextDue.dueDate!), { addSuffix: true }) : '—'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Sparkles className="size-4" /> Goal Templates
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh]">
            <DialogHeader>
              <DialogTitle>Goal Templates</DialogTitle>
              <DialogDescription>Choose a template to get started quickly</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-[55vh] overflow-y-auto mt-2 pr-1">
              {allTemplates.map((t, i) => (
                <Card key={i} className="cursor-pointer hover:border-emerald-500 transition-all hover:shadow-sm" onClick={() => applyTemplate(t)}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-lg mt-0.5',
                      t.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' :
                      t.priority === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' :
                      'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                    )}>
                      <Zap className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{t.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{t.description}</p>
                      <div className="flex gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-xs">{t.subject}</Badge>
                        <Badge className={cn('text-xs', priorityConfig[t.priority]?.badge)}>{t.priority}</Badge>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="size-4" /> New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>Set a new study goal to track your progress</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label htmlFor="goal-title">Title *</Label>
                <Input id="goal-title" className="mt-1.5" placeholder="e.g. Complete Quant chapter 5" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
                {!form.title.trim() && (
                  <p className="text-xs text-red-500 mt-1">Title is required</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goal-priority">Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm(f => ({ ...f, priority: v }))}>
                    <SelectTrigger id="goal-priority" className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="goal-exam">Linked Exam</Label>
                  <Select value={form.linkedExam} onValueChange={(v) => setForm(f => ({ ...f, linkedExam: v }))}>
                    <SelectTrigger id="goal-exam" className="mt-1.5">
                      <SelectValue placeholder="Select exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {upcomingExams?.map((exam) => (
                        <SelectItem key={exam.id} value={exam.name}>{exam.name}</SelectItem>
                      ))}
                      {(!upcomingExams || upcomingExams.length === 0) && (
                        <SelectItem value="custom" disabled>No exams available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goal-subject">Subject</Label>
                  <Input id="goal-subject" className="mt-1.5" placeholder="e.g. Mathematics" value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="goal-due">Due Date *</Label>
                  <Input id="goal-due" type="date" className="mt-1.5" value={form.dueDate} onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                  {!form.dueDate && (
                    <p className="text-xs text-red-500 mt-1">Due date is required</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="goal-desc">Description</Label>
                <Textarea id="goal-desc" className="mt-1.5" rows={3} placeholder="Describe your goal..." value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleCreate} disabled={createMutation.isPending || !form.title.trim() || !form.dueDate}>
                {createMutation.isPending ? 'Creating...' : 'Create Goal'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Goals List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Focus */}
          {stats?.nextDue ? (
            <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-[1px]">
              <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
                    <Rocket className="size-5" />
                    <span className="absolute -top-0.5 -right-0.5 flex size-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex size-3 rounded-full bg-white" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Today&apos;s Focus</p>
                    <p className="text-base font-bold text-emerald-900 dark:text-emerald-100 truncate">{stats.nextDue.title}</p>
                  </div>
                  {stats.nextDue.subject && (
                    <Badge className="bg-emerald-200/80 text-emerald-800 dark:bg-emerald-800/60 dark:text-emerald-200 text-xs border-0">
                      {stats.nextDue.subject}
                    </Badge>
                  )}
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Progress</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{stats.nextDue.progress}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-emerald-200 dark:bg-emerald-900/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-700 ease-out"
                      style={{ width: `${stats.nextDue.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                    onClick={() => completeMutation.mutate(stats.nextDue!.id)}
                    disabled={completeMutation.isPending}
                  >
                    <CheckCircle2 className="size-4 mr-1.5" /> Mark Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
                    onClick={() => openProgress(stats.nextDue!)}
                  >
                    Update Progress
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Card className="border-dashed border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="size-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-3">
                  <Rocket className="size-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="font-semibold text-emerald-800 dark:text-emerald-200">No active goals yet</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Start your journey by creating a goal. Every step counts towards your dream career!
                </p>
                <Button
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus className="size-4 mr-1.5" /> Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Active Goals */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="size-5 text-emerald-600" /> Active Goals
              <Badge variant="secondary" className="ml-1">{activeGoals?.length ?? 0}</Badge>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeGoals?.map((goal) => {
                const pc = priorityConfig[goal.priority] || priorityConfig.medium;
                const isOverdue = goal.dueDate && isBefore(parseISO(goal.dueDate), new Date());
                const countdown = getDueCountdown(goal.dueDate);
                return (
                  <Card
                    key={goal.id}
                    className={cn(
                      'border-l-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                      pc.color,
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{goal.title}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <Badge className={cn('text-xs', pc.badge)}>{goal.priority}</Badge>
                            {goal.subject && <Badge variant="outline" className="text-xs">{goal.subject}</Badge>}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 shrink-0">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openProgress(goal)}>
                              <TrendingUp className="size-4 mr-2" />Update Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(goal)}>
                              <Pencil className="size-4 mr-2" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteMutation.mutate(goal.id)} className="text-red-600">
                              <Trash2 className="size-4 mr-2" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground mb-3">
                        {goal.linkedExam && <p className="flex items-center gap-1"><BookOpen className="size-3" />{goal.linkedExam}</p>}
                        {goal.dueDate && (
                          <p className={cn(isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : '')}>
                            <Calendar className="size-3 inline mr-1" />
                            {format(parseISO(goal.dueDate), 'MMM d, yyyy')}
                          </p>
                        )}
                        {countdown && (
                          <p className={cn(
                            countdown.urgent
                              ? 'text-amber-600 dark:text-amber-400 font-medium'
                              : 'text-muted-foreground'
                          )}>
                            <Clock className="size-3 inline mr-1" />
                            {countdown.text}
                          </p>
                        )}
                      </div>

                      <ProgressBar percent={goal.progress} showValue className="mb-3" />

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => openProgress(goal)}>
                          <TrendingUp className="size-3 mr-1" /> Update Progress
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => completeMutation.mutate(goal.id)}
                          disabled={completeMutation.isPending}
                        >
                          <CheckCircle2 className="size-3 mr-1" /> Complete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {(!activeGoals || activeGoals.length === 0) && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <Target className="size-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No active goals. Create one to get started!</p>
                </div>
              )}
            </div>
          </div>

          {/* Completed Goals */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="size-5 text-amber-500" /> Completed Goals
              <Badge variant="secondary" className="ml-1">{completedGoals?.length ?? 0}</Badge>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {completedGoals?.map((goal) => (
                <Card key={goal.id} className="opacity-80 hover:opacity-100 transition-opacity">
                  <CardContent className="p-3 flex items-start gap-2">
                    <CheckCircle2 className="size-5 text-teal-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{goal.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {goal.completedAt ? format(parseISO(goal.completedAt), 'MMM d') : 'Done'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!completedGoals || completedGoals.length === 0) && (
                <div className="col-span-full text-center py-6 text-muted-foreground text-sm">
                  No completed goals yet. Keep going!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Study Streak - Prominent */}
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex size-9 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/40">
                  <Flame className="size-5 text-orange-500" />
                </div>
                <CardTitle className="text-sm font-semibold">Study Streak</CardTitle>
              </div>
              <div className="text-center mb-4">
                <p className="text-5xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                  {streak?.currentStreak ?? 0}
                </p>
                <p className="text-sm font-medium text-muted-foreground mt-1">day streak</p>
              </div>
              <div className="flex gap-2.5 justify-center mb-3">
                {weekDots.split('').map((d, i) => (
                  <div
                    key={i}
                    className={cn(
                      'size-5 rounded-full transition-all',
                      d === '1'
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30'
                        : 'bg-gray-200 dark:bg-gray-700'
                    )}
                    title={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  />
                ))}
              </div>
              <div className="flex justify-between px-1 mb-4">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <span key={i} className="text-[10px] text-muted-foreground w-5 text-center">{d}</span>
                ))}
              </div>
              <Separator className="mb-3" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Longest streak</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {streak?.longestStreak ?? 0} days
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="size-4 text-amber-500" /> Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeGoals?.filter(g => g.dueDate).sort((a, b) => a.dueDate!.localeCompare(b.dueDate!)).slice(0, 3).map((g) => {
                const cd = getDueCountdown(g.dueDate);
                return (
                  <div key={g.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={cn('size-2 rounded-full shrink-0', priorityConfig[g.priority]?.dot)} />
                      <span className="text-sm truncate">{g.title}</span>
                    </div>
                    <span className={cn('text-xs whitespace-nowrap', cd?.urgent ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-muted-foreground')}>
                      {cd?.text ?? '—'}
                    </span>
                  </div>
                );
              }) || <p className="text-sm text-muted-foreground">No upcoming deadlines</p>}
            </CardContent>
          </Card>

          {/* Priority Goals */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="size-4 text-red-500" /> Priority Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeGoals?.filter(g => g.priority === 'high').slice(0, 3).map((g) => (
                <div key={g.id} className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-red-500 shrink-0" />
                  <span className="text-sm truncate">{g.title}</span>
                </div>
              )) || <p className="text-sm text-muted-foreground">No high priority goals</p>}
            </CardContent>
          </Card>

          {/* Smart Suggestions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Lightbulb className="size-4 text-amber-500" /> Smart Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                'Break large goals into smaller weekly targets',
                'Review your study schedule and adjust timelines',
                'Focus on overdue goals first for quick wins',
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Star className="size-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">{s}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Goal Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>Update your goal details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input id="edit-title" className="mt-1.5" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger id="edit-priority" className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-exam">Linked Exam</Label>
                <Select value={form.linkedExam} onValueChange={(v) => setForm(f => ({ ...f, linkedExam: v }))}>
                  <SelectTrigger id="edit-exam" className="mt-1.5">
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {upcomingExams?.map((exam) => (
                      <SelectItem key={exam.id} value={exam.name}>{exam.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-subject">Subject</Label>
                <Input id="edit-subject" className="mt-1.5" value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="edit-due">Due Date</Label>
                <Input id="edit-due" type="date" className="mt-1.5" value={form.dueDate} onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea id="edit-desc" className="mt-1.5" rows={3} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Progress Dialog */}
      <Dialog open={progressOpen} onOpenChange={setProgressOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Progress</DialogTitle>
            <DialogDescription>Adjust the progress for &ldquo;{selectedGoal?.title}&rdquo;</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <span className="text-5xl font-extrabold text-emerald-600 dark:text-emerald-400">{progressValue}%</span>
                {progressValue === 100 && (
                  <Trophy className="size-6 text-amber-500 absolute -top-2 -right-6" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {progressValue === 0 && 'Just getting started!'}
                {progressValue > 0 && progressValue < 25 && 'Great start, keep going!'}
                {progressValue >= 25 && progressValue < 50 && 'Making solid progress!'}
                {progressValue >= 50 && progressValue < 75 && 'You\'re halfway there!'}
                {progressValue >= 75 && progressValue < 100 && 'Almost there, finish strong!'}
                {progressValue === 100 && 'Ready to mark complete! 🎉'}
              </p>
            </div>
            <Slider
              value={[progressValue]}
              min={0}
              max={100}
              step={5}
              onValueChange={(v) => setProgressValue(v[0])}
              className="mb-2"
            />
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">0%</span>
              <span className="text-xs text-muted-foreground">100%</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProgressOpen(false)}>Cancel</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => selectedGoal && progressMutation.mutate({ id: selectedGoal.id, progress: progressValue })}
              disabled={progressMutation.isPending}
            >
              {progressMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
