'use client';

import { useCallback } from 'react';
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
  HelpCircle,
  LogOut,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useNavigationStore, type PageId } from '@/store/navigation';
import { useUserStore } from '@/store/user-store';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
} from '@/components/ui/sheet';

const NAV_ITEMS: { id: PageId; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'history', label: 'Exam History', icon: History },
  { id: 'upcoming', label: 'Upcoming Exams', icon: CalendarClock },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'weakness-heatmap', label: 'Weakness Heatmap', icon: Flame },
  { id: 'reflections', label: 'Reflections', icon: FileText },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
  { id: 'goals', label: 'Goals & Plans', icon: Target },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
];

const FOOTER_ITEMS: {
  id: PageId;
  label: string;
  icon: React.ElementType;
  variant?: 'default' | 'destructive';
}[] = [
  { id: 'help', label: 'Help Center', icon: HelpCircle },
  { id: 'sign-out', label: 'Sign Out', icon: LogOut, variant: 'destructive' },
];

function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number] | (typeof FOOTER_ITEMS)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground',
        item.id === 'sign-out' && 'hover:text-destructive focus-visible:ring-destructive',
      )}
    >
      <Icon
        className={cn(
          'size-5 shrink-0 transition-colors',
          isActive
            ? 'text-foreground'
            : item.id === 'sign-out'
              ? 'text-muted-foreground group-hover:text-destructive'
              : 'text-muted-foreground group-hover:text-foreground',
        )}
      />
      <span className="truncate">{item.label}</span>
    </button>
  );
}

function SidebarContent() {
  const { currentPage, navigate, setSidebarOpen } = useNavigationStore();
  const profile = useUserStore((s) => s.profile);

  const handleNav = useCallback(
    (page: PageId) => {
      navigate(page);
      setSidebarOpen(false);
    },
    [navigate, setSidebarOpen],
  );

  const isPro = profile?.plan === 'pro';

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Logo */}
      <div className="flex shrink-0 items-center gap-3 px-4 py-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 dark:bg-emerald-500">
          <GraduationCap className="size-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight text-foreground">
            Exam Journey
          </span>
          <span className="text-xs leading-tight text-muted-foreground">
            Tracker
          </span>
        </div>
      </div>

      <Separator className="shrink-0" />

      {/* Navigation — ScrollArea with min-h-0 so it shrinks in flex */}
      <ScrollArea className="min-h-0 flex-1 px-3 py-3">
        <nav className="flex flex-col gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={currentPage === item.id}
              onClick={() => handleNav(item.id)}
            />
          ))}
        </nav>

        {/* Upgrade CTA */}
        {!isPro && (
          <div className="mt-4">
            <button
              onClick={() => handleNav('upgrade')}
              className={cn(
                'group w-full rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 text-left transition-all duration-200',
                'hover:from-emerald-100 hover:to-teal-100 hover:shadow-sm',
                'dark:from-emerald-950/40 dark:to-teal-950/40 dark:border-emerald-800',
                'dark:hover:from-emerald-950/60 dark:hover:to-teal-950/60',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Pro
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">
                Upgrade to Pro
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Unlock analytics, AI insights & more
              </p>
            </button>
          </div>
        )}
      </ScrollArea>

      <Separator className="shrink-0" />

      {/* Footer — always visible at bottom */}
      <div className="shrink-0 px-3 py-3">
        {FOOTER_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={false}
            onClick={() => handleNav(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

/** Desktop sidebar — always visible on lg+ */
export function Sidebar() {
  return (
    <aside
      className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r bg-sidebar text-sidebar-foreground h-screen sticky top-0"
      aria-label="Sidebar navigation"
    >
      <SidebarContent />
    </aside>
  );
}

/** Mobile sidebar — rendered as a Sheet, controlled via navigation store */
export function MobileSidebar() {
  const { sidebarOpen, setSidebarOpen } = useNavigationStore();

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}