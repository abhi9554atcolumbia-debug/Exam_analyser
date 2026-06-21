'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  History,
  CalendarClock,
  BarChart3,
  Flame,
  FileText,
  FolderOpen,
  Target,
  Calendar,
  Settings,
  User,
  HelpCircle,
  LogOut,
  Sparkles,
  GraduationCap,
  Search,
  CornerDownLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useNavigationStore, type PageId } from '@/store/navigation';
import { getExams } from '@/lib/api';

/* ─── Page definitions (mirrors Sidebar icons) ─────────────── */

interface PageEntry {
  id: PageId;
  label: string;
  subtitle: string;
  icon: React.ElementType;
}

const PAGES: PageEntry[] = [
  { id: 'dashboard', label: 'Dashboard', subtitle: 'Overview of your exam journey', icon: LayoutDashboard },
  { id: 'history', label: 'Exam History', subtitle: 'View and manage past exams', icon: History },
  { id: 'upcoming', label: 'Upcoming Exams', subtitle: 'Your upcoming exam schedule', icon: CalendarClock },
  { id: 'analytics', label: 'Analytics', subtitle: 'Deep dive into your performance', icon: BarChart3 },
  { id: 'weakness-heatmap', label: 'Weakness Heatmap', subtitle: 'Identify areas that need focus', icon: Flame },
  { id: 'reflections', label: 'Reflections', subtitle: 'Your thoughts after each exam', icon: FileText },
  { id: 'documents', label: 'Documents', subtitle: 'Manage your study materials', icon: FolderOpen },
  { id: 'goals', label: 'Goals & Plans', subtitle: 'Track your study goals and plans', icon: Target },
  { id: 'calendar', label: 'Calendar', subtitle: 'Your exam and study schedule', icon: Calendar },
  { id: 'profile', label: 'Profile', subtitle: 'Manage your account settings', icon: User },
  { id: 'settings', label: 'Settings', subtitle: 'Customize your experience', icon: Settings },
  { id: 'help', label: 'Help Center', subtitle: 'Find answers and get support', icon: HelpCircle },
  { id: 'upgrade', label: 'Upgrade to Pro', subtitle: 'Unlock premium features', icon: Sparkles },
  { id: 'sign-out', label: 'Sign Out', subtitle: 'Sign out of your account', icon: LogOut },
];

/* ─── Component ───────────────────────────────────────────── */

export function CommandSearch() {
  const open = useNavigationStore((s) => s.commandSearchOpen);
  const setOpen = useNavigationStore((s) => s.setCommandSearchOpen);
  const navigate = useNavigationStore((s) => s.navigate);
  const currentPage = useNavigationStore((s) => s.currentPage);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* ─── Keyboard shortcut (Cmd+K / Ctrl+K) ─────────────────── */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, setOpen]);

  /* ─── Fetch exams for search ──────────────────────────────── */
  const { data: examsResponse } = useQuery({
    queryKey: ['exams', 'search', 'all'],
    queryFn: () => getExams({ limit: 50 }),
    staleTime: 5 * 60_000,
    enabled: open,
  });

  const exams = examsResponse?.data ?? [];

  /* ─── Handlers ───────────────────────────────────────────── */
  const handlePageSelect = useCallback(
    (pageId: PageId) => {
      navigate(pageId);
      setOpen(false);
    },
    [navigate, setOpen],
  );

  const handleExamSelect = useCallback(() => {
    navigate('history');
    setOpen(false);
  }, [navigate, setOpen]);

  /* ─── Focus input when dialog opens ──────────────────────── */
  useEffect(() => {
    if (open) {
      // Small delay so cmdk's input is mounted
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search"
      description="Search pages and exams"
      className="sm:max-w-[560px] rounded-xl border shadow-2xl"
    >
      <div className="flex items-center border-b px-3">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <CommandInput
          ref={inputRef}
          placeholder="Search pages, exams..."
          className="border-0 focus:ring-0 pl-2"
        />
      </div>

      <CommandList className="max-h-[400px]">
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-8">
            <Search className="size-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              No results found
            </p>
            <p className="text-xs text-muted-foreground/60">
              Try a different search term
            </p>
          </div>
        </CommandEmpty>

        {/* ─── Pages Group ──────────────────────────────────── */}
        <CommandGroup heading="Pages" className="px-2 py-1.5">
          {PAGES.map((page) => {
            const Icon = page.icon;
            const isActive = currentPage === page.id;
            return (
              <CommandItem
                key={page.id}
                value={`${page.label} ${page.subtitle}`}
                onSelect={() => handlePageSelect(page.id)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  'data-[selected=true]:bg-emerald-50 data-[selected=true]:text-emerald-900',
                  'dark:data-[selected=true]:bg-emerald-950/50 dark:data-[selected=true]:text-emerald-100',
                  'hover:bg-muted/80',
                  isActive && 'bg-emerald-50/60 dark:bg-emerald-950/30',
                )}
              >
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-md transition-colors',
                    isActive
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                      : 'bg-muted text-muted-foreground data-[selected=true]:bg-emerald-200 data-[selected=true]:text-emerald-800 dark:data-[selected=true]:bg-emerald-800 dark:data-[selected=true]:text-emerald-200',
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'text-sm font-medium leading-tight',
                      isActive
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-foreground',
                    )}
                  >
                    {page.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {page.subtitle}
                  </p>
                </div>
                {isActive && (
                  <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Current
                  </span>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>

        {/* ─── Exams Group (only when exams are loaded) ────── */}
        {exams.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Exams" className="px-2 py-1.5">
              {exams.map((exam) => (
                <CommandItem
                  key={exam.id}
                  value={exam.name}
                  onSelect={handleExamSelect}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    'data-[selected=true]:bg-emerald-50 data-[selected=true]:text-emerald-900',
                    'dark:data-[selected=true]:bg-emerald-950/50 dark:[&_[data-slot=command-item]]:text-emerald-100',
                    'hover:bg-muted/80',
                  )}
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground data-[selected=true]:bg-emerald-200 data-[selected=true]:text-emerald-800 dark:data-[selected=true]:bg-emerald-800 dark:data-[selected=true]:text-emerald-200">
                    <GraduationCap className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight text-foreground truncate">
                      {exam.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {exam.category} &middot; {exam.stage} &middot; Score: {exam.score}/{exam.maxScore}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
                      exam.result === 'Qualified'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : exam.result === 'Not Qualified'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
                    )}
                  >
                    {exam.result}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>

      {/* ─── Footer with keyboard hint ──────────────────────── */}
      <div className="flex items-center justify-between border-t px-4 py-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <kbd className="pointer-events-none inline-flex h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ↑↓
            </kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="pointer-events-none inline-flex h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ↵
            </kbd>
            <span>Select</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="pointer-events-none inline-flex h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            esc
          </kbd>
          <span>Close</span>
        </div>
      </div>
    </CommandDialog>
  );
}
