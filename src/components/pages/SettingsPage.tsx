'use client';

import { useState } from 'react';
import {
  Settings, Bell, Globe, Shield, Palette, Info, Save, Mail,
  Lock, Trash2, HardDrive, Download, Moon, Sun, Monitor,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import {
  getSettings, updateSettings, exportUserData, type UserSettings,
} from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

const accentColors = [
  { name: 'emerald', class: 'bg-emerald-500', ring: 'ring-emerald-500' },
  { name: 'teal', class: 'bg-teal-500', ring: 'ring-teal-500' },
  { name: 'violet', class: 'bg-violet-500', ring: 'ring-violet-500' },
  { name: 'rose', class: 'bg-rose-500', ring: 'ring-rose-500' },
  { name: 'amber', class: 'bg-amber-500', ring: 'ring-amber-500' },
];

interface ToggleSetting {
  key: keyof UserSettings;
  label: string;
  description: string;
}

const notificationToggles: ToggleSetting[] = [
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
  { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
  { key: 'examReminders', label: 'Exam Reminders', description: 'Reminders before upcoming exams' },
  { key: 'goalReminders', label: 'Goal Reminders', description: 'Reminders for goal deadlines' },
  { key: 'weeklyReport', label: 'Weekly Report', description: 'Weekly performance summary' },
  { key: 'newFeatureAlerts', label: 'New Features', description: 'Get notified about new features' },
  { key: 'marketingEmails', label: 'Marketing Emails', description: 'Tips, offers, and updates' },
];

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const { data: settings, isLoading } = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const selectedAccent = settings?.accentColor || 'emerald';

  const saveMutation = useMutation({
    mutationFn: (data: Partial<UserSettings>) => updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings saved!');
    },
    onError: () => toast.error('Failed to save settings'),
  });

  const handleToggle = (key: keyof UserSettings) => {
    if (!settings) return;
    saveMutation.mutate({ [key]: !settings[key] } as Partial<UserSettings>);
  };

  const handleSelectChange = (key: keyof UserSettings, value: string) => {
    if (!settings) return;
    saveMutation.mutate({ [key]: value } as Partial<UserSettings>);
  };

  const handleSave = () => {
    if (settings) {
      saveMutation.mutate(settings);
    }
  };

  const handleExport = () => {
    exportUserData().then(() => toast.success('Data exported!')).catch(() => toast.error('Export failed'));
  };

  const handleClearCache = () => {
    localStorage.clear();
    toast.success('Local cache cleared!');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-28" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
      </div>
    );
  }

  const s = settings;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Settings</h2>
        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={handleSave} disabled={saveMutation.isPending}>
          <Save className="size-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Account Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Settings className="size-4 text-emerald-600" /> Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <Input className="mt-1.5" defaultValue="Alex Chen" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <Input className="mt-1.5" defaultValue="alex@example.com" type="email" />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => toast.info('Change password dialog would open')}>
                  <Lock className="size-3.5" /> Change Password
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => toast.info('Linked accounts would open')}>
                  <Globe className="size-3.5" /> Linked Accounts
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30">
                      <Trash2 className="size-3.5" /> Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone. All your data will be permanently deleted.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => toast.error('Account deletion is disabled in demo mode')}>
                        Delete Permanently
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bell className="size-4 text-emerald-600" /> Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationToggles.map((toggle) => (
                <div key={toggle.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{toggle.label}</p>
                    <p className="text-xs text-muted-foreground">{toggle.description}</p>
                  </div>
                  <Switch
                    checked={!!s?.[toggle.key]}
                    onCheckedChange={() => handleToggle(toggle.key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Globe className="size-4 text-emerald-600" /> App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Language</Label>
                  <Select value={s?.language || 'english'} onValueChange={(v) => handleSelectChange('language', v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date Format</Label>
                  <Select value={s?.dateFormat || 'DD/MM/YYYY'} onValueChange={(v) => handleSelectChange('dateFormat', v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Week Starts On</Label>
                  <Select value={s?.weekStart || 'monday'} onValueChange={(v) => handleSelectChange('weekStart', v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Time Format</Label>
                  <Select value={s?.timeFormat || '12h'} onValueChange={(v) => handleSelectChange('timeFormat', v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="size-4 text-emerald-600" /> Privacy &amp; Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Privacy Mode</p>
                  <p className="text-xs text-muted-foreground">Hide sensitive data from dashboard</p>
                </div>
                <Switch checked={s?.privacyMode || false} onCheckedChange={() => handleToggle('privacyMode')} />
              </div>
              <Separator />
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => toast.success('Backup started!')}>
                  <HardDrive className="size-3.5" /> Data Backup
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={handleExport}>
                  <Download className="size-3.5" /> Export Data
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={handleClearCache}>
                  <Trash2 className="size-3.5" /> Clear Local Cache
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Palette className="size-4 text-emerald-600" /> Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-3 block">Theme</Label>
                <div className="flex gap-2">
                  {[
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'system', icon: Monitor, label: 'System' },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isActive = theme === t.value;
                    return (
                      <Button
                        key={t.value}
                        variant={isActive ? 'default' : 'outline'}
                        size="sm"
                        className={cn('gap-2', isActive && 'bg-emerald-600 hover:bg-emerald-700')}
                        onClick={() => setTheme(t.value)}
                      >
                        <Icon className="size-3.5" /> {t.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-3 block">Accent Color</Label>
                <div className="flex gap-3">
                  {accentColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => { setSelectedAccent(c.name); handleSelectChange('accentColor', c.name); }}
                      className={cn(
                        'size-8 rounded-full transition-all',
                        c.class,
                        selectedAccent === c.name ? `ring-2 ring-offset-2 ring-offset-background ${c.ring}` : 'opacity-60 hover:opacity-100',
                      )}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Info className="size-4 text-emerald-600" /> About &amp; Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <Separator />
              <div className="flex gap-4 text-sm">
                <button className="text-emerald-600 hover:underline" onClick={() => toast.info('Terms of Service')}>Terms of Service</button>
                <button className="text-emerald-600 hover:underline" onClick={() => toast.info('Privacy Policy')}>Privacy Policy</button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-emerald-500/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
            <CardContent className="p-5">
              <h4 className="font-semibold text-sm">Settings Tips</h4>
              <ul className="mt-3 space-y-2">
                {['Enable push notifications for exam reminders', 'Set your weekly report day for best insights', 'Use privacy mode when sharing your screen'].map((tip, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Notifications Enabled</span>
                <span className="text-sm font-semibold">
                  {notificationToggles.filter(t => s?.[t.key]).length}/{notificationToggles.length}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Current Theme</span>
                <span className="text-sm font-semibold capitalize">{theme || 'system'}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Accent Color</span>
                <div className={cn('size-4 rounded-full', accentColors.find(c => c.name === selectedAccent)?.class || 'bg-emerald-500')} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
