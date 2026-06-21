'use client';

import { useState } from 'react';
import {
  Target, Plus, CheckCircle2, Clock, AlertTriangle, TrendingUp, Calendar,
  Star, ChevronRight, MoreHorizontal, Pencil, Trash2, Sparkles, Zap, BookOpen,
  Flame, Lightbulb, X,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from 'date-fns';
import {
  getGoals, getGoalStats, getGoalStreak, getGoalTemplates,
  createGoal, updateGoal, completeGoal, deleteGoal,
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

const priorityConfig: Record<string, { color: string; badge: string }> = {
  high: { color: 'border-l-red-500', badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  medium: { color: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  low: { color: 'border-l-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
};

export default function GoalsPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [progressValue, setProgressValue] = useState(50);

  // Form state
  const [form, setForm] = useState({ title: '', priority: 'medium', linkedExam: '', subject: '', dueDate: '', description: '' });
  const resetForm = () => setForm({ title: '', priority: 'medium', linkedExam: '', subject: '', dueDate: '', description: '' });

  // Queries
  const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ['goalStats'], queryFn: getGoalStats });
  const { data: activeGoals, isLoading: activeLoading } = useQuery({ queryKey: ['goals', 'active'], queryFn: () => getGoals({ status: 'active' }) });
  const { data: completedGoals, isLoading: completedLoading } = useQuery({ queryKey: ['goals', 'completed'], queryFn: () => getGoals({ status: 'completed' }) });
  const { data: streak } = useQuery({ queryKey: ['goalStreak'], queryFn: getGoalStreak });
  const { data: templates } = useQuery({ queryKey: ['goalTemplates'], queryFn: getGoalTemplates });

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
    mutationFn: completeGoal,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['goals'] }); queryClient.invalidateQueries({ queryKey: ['goalStats'] }); toast.success('Goal completed! 🎉'); },
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
    createMutation.mutate(form);
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
  const suggestions = [
    'Break large goals into smaller weekly targets',
    'Review your study schedule and adjust timelines',
    'Focus on overdue goals first for quick wins',
  ];

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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Goal Templates</DialogTitle>
              <DialogDescription>Choose a template to get started quickly</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-64 overflow-y-auto mt-2">
              {templates?.map((t, i) => (
                <Card key={i} className="cursor-pointer hover:border-emerald-500 transition-colors" onClick={() => applyTemplate(t)}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <Zap className="size-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{t.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                      <div className="flex gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-xs">{t.subject}</Badge>
                        <Badge className={cn('text-xs', priorityConfig[t.priority]?.badge)}>{t.priority}</Badge>
                      </div>
                    </div>
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
                <Label>Title *</Label>
                <Input className="mt-1.5" placeholder="e.g. Complete Quant chapter 5" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm(f => ({ ...f, priority: v }))}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Linked Exam</Label>
                  <Input className="mt-1.5" placeholder="e.g. CAT 2025" value={form.linkedExam} onChange={(e) => setForm(f => ({ ...f, linkedExam: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Subject</Label>
                  <Input className="mt-1.5" placeholder="e.g. Mathematics" value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input type="date" className="mt-1.5" value={form.dueDate} onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea className="mt-1.5" rows={3} placeholder="Describe your goal..." value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleCreate} disabled={createMutation.isPending}>
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
          {stats?.nextDue && (
            <Card className="border-emerald-500/50 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <Zap className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Today's Focus</p>
                    <p className="text-sm font-semibold">{stats.nextDue.title}</p>
                  </div>
                </div>
                <ProgressBar percent={stats.nextDue.progress} color="bg-emerald-600 dark:bg-emerald-500" showValue className="mb-3" />
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => completeMutation.mutate(stats.nextDue.id)} disabled={completeMutation.isPending}>
                  <CheckCircle2 className="size-4 mr-1.5" /> Mark Complete
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
                return (
                  <Card key={goal.id} className={cn('border-l-4', pc.color)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{goal.title}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <Badge className={cn('text-xs', pc.badge)}>{goal.priority}</Badge>
                            {goal.status && <Badge variant="outline" className="text-xs">{goal.status}</Badge>}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 shrink-0">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(goal)}><Pencil className="size-4 mr-2" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteMutation.mutate(goal.id)} className="text-red-600"><Trash2 className="size-4 mr-2" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground mb-3">
                        {goal.linkedExam && <p className="flex items-center gap-1"><BookOpen className="size-3" />{goal.linkedExam}</p>}
                        {goal.subject && <p>{goal.subject}</p>}
                        {goal.dueDate && (
                          <p className={cn(isOverdue ? 'text-red-600 font-medium' : '')}>
                            <Calendar className="size-3 inline mr-1" />
                            {isOverdue ? 'Overdue: ' : 'Due: '}{format(parseISO(goal.dueDate), 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>

                      <ProgressBar percent={goal.progress} showValue className="mb-3" />

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => openProgress(goal)}>
                          Update Progress
                        </Button>
                        <Button size="sm" className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700" onClick={() => completeMutation.mutate(goal.id)}>
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
              <CheckCircle2 className="size-5 text-teal-600" /> Completed Goals
              <Badge variant="secondary" className="ml-1">{completedGoals?.length ?? 0}</Badge>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {completedGoals?.map((goal) => (
                <Card key={goal.id} className="opacity-80">
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
                  No completed goals yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="size-4 text-amber-500" /> Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeGoals?.filter(g => g.dueDate).sort((a, b) => a.dueDate!.localeCompare(b.dueDate!)).slice(0, 3).map((g) => (
                <div key={g.id} className="flex items-center justify-between">
                  <span className="text-sm truncate mr-2">{g.title}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(parseISO(g.dueDate!), { addSuffix: true })}
                  </span>
                </div>
              )) || <p className="text-sm text-muted-foreground">No upcoming deadlines</p>}
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

          {/* Study Streak */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Flame className="size-4 text-orange-500" /> Study Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold">{streak?.currentStreak ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Current streak</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{streak?.longestStreak ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Longest streak</p>
                </div>
              </div>
              <div className="flex gap-1.5 justify-center">
                {weekDots.split('').map((d, i) => (
                  <div key={i} className={cn('size-3 rounded-full', d === '1' ? 'bg-emerald-500' : 'bg-muted')} title={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]} />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">M</span>
                <span className="text-[10px] text-muted-foreground">T</span>
                <span className="text-[10px] text-muted-foreground">W</span>
                <span className="text-[10px] text-muted-foreground">T</span>
                <span className="text-[10px] text-muted-foreground">F</span>
                <span className="text-[10px] text-muted-foreground">S</span>
                <span className="text-[10px] text-muted-foreground">S</span>
              </div>
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
              {suggestions.map((s, i) => (
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
              <Label>Title *</Label>
              <Input className="mt-1.5" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Linked Exam</Label>
                <Input className="mt-1.5" value={form.linkedExam} onChange={(e) => setForm(f => ({ ...f, linkedExam: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Subject</Label>
                <Input className="mt-1.5" value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" className="mt-1.5" value={form.dueDate} onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea className="mt-1.5" rows={3} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
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
              <span className="text-4xl font-bold text-emerald-600">{progressValue}%</span>
            </div>
            <Slider value={[progressValue]} min={0} max={100} step={5} onValueChange={(v) => setProgressValue(v[0])} />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">0%</span>
              <span className="text-xs text-muted-foreground">100%</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProgressOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => selectedGoal && progressMutation.mutate({ id: selectedGoal.id, progress: progressValue })} disabled={progressMutation.isPending}>
              {progressMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
