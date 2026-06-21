'use client';

import { useState, useCallback } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  FileText,
  GripVertical,
  ChevronDown,
} from 'lucide-react';
import { useNavigationStore } from '@/store/navigation';
import {
  getReflectionExamOptions,
  getReflection,
  getReflections,
  getExam,
  createReflection,
  updateReflection,
  type Reflection,
  type ReflectionSection,
  type Exam,
} from '@/lib/api';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// ── Constants ────────────────────────────────────────────────
const DIFFICULTY_OPTIONS = ['Easy', 'Moderate', 'Hard', 'Very Hard'];
const EMOTIONAL_OPTIONS = ['Confident', 'Anxious', 'Neutral', 'Frustrated'];
const MISTAKE_TAG_OPTIONS = [
  'Time Management',
  'Concept Gap',
  'Silly Mistakes',
  'Calculation Errors',
  'Pressure Handling',
  'Guessing',
  'Revision Gap',
  'Speed Issues',
  'Accuracy',
  'Question Selection',
];
const STRENGTH_TAG_OPTIONS = [
  'Strong in Reasoning',
  'Good Speed',
  'Accurate in English',
  'Strong Quant',
  'Good GK',
  'Puzzle Solver',
  'Fast Reader',
];
const REMINDER_TYPE_OPTIONS = [
  '1 Day Before',
  '3 Days Before',
  '1 Week Before',
  'Custom',
];

interface SectionReflection {
  section: string;
  score: string;
  strength: string;
  weakness: string;
  actionPlan: string;
}

