'use client';

import { useState, useCallback } from 'react';
import {
  Menu,
  Search,
  Plus,
  Settings,
  Bell,
  User,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigationStore, type PageId } from '@/store/navigation';
import { useUserStore } from '@/store/user-store';
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
  upgrade: {
    title: 'Upgrade to Pro',
    subtitle: 'Unlock premium features',
    showSearch: false,
    showAdd: false,
  },
};

export function Topbar() {
  const { currentPage, navigate, setSidebarOpen } = useNavigationStore();
  const { profile, notificationsCount, clearNotifications } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleAddExam = useCallback(() => {
    // Form submission would go here
    setDialogOpen(false);
    toast.success('Exam added successfully!');
  }, []);

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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Exam</DialogTitle>
              <DialogDescription>
                Record a new exam result to track your progress.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="exam-name">Exam Name</Label>
                <Input id="exam-name" placeholder="e.g. Midterm Calculus" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="exam-subject">Subject</Label>
                  <Select>
                    <SelectTrigger id="exam-subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="exam-date">Date</Label>
                  <Input id="exam-date" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="exam-score">Score</Label>
                  <Input id="exam-score" type="number" placeholder="85" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="exam-max">Max Score</Label>
                  <Input id="exam-max" type="number" placeholder="100" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exam-notes">Notes (optional)</Label>
                <Textarea
                  id="exam-notes"
                  placeholder="How did the exam go? Any thoughts..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white"
                onClick={handleAddExam}
              >
                Save Exam
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

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => handleNav('help')}
          aria-label={`Notifications${notificationsCount > 0 ? ` (${notificationsCount} unread)` : ''}`}
        >
          <Bell className="size-[18px]" />
          {notificationsCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {notificationsCount > 9 ? '9+' : notificationsCount}
            </span>
          )}
        </Button>

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