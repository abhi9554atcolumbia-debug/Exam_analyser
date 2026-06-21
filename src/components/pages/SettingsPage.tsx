'use client';

import { useState } from 'react';
import {
  Settings, Bell, Globe, Shield, Palette, Info, Save, Mail,
  Lock, Trash2, HardDrive, Download, Moon, Sun, Monitor, BarChart3,
  ShieldCheck, Eye, EyeOff, Zap, Check,
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
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/user-store';
import { cn } from '@/lib/utils';

const accentColors = [
  { name: 'emerald', class: 'bg-emerald-500', ring: 'ring-emerald-500', label: 'Emerald' },
  { name: 'teal', class: 'bg-teal-500', ring: 'ring-teal-500', label: 'Teal' },
  { name: 'violet', class: 'bg-violet-500', ring: 'ring-violet-500', label: 'Violet' },
  { name: 'rose', class: 'bg-rose-500', ring: 'ring-rose-500', label: 'Rose' },
  { name: 'amber', class: 'bg-amber-500', ring: 'ring-amber-500', label: 'Amber' },
];

interface ToggleSetting {
  key: keyof UserSettings;
  label: string;
  description: string;
  icon: typeof Bell;
  category: string;
}

const notificationToggles: ToggleSetting[] = [
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email', icon: Mail, category: 'Communication' },
  { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications', icon: Bell, category: 'Communication' },
  { key: 'examReminders', label: 'Exam Reminders', description: 'Reminders before upcoming exams', icon: Zap, category: 'Exam' },
  { key: 'goalReminders', label: 'Goal Reminders', description: 'Reminders for goal deadlines', icon: Check, category: 'Goals' },
  { key: 'weeklyReport', label: 'Weekly Report', description: 'Weekly performance summary', icon: Settings, category: 'Reports' },
  { key: 'newFeatureAlerts', label: 'New Features', description: 'Get notified about new features', icon: Zap, category: 'App' },
  { key: 'marketingEmails', label: 'Marketing Emails', description: 'Tips, offers, and updates', icon: Mail, category: 'Marketing' },
];

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const profile = useUserStore((s) => s.profile);
  const [localName, setLocalName] = useState<string | null>(null);
  const [localEmail, setLocalEmail] = useState<string | null>(null);
  const accountName = localName ?? profile?.name ?? '';
  const accountEmail = localEmail ?? profile?.email ?? '';
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

  const enabledCount = notificationToggles.filter(t => s?.[t.key]).length;

  const handleAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocalName(e.target.value);
  const handleAccountEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocalEmail(e.target.value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm">
            <Settings className="size-5 text-white drop-shadow-sm" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Settings</h2>
            <p className="text-xs text-muted-foreground">Manage your app preferences and account</p>
          </div>
        </div>
        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" onClick={handleSave} disabled={saveMutation.isPending}>
          <Save className="size-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Account Settings */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <Settings className="size-4" />
                </div>
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <Input className="mt-1.5" value={accountName} onChange={handleAccountNameChange} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <Input className="mt-1.5" value={accountEmail} onChange={handleAccountEmailChange} type="email" />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Lock, label: 'Change Password', action: () => toast.info('Change password dialog would open'), className: '' },
                  { icon: Globe, label: 'Linked Accounts', action: () => toast.info('Linked accounts would open'), className: '' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button key={item.label} variant="outline" size="sm" className={cn('gap-2 text-xs h-auto py-2.5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200', item.className)} onClick={item.action}>
                      <Icon className="size-3.5" /> {item.label}
                    </Button>
                  );
                })}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 text-xs h-auto py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800 hover:shadow-sm transition-all duration-200">
                      <Trash2 className="size-3.5" /> Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
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
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  <Bell className="size-4" />
                </div>
                Notification Settings
                <Badge variant="secondary" className="text-[10px] ml-auto font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {enabledCount}/{notificationToggles.length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {notificationToggles.map((toggle, i) => {
                const Icon = toggle.icon;
                const isOn = !!s?.[toggle.key];
                return (
                  <div key={toggle.key}>
                    <div className="flex items-center justify-between py-3 px-1 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'flex size-8 items-center justify-center rounded-lg shrink-0 mt-0.5 transition-colors duration-200',
                          isOn ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-muted text-muted-foreground',
                        )}>
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <p className={cn('text-sm font-medium transition-colors', isOn ? 'text-foreground' : 'text-muted-foreground')}>{toggle.label}</p>
                          <p className="text-xs text-muted-foreground">{toggle.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={isOn}
                        onCheckedChange={() => handleToggle(toggle.key)}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>
                    {i < notificationToggles.length - 1 && <Separator />}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  <Globe className="size-4" />
                </div>
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Language', value: s?.language || 'english', key: 'language' as keyof UserSettings, options: [{ v: 'english', l: 'English' }, { v: 'hindi', l: 'Hindi' }] },
                  { label: 'Date Format', value: s?.dateFormat || 'DD/MM/YYYY', key: 'dateFormat' as keyof UserSettings, options: [{ v: 'DD/MM/YYYY', l: 'DD/MM/YYYY' }, { v: 'MM/DD/YYYY', l: 'MM/DD/YYYY' }, { v: 'YYYY-MM-DD', l: 'YYYY-MM-DD' }] },
                  { label: 'Week Starts On', value: s?.weekStart || 'monday', key: 'weekStart' as keyof UserSettings, options: [{ v: 'monday', l: 'Monday' }, { v: 'sunday', l: 'Sunday' }] },
                  { label: 'Time Format', value: s?.timeFormat || '12h', key: 'timeFormat' as keyof UserSettings, options: [{ v: '12h', l: '12-hour' }, { v: '24h', l: '24-hour' }] },
                ].map((pref) => (
                  <div key={pref.label}>
                    <Label className="text-xs text-muted-foreground">{pref.label}</Label>
                    <Select value={pref.value} onValueChange={(v) => handleSelectChange(pref.key, v)}>
                      <SelectTrigger className="mt-1.5 hover:bg-muted/50 transition-colors"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {pref.options.map((opt) => (
                          <SelectItem key={opt.v} value={opt.v}>{opt.l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                  <Shield className="size-4" />
                </div>
                Privacy &amp; Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'flex size-8 items-center justify-center rounded-lg transition-colors',
                    s?.privacyMode ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-muted text-muted-foreground',
                  )}>
                    {s?.privacyMode ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Privacy Mode</p>
                    <p className="text-xs text-muted-foreground">Hide sensitive data from dashboard</p>
                  </div>
                </div>
                <Switch checked={s?.privacyMode || false} onCheckedChange={() => handleToggle('privacyMode')} className="data-[state=checked]:bg-emerald-600" />
              </div>
              <Separator />
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: HardDrive, label: 'Data Backup', action: () => toast.success('Backup started!'), className: '' },
                  { icon: Download, label: 'Export Data', action: handleExport, className: '' },
                  { icon: Trash2, label: 'Clear Local Cache', action: handleClearCache, className: '' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button key={item.label} variant="outline" size="sm" className={cn('gap-2 text-xs h-auto py-2.5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200', item.className)} onClick={item.action}>
                      <Icon className="size-3.5" /> {item.label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  <Palette className="size-4" />
                </div>
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-xs text-muted-foreground mb-3 block font-medium">Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', icon: Sun, label: 'Light', desc: 'Clean & bright' },
                    { value: 'dark', icon: Moon, label: 'Dark', desc: 'Easy on eyes' },
                    { value: 'system', icon: Monitor, label: 'System', desc: 'Auto detect' },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isActive = theme === t.value;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={cn(
                          'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
                          isActive
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-md'
                            : 'border-transparent bg-muted/50 hover:border-border',
                        )}
                      >
                        <div className={cn(
                          'flex size-10 items-center justify-center rounded-xl transition-colors',
                          isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-muted text-muted-foreground',
                        )}>
                          <Icon className="size-5" />
                        </div>
                        <div className="text-center">
                          <p className={cn('text-sm font-semibold', isActive ? 'text-foreground' : 'text-muted-foreground')}>{t.label}</p>
                          <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                        </div>
                        {isActive && (
                          <div className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-emerald-600">
                            <Check className="size-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-xs text-muted-foreground mb-3 block font-medium">Accent Color</Label>
                <div className="flex gap-4">
                  {accentColors.map((c) => {
                    const isActive = selectedAccent === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => handleSelectChange('accentColor', c.name)}
                        className={cn(
                          'flex flex-col items-center gap-2 transition-all duration-200',
                          isActive ? 'scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100',
                        )}
                      >
                        <div className={cn(
                          'size-10 rounded-full transition-all shadow-sm',
                          c.class,
                          isActive ? `ring-2 ring-offset-2 ring-offset-background ${c.ring} shadow-md` : '',
                        )} />
                        <span className={cn('text-[11px] font-medium transition-colors', isActive ? 'text-foreground' : 'text-muted-foreground')}>
                          {c.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                  <Info className="size-4" />
                </div>
                About &amp; Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Version</span>
                <Badge variant="secondary" className="font-semibold">1.0.0</Badge>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-200" onClick={() => toast.info('Terms of Service')}>
                  Terms of Service
                </button>
                <button className="flex-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-200" onClick={() => toast.info('Privacy Policy')}>
                  Privacy Policy
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-emerald-500/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-semibold text-sm">Settings Tips</h4>
              </div>
              <div className="space-y-3">
                {['Enable push notifications for exam reminders', 'Set your weekly report day for best insights', 'Use privacy mode when sharing your screen'].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className={cn(
                      'flex size-5 items-center justify-center rounded-full text-[11px] font-bold shrink-0 mt-0.5',
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
                    )}>
                      {i + 1}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="size-4 text-emerald-600" /> Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Notifications Enabled', value: `${enabledCount}/${notificationToggles.length}`, color: '' },
                { label: 'Current Theme', value: (theme || 'system'), color: '' },
                { label: 'Accent Color', value: selectedAccent, color: '' },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    {item.label === 'Accent Color' ? (
                      <div className="flex items-center gap-2">
                        <div className={cn('size-4 rounded-full', accentColors.find(c => c.name === selectedAccent)?.class || 'bg-emerald-500')} />
                        <span className="text-sm font-semibold capitalize">{item.value}</span>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold capitalize">{item.value}</span>
                    )}
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
