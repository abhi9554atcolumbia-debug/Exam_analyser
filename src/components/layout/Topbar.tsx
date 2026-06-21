'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
  Menu,
  Search,
  Plus,
  Settings,
  Bell,
  User,
  LogOut,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  CheckCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useNavigationStore, type PageId } from '@/store/navigation';
import { useUserStore } from '@/store/user-store';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  createExam,
  type Notification,
} from '@/lib/api';
import { toast } from 'sonner';

const PAGE_META: Record<
  string,
  { title: string; subtitle: string; showSearch: boolean; showAdd: boolean }
> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Overview of your exam journey',
    showSearch: false,
    showAdd: false,
  },
  history: {
    title: 'Exam History',
    subtitle: 'View and manage past exams',
    showSearch: true,
    showAdd: true,
  },
  upcoming: {
    title: 'Upcoming Exams',
    subtitle: 'Your upcoming exam schedule',
    showSearch: false,
    showAdd: true,
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Deep dive into your performance',
    showSearch: false,
    showAdd: false,
  },
  'weakness-heatmap': {
    title: 'Weakness Heatmap',
    subtitle: 'Identify areas that need more focus',
    showSearch: false,
    showAdd: false,
  },
  reflections: {
    title: 'Reflections',
    subtitle: 'Your thoughts after each exam',
    showSearch: true,
    showAdd: false,
  },
  documents: {
    title: 'Documents',
    subtitle: 'Manage your study materials',
    showSearch: true,
    showAdd: false,
  },
  goals: {
    title: 'Goals & Plans',
    subtitle: 'Track your study goals and plans',
    showSearch: false,
    showAdd: true,
  },
  calendar: {
    title: 'Calendar',
    subtitle: 'Your exam and study schedule',
    showSearch: false,
    showAdd: false,
  },
  profile: {
    title: 'Profile',
    subtitle: 'Manage your account settings',
    showSearch: false,
    showAdd: false,
  },
  settings: {
    title: 'Settings',
    subtitle: 'Customize your experience',
    showSearch: false,
    showAdd: false,
  },
  help: {
    title: 'Help Center',
    subtitle: 'Find answers and get support',
    showSearch: true,
    showAdd: false,
  },
  'sign-out': {
    title: 'Sign Out',
    subtitle: 'Manage your active sessions',
    showSearch: false,
    showAdd: false,
  },
  upgrade: {
    title: 'Upgrade to Pro',
    subtitle: 'Unlock premium features',
    showSearch: false,
    showAdd: false,
  },
};

const NOTIFICATION_ICON_MAP: Record<string, React.ElementType> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const NOTIFICATION_ICON_COLOR: Record<string, string> = {
  info: 'text-emerald-600 dark:text-emerald-400',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-red-600 dark:text-red-400',
};

