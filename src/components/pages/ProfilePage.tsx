'use client';

import { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Camera, Pencil, Download, HardDrive,
  BookOpen, Trophy, Star, Clock, BrainCircuit, Target, Shield, Plus,
  Lock, MonitorSmartphone, Trash2, BarChart3,
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

const achievementIcons = [Trophy, Star, BarChart3, Shield, BookOpen];
const achievementColors = [
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
];

export default function ProfilePage() {
  const queryClient = useQueryClient();
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
        <h2 className="text-xl font-bold">My Profile</h2>
        <Button variant="outline" className="gap-2" onClick={openEdit}>
          <Pencil className="size-4" /> Edit Profile
        </Button>
      </div>

      {/* User Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <Avatar className="size-20">
                <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl dark:bg-emerald-900/50 dark:text-emerald-300">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition-colors">
                <Camera className="size-3.5" />
              </button>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">{user?.name || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{user?.email || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">{user?.phone || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{user?.location || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-semibold capitalize">{user?.role || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-semibold">{user?.memberSince ? format(new Date(user.memberSince), 'MMM d, yyyy') : '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* My Exam Focus */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="size-4 text-emerald-600" /> My Exam Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Primary Exam', value: user?.primaryExam },
                  { label: 'Secondary Exam', value: user?.secondaryExam },
                  { label: 'Target Year', value: user?.targetYear },
                  { label: 'Stage', value: user?.currentStage },
                  { label: 'Language', value: user?.language },
                  { label: 'Study Time', value: user?.studyTime },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-sm capitalize">{item.value || '—'}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="size-4 text-emerald-600" /> Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Button variant="outline" className="gap-2 justify-start text-sm" onClick={() => toast.info('Change password dialog would open')}>
                  <Lock className="size-4" /> Change Password
                </Button>
                <Button variant="outline" className="gap-2 justify-start text-sm" onClick={() => toast.info('Update email dialog would open')}>
                  <Mail className="size-4" /> Update Email
                </Button>
                <Button variant="outline" className="gap-2 justify-start text-sm" onClick={() => toast.info('Update phone dialog would open')}>
                  <Phone className="size-4" /> Update Phone
                </Button>
                <Button variant="outline" className="gap-2 justify-start text-sm" onClick={() => toast.info('Manage devices dialog would open')}>
                  <MonitorSmartphone className="size-4" /> Manage Devices
                </Button>
                <Button variant="outline" className="gap-2 justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => toast.error('Account deletion requires confirmation')}>
                  <Trash2 className="size-4" /> Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="size-4 text-emerald-600" /> Progress Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Exams Tracked', value: progress?.examsTracked ?? 0 },
                  { label: 'Attempted', value: progress?.examsAttempted ?? 0 },
                  { label: 'Qualified', value: progress?.examsQualified ?? 0 },
                  { label: 'Avg Score', value: progress?.averageScore ?? 0 },
                  { label: 'Best Score', value: progress?.bestScore ?? 0 },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Trophy className="size-4 text-amber-500" /> Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(achievements || Array.from({ length: 5 }, (_, i) => ({ label: ['First Exam', '3-Day Streak', 'Score 80+', '5 Goals', 'Reflection Pro'][i], sub: ['Completed your first exam', 'Studied 3 days in a row', 'Scored above 80%', 'Set 5 goals', 'Wrote 5 reflections'][i] }))).map((a, i) => {
                  const Icon = achievementIcons[i % achievementIcons.length];
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={cn('flex size-10 items-center justify-center rounded-lg shrink-0', achievementColors[i % achievementColors.length])}>
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{a.label}</p>
                        <p className="text-xs text-muted-foreground">{a.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Exam Interests */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Target className="size-4 text-teal-600" /> Exam Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {examInterests.map((e) => (
                  <Badge key={e.name} variant={e.type === 'primary' ? 'default' : 'secondary'} className={cn(
                    e.type === 'primary' ? 'bg-emerald-600 hover:bg-emerald-700' : '',
                    'gap-1.5',
                  )}>
                    {e.type === 'primary' && <Star className="size-3" />}
                    {e.name}
                    <span className="text-[10px] opacity-70 capitalize">{e.type}</span>
                  </Badge>
                ))}
                <Button variant="outline" size="sm" className="gap-1 h-7 text-xs" onClick={() => toast.info('Add exam dialog would open')}>
                  <Plus className="size-3" /> Add Exam
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Study Preferences */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BrainCircuit className="size-4 text-violet-500" /> Study Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Preferred Time', value: user?.preferredTime || 'Morning' },
                  { label: 'Hours/Day', value: user?.hoursPerDay || '4-6 hrs' },
                  { label: 'Learning Mode', value: user?.learningMode || 'Visual' },
                  { label: 'Weekend Study', value: user?.weekendStudy || 'Yes' },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data & Backup */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <HardDrive className="size-4 text-emerald-600" /> Data &amp; Backup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2 text-sm" onClick={() => toast.success('Export started')}>
                  <Download className="size-4" /> Export
                </Button>
                <Button variant="outline" className="gap-2 text-sm" onClick={() => toast.success('Download started')}>
                  <Download className="size-4" /> Download
                </Button>
                <Button className="gap-2 text-sm bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.success('Backup created!')}>
                  <HardDrive className="size-4" /> Backup Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Plan Info */}
          <Card className="border-emerald-500/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Current Plan</p>
              <p className="text-xl font-bold mt-1 capitalize">{user?.plan || 'Free'}</p>
              <p className="text-xs text-muted-foreground mt-1">Upgrade for advanced analytics</p>
              <Button className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-sm" onClick={() => toast.info('Upgrade page coming soon!')}>
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total Reflections</span>
                <span className="text-sm font-semibold">{achievements?.length ?? 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Best Score</span>
                <span className="text-sm font-semibold text-emerald-600">{progress?.bestScore ?? 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Exams Qualified</span>
                <span className="text-sm font-semibold text-teal-600">{progress?.examsQualified ?? 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information and exam preferences</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2 max-h-[60vh] overflow-y-auto pr-1">
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input className="mt-1.5" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <Label>Location</Label>
                <Input className="mt-1.5" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
            </div>
            <Separator />
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
            <div className="grid grid-cols-2 gap-4">
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
