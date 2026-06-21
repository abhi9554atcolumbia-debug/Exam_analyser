'use client';

import { useState, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, CalendarDays, Clock, Plus, Flame,
  BookOpen, Target, Bell, AlertCircle, BrainCircuit, Play,
  ChevronDown, CheckCircle2, ArrowLeftRight,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, addDays, isSameMonth, isSameDay, isToday, parseISO,
} from 'date-fns';
import {
  getCalendarEvents, getTodaySchedule, createCalendarEvent,
  type CalendarEvent,
} from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const eventTypeConfig: Record<string, { color: string; label: string; dot: string; icon: React.ElementType; bg: string }> = {
  exam:       { color: 'text-blue-700 dark:text-blue-300',   label: 'Exam',       dot: 'bg-blue-500',    icon: BookOpen,      bg: 'bg-blue-100 dark:bg-blue-900/40' },
  goal:       { color: 'text-emerald-700 dark:text-emerald-300', label: 'Goal',   dot: 'bg-emerald-500', icon: Target,       bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  deadline:   { color: 'text-orange-700 dark:text-orange-300', label: 'Deadline',  dot: 'bg-orange-500',  icon: AlertCircle,   bg: 'bg-orange-100 dark:bg-orange-900/40' },
  reflection: { color: 'text-purple-700 dark:text-purple-300', label: 'Reflection', dot: 'bg-purple-500', icon: BrainCircuit,  bg: 'bg-purple-100 dark:bg-purple-900/40' },
  reminder:   { color: 'text-red-700 dark:text-red-300',       label: 'Reminder',  dot: 'bg-red-500',     icon: Bell,         bg: 'bg-red-100 dark:bg-red-900/40' },
  study:      { color: 'text-teal-700 dark:text-teal-300',     label: 'Study',     dot: 'bg-teal-500',    icon: BookOpen,      bg: 'bg-teal-100 dark:bg-teal-900/40' },
  other:      { color: 'text-slate-700 dark:text-slate-300',   label: 'Other',     dot: 'bg-slate-500',   icon: Play,          bg: 'bg-slate-100 dark:bg-slate-900/40' },
};

/* ── Create Event Dialog ──────────────────────────────────── */
function CreateEventDialog({
  open,
  onOpenChange,
  defaultDate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: string;
}) {
  const queryClient = useQueryClient();
  const [type, setType] = useState('exam');
  const [label, setLabel] = useState('');
  const [date, setDate] = useState(defaultDate || format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState('');

  const createMutation = useMutation({
    mutationFn: createCalendarEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['todaySchedule'] });
      onOpenChange(false);
      setLabel(''); setTime(''); setType('exam');
      toast.success('Event added to calendar!');
    },
    onError: () => toast.error('Failed to add event'),
  });

  const handleSubmit = () => {
    if (!label.trim()) { toast.error('Event title is required'); return; }
    if (!date) { toast.error('Date is required'); return; }
    createMutation.mutate({ type, label: label.trim(), date, time: time || undefined });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setLabel(''); setTime(''); setType('exam'); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-600" />
            Create Event
          </DialogTitle>
          <DialogDescription>Add a new event to your calendar</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {/* Event Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Event Type <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(eventTypeConfig).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setType(key)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all duration-200',
                      type === key
                        ? 'border-emerald-500 bg-emerald-50 shadow-sm dark:bg-emerald-950/30'
                        : 'hover:border-muted-foreground/30 hover:bg-muted/50',
                    )}
                  >
                    <div className={cn('flex h-7 w-7 items-center justify-center rounded-md', cfg.bg)}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className={cn(
                      'text-[11px] font-medium',
                      type === key ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground',
                    )}>
                      {cfg.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Event Title <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. Math practice test"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            {!label.trim() && <p className="text-xs text-red-500">Title is required</p>}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Time (optional)</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleSubmit}
            disabled={createMutation.isPending || !label.trim() || !date}
          >
            {createMutation.isPending ? 'Adding...' : 'Add Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Main Component ───────────────────────────────────────── */
export default function CalendarPage() {
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [view, setView] = useState('month');
  const [createOpen, setCreateOpen] = useState(false);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const { data: events, isLoading } = useQuery({
    queryKey: ['calendarEvents', month, year],
    queryFn: () => getCalendarEvents({ month, year }),
  });
  const { data: todaySchedule } = useQuery({
    queryKey: ['todaySchedule'],
    queryFn: getTodaySchedule,
  });

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToday = () => setCurrentDate(new Date());

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days: Date[] = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events?.forEach((e) => {
      const key = e.date.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [events]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    const key = format(selectedDay, 'yyyy-MM-dd');
    return eventsByDate[key] || [];
  }, [selectedDay, eventsByDate]);

  const upcomingEvents = useMemo(() => {
    if (!events) return [];
    const today = format(new Date(), 'yyyy-MM-dd');
    return events
      .filter(e => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
      .slice(0, 5);
  }, [events]);

  const weekDots = useMemo(() => {
    const dots = Array(7).fill(false);
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = addDays(today, i - 6);
      const key = format(d, 'yyyy-MM-dd');
      if (eventsByDate[key] && eventsByDate[key].length > 0) dots[i] = true;
    }
    return dots;
  }, [eventsByDate]);

  const openCreateForDay = (day: Date) => {
    setSelectedDay(day);
    setCreateOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Calendar</h1>
          <p className="mt-1 text-sm text-muted-foreground">Plan your study schedule and track important dates</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week" disabled>Week</TabsTrigger>
              <TabsTrigger value="day" disabled>Day</TabsTrigger>
            </TabsList>
          </Tabs>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <Button variant="outline" size="sm" onClick={goToday} className="gap-1.5">
            Today
          </Button>
        </div>
      </div>

      {/* Month Navigation */}
      <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
              <ChevronLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1 bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:text-white"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" /> Add Event
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {/* Quick Event Type Buttons */}
          <div className="flex flex-wrap gap-2 px-4 py-2.5 border-b bg-muted/20">
            {['exam', 'goal', 'study', 'reminder', 'deadline', 'other'].map((type) => {
              const cfg = eventTypeConfig[type];
              const Icon = cfg.icon;
              return (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-7"
                  onClick={() => {
                    setSelectedDay(new Date());
                    setCreateOpen(true);
                  }}
                >
                  <Icon className="size-3" /> {cfg.label}
                </Button>
              );
            })}
          </div>

          {/* Main Calendar Grid */}
          <div className="p-3">
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 mb-3 px-1">
              {Object.entries(eventTypeConfig).map(([type, cfg]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className={cn('size-2.5 rounded-full', cfg.dot)} />
                  <span className="text-[11px] font-medium text-muted-foreground">{cfg.label}</span>
                </div>
              ))}
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2 uppercase tracking-wider">{d}</div>
              ))}
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                const key = format(day, 'yyyy-MM-dd');
                const dayEvents = eventsByDate[key] || [];
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                const inMonth = isSameMonth(day, currentDate);
                const today = isToday(day);
                const hasEvents = dayEvents.length > 0;

                return (
                  <div
                    key={idx}
                    className={cn(
                      'relative rounded-lg p-1.5 text-left transition-all duration-200 min-h-[4.5rem] sm:min-h-[5.5rem] cursor-pointer group',
                      today && 'ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-background',
                      isSelected && 'bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-500',
                      !isSelected && !today && hasEvents && 'hover:bg-muted/50',
                      !isSelected && !today && !hasEvents && 'hover:bg-muted/30',
                      !inMonth && 'opacity-30',
                    )}
                    onClick={() => setSelectedDay(day)}
                    onDoubleClick={() => openCreateForDay(day)}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        'text-sm font-medium',
                        today && 'text-emerald-600 dark:text-emerald-400',
                        !today && !inMonth && 'text-muted-foreground',
                      )}>
                        {format(day, 'd')}
                      </span>
                      {hasEvents && (
                        <Badge
                          variant="secondary"
                          className="h-4 min-w-[16px] px-1 text-[10px] font-bold flex items-center justify-center"
                        >
                          {dayEvents.length}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-0.5 space-y-0.5">
                      {dayEvents.slice(0, 2).map((e, i) => {
                        const cfg = eventTypeConfig[e.type] || eventTypeConfig.other;
                        return (
                          <div
                            key={i}
                            className={cn(
                              'flex items-center gap-1 rounded px-1 py-0.5 text-[10px] font-medium truncate transition-colors',
                              cfg.bg, cfg.color,
                            )}
                          >
                            <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', cfg.dot)} />
                            <span className="truncate">{e.label}</span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <span className="text-[9px] text-muted-foreground font-medium">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                    {/* Hover overlay to show "add" hint */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Day Events */}
          {selectedDay && (
            <div className="border-t px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {format(selectedDay, 'EEEE, MMMM d, yyyy')}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400"
                  onClick={() => openCreateForDay(selectedDay)}
                >
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </div>
              {selectedDayEvents.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedDayEvents.map((e) => {
                    const cfg = eventTypeConfig[e.type] || eventTypeConfig.other;
                    const Icon = cfg.icon;
                    return (
                      <div key={e.id} className={cn('flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-200 hover:shadow-sm', cfg.bg)}>
                        <div className={cn('flex size-9 items-center justify-center rounded-lg', cfg.bg)}>
                          <Icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{e.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {cfg.label}{e.time ? ` · ${e.time}` : ' · All day'}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">{cfg.label}</Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CalendarDays className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No events on this day</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 h-7 text-xs gap-1"
                    onClick={() => openCreateForDay(selectedDay)}
                  >
                    <Plus className="h-3 w-3" /> Add Event
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sidebar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Schedule */}
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                <Clock className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Today&apos;s Schedule</CardTitle>
                <CardDescription className="text-xs">{format(new Date(), 'EEEE, MMM d')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 max-h-52 overflow-y-auto">
            {todaySchedule && todaySchedule.length > 0 ? todaySchedule.map((e) => {
              const cfg = eventTypeConfig[e.type] || eventTypeConfig.other;
              const Icon = cfg.icon;
              return (
                <div key={e.id} className="flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors hover:bg-muted/50">
                  <div className={cn('flex size-8 items-center justify-center rounded-lg shrink-0', cfg.bg)}>
                    <Icon className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{e.label}</p>
                    <p className="text-[11px] text-muted-foreground">{e.time || 'All day'}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{cfg.label}</Badge>
                </div>
              );
            }) : (
              <div className="flex flex-col items-center py-4 text-center">
                <CheckCircle2 className="h-6 w-6 text-muted-foreground/30 mb-1" />
                <p className="text-xs text-muted-foreground">No events today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/50">
                <CalendarDays className="size-4 text-teal-600 dark:text-teal-400" />
              </div>
              <CardTitle className="text-sm font-semibold">Upcoming</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 max-h-52 overflow-y-auto">
            {upcomingEvents.map((e) => {
              const cfg = eventTypeConfig[e.type] || eventTypeConfig.other;
              const Icon = cfg.icon;
              return (
                <div key={e.id} className="flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors hover:bg-muted/50">
                  <div className={cn('flex size-8 items-center justify-center rounded-lg shrink-0', cfg.bg)}>
                    <Icon className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{e.label}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {format(parseISO(e.date), 'MMM d')}{e.time ? ` · ${e.time}` : ''}
                    </p>
                  </div>
                </div>
              );
            }) || (
              <p className="text-xs text-muted-foreground text-center py-4">No upcoming events</p>
            )}
          </CardContent>
        </Card>

        {/* Activity Streak */}
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/50">
                <Flame className="size-4 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Activity Streak</CardTitle>
                <CardDescription className="text-xs">Last 7 days</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-3 text-center">
              {weekDots.filter(Boolean).length} <span className="text-sm font-normal text-muted-foreground">active days</span>
            </p>
            <div className="flex gap-2 justify-center mb-2">
              {weekDots.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      'size-7 rounded-full transition-all duration-200',
                      d ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30' : 'bg-muted',
                    )}
                  />
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Event Dialog */}
      <CreateEventDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultDate={selectedDay ? format(selectedDay, 'yyyy-MM-dd') : undefined}
      />
    </div>
  );
}