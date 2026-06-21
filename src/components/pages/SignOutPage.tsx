'use client';

import { useState } from 'react';
import {
  LogOut, Monitor, Smartphone, Tablet, Laptop, ShieldCheck, CircleCheck,
  HelpCircle, ExternalLink, ChevronRight, LogIn,
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

const deviceIcons: Record<string, React.ElementType> = {
  'Desktop': Monitor,
  'Mobile': Smartphone,
  'Tablet': Tablet,
  'Laptop': Laptop,
};

const securityTips = [
  'Use a strong, unique password for your account',
  'Enable two-factor authentication for extra security',
  'Sign out from shared or public devices',
  'Keep your email and phone number updated',
  'Review your active sessions regularly',
];

export default function SignOutPage() {
  const [confirmAllOpen, setConfirmAllOpen] = useState(false);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Sign Out</h2>
      </div>

      {/* Current User Card */}
      <Card className="border-emerald-500/50 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-sm font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{profile?.name || 'User'}</p>
              <p className="text-sm text-muted-foreground">{profile?.email || 'user@example.com'}</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => {
              toast.info('You will be signed out from this device');
            }}>
              <LogOut className="size-4" /> Sign Out from This Device
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Signed In Devices */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Signed In Devices</h3>
            <div className="space-y-3">
              {(devices || [
                { id: '1', device: 'Laptop', location: 'New Delhi, India', isCurrent: true, lastActive: '2025-06-14T10:30:00Z' },
                { id: '2', device: 'Mobile', location: 'New Delhi, India', isCurrent: false, lastActive: '2025-06-13T18:45:00Z' },
                { id: '3', device: 'Desktop', location: 'Mumbai, India', isCurrent: false, lastActive: '2025-06-10T09:00:00Z' },
                { id: '4', device: 'Tablet', location: 'Bangalore, India', isCurrent: false, lastActive: '2025-06-08T14:20:00Z' },
              ]).map((device) => {
                const Icon = deviceIcons[device.device] || Monitor;
                return (
                  <Card key={device.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted shrink-0">
                        <Icon className="size-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{device.device}</p>
                          {device.isCurrent && (
                            <Badge className="text-[10px] bg-emerald-600 hover:bg-emerald-700">Current Device</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {device.location || 'Unknown location'} · {formatDistanceToNow(parseISO(device.lastActive), { addSuffix: true })}
                        </p>
                      </div>
                      {!device.isCurrent && (
                        <Button variant="outline" size="sm" className="text-xs h-7 gap-1.5" onClick={() => handleSignOutDevice(device)}>
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
              <Button variant="outline" className="gap-2 w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800">
                <LogOut className="size-4" /> Sign Out from All Devices
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign Out from All Devices?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will end your session on all devices including this one. You will need to sign in again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleSignOutAll}>
                  Sign Out All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Security Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600" /> Security Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account is Secure */}
          <Card className="border-emerald-500/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
            <CardContent className="p-5 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-3 dark:bg-emerald-900/40">
                <ShieldCheck className="size-6" />
              </div>
              <h4 className="font-semibold text-sm">Account is Secure</h4>
              <p className="text-xs text-muted-foreground mt-1">No suspicious activity detected on your account</p>
            </CardContent>
          </Card>

          {/* Before You Go */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Before You Go</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {[
                  'Download your data backup',
                  'Review your active goals',
                  'Check upcoming exam dates',
                  'Export your analytics report',
                ].map((item, i) => (
                  <label key={i} className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" className="mt-1 accent-emerald-600" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <HelpCircle className="size-4 text-emerald-600" /> Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full gap-2 text-xs" onClick={() => toast.info('Help center would open')}>
                <HelpCircle className="size-3.5" /> Visit Help Center
              </Button>
              <Button variant="outline" size="sm" className="w-full gap-2 text-xs" onClick={() => toast.info('Password reset would open')}>
                <ExternalLink className="size-3.5" /> Reset Password
              </Button>
              <Button variant="outline" size="sm" className="w-full gap-2 text-xs" onClick={() => toast.info('Contact support would open')}>
                <LogIn className="size-3.5" /> Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
