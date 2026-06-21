'use client';

import { useState } from 'react';
import {
  LogOut, Monitor, Smartphone, Tablet, Laptop, ShieldCheck, CircleCheck,
  HelpCircle, ExternalLink, ChevronRight, LogIn, MapPin, Clock,
  CheckCircle, Lock, Zap, Eye,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { getDevices, getUser, type Device } from '@/lib/api';
import { useUserStore } from '@/store/user-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useNavigationStore } from '@/store/navigation';

const deviceIcons: Record<string, React.ElementType> = {
  'Desktop': Monitor,
  'Mobile': Smartphone,
  'Tablet': Tablet,
  'Laptop': Laptop,
};

const deviceColors: Record<string, string> = {
  'Desktop': 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  'Mobile': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'Tablet': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Laptop': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const securityTips = [
  { text: 'Use a strong, unique password for your account', severity: 'high' },
  { text: 'Enable two-factor authentication for extra security', severity: 'high' },
  { text: 'Sign out from shared or public devices', severity: 'medium' },
  { text: 'Keep your email and phone number updated', severity: 'low' },
  { text: 'Review your active sessions regularly', severity: 'low' },
];

const beforeYouGo = [
  'Download your data backup',
  'Review your active goals',
  'Check upcoming exam dates',
  'Export your analytics report',
];

const severityConfig: Record<string, { bg: string; text: string }> = {
  high: { bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300' },
  medium: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300' },
  low: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300' },
};

export default function SignOutPage() {
  const { navigate } = useNavigationStore();
  const [confirmAllOpen, setConfirmAllOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const profile = useUserStore((s) => s.profile);
  const { data: devices, isLoading } = useQuery({ queryKey: ['devices'], queryFn: getDevices });
  const initials = profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleSignOutDevice = (device: Device) => {
    if (device.isCurrent) {
      toast.info('You are currently using this device');
      return;
    }
    toast.success(`Signed out from ${device.device}`);
  };

  const handleSignOutAll = () => {
    toast.success('Signed out from all devices');
    setConfirmAllOpen(false);
  };

  const toggleCheck = (i: number) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const progress = Math.round((checkedItems.size / beforeYouGo.length) * 100);
  const allDevices = devices || [
    { id: '1', device: 'Laptop', location: 'New Delhi, India', isCurrent: true, lastActive: '2025-06-14T10:30:00Z' },
    { id: '2', device: 'Mobile', location: 'New Delhi, India', isCurrent: false, lastActive: '2025-06-13T18:45:00Z' },
    { id: '3', device: 'Desktop', location: 'Mumbai, India', isCurrent: false, lastActive: '2025-06-10T09:00:00Z' },
    { id: '4', device: 'Tablet', location: 'Bangalore, India', isCurrent: false, lastActive: '2025-06-08T14:20:00Z' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm">
          <LogOut className="size-5 text-white drop-shadow-sm" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Sign Out</h2>
          <p className="text-xs text-muted-foreground">Manage your active sessions and security</p>
        </div>
      </div>

      {/* Current User Card with Status */}
      <Card className="rounded-2xl overflow-hidden border-emerald-500/30 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-emerald-950/30">
        <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <Avatar className="size-16 ring-4 ring-white dark:ring-card shadow-lg">
                <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-lg font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-card" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{profile?.name || 'User'}</h3>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-semibold gap-1">
                  <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="size-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{profile?.email || 'user@example.com'}</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" onClick={() => {
              toast.info('You will be signed out from this device');
            }}>
              <LogOut className="size-4" /> Sign Out from This Device
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Signed In Devices */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Monitor className="size-3.5" /> Signed In Devices
              <Badge variant="secondary" className="text-[10px] font-semibold">{allDevices.length} devices</Badge>
            </h3>
            <div className="space-y-3">
              {allDevices.map((device) => {
                const Icon = deviceIcons[device.device] || Monitor;
                const colorClass = deviceColors[device.device] || 'bg-muted text-muted-foreground';
                return (
                  <Card key={device.id} className={cn(
                    'rounded-xl transition-all duration-200',
                    device.isCurrent ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/10' : 'hover:shadow-md hover:-translate-y-0.5',
                  )}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={cn('flex size-12 items-center justify-center rounded-xl shrink-0 shadow-sm', colorClass)}>
                        <Icon className="size-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{device.device}</p>
                          {device.isCurrent ? (
                            <Badge className="text-[10px] bg-emerald-600 hover:bg-emerald-700 gap-1 font-semibold">
                              <div className="size-1.5 rounded-full bg-white animate-pulse" /> Current Device
                            </Badge>
                          ) : (
                            <div className="flex items-center gap-1">
                              <div className="size-2 rounded-full bg-emerald-500" />
                              <span className="text-[10px] text-muted-foreground">Active</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="size-3" /> {device.location || 'Unknown location'}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" /> {formatDistanceToNow(parseISO(device.lastActive), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      {!device.isCurrent && (
                        <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200" onClick={() => handleSignOutDevice(device)}>
                          <LogOut className="size-3" /> Sign Out
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sign Out All */}
          <AlertDialog open={confirmAllOpen} onOpenChange={setConfirmAllOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-2 w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 py-5">
                <LogOut className="size-4" /> Sign Out from All Devices
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                    <LogOut className="size-4" />
                  </div>
                  Sign Out from All Devices?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will end your session on all devices including this one. You will need to sign in again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700 transition-all duration-200" onClick={handleSignOutAll}>
                  Sign Out All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Security Tips */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <ShieldCheck className="size-4" />
                </div>
                Security Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {securityTips.map((tip, i) => {
                  const sev = severityConfig[tip.severity];
                  return (
                    <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={cn('flex size-6 items-center justify-center rounded-full shrink-0 mt-0.5', sev.bg, sev.text)}>
                        <span className="text-[11px] font-bold">{i + 1}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account is Secure */}
          <Card className="rounded-2xl border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
            <CardContent className="p-5 text-center">
              <div className="relative mx-auto mb-3">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md mx-auto">
                  <ShieldCheck className="size-8 text-white drop-shadow-sm" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-card">
                  <CheckCircle className="size-3 text-white" />
                </div>
              </div>
              <h4 className="font-bold text-sm">Account is Secure</h4>
              <p className="text-xs text-muted-foreground mt-1">No suspicious activity detected on your account</p>
            </CardContent>
          </Card>

          {/* Before You Go */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Eye className="size-4 text-amber-500" /> Before You Go
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {beforeYouGo.map((item, i) => (
                  <button
                    key={i}
                    className="flex items-start gap-2.5 w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    onClick={() => toggleCheck(i)}
                  >
                    <div className={cn(
                      'flex size-5 items-center justify-center rounded border mt-0.5 shrink-0 transition-all duration-200',
                      checkedItems.has(i)
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-muted-foreground/30',
                    )}>
                      {checkedItems.has(i) && <CheckCircle className="size-3.5" />}
                    </div>
                    <span className={cn(
                      'text-sm transition-colors',
                      checkedItems.has(i) ? 'text-muted-foreground line-through' : 'text-foreground',
                    )}>
                      {item}
                    </span>
                  </button>
                ))}
              </div>
              {/* Progress */}
              <div className="mt-4 pt-3 border-t">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-muted-foreground font-medium">Completion</span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500 ease-out',
                      progress === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-emerald-500',
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                  <HelpCircle className="size-4" />
                </div>
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { icon: HelpCircle, label: 'Visit Help Center', action: () => navigate('help') },
                { icon: ExternalLink, label: 'Reset Password', action: () => toast.info('Password reset would open') },
                { icon: LogIn, label: 'Contact Support', action: () => navigate('help') },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Button key={item.label} variant="outline" size="sm" className="w-full gap-2 text-xs justify-start hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 h-auto py-2.5" onClick={item.action}>
                    <Icon className="size-3.5" /> {item.label}
                    <ChevronRight className="size-3 ml-auto text-muted-foreground" />
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Security Stats */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Lock className="size-4 text-emerald-600" /> Session Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Active Devices', value: `${allDevices.length}`, color: '' },
                { label: 'Session Type', value: 'Secure', color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Last Activity', value: 'Just now', color: '' },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className={cn('text-sm font-semibold', item.color)}>{item.value}</span>
                  </div>
                  {i < 2 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
