'use client';

import { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Camera, Pencil, Download, HardDrive,
  BookOpen, Trophy, Star, Clock, BrainCircuit, Target, Shield, Plus,
  Lock, MonitorSmartphone, Trash2, BarChart3, Crown, GraduationCap,
  Flame, Calendar, Award, Sparkles, ChevronRight, Zap,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  getUser, getUserProgress, getUserAchievements, updateUser,
  type UserProfile, type UserProgress, type Achievement,
} from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useNavigationStore } from '@/store/navigation';

const achievementIcons = [Trophy, Star, BarChart3, Shield, BookOpen];
const achievementColors = [
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
];
const achievementBorderColors = [
  'border-l-amber-500',
  'border-l-emerald-500',
  'border-l-teal-500',
  'border-l-rose-500',
  'border-l-violet-500',
];

const examFocusConfig = [
  { label: 'Primary Exam', icon: GraduationCap, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  { label: 'Secondary Exam', icon: Target, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' },
  { label: 'Target Year', icon: Calendar, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  { label: 'Stage', icon: BarChart3, color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  { label: 'Language', icon: Sparkles, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
  { label: 'Study Time', icon: Clock, color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
];

const studyPrefConfig = [
  { label: 'Preferred Time', icon: Sun, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  { label: 'Hours/Day', icon: Clock, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  { label: 'Learning Mode', icon: BrainCircuit, color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  { label: 'Weekend Study', icon: Flame, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' },
];

function Sun(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigationStore((s) => s.navigate);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', location: '',
    primaryExam: '', secondaryExam: '', targetYear: '', stage: '', language: '', studyTime: '',
  });

  const { data: user, isLoading: userLoading } = useQuery({ queryKey: ['user'], queryFn: getUser });
  const { data: progress } = useQuery({ queryKey: ['userProgress'], queryFn: getUserProgress });
  const { data: achievements } = useQuery({ queryKey: ['userAchievements'], queryFn: getUserAchievements });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setEditOpen(false);
      toast.success('Profile updated!');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const openEdit = () => {
    if (user) {
      setForm({
        name: user.name, email: user.email, phone: user.phone || '',
        location: user.location || '', primaryExam: user.primaryExam || '',
        secondaryExam: user.secondaryExam || '', targetYear: user.targetYear || '',
        stage: user.currentStage || '', language: user.language || '', studyTime: user.studyTime || '',
      });
    }
    setEditOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) { toast.error('Name and email are required'); return; }
    updateMutation.mutate(form);
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const examInterests = [
    { name: 'CAT 2025', type: 'primary' },
    { name: 'GATE CS', type: 'primary' },
    { name: 'UPSC', type: 'secondary' },
    { name: 'GMAT', type: 'secondary' },
    { name: 'GRE', type: 'secondary' },
  ];

  const achievementData = achievements || Array.from({ length: 5 }, (_, i) => ({
    label: ['First Exam', '3-Day Streak', 'Score 80+', '5 Goals', 'Reflection Pro'][i],
    sub: ['Completed your first exam', 'Studied 3 days in a row', 'Scored above 80%', 'Set 5 goals', 'Wrote 5 reflections'][i],
    unlocked: true,
  }));

  if (userLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm">
            <User className="size-5 text-white drop-shadow-sm" />
          </div>
          <div>
            <h2 className="text-xl font-bold">My Profile</h2>
            <p className="text-xs text-muted-foreground">Manage your personal information and preferences</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" onClick={openEdit}>
          <Pencil className="size-4" /> Edit Profile
        </Button>
      </div>

      {/* Profile Header with Cover Banner */}
      <Card className="overflow-hidden rounded-2xl">
        {/* Cover/Banner Area */}
        <div className="relative h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-4 -right-4 size-32 rounded-full bg-white/20 blur-xl" />
            <div className="absolute -bottom-8 -left-8 size-40 rounded-full bg-white/15 blur-xl" />
            <div className="absolute top-4 left-1/2 size-24 rounded-full bg-white/10 blur-lg" />
          </div>
        </div>
        {/* User Info Overlay */}
        <CardContent className="p-6 pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-12">
            <div className="relative group">
              <Avatar className="size-24 ring-4 ring-white dark:ring-card shadow-lg">
                <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl dark:bg-emerald-900/50 dark:text-emerald-300">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:scale-110 transition-all duration-200">
                <Camera className="size-3.5" />
              </button>
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold">{user?.name || '—'}</h3>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-semibold uppercase tracking-wide">
                  {user?.role || 'User'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Mail className="size-3.5" /> {user?.email || '—'}
                </span>
                {user?.memberSince && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Clock className="size-3.5" /> Joined {format(new Date(user.memberSince), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { icon: Phone, label: 'Phone', value: user?.phone },
              { icon: MapPin, label: 'Location', value: user?.location },
              { icon: Target, label: 'Role', value: user?.role },
              { icon: Award, label: 'Plan', value: user?.plan || 'Free' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{item.label}</p>
                    <p className="text-sm font-medium capitalize">{item.value || '—'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* My Exam Focus */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <BookOpen className="size-4" />
                </div>
                My Exam Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {examFocusConfig.map((item) => {
                  const Icon = item.icon;
                  const valueKey = item.label.toLowerCase().replace(/ /g, '') as keyof UserProfile;
                  const value = (user as unknown as Record<string, string | undefined>)?.[
                    item.label === 'Primary Exam' ? 'primaryExam' :
                    item.label === 'Secondary Exam' ? 'secondaryExam' :
                    item.label === 'Target Year' ? 'targetYear' :
                    item.label === 'Stage' ? 'currentStage' :
                    item.label === 'Language' ? 'language' : 'studyTime'
                  ];
                  return (
                    <div key={item.label} className="p-3 rounded-xl border bg-card hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                      <div className={cn('flex size-8 items-center justify-center rounded-lg mb-2', item.color)}>
                        <Icon className="size-4" />
                      </div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{item.label}</p>
                      <p className="font-semibold text-sm capitalize mt-0.5">{value || '—'}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                  <Shield className="size-4" />
                </div>
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { icon: Lock, label: 'Change Password', action: () => toast.info('Change password dialog would open'), className: '' },
                  { icon: Mail, label: 'Update Email', action: () => toast.info('Update email dialog would open'), className: '' },
                  { icon: Phone, label: 'Update Phone', action: () => toast.info('Update phone dialog would open'), className: '' },
                  { icon: MonitorSmartphone, label: 'Manage Devices', action: () => toast.info('Manage devices dialog would open'), className: '' },
                  { icon: Trash2, label: 'Delete Account', action: () => toast.error('Account deletion requires confirmation'), className: 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button key={item.label} variant="outline" className={cn('gap-2 justify-start text-sm h-auto py-3 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200', item.className)} onClick={item.action}>
                      <Icon className="size-4" /> {item.label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  <BarChart3 className="size-4" />
                </div>
                Progress Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: 'Exams Tracked', value: progress?.examsTracked ?? 0, icon: GraduationCap, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
                  { label: 'Attempted', value: progress?.examsAttempted ?? 0, icon: Zap, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
                  { label: 'Qualified', value: progress?.examsQualified ?? 0, icon: Trophy, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' },
                  { label: 'Avg Score', value: progress?.averageScore ?? 0, icon: BarChart3, color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
                  { label: 'Best Score', value: progress?.bestScore ?? 0, icon: Star, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="text-center p-3 rounded-xl bg-muted/50 hover:bg-muted/80 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                      <div className={cn('flex size-8 items-center justify-center rounded-lg mx-auto mb-2', item.color)}>
                        <Icon className="size-4" />
                      </div>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{item.value}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  <Trophy className="size-4" />
                </div>
                Achievements
                <Badge variant="secondary" className="text-[10px] ml-auto font-semibold">{achievementData.length} Unlocked</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {achievementData.map((a, i) => {
                  const Icon = achievementIcons[i % achievementIcons.length];
                  const colorClass = achievementColors[i % achievementColors.length];
                  const borderClass = achievementBorderColors[i % achievementBorderColors.length];
                  return (
                    <div key={i} className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border-l-[3px] bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
                      borderClass,
                    )}>
                      <div className={cn('flex size-10 items-center justify-center rounded-xl shrink-0 shadow-sm', colorClass)}>
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{a.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{a.sub}</p>
                      </div>
                      <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 shrink-0">
                        <Sparkles className="size-3" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Exam Interests */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  <Target className="size-4" />
                </div>
                Exam Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {examInterests.map((e) => (
                  <Badge key={e.name} variant={e.type === 'primary' ? 'default' : 'secondary'} className={cn(
                    e.type === 'primary' ? 'bg-emerald-600 hover:bg-emerald-700' : 'hover:bg-muted',
                    'gap-1.5 py-1.5 px-3 transition-all duration-200 hover:shadow-sm',
                  )}>
                    {e.type === 'primary' && <Star className="size-3" />}
                    {e.name}
                    <span className="text-[10px] opacity-70 capitalize">{e.type}</span>
                  </Badge>
                ))}
                <Button variant="outline" size="sm" className="gap-1 h-7 text-xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200" onClick={() => toast.info('Add exam dialog would open')}>
                  <Plus className="size-3" /> Add Exam
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Study Preferences */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  <BrainCircuit className="size-4" />
                </div>
                Study Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Preferred Time', value: user?.preferredTime || 'Morning', icon: studyPrefConfig[0].icon, color: studyPrefConfig[0].color },
                  { label: 'Hours/Day', value: user?.hoursPerDay || '4-6 hrs', icon: studyPrefConfig[1].icon, color: studyPrefConfig[1].color },
                  { label: 'Learning Mode', value: user?.learningMode || 'Visual', icon: studyPrefConfig[2].icon, color: studyPrefConfig[2].color },
                  { label: 'Weekend Study', value: user?.weekendStudy || 'Yes', icon: studyPrefConfig[3].icon, color: studyPrefConfig[3].color },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="p-3 rounded-xl border bg-card hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                      <div className={cn('flex size-8 items-center justify-center rounded-lg mb-2', item.color)}>
                        <Icon className="size-4" />
                      </div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{item.label}</p>
                      <p className="font-semibold text-sm mt-0.5">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Data & Backup */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <HardDrive className="size-4" />
                </div>
                Data &amp; Backup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2 text-sm hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200" onClick={() => toast.success('Export started')}>
                  <Download className="size-4" /> Export Data
                </Button>
                <Button variant="outline" className="gap-2 text-sm hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200" onClick={() => toast.success('Download started')}>
                  <Download className="size-4" /> Download Backup
                </Button>
                <Button className="gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" onClick={() => toast.success('Backup created!')}>
                  <HardDrive className="size-4" /> Backup Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Plan Info */}
          <Card className="border-emerald-500/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="size-4 text-emerald-600 dark:text-emerald-400" />
                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Current Plan</p>
              </div>
              <p className="text-xl font-bold capitalize">{user?.plan || 'Free'}</p>
              <p className="text-xs text-muted-foreground mt-1">Upgrade for advanced analytics</p>
              <Button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 hover:shadow-md transition-all duration-200 text-sm" onClick={() => navigate('upgrade')}>
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="size-4 text-emerald-600" /> Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Total Reflections', value: achievements?.length ?? 0, color: '' },
                { label: 'Best Score', value: progress?.bestScore ?? 0, color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Exams Qualified', value: progress?.examsQualified ?? 0, color: 'text-teal-600 dark:text-teal-400' },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className={cn('text-sm font-bold tabular-nums', item.color)}>{item.value}</span>
                  </div>
                  {i < 2 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Account Health */}
          <Card className="rounded-2xl border-emerald-500/30">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 shrink-0">
                  <Shield className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Profile Complete</p>
                  <p className="text-xs text-muted-foreground">Keep your profile updated for best experience</p>
                </div>
              </div>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">75% complete</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <Pencil className="size-4" />
              </div>
              Edit Profile
            </DialogTitle>
            <DialogDescription>Update your personal information and exam preferences</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2 max-h-[60vh] overflow-y-auto pr-1">
            {/* Personal Info Section */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User className="size-3" /> Personal Information
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input className="mt-1.5" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input type="email" className="mt-1.5" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Phone</Label>
                  <Input className="mt-1.5" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input className="mt-1.5" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Exam Preferences Section */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <GraduationCap className="size-3" /> Exam Preferences
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Primary Exam</Label>
                  <Input className="mt-1.5" placeholder="e.g. CAT 2025" value={form.primaryExam} onChange={(e) => setForm(f => ({ ...f, primaryExam: e.target.value }))} />
                </div>
                <div>
                  <Label>Secondary Exam</Label>
                  <Input className="mt-1.5" value={form.secondaryExam} onChange={(e) => setForm(f => ({ ...f, secondaryExam: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Target Year</Label>
                  <Input className="mt-1.5" placeholder="e.g. 2025" value={form.targetYear} onChange={(e) => setForm(f => ({ ...f, targetYear: e.target.value }))} />
                </div>
                <div>
                  <Label>Stage</Label>
                  <Select value={form.stage} onValueChange={(v) => setForm(f => ({ ...f, stage: v }))}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select stage" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preparation">Preparation</SelectItem>
                      <SelectItem value="applying">Applying</SelectItem>
                      <SelectItem value="results">Awaiting Results</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Study Preferences Section */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BrainCircuit className="size-3" /> Study Preferences
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Language</Label>
                  <Select value={form.language} onValueChange={(v) => setForm(f => ({ ...f, language: v }))}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Study Time</Label>
                  <Select value={form.studyTime} onValueChange={(v) => setForm(f => ({ ...f, studyTime: v }))}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select time" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 hover:shadow-md transition-all duration-200" onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
