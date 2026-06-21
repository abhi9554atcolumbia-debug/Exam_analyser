'use client';

import { useState, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, CalendarDays, Clock, Plus, Flame,
  BookOpen, Target, Bell, AlertCircle, BrainCircuit, Play,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const eventTypeConfig: Record<string, { color: string; label: string; dot: string; icon: React.ElementType }> = {
  exam:      { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', label: 'Exam',      dot: 'bg-blue-500', icon: BookOpen },
  goal:      { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', label: 'Goal', dot: 'bg-emerald-500', icon: Target },
  deadline:  { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', label: 'Deadline',  dot: 'bg-orange-500', icon: AlertCircle },
  reflection:{ color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', label: 'Reflection', dot: 'bg-purple-500', icon: BrainCircuit },
  reminder:  { color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', label: 'Reminder', dot: 'bg-red-500', icon: Bell },
};

export default function CalendarPage() {
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [view, setView] = useState('month');
  const [createOpen, setCreateOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ type: 'exam', label: '', date: '', time: '' });

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

  const createMutation = useMutation({
    mutationFn: createCalendarEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['todaySchedule'] });
      setCreateOpen(false);
      setNewEvent({ type: 'exam', label: '', date: '', time: '' });
      toast.success('Event added to calendar!');
    },
    onError: () => toast.error('Failed to add event'),
  });

  const handleCreate = () => {
    if (!newEvent.label.trim() || !newEvent.date) { toast.error('Label and date are required'); return; }
    createMutation.mutate(newEvent);
  };

  const openCreateWithType = (type: string) => {
    setNewEvent({ type, label: '', date: selectedDay ? format(selectedDay, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'), time: '' });
    setCreateOpen(true);
  };

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

  // Upcoming events (next 5 from today)
  const upcomingEvents = useMemo(() => {
    if (!events) return [];
    const today = format(new Date(), 'yyyy-MM-dd');
    return events
      .filter(e => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
      .slice(0, 5);
  }, [events]);

  // Week dots for streak (mock from events this month)
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
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
          <Button variant="outline" size="sm" onClick={goToday}>Today</Button>
          <Button variant="outline" size="icon" className="size-8" onClick={prevMonth}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" className="size-8" onClick={nextMonth}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Quick Event Creation */}
      <div className="flex flex-wrap gap-2">
        {['exam', 'goal', 'reminder', 'deadline', 'reflection'].map((type) => {
          const cfg = eventTypeConfig[type];
          const Icon = cfg.icon;
          return (
            <Button key={type} variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => openCreateWithType(type)}>
              <Icon className="size-3.5" /> Add {cfg.label}
            </Button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4">
            {Object.entries(eventTypeConfig).map(([type, cfg]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={cn('size-2.5 rounded-full', cfg.dot)} />
                <span className="text-xs text-muted-foreground">{cfg.label}</span>
              </div>
            ))}
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
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

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'relative rounded-lg p-1.5 text-left transition-colors min-h-[4rem] sm:min-h-[5rem]',
                    today && 'ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-background',
                    isSelected && 'bg-emerald-50 dark:bg-emerald-950/40',
                    !isSelected && !today && 'hover:bg-muted/50',
                    !inMonth && 'opacity-40',
                  )}
                >
                  <span className={cn(
                    'text-sm font-medium block',
                    today && 'text-emerald-600 dark:text-emerald-400',
                    !today && !inMonth && 'text-muted-foreground',
                  )}>
                    {format(day, 'd')}
                  </span>
                  <div className="mt-0.5 flex flex-wrap gap-0.5">
                    {dayEvents.slice(0, 3).map((e, i) => (
                      <div key={i} className={cn('size-2 rounded-full', eventTypeConfig[e.type]?.dot || 'bg-gray-400')} />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[9px] text-muted-foreground">+{dayEvents.length - 3}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Day Events */}
          {selectedDay && (
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Events for {format(selectedDay, 'EEEE, MMM d, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDayEvents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDayEvents.map((e) => {
                      const cfg = eventTypeConfig[e.type] || eventTypeConfig.exam;
                      const Icon = cfg.icon;
                      return (
                        <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                          <div className={cn('flex size-8 items-center justify-center rounded-lg', cfg.color)}>
                            <Icon className="size-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{e.label}</p>
                            <p className="text-xs text-muted-foreground">{cfg.label}{e.time ? ` · ${e.time}` : ''}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">{cfg.label}</Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No events on this day</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="size-4 text-emerald-500" /> Today&apos;s Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-48 overflow-y-auto">
              {todaySchedule && todaySchedule.length > 0 ? todaySchedule.map((e) => {
                const cfg = eventTypeConfig[e.type] || eventTypeConfig.exam;
                return (
                  <div key={e.id} className="flex items-center gap-2">
                    <div className={cn('size-2 rounded-full shrink-0', cfg.dot)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{e.label}</p>
                      <p className="text-[10px] text-muted-foreground">{e.time || 'All day'}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{cfg.label}</Badge>
                  </div>
                );
              }) : (
                <p className="text-xs text-muted-foreground">No events today</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CalendarDays className="size-4 text-teal-500" /> Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-48 overflow-y-auto">
              {upcomingEvents.map((e) => {
                const cfg = eventTypeConfig[e.type] || eventTypeConfig.exam;
                const Icon = cfg.icon;
                return (
                  <div key={e.id} className="flex items-center gap-2">
                    <Icon className="size-3.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{e.label}</p>
                      <p className="text-[10px] text-muted-foreground">{format(parseISO(e.date), 'MMM d')}{e.time ? ` · ${e.time}` : ''}</p>
                    </div>
                  </div>
                );
              }) || <p className="text-xs text-muted-foreground">No upcoming events</p>}
            </CardContent>
          </Card>

          {/* Study Streak */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Flame className="size-4 text-orange-500" /> Activity Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-3">{weekDots.filter(Boolean).length} days this week</p>
              <div className="flex gap-1.5 justify-center">
                {weekDots.map((d, i) => (
                  <div key={i} className={cn('size-3 rounded-full', d ? 'bg-emerald-500' : 'bg-muted')} />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <span key={i} className="text-[10px] text-muted-foreground">{d}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) setNewEvent({ type: 'exam', label: '', date: '', time: '' }); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Calendar Event</DialogTitle>
            <DialogDescription>Create a new event on your calendar</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Event Type</Label>
              <Select value={newEvent.type} onValueChange={(v) => setNewEvent(e => ({ ...e, type: v }))}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(eventTypeConfig).map(([type, cfg]) => (
                    <SelectItem key={type} value={type}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Label *</Label>
              <Input className="mt-1.5" placeholder="e.g. Math practice test" value={newEvent.label} onChange={(e) => setNewEvent(ev => ({ ...ev, label: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date *</Label>
                <Input type="date" className="mt-1.5" value={newEvent.date} onChange={(e) => setNewEvent(ev => ({ ...ev, date: e.target.value }))} />
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" className="mt-1.5" value={newEvent.time} onChange={(e) => setNewEvent(ev => ({ ...ev, time: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Adding...' : 'Add Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