// ── Component ────────────────────────────────────────────────
export default function ReflectionsPage() {
  const { navigate, previousPage } = useNavigationStore();
  const queryClient = useQueryClient();

  // editing reflection id (passed via store or query param style)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [manualExamData, setExamData] = useState<Exam | null>(null);

  // Form state
  const [difficulty, setDifficulty] = useState('');
  const [confidence, setConfidence] = useState(50);
  const [emotionalState, setEmotionalState] = useState('');
  const [mistakeTags, setMistakeTags] = useState<string[]>([]);
  const [strengthTags, setStrengthTags] = useState<string[]>([]);
  const [whatWentWrong, setWhatWentWrong] = useState('');
  const [whatWentWell, setWhatWentWell] = useState('');
  const [biggestLesson, setBiggestLesson] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [targetScore, setTargetScore] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [manualSections, setSectionReflections] = useState<SectionReflection[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [reminderType, setReminderType] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  // ── Queries ─────────────────────────────────────────────
  const { data: examOptions, isLoading: loadingOptions } = useQuery({
    queryKey: ['reflection-exam-options'],
    queryFn: getReflectionExamOptions,
  });

  const { data: reflections, isLoading: loadingReflections } = useQuery({
    queryKey: ['reflections-list'],
    queryFn: () => getReflections(),
  });

  const { data: selectedExam, isLoading: loadingExam } = useQuery({
    queryKey: ['exam-for-reflection', selectedExamId],
    queryFn: () => getExam(selectedExamId!),
    enabled: !!selectedExamId,
  });

  // Derive examData from query result (avoids synchronous setState in effect)
  const derivedExamData = selectedExam;
  const derivedSections = selectedExam?.sectionalScores?.length
    ? selectedExam.sectionalScores.map((s) => ({
        section: s.section,
        score: String(s.score ?? ''),
        strength: '',
        weakness: '',
        actionPlan: '',
      }))
    : [];
  // examData and sectionReflections prefer manually-set values (from loadReflection), else use query-derived
  const examData = manualExamData || derivedExamData;
  const sectionReflections = manualSections.length > 0 ? manualSections : derivedSections;

  // ── Load existing reflection ────────────────────────────
  const loadReflection = useCallback(
    (r: Reflection) => {
      setEditingId(r.id);
      if (r.examId) {
        setSelectedExamId(r.examId);
        getExam(r.examId).then((exam) => {
          setExamData(exam);
          if (exam.sectionalScores?.length) {
            const sectionMap = new Map(
              r.sections?.map((s) => [s.section, s]) ?? []
            );
            setSectionReflections(
              exam.sectionalScores.map((s) => {
                const existing = sectionMap.get(s.section);
                return {
                  section: s.section,
                  score: existing?.score != null ? String(existing.score) : String(s.score ?? ''),
                  strength: existing?.strength ?? '',
                  weakness: existing?.weakness ?? '',
                  actionPlan: existing?.actionPlan ?? '',
                };
              })
            );
          }
        });
      }
      setDifficulty(r.difficulty ?? '');
      setConfidence(r.confidence ?? 50);
      setEmotionalState(r.emotionalState ?? '');
      setMistakeTags(r.mistakeTags ? r.mistakeTags.split(',').filter(Boolean) : []);
      setStrengthTags(r.strengthTags ? r.strengthTags.split(',').filter(Boolean) : []);
      setWhatWentWrong(r.whatWentWrong ?? '');
      setWhatWentWell(r.whatWentWell ?? '');
      setBiggestLesson(r.biggestLesson ?? '');
      setActionPlan(r.actionPlan ?? '');
      setTargetScore(r.targetScore != null ? String(r.targetScore) : '');
      setGoalDescription(r.goalDescription ?? '');
      setReminderType(r.reminderType ?? '');
      setReminderDate(r.reminderDate ?? '');
    },
    []
  );

  // ── Mutations ───────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: (data: Parameters<typeof createReflection>[0]) => {
      if (editingId) return updateReflection(editingId, data);
      return createReflection(data);
    },
    onSuccess: () => {
      toast.success(editingId ? 'Reflection updated!' : 'Reflection saved!');
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      queryClient.invalidateQueries({ queryKey: ['reflection-exam-options'] });
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['weakness'] });
      navigate('history');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to save reflection');
    },
  });

  // ── Handlers ────────────────────────────────────────────
  const toggleTag = (tag: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag]);
  };

  const updateSection = (idx: number, field: keyof SectionReflection, value: string) => {
    setSectionReflections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = () => {
    if (!selectedExamId) {
      toast.error('Please select an exam');
      return;
    }
    const payload: Parameters<typeof createReflection>[0] = {
      examId: selectedExamId,
      examName: examData?.name ?? '',
      examDate: examData?.examDate ?? null,
      score: examData?.score ?? null,
      cutoff: examData?.cutoff ?? null,
      gap: examData?.cutoffGap ?? null,
      result: examData?.result ?? null,
      difficulty: difficulty || null,
      confidence,
      emotionalState: emotionalState || null,
      mistakeTags: mistakeTags.length ? mistakeTags.join(',') : null,
      strengthTags: strengthTags.length ? strengthTags.join(',') : null,
      whatWentWrong: whatWentWrong || null,
      whatWentWell: whatWentWell || null,
      biggestLesson: biggestLesson || null,
      actionPlan: actionPlan || null,
      targetScore: targetScore ? Number(targetScore) : null,
      goalDescription: goalDescription || null,
      reminderType: reminderType || null,
      reminderDate: reminderDate || null,
      sections: sectionReflections.map((s) => ({
        section: s.section,
        score: s.score ? Number(s.score) : undefined,
        strength: s.strength || undefined,
        weakness: s.weakness || undefined,
        actionPlan: s.actionPlan || undefined,
      })),
    };
    saveMutation.mutate(payload);
  };

  const handleCancel = () => {
    resetForm();
    if (previousPage && previousPage !== 'reflections') {
      navigate(previousPage);
    } else {
      navigate('history');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedExamId(null);
    setExamData(null);
    setDifficulty('');
    setConfidence(50);
    setEmotionalState('');
    setMistakeTags([]);
    setStrengthTags([]);
    setWhatWentWrong('');
    setWhatWentWell('');
    setBiggestLesson('');
    setActionPlan('');
    setTargetScore('');
    setGoalDescription('');
    setSectionReflections([]);
    setAttachments([]);
    setReminderType('');
    setReminderDate('');
  };

  const handleSelectExam = (examId: string) => {
    if (editingId) return; // don't switch exam when editing
    resetForm();
    setSelectedExamId(examId);
  };

  const addAttachment = (name: string) => {
    setAttachments((prev) => [...prev, name]);
  };

  const removeAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Render helpers ──────────────────────────────────────
  const ToggleButton = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
          : 'border-border bg-background text-muted-foreground hover:border-emerald-400 hover:text-emerald-600'
      }`}
    >
      {label}
    </button>
  );

  const resultColor = (r: string) => {
    if (r === 'Qualified' || r === 'qualified') return 'text-emerald-600 dark:text-emerald-400';
    if (r === 'Not Qualified' || r === 'not-qualified') return 'text-red-600 dark:text-red-400';
    return 'text-muted-foreground';
  };

  // ── Loading state ───────────────────────────────────────
  if (loadingOptions && loadingReflections) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const existingReflections = reflections ?? [];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(previousPage ?? 'history')}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Exam Reflection</h1>
            <p className="text-sm text-muted-foreground">
              {editingId ? 'Edit your reflection' : 'Create a detailed reflection for an exam'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('history')}
          className="self-start sm:self-auto"
        >
          <ArrowLeft className="mr-1.5 size-3.5" />
          Back to History
        </Button>
      </div>

      {/* ── Existing reflections (when no exam selected) ── */}
      {!selectedExamId && !editingId && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select Exam to Reflect On</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedExamId ?? ''} onValueChange={handleSelectExam}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an exam..." />
                </SelectTrigger>
                <SelectContent>
                  {examOptions?.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name} — {e.examDate}
                    </SelectItem>
                  ))}
                  {(!examOptions || examOptions.length === 0) && (
                    <SelectItem value="__none" disabled>
                      No exams available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {existingReflections.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Existing Reflections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {existingReflections.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => loadReflection(r)}
                      className="flex w-full items-center justify-between rounded-lg border p-3 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">{r.examName}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.examDate} · Score: {r.score} · {r.difficulty}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {r.emotionalState}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ── Reflection Form ─────────────────────────────── */}
      {selectedExamId && (
        <div className="space-y-6">
          {/* Exam Summary Card */}
          <Card className="border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10">
            <CardContent className="p-4">
              {loadingExam ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ) : examData ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <FileText className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{examData.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {examData.examDate} · {examData.category} · Attempt #{examData.attempt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Score</p>
                      <p className="font-semibold">{examData.score}/{examData.maxScore}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Cutoff</p>
                      <p className="font-semibold">{examData.cutoff}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Gap</p>
                      <p className={`font-semibold ${examData.cutoffGap != null && examData.cutoffGap < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {examData.cutoffGap != null ? `${examData.cutoffGap > 0 ? '+' : ''}${examData.cutoffGap}` : '—'}
                      </p>
                    </div>
                    <Badge
                      variant={examData.result === 'Qualified' || examData.result === 'qualified' ? 'default' : 'destructive'}
                      className={examData.result === 'Qualified' || examData.result === 'qualified' ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600' : ''}
                    >
                      {examData.result}
                    </Badge>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* 1. Exam Experience */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">1. Exam Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <ToggleButton
                      key={d}
                      label={d}
                      active={difficulty === d}
                      onClick={() => setDifficulty(difficulty === d ? '' : d)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Confidence Level</Label>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {confidence}%
                  </span>
                </div>
                <Slider
                  value={[confidence]}
                  onValueChange={(v) => setConfidence(v[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="[&_[data-slot=slider-range]]:bg-emerald-500 [&_[data-slot=slider-thumb]]:border-emerald-500"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Not Confident</span>
                  <span>Very Confident</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Emotional State</Label>
                <div className="flex flex-wrap gap-2">
                  {EMOTIONAL_OPTIONS.map((e) => (
                    <ToggleButton
                      key={e}
                      label={e}
                      active={emotionalState === e}
                      onClick={() => setEmotionalState(emotionalState === e ? '' : e)}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Mistake Tags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">2. Mistake Tags</CardTitle>
              <p className="text-xs text-muted-foreground">Select the mistakes you made</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {MISTAKE_TAG_OPTIONS.map((tag) => (
                  <ToggleButton
                    key={tag}
                    label={tag}
                    active={mistakeTags.includes(tag)}
                    onClick={() => toggleTag(tag, mistakeTags, setMistakeTags)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 3. Strength Tags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">3. Strength Tags</CardTitle>
              <p className="text-xs text-muted-foreground">Select areas where you performed well</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {STRENGTH_TAG_OPTIONS.map((tag) => (
                  <ToggleButton
                    key={tag}
                    label={tag}
                    active={strengthTags.includes(tag)}
                    onClick={() => toggleTag(tag, strengthTags, setStrengthTags)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 4. What Went Wrong */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">4. What Went Wrong</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe what didn't go as planned..."
                value={whatWentWrong}
                onChange={(e) => setWhatWentWrong(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* 5. What Went Well */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">5. What Went Well</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe what went well..."
                value={whatWentWell}
                onChange={(e) => setWhatWentWell(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* 6. Biggest Lesson */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">6. Biggest Lesson</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What's the most important thing you learned from this exam?"
                value={biggestLesson}
                onChange={(e) => setBiggestLesson(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* 7. Action Plan */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">7. Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What specific actions will you take before the next attempt?"
                value={actionPlan}
                onChange={(e) => setActionPlan(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* 8. Next Attempt Goal */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">8. Next Attempt Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Target Score</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 85"
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Score</Label>
                  <Input
                    type="text"
                    value={examData?.score ?? '—'}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Goal Description</Label>
                <Textarea
                  placeholder="Describe your goal for the next attempt..."
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* 9. Section-wise Reflection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">9. Section-wise Reflection</CardTitle>
              <p className="text-xs text-muted-foreground">
                Analyze each section of the exam
              </p>
            </CardHeader>
            <CardContent>
              {sectionReflections.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No sectional data available for this exam.
                </p>
              ) : (
                <div className="overflow-x-auto -mx-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Section</TableHead>
                        <TableHead className="min-w-[80px]">Score</TableHead>
                        <TableHead className="min-w-[140px]">Strength</TableHead>
                        <TableHead className="min-w-[140px]">Weakness</TableHead>
                        <TableHead className="min-w-[160px]">Action Plan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sectionReflections.map((sec, idx) => (
                        <TableRow key={sec.section}>
                          <TableCell className="font-medium text-sm">
                            {sec.section}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="—"
                              value={sec.score}
                              onChange={(e) => updateSection(idx, 'score', e.target.value)}
                              className="h-8 w-20 text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Strength..."
                              value={sec.strength}
                              onChange={(e) => updateSection(idx, 'strength', e.target.value)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Weakness..."
                              value={sec.weakness}
                              onChange={(e) => updateSection(idx, 'weakness', e.target.value)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Action plan..."
                              value={sec.actionPlan}
                              onChange={(e) => updateSection(idx, 'actionPlan', e.target.value)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 10. Attachments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">10. Attachments</CardTitle>
              <p className="text-xs text-muted-foreground">
                Add notes, screenshots, or reference materials
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer"
                onClick={() => {
                  const name = `attachment-${attachments.length + 1}.png`;
                  addAttachment(name);
                  toast.success(`Added ${name}`);
                }}
              >
                <Upload className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to add attachment
                </p>
              </div>
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border p-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        <span className="text-sm">{file}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                        onClick={() => removeAttachment(idx)}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 11. Reminder */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">11. Reminder</CardTitle>
              <p className="text-xs text-muted-foreground">
                Set a reminder for your next study session or exam prep
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Reminder Type</Label>
                  <Select value={reminderType} onValueChange={setReminderType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {REMINDER_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reminder Date</Label>
                  <Input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Footer Buttons ─────────────────────────────── */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="min-w-[120px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="min-w-[160px] bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Save className="mr-2 size-4" />
              {saveMutation.isPending
                ? 'Saving...'
                : editingId
                  ? 'Update Reflection'
                  : 'Save Reflection'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}