export function Topbar() {
  const { currentPage, navigate, setSidebarOpen } = useNavigationStore();
  const { profile, setNotificationsCount, clearNotifications } = useUserStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Add Exam form state
  const [examForm, setExamForm] = useState({
    name: '',
    org: '',
    category: 'Banking',
    stage: 'Prelims',
    examDate: '',
    score: '',
    maxScore: '100',
    cutoff: '',
    result: 'Pending',
  });

  const meta = PAGE_META[currentPage] ?? {
    title: 'Exam Journey Tracker',
    subtitle: '',
    showSearch: false,
    showAdd: false,
  };

  const handleNav = useCallback(
    (page: PageId) => {
      navigate(page);
    },
    [navigate],
  );

  // ─── Notifications ─────────────────────────────────────────
  const { data: notifications = [], isLoading: notifLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    staleTime: 30_000,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
      setNotificationsCount(0);
      clearNotifications();
      toast.success('All notifications marked as read');
    },
    onError: () => {
      toast.error('Failed to mark all as read');
    },
  });

  // ─── Add Exam ──────────────────────────────────────────────
  const examMutation = useMutation({
    mutationFn: () =>
      createExam({
        name: examForm.name,
        org: examForm.org || undefined,
        category: examForm.category,
        stage: examForm.stage,
        examDate: examForm.examDate,
        score: Number(examForm.score),
        maxScore: Number(examForm.maxScore),
        cutoff: Number(examForm.cutoff),
        result: examForm.result,
      }),
    onSuccess: () => {
      toast.success('Exam added successfully!');
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDialogOpen(false);
      setExamForm({
        name: '',
        org: '',
        category: 'Banking',
        stage: 'Prelims',
        examDate: '',
        score: '',
        maxScore: '100',
        cutoff: '',
        result: 'Pending',
      });
    },
    onError: () => {
      toast.error('Failed to add exam. Please try again.');
    },
  });

  const handleExamSubmit = useCallback(() => {
    if (!examForm.name || !examForm.examDate || !examForm.score) {
      toast.error('Please fill in exam name, date, and score');
      return;
    }
    examMutation.mutate();
  }, [examForm, examMutation]);

  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6',
      )}
    >
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </Button>

      {/* Page title */}
      <div className="min-w-0 flex-1">
        <h1 className="text-lg font-semibold leading-tight truncate text-foreground">
          {meta.title}
        </h1>
        {meta.subtitle && (
          <p className="hidden text-sm text-muted-foreground sm:block truncate">
            {meta.subtitle}
          </p>
        )}
      </div>

      {/* Search (conditional) */}
      {meta.showSearch && (
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Add Exam button (conditional) */}
      {meta.showAdd && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">Add Exam</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Exam</DialogTitle>
              <DialogDescription>
                Record a new exam result to track your progress.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="tb-exam-name">Exam Name</Label>
                <Input
                  id="tb-exam-name"
                  placeholder="e.g. IBPS PO 2025"
                  value={examForm.name}
                  onChange={(e) =>
                    setExamForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tb-exam-org">Organization</Label>
                  <Input
                    id="tb-exam-org"
                    placeholder="e.g. IBPS, SSC"
                    value={examForm.org}
                    onChange={(e) =>
                      setExamForm((f) => ({ ...f, org: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select
                    value={examForm.category}
                    onValueChange={(v) =>
                      setExamForm((f) => ({ ...f, category: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Banking">Banking</SelectItem>
                      <SelectItem value="SSC">SSC</SelectItem>
                      <SelectItem value="Railway">Railway</SelectItem>
                      <SelectItem value="UPSC">UPSC</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Stage</Label>
                  <Select
                    value={examForm.stage}
                    onValueChange={(v) =>
                      setExamForm((f) => ({ ...f, stage: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prelims">Prelims</SelectItem>
                      <SelectItem value="Mains">Mains</SelectItem>
                      <SelectItem value="Tier 1">Tier 1</SelectItem>
                      <SelectItem value="Tier 2">Tier 2</SelectItem>
                      <SelectItem value="Interview">Interview</SelectItem>
                      <SelectItem value="CBT 1">CBT 1</SelectItem>
                      <SelectItem value="Final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tb-exam-date">Exam Date</Label>
                  <Input
                    id="tb-exam-date"
                    type="date"
                    value={examForm.examDate}
                    onChange={(e) =>
                      setExamForm((f) => ({ ...f, examDate: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tb-score">Score</Label>
                  <Input
                    id="tb-score"
                    type="number"
                    placeholder="0"
                    value={examForm.score}
                    onChange={(e) =>
                      setExamForm((f) => ({ ...f, score: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tb-max-score">Max Score</Label>
                  <Input
                    id="tb-max-score"
                    type="number"
                    placeholder="100"
                    value={examForm.maxScore}
                    onChange={(e) =>
                      setExamForm((f) => ({ ...f, maxScore: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tb-cutoff">Cutoff</Label>
                  <Input
                    id="tb-cutoff"
                    type="number"
                    placeholder="0"
                    value={examForm.cutoff}
                    onChange={(e) =>
                      setExamForm((f) => ({ ...f, cutoff: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Result</Label>
                <Select
                  value={examForm.result}
                  onValueChange={(v) =>
                    setExamForm((f) => ({ ...f, result: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Not Qualified">Not Qualified</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white"
                onClick={handleExamSubmit}
                disabled={examMutation.isPending}
              >
                {examMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Exam'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Right-side actions */}
      <div className="flex items-center gap-1">
        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNav('settings')}
          aria-label="Settings"
        >
          <Settings className="size-[18px]" />
        </Button>

        {/* Notification Dropdown */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            >
              <Bell className="size-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-0"
            align="end"
            sideOffset={8}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                  onClick={() => markAllReadMutation.mutate()}
                  disabled={markAllReadMutation.isPending}
                >
                  {markAllReadMutation.isPending ? (
                    <Loader2 className="mr-1 size-3 animate-spin" />
                  ) : (
                    <CheckCheck className="mr-1 size-3" />
                  )}
                  Mark all read
                </Button>
              )}
            </div>
            <Separator />

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Bell className="mb-2 size-8 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No new notifications
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground/60">
                    You&apos;re all caught up!
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notif) => {
                    const IconComponent =
                      NOTIFICATION_ICON_MAP[notif.type] ?? Info;
                    const iconColor =
                      NOTIFICATION_ICON_COLOR[notif.type] ??
                      'text-muted-foreground';

                    return (
                      <button
                        key={notif.id}
                        className={cn(
                          'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
                          !notif.isRead && 'bg-emerald-50/50 dark:bg-emerald-950/20',
                        )}
                        onClick={() => {
                          if (!notif.isRead) {
                            markReadMutation.mutate(notif.id);
                          }
                        }}
                      >
                        <div
                          className={cn(
                            'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/80',
                          )}
                        >
                          <IconComponent className={cn('size-4', iconColor)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <p
                              className={cn(
                                'text-sm leading-snug',
                                notif.isRead
                                  ? 'text-muted-foreground'
                                  : 'font-medium text-foreground',
                              )}
                            >
                              {notif.title}
                            </p>
                            {!notif.isRead && (
                              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-emerald-500" />
                            )}
                          </div>
                          {notif.message && (
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                              {notif.message}
                            </p>
                          )}
                          <p className="mt-1 text-[11px] text-muted-foreground/70">
                            {formatDistanceToNow(new Date(notif.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative ml-1 h-9 w-9 rounded-full"
              aria-label="User menu"
            >
              <Avatar className="size-8">
                {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
                <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium leading-none">
                  {profile?.name ?? 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.email ?? 'user@example.com'}
                </p>
                {profile?.plan === 'pro' && (
                  <Badge
                    variant="secondary"
                    className="mt-1.5 w-fit bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-[10px]"
                  >
                    PRO
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleNav('profile')}>
                <User className="size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNav('settings')}>
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => handleNav('sign-out')}
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}