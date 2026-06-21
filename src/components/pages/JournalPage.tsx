'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Clock,
  Tag,
  ChevronDown,
  ChevronUp,
  Flame,
  BarChart3,
  SmilePlus,
  BookOpenCheck,
  CalendarDays,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  type JournalEntry as JournalEntryType,
} from '@/lib/api';

// ─── Mood Config ───────────────────────────────────────────────
const MOODS = [
  { key: 'happy', label: 'Happy', emoji: '😊', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800', ring: 'ring-emerald-500' },
  { key: 'motivated', label: 'Motivated', emoji: '💪', color: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800', ring: 'ring-teal-500' },
  { key: 'tired', label: 'Tired', emoji: '😴', color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800', ring: 'ring-amber-500' },
  { key: 'anxious', label: 'Anxious', emoji: '😰', color: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800', ring: 'ring-rose-500' },
  { key: 'neutral', label: 'Neutral', emoji: '😐', color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700', ring: 'ring-slate-500' },
  { key: 'frustrated', label: 'Frustrated', emoji: '😤', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800', ring: 'ring-red-500' },
] as const;

function getMoodConfig(mood: string) {
  return MOODS.find((m) => m.key === mood) ?? MOODS[4];
}

// ─── Helpers ──────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function toDateKey(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getTodayKey(): string {
  return toDateKey(new Date().toISOString());
}

// ─── Calendar Strip ────────────────────────────────────────────
function CalendarStrip({ entries }: { entries: JournalEntryType[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const entryDates = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => set.add(toDateKey(e.date)));
    return set;
  }, [entries]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <CalendarDays className="size-4 text-emerald-600 dark:text-emerald-400" />
        {now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dayLabels.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground">
            {d}
          </div>
        ))}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const hasEntry = entryDates.has(dateKey);
          const isToday = dateKey === getTodayKey();
          return (
            <div
              key={day}
              className={cn(
                'flex h-7 items-center justify-center rounded-md text-xs transition-colors',
                isToday && 'bg-emerald-100 font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
              )}
            >
              <span className="relative">
                {day}
                {hasEntry && (
                  <span className="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-emerald-500" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Stats Sidebar ─────────────────────────────────────────────
function StatsSidebar({ entries }: { entries: JournalEntryType[] }) {
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthEntries = entries.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const avgHours = monthEntries.length
      ? monthEntries.reduce((sum, e) => sum + (e.studyHours ?? 0), 0) / monthEntries.length
      : 0;

    const moodCounts: Record<string, number> = {};
    monthEntries.forEach((e) => {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
    const topMoodConfig = topMood ? getMoodConfig(topMood[0]) : null;

    // Calculate streak: consecutive days with entries ending at today or yesterday
    let streak = 0;
    const sortedDates = entries
      .map((e) => new Date(e.date).getTime())
      .sort((a, b) => b - a);

    if (sortedDates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const latest = new Date(sortedDates[0]);
      latest.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - latest.getTime()) / 86400000);

      if (diffDays <= 1) {
        streak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const prev = new Date(sortedDates[i - 1]);
          prev.setHours(0, 0, 0, 0);
          const curr = new Date(sortedDates[i]);
          curr.setHours(0, 0, 0, 0);
          const diff = Math.floor((prev.getTime() - curr.getTime()) / 86400000);
          if (diff === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    return { monthCount: monthEntries.length, avgHours, topMoodConfig, streak };
  }, [entries]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-4">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <BarChart3 className="size-4 text-emerald-600 dark:text-emerald-400" />
          Monthly Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.monthCount}</p>
            <p className="text-[11px] text-muted-foreground">Entries</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{stats.avgHours.toFixed(1)}</p>
            <p className="text-[11px] text-muted-foreground">Avg Hours</p>
          </div>
          <div className="col-span-2 rounded-lg bg-muted/50 p-3 text-center">
            {stats.topMoodConfig ? (
              <>
                <span className="text-2xl">{stats.topMoodConfig.emoji}</span>
                <p className="mt-0.5 text-xs font-medium text-foreground">{stats.topMoodConfig.label}</p>
                <p className="text-[11px] text-muted-foreground">Most common mood</p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">No mood data yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-sm shadow-orange-500/20">
            <Flame className="size-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Journal Entry Card ────────────────────────────────────────
function EntryCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: JournalEntryType;
  onEdit: (entry: JournalEntryType) => void;
  onDelete: (entry: JournalEntryType) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const mood = getMoodConfig(entry.mood);
  const isLong = entry.content.length > 150;

  return (
    <Card className="group overflow-hidden border transition-all duration-200 hover:border-emerald-200 hover:shadow-md dark:hover:border-emerald-800">
      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{mood.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-foreground">{formatDate(entry.date)}</p>
              <Badge variant="secondary" className={cn('mt-0.5 text-[10px] font-medium', mood.color, 'border')}>
                {mood.label}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit(entry)}>
              <Pencil className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={() => onDelete(entry)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <p className={cn('text-sm leading-relaxed text-foreground/80', !expanded && isLong && 'line-clamp-3')}>
          {entry.content}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Meta */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {entry.studyHours != null && (
            <Badge variant="outline" className="gap-1 text-[11px] font-normal text-muted-foreground">
              <Clock className="size-3" />
              {entry.studyHours}h
            </Badge>
          )}
          {entry.topics &&
            entry.topics.split(',').map((topic) => (
              <Badge
                key={topic}
                variant="outline"
                className="gap-1 border-emerald-200 bg-emerald-50/50 text-[11px] font-normal text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
              >
                <Tag className="size-3" />
                {topic.trim()}
              </Badge>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Entry Form Dialog ─────────────────────────────────────────
function EntryFormDialog({
  open,
  onOpenChange,
  entry,
  formKey,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: JournalEntryType | null;
  formKey: string;
}) {
  const queryClient = useQueryClient();

  const isEditing = !!entry;

  const [date, setDate] = useState(() => (entry ? toDateKey(entry.date) : getTodayKey()));
  const [mood, setMood] = useState(() => (entry ? entry.mood : 'neutral'));
  const [content, setContent] = useState(() => (entry ? entry.content : ''));
  const [studyHours, setStudyHours] = useState(() => (entry?.studyHours != null ? String(entry.studyHours) : ''));
  const [topics, setTopics] = useState(() => (entry?.topics ?? ''));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!date) newErrors.date = 'Date is required';
    if (!content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [date, content]);

  const createMutation = useMutation({
    mutationFn: (data: { date: string; mood: string; content: string; studyHours?: number; topics?: string }) =>
      createJournalEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      toast.success('Journal entry saved!');
      onOpenChange(false);
    },
    onError: () => toast.error('Failed to save entry'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { date: string; mood: string; content: string; studyHours?: number; topics?: string }) =>
      updateJournalEntry(entry ? toDateKey(entry.date) : date, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      toast.success('Entry updated!');
      onOpenChange(false);
    },
    onError: () => toast.error('Failed to update entry'),
  });

  const handleSubmit = () => {
    if (!validate()) return;
    const data = {
      date,
      mood,
      content: content.trim(),
      studyHours: studyHours ? Number(studyHours) : undefined,
      topics: topics.trim() || undefined,
    };
    if (isEditing && entry) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <Pencil className="size-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Plus className="size-5 text-emerald-600 dark:text-emerald-400" />
            )}
            {isEditing ? 'Edit Journal Entry' : 'New Journal Entry'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date */}
          <div>
            <Label className="mb-1.5">Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={cn(errors.date && 'border-destructive')}
            />
            {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date}</p>}
          </div>

          {/* Mood Selector */}
          <div>
            <Label className="mb-1.5">How are you feeling?</Label>
            <div className="grid grid-cols-3 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMood(m.key)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border p-2.5 text-sm font-medium transition-all duration-150',
                    'hover:scale-[1.02]',
                    mood === m.key
                      ? `${m.color} ring-2 ${m.ring}`
                      : 'border-border bg-card text-muted-foreground hover:bg-muted',
                  )}
                >
                  <span className="text-lg">{m.emoji}</span>
                  <span className="text-xs">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <Label className="mb-1.5">Journal Entry</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did you study today? How was your day? Any challenges or wins?"
              rows={5}
              className={cn('resize-none', errors.content && 'border-destructive')}
            />
            {errors.content && <p className="mt-1 text-xs text-destructive">{errors.content}</p>}
          </div>

          {/* Study Hours & Topics */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5">Study Hours</Label>
              <Input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                placeholder="e.g. 4.5"
              />
            </div>
            <div>
              <Label className="mb-1.5">Topics</Label>
              <Input
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="DI, Reasoning, GA"
              />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">Separate topics with commas</p>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isEditing ? 'Update Entry' : 'Save Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Empty State ───────────────────────────────────────────────
function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40">
        <BookOpenCheck className="size-10 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">No journal entries yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Start tracking your daily study progress and reflections. Write your first entry to build a study habit!
      </p>
      <Button
        onClick={onNew}
        className="mt-6 bg-emerald-600 text-white hover:bg-emerald-700"
      >
        <Plus className="mr-2 size-4" />
        Write Your First Entry
      </Button>
    </div>
  );
}

// ─── Main JournalPage ──────────────────────────────────────────
export default function JournalPage() {
  const now = new Date();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntryType | null>(null);
  const [formKey, setFormKey] = useState('new');

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['journal', now.getFullYear(), now.getMonth() + 1],
    queryFn: () => getJournalEntries({ month: now.getMonth() + 1, year: now.getFullYear(), limit: 60 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (entry: JournalEntryType) => deleteJournalEntry(toDateKey(entry.date)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      toast.success('Entry deleted');
    },
    onError: () => toast.error('Failed to delete entry'),
  });

  const handleNew = () => {
    setEditingEntry(null);
    setFormKey(`new-${Date.now()}`);
    setDialogOpen(true);
  };

  const handleEdit = (entry: JournalEntryType) => {
    setEditingEntry(entry);
    setFormKey(`edit-${entry.id}-${Date.now()}`);
    setDialogOpen(true);
  };

  const handleDelete = (entry: JournalEntryType) => {
    deleteMutation.mutate(entry);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Study Journal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record your daily study progress and reflections
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Plus className="mr-2 size-4" />
          New Entry
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Entries */}
        <div className="space-y-4">
          {/* Calendar Strip */}
          {!isLoading && entries.length > 0 && (
            <CalendarStrip entries={entries} />
          )}

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="mb-3 h-5 w-48" />
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <EmptyState onNew={handleNew} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {entries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        {!isLoading && entries.length > 0 && (
          <div>
            <StatsSidebar entries={entries} />
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <EntryFormDialog
        key={formKey}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingEntry(null);
        }}
        entry={editingEntry}
        formKey={formKey}
      />
    </div>
  );
}
