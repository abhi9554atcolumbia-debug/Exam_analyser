// 'use client';

// import { useState, useCallback } from 'react';
// import {
//   useQuery,
//   useMutation,
//   useQueryClient,
// } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import {
//   Plus,
//   FileText,
//   Smile,
//   Frown,
//   Meh,
//   Angry,
//   ChevronDown,
//   ChevronUp,
//   PenLine,
//   BookOpen,
//   BrainCircuit,
//   Target,
//   Heart,
//   Sparkles,
//   TrendingUp,
//   TrendingDown,
//   ArrowRight,
//   BarChart3,
//   Eye,
// } from 'lucide-react';
// import { useNavigationStore } from '@/store/navigation';
// import {
//   getReflectionExamOptions,
//   getReflections,
//   getExams,
//   getExam,
//   createReflection,
//   type Reflection,
//   type Exam,
// } from '@/lib/api';

// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Slider } from '@/components/ui/slider';
// import { Badge } from '@/components/ui/badge';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Separator } from '@/components/ui/separator';
// import { cn } from '@/lib/utils';
// import { reflectionFormSchema } from '@/lib/validations';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
//   DialogDescription,
// } from '@/components/ui/dialog';

// // ── Constants ────────────────────────────────────────────────
// const DIFFICULTY_OPTIONS = ['Easy', 'Moderate', 'Hard', 'Very Hard'];
// const EMOTIONAL_OPTIONS = ['Confident', 'Anxious', 'Neutral', 'Disappointed'];

// const EMOTIONAL_CONFIG: Record<string, { icon: React.ElementType; cls: string; bg: string }> = {
//   Confident: {
//     icon: Smile,
//     cls: 'text-emerald-700 dark:text-emerald-300',
//     bg: 'bg-emerald-100 dark:bg-emerald-900/50',
//   },
//   Anxious: {
//     icon: Frown,
//     cls: 'text-amber-700 dark:text-amber-300',
//     bg: 'bg-amber-100 dark:bg-amber-900/50',
//   },
//   Neutral: {
//     icon: Meh,
//     cls: 'text-slate-700 dark:text-slate-300',
//     bg: 'bg-slate-100 dark:bg-slate-900/50',
//   },
//   Disappointed: {
//     icon: Angry,
//     cls: 'text-rose-700 dark:text-rose-300',
//     bg: 'bg-rose-100 dark:bg-rose-900/50',
//   },
// };

// const DIFFICULTY_CONFIG: Record<string, { cls: string; border: string }> = {
//   Easy: { cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', border: 'border-l-emerald-500' },
//   Moderate: { cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800', border: 'border-l-amber-500' },
//   Hard: { cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-800', border: 'border-l-orange-500' },
//   'Very Hard': { cls: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800', border: 'border-l-red-500' },
// };

// // ── Empty State ──────────────────────────────────────────────
// function EmptyReflectionState({ onCreateClick }: { onCreateClick: () => void }) {
//   return (
//     <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 px-6 py-16 text-center">
//       <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
//         <PenLine className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
//       </div>
//       <h3 className="mb-2 text-lg font-semibold text-foreground">No Reflections Yet</h3>
//       <p className="max-w-md text-sm text-muted-foreground">
//         Reflections help you learn from each exam. Track what went well, identify mistakes,
//         and create action plans to improve your performance.
//       </p>
//       <Button
//         className="mt-6 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
//         onClick={onCreateClick}
//       >
//         <Plus className="mr-2 h-4 w-4" />
//         Write Your First Reflection
//       </Button>
//     </div>
//   );
// }

// // ── Section Analysis Cards ─────────────────────────────────
// function SectionAnalysisCards({ sections }: { sections: Reflection['sections'] }) {
//   if (!sections || sections.length === 0) return null;

//   return (
//     <div className="mt-3 space-y-2">
//       <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
//         <BarChart3 className="inline h-3 w-3 mr-1" />Section Analysis
//       </p>
//       <div className="grid gap-2 sm:grid-cols-2">
//         {sections.map((sec) => {
//           const pct = sec.score != null ? Math.round(sec.score) : null;
//           const isStrong = pct != null && pct >= 60;
//           const isWeak = pct != null && pct < 40;
//           return (
//             <div
//               key={sec.id}
//               className={cn(
//                 'rounded-lg border p-3 transition-all duration-200',
//                 isWeak
//                   ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20'
//                   : isStrong
//                     ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20'
//                     : 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20',
//               )}
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-xs font-semibold text-foreground">{sec.section}</span>
//                 {pct != null && (
//                   <Badge
//                     variant="outline"
//                     className={cn(
//                       'text-[10px] font-bold border-0',
//                       isWeak
//                         ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
//                         : isStrong
//                           ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
//                           : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
//                     )}
//                   >
//                     {pct}%
//                   </Badge>
//                 )}
//               </div>
//               <div className="space-y-1.5">
//                 {sec.strength && (
//                   <div className="flex items-start gap-1.5">
//                     <TrendingUp className="mt-0.5 size-3 flex-shrink-0 text-emerald-500" />
//                     <p className="text-[11px] text-muted-foreground line-clamp-1">{sec.strength}</p>
//                   </div>
//                 )}
//                 {sec.weakness && (
//                   <div className="flex items-start gap-1.5">
//                     <TrendingDown className="mt-0.5 size-3 flex-shrink-0 text-red-500" />
//                     <p className="text-[11px] text-muted-foreground line-clamp-1">{sec.weakness}</p>
//                   </div>
//                 )}
//                 {sec.actionPlan && (
//                   <div className="flex items-start gap-1.5">
//                     <Target className="mt-0.5 size-3 flex-shrink-0 text-teal-500" />
//                     <p className="text-[11px] text-muted-foreground line-clamp-1">{sec.actionPlan}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ── Similar Exam Comparison Suggestion ─────────────────────
// function SimilarExamSuggestion({
//   reflection,
//   allReflections,
// }: {
//   reflection: Reflection;
//   allReflections: Reflection[];
// }) {
//   // Find similar exam by category/result
//   const similar = allReflections.find(
//     (r) =>
//       r.id !== reflection.id &&
//       r.result === reflection.result &&
//       r.score !== null &&
//       reflection.score !== null &&
//       Math.abs(r.score - reflection.score) <= 10,
//   );

//   if (!similar) return null;

//   const isBetter = (similar.score ?? 0) > (reflection.score ?? 0);

//   return (
//     <div className="mt-3 rounded-lg border border-dashed border-emerald-200 bg-emerald-50/30 p-3 dark:border-emerald-800 dark:bg-emerald-950/10">
//       <div className="flex items-center gap-1.5 mb-1.5">
//         <Eye className="size-3.5 text-emerald-600 dark:text-emerald-400" />
//         <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Similar Exam Comparison</p>
//       </div>
//       <div className="flex items-center gap-2">
//         <div className="flex-1 min-w-0">
//           <p className="text-xs font-medium text-foreground truncate">{similar.examName}</p>
//           <p className="text-[10px] text-muted-foreground">
//             Score: {similar.score ?? '—'} · {similar.result}
//           </p>
//         </div>
//         <div className="flex flex-col items-center">
//           <span
//             className={cn(
//               'text-lg font-bold',
//               isBetter ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400',
//             )}
//           >
//             {isBetter ? '↓' : '↑'}
//           </span>
//           <span className="text-[9px] text-muted-foreground">
//             {Math.abs((similar.score ?? 0) - (reflection.score ?? 0)).toFixed(0)} pts
//           </span>
//         </div>
//         <ArrowRight className="size-3.5 text-muted-foreground flex-shrink-0" />
//       </div>
//       <p className="mt-1.5 text-[11px] text-muted-foreground">
//         {isBetter
//           ? 'This exam scored higher. Review what worked there for improvement insights.'
//           : 'Your current exam performed better! Keep building on these strengths.'}
//       </p>
//     </div>
//   );
// }

// // ── Reflection Card ──────────────────────────────────────────
// function ReflectionCard({ reflection, allReflections }: { reflection: Reflection; allReflections: Reflection[] }) {
//   const [expanded, setExpanded] = useState(false);

//   const emotionalCfg = EMOTIONAL_CONFIG[reflection.emotionalState ?? ''] ?? EMOTIONAL_CONFIG.Neutral;
//   const diffCfg = DIFFICULTY_CONFIG[reflection.difficulty ?? ''] ?? null;
//   const EmotionIcon = emotionalCfg.icon;

//   const hasContent =
//     reflection.whatWentWell || reflection.whatWentWrong || reflection.biggestLesson || reflection.actionPlan;
//   const contentLength = [
//     reflection.whatWentWell,
//     reflection.whatWentWrong,
//     reflection.biggestLesson,
//     reflection.actionPlan,
//   ].filter(Boolean).join('').length;
//   const isLong = contentLength > 300;

//   return (
//     <Card
//       className={cn(
//         'border-l-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
//         diffCfg?.border ?? 'border-l-slate-300 dark:border-l-slate-700',
//       )}
//     >
//       <CardContent className="p-4">
//         {/* Header */}
//         <div className="flex items-start justify-between gap-3">
//           <div className="flex items-center gap-3 min-w-0">
//             <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg', emotionalCfg.bg)}>
//               <EmotionIcon className={cn('h-5 w-5', emotionalCfg.cls)} />
//             </div>
//             <div className="min-w-0">
//               <h3 className="text-sm font-semibold text-foreground truncate">
//                 {reflection.examName}
//               </h3>
//               <p className="text-xs text-muted-foreground">
//                 {reflection.examDate
//                   ? new Date(reflection.examDate).toLocaleDateString('en-IN', {
//                       day: 'numeric',
//                       month: 'short',
//                       year: 'numeric',
//                     })
//                   : 'No date'}
//                 {reflection.score != null && ` · Score: ${reflection.score}`}
//                 {reflection.result && (
//                   <span
//                     className={cn(
//                       'ml-1 font-medium',
//                       reflection.result.toLowerCase().includes('qualified')
//                         ? 'text-emerald-600 dark:text-emerald-400'
//                         : 'text-red-600 dark:text-red-400',
//                     )}
//                   >
//                     · {reflection.result}
//                   </span>
//                 )}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 flex-shrink-0">
//             {reflection.difficulty && (
//               <Badge variant="outline" className={cn('border text-[11px] font-semibold', diffCfg?.cls)}>
//                 {reflection.difficulty}
//               </Badge>
//             )}
//             <Badge variant="secondary" className={cn('text-[11px] font-medium', emotionalCfg.bg, emotionalCfg.cls)}>
//               <EmotionIcon className="mr-1 h-3 w-3" />
//               {reflection.emotionalState}
//             </Badge>
//           </div>
//         </div>

//         {/* Confidence */}
//         {reflection.confidence != null && (
//           <div className="mt-3">
//             <div className="flex items-center justify-between text-xs mb-1">
//               <span className="text-muted-foreground">Confidence Level</span>
//               <span className={cn(
//                 'font-semibold',
//                 reflection.confidence >= 70
//                   ? 'text-emerald-600 dark:text-emerald-400'
//                   : reflection.confidence >= 40
//                     ? 'text-amber-600 dark:text-amber-400'
//                     : 'text-red-600 dark:text-red-400',
//               )}>
//                 {reflection.confidence}%
//               </span>
//             </div>
//             <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
//               <div
//                 className={cn(
//                   'h-full rounded-full transition-all duration-500',
//                   reflection.confidence >= 70
//                     ? 'bg-emerald-500'
//                     : reflection.confidence >= 40
//                       ? 'bg-amber-500'
//                       : 'bg-red-500',
//                 )}
//                 style={{ width: `${reflection.confidence}%` }}
//               />
//             </div>
//           </div>
//         )}

//         {/* Content sections */}
//         {hasContent && (
//           <div className={cn('mt-3 space-y-2', !expanded && isLong && 'max-h-40 overflow-hidden relative')}>
//             {reflection.whatWentWell && (
//               <div>
//                 <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
//                   <Smile className="inline h-3 w-3 mr-1" />What Went Well
//                 </p>
//                 <p className="text-sm text-muted-foreground leading-relaxed">
//                   {reflection.whatWentWell}
//                 </p>
//               </div>
//             )}
//             {reflection.whatWentWrong && (
//               <div>
//                 <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-0.5">
//                   <Frown className="inline h-3 w-3 mr-1" />What Went Wrong
//                 </p>
//                 <p className="text-sm text-muted-foreground leading-relaxed">
//                   {reflection.whatWentWrong}
//                 </p>
//               </div>
//             )}
//             {reflection.biggestLesson && (
//               <div>
//                 <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-0.5">
//                   <Sparkles className="inline h-3 w-3 mr-1" />Biggest Lesson
//                 </p>
//                 <p className="text-sm text-muted-foreground leading-relaxed">
//                   {reflection.biggestLesson}
//                 </p>
//               </div>
//             )}
//             {reflection.actionPlan && (
//               <div>
//                 <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-0.5">
//                   <Target className="inline h-3 w-3 mr-1" />Action Plan
//                 </p>
//                 <p className="text-sm text-muted-foreground leading-relaxed">
//                   {reflection.actionPlan}
//                 </p>
//               </div>
//             )}
//             {!expanded && isLong && (
//               <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
//             )}
//           </div>
//         )}

//         {/* Target Score & Footer */}
//         <div className="mt-3 flex items-center justify-between">
//           {reflection.targetScore != null && (
//             <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
//               <Target className="h-3.5 w-3.5" />
//               <span>Target: <span className="font-semibold text-foreground">{reflection.targetScore}</span></span>
//             </div>
//           )}
//           {isLong && (
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-7 px-2 text-xs text-muted-foreground"
//               onClick={() => setExpanded(!expanded)}
//             >
//               {expanded ? (
//                 <>
//                   <ChevronUp className="mr-1 h-3 w-3" /> Show Less
//                 </>
//               ) : (
//                 <>
//                   <ChevronDown className="mr-1 h-3 w-3" /> Show More
//                 </>
//               )}
//             </Button>
//           )}
//         </div>

//         {/* Mistake Tags */}
//         {reflection.mistakeTags && (
//           <div className="mt-2 flex flex-wrap gap-1">
//             {reflection.mistakeTags.split(',').filter(Boolean).map((tag) => (
//               <Badge key={tag} variant="outline" className="text-[10px] border-rose-200 text-rose-600 dark:border-rose-800 dark:text-rose-400">
//                 {tag}
//               </Badge>
//             ))}
//           </div>
//         )}

//         {/* Strength Tags */}
//         {reflection.strengthTags && (
//           <div className="mt-1.5 flex flex-wrap gap-1">
//             {reflection.strengthTags.split(',').filter(Boolean).map((tag) => (
//               <Badge key={tag} variant="outline" className="text-[10px] border-emerald-200 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400">
//                 {tag}
//               </Badge>
//             ))}
//           </div>
//         )}

//         {/* Section Analysis Cards */}
//         <SectionAnalysisCards sections={reflection.sections} />

//         {/* Similar Exam Comparison */}
//         <SimilarExamSuggestion reflection={reflection} allReflections={allReflections} />
//       </CardContent>
//     </Card>
//   );
// }

// // ── Create Reflection Dialog ─────────────────────────────────
// function CreateReflectionDialog({
//   open,
//   onOpenChange,
// }: {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }) {
//   const queryClient = useQueryClient();
//   const { navigate } = useNavigationStore();

//   const [examId, setExamId] = useState('');
//   const [difficulty, setDifficulty] = useState('');
//   const [confidence, setConfidence] = useState(50);
//   const [emotionalState, setEmotionalState] = useState('');
//   const [whatWentWell, setWhatWentWell] = useState('');
//   const [whatWentWrong, setWhatWentWrong] = useState('');
//   const [biggestLesson, setBiggestLesson] = useState('');
//   const [actionPlan, setActionPlan] = useState('');
//   const [targetScore, setTargetScore] = useState('');
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});

//   const { data: examOptions, isLoading: loadingOptions } = useQuery({
//     queryKey: ['reflection-exam-options'],
//     queryFn: getReflectionExamOptions,
//   });

//   const { data: selectedExam, isLoading: loadingExam } = useQuery({
//     queryKey: ['exam-for-dialog', examId],
//     queryFn: () => getExam(examId),
//     enabled: !!examId,
//   });

//   const createMutation = useMutation({
//     mutationFn: createReflection,
//     onSuccess: () => {
//       toast.success('Reflection created successfully!');
//       queryClient.invalidateQueries({ queryKey: ['reflections'] });
//       queryClient.invalidateQueries({ queryKey: ['reflection-exam-options'] });
//       queryClient.invalidateQueries({ queryKey: ['analytics'] });
//       queryClient.invalidateQueries({ queryKey: ['weakness'] });
//       onOpenChange(false);
//       resetForm();
//     },
//     onError: (err: Error) => {
//       toast.error(err.message || 'Failed to create reflection');
//     },
//   });

//   const resetForm = () => {
//     setExamId('');
//     setDifficulty('');
//     setConfidence(50);
//     setEmotionalState('');
//     setWhatWentWell('');
//     setWhatWentWrong('');
//     setBiggestLesson('');
//     setActionPlan('');
//     setTargetScore('');
//     setFormErrors({});
//   };

//   const handleSubmit = () => {
//     const result = reflectionFormSchema.safeParse({
//       examId,
//       difficulty: difficulty || undefined,
//       confidence,
//       emotionalState: emotionalState || undefined,
//       whatWentWell: whatWentWell || '',
//       whatWentWrong: whatWentWrong || '',
//       biggestLesson: biggestLesson || '',
//       actionPlan: actionPlan || undefined,
//       targetScore: targetScore ? Number(targetScore) : undefined,
//     });
//     if (!result.success) {
//       const errors: Record<string, string> = {};
//       const fieldErrors = result.error.flatten().fieldErrors;
//       for (const [key, messages] of Object.entries(fieldErrors)) {
//         if (messages && messages.length > 0) {
//           errors[key] = messages[0];
//         }
//       }
//       setFormErrors(errors);
//       return;
//     }
//     setFormErrors({});
//     createMutation.mutate({
//       examId,
//       examName: selectedExam?.name ?? '',
//       examDate: selectedExam?.examDate ?? null,
//       score: selectedExam?.score ?? null,
//       cutoff: selectedExam?.cutoff ?? null,
//       gap: selectedExam?.cutoffGap ?? null,
//       result: selectedExam?.result ?? null,
//       difficulty: difficulty || null,
//       confidence,
//       emotionalState: emotionalState || null,
//       whatWentWrong: whatWentWrong || null,
//       whatWentWell: whatWentWell || null,
//       biggestLesson: biggestLesson || null,
//       actionPlan: actionPlan || null,
//       targetScore: targetScore ? Number(targetScore) : null,
//     });
//   };

//   const ToggleButton = ({
//     label,
//     active,
//     onClick,
//     activeColor,
//   }: {
//     label: string;
//     active: boolean;
//     onClick: () => void;
//     activeColor?: string;
//   }) => (
//     <button
//       type="button"
//       onClick={onClick}
//       className={cn(
//         'rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200',
//         active
//           ? activeColor
//             ? activeColor
//             : 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
//           : 'border-border bg-background text-muted-foreground hover:border-emerald-400 hover:text-emerald-600',
//       )}
//     >
//       {label}
//     </button>
//   );

//   return (
//     <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm(); }}>
//       <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <PenLine className="h-5 w-5 text-emerald-600" />
//             Create Reflection
//           </DialogTitle>
//           <DialogDescription>
//             Write a detailed reflection for your exam to track progress
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-5 mt-2">
//           {/* Exam Selection */}
//           <div className="space-y-2">
//             <Label className="text-sm font-medium">
//               Select Exam <span className="text-red-500">*</span>
//             </Label>
//             <Select value={examId} onValueChange={(v) => { setExamId(v); if (formErrors.examId) setFormErrors(prev => { const { examId, ...rest } = prev; return rest; }); }}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Choose an exam..." />
//               </SelectTrigger>
//               <SelectContent>
//                 {examOptions?.map((e) => (
//                   <SelectItem key={e.id} value={e.id}>
//                     {e.name} — {e.examDate}
//                   </SelectItem>
//                 ))}
//                 {(!examOptions || examOptions.length === 0) && !loadingOptions && (
//                   <SelectItem value="__none" disabled>
//                     No exams available
//                   </SelectItem>
//                 )}
//               </SelectContent>
//             </Select>
//             {formErrors.examId && <p className="text-xs text-red-500 mt-1">{formErrors.examId}</p>}
//           </div>
//           {loadingExam && examId && (
//             <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-800 dark:bg-emerald-950/20">
//               <Skeleton className="h-4 w-40" />
//               <Skeleton className="mt-2 h-3 w-24" />
//             </div>
//           )}
//           {selectedExam && (
//             <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-800 dark:bg-emerald-950/20">
//               <p className="text-sm font-semibold text-foreground">{selectedExam.name}</p>
//               <p className="text-xs text-muted-foreground">
//                 {selectedExam.examDate} · {selectedExam.category} · Score: {selectedExam.score}/{selectedExam.maxScore}
//                 {selectedExam.result && (
//                   <span className={cn(
//                     'ml-1 font-medium',
//                     selectedExam.result.toLowerCase().includes('qualified')
//                       ? 'text-emerald-600 dark:text-emerald-400'
//                       : 'text-red-600 dark:text-red-400',
//                   )}>
//                     · {selectedExam.result}
//                   </span>
//                 )}
//               </p>
//             </div>
//           )}

//           <Separator />

//           {/* Difficulty */}
//           <div className="space-y-2">
//             <Label className="text-sm font-medium">Difficulty Level</Label>
//             <div className="flex flex-wrap gap-2">
//               {DIFFICULTY_OPTIONS.map((d) => (
//                 <ToggleButton
//                   key={d}
//                   label={d}
//                   active={difficulty === d}
//                   onClick={() => { setDifficulty(difficulty === d ? '' : d); if (formErrors.difficulty) setFormErrors(prev => { const { difficulty, ...rest } = prev; return rest; }); }}
//                   activeColor={
//                     d === 'Easy' ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
//                     : d === 'Moderate' ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400'
//                     : d === 'Hard' ? 'border-orange-500 bg-orange-500/15 text-orange-700 dark:text-orange-400'
//                     : 'border-red-500 bg-red-500/15 text-red-700 dark:text-red-400'
//                   }
//                 />
//               ))}
//             </div>
//             {formErrors.difficulty && <p className="text-xs text-red-500 mt-1">{formErrors.difficulty}</p>}
//           </div>

//           {/* Confidence Slider */}
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <Label className="text-sm font-medium">Confidence Level</Label>
//               <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{confidence}%</span>
//             </div>
//             <Slider
//               value={[confidence]}
//               onValueChange={(v) => setConfidence(v[0])}
//               min={0}
//               max={100}
//               step={5}
//               className="[&_[data-slot=slider-range]]:bg-emerald-500 [&_[data-slot=slider-thumb]]:border-emerald-500"
//             />
//             <div className="flex justify-between text-[10px] text-muted-foreground">
//               <span>Not Confident</span>
//               <span>Very Confident</span>
//             </div>
//           </div>

//           {/* Emotional State */}
//           <div className="space-y-2">
//             <Label className="text-sm font-medium">Emotional State</Label>
//             <div className="flex flex-wrap gap-2">
//               {EMOTIONAL_OPTIONS.map((e) => {
//                 const cfg = EMOTIONAL_CONFIG[e];
//                 return (
//                   <ToggleButton
//                     key={e}
//                     label={e}
//                     active={emotionalState === e}
//                     onClick={() => { setEmotionalState(emotionalState === e ? '' : e); if (formErrors.emotionalState) setFormErrors(prev => { const { emotionalState, ...rest } = prev; return rest; }); }}
//                     activeColor={cn('border', cfg.cls, cfg.bg.replace('dark:', 'dark:').replace('100', '500/15').replace('50', '500/15'))}
//                   />
//                 );
//               })}
//             </div>
//             {formErrors.emotionalState && <p className="text-xs text-red-500 mt-1">{formErrors.emotionalState}</p>}
//           </div>

//           <Separator />

//           {/* What Went Well */}
//           <div className="space-y-2">
//             <Label className="text-sm font-medium flex items-center gap-1.5">
//               <Smile className="h-3.5 w-3.5 text-emerald-500" /> What Went Well
//             </Label>
//             <Textarea
//               placeholder="Describe what went well in the exam..."
//               value={whatWentWell}
//               onChange={(e) => { setWhatWentWell(e.target.value); if (formErrors.whatWentWell) setFormErrors(prev => { const { whatWentWell, ...rest } = prev; return rest; }); }}
//               rows={3}
//               className="resize-none"
//             />
//             {formErrors.whatWentWell && <p className="text-xs text-red-500 mt-1">{formErrors.whatWentWell}</p>}
//           </div>

//           {/* What Went Wrong */}
//           <div className="space-y-2">
//             <Label className="text-sm font-medium flex items-center gap-1.5">
//               <Frown className="h-3.5 w-3.5 text-rose-500" /> What Went Wrong
//             </Label>
//             <Textarea
//               placeholder="Describe what didn't go as planned..."
//               value={whatWentWrong}
//               onChange={(e) => { setWhatWentWrong(e.target.value); if (formErrors.whatWentWrong) setFormErrors(prev => { const { whatWentWrong, ...rest } = prev; return rest; }); }}
//               rows={3}
//               className="resize-none"
//             />
//             {formErrors.whatWentWrong && <p className="text-xs text-red-500 mt-1">{formErrors.whatWentWrong}</p>}
//           </div>

//           {/* Biggest Lesson */}
//           <div className="space-y-2">
//             <Label className="text-sm font-medium flex items-center gap-1.5">
//               <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Biggest Lesson
//             </Label>
//             <Textarea
//               placeholder="What's the most important thing you learned?"
//               value={biggestLesson}
//               onChange={(e) => { setBiggestLesson(e.target.value); if (formErrors.biggestLesson) setFormErrors(prev => { const { biggestLesson, ...rest } = prev; return rest; }); }}
//               rows={2}
//               className="resize-none"
//             />
//             {formErrors.biggestLesson && <p className="text-xs text-red-500 mt-1">{formErrors.biggestLesson}</p>}
//           </div>

//           {/* Action Plan */}
//           <div className="space-y-2">
//             <Label className="text-sm font-medium flex items-center gap-1.5">
//               <Target className="h-3.5 w-3.5 text-teal-500" /> Action Plan
//             </Label>
//             <Textarea
//               placeholder="What specific actions will you take before the next attempt?"
//               value={actionPlan}
//               onChange={(e) => setActionPlan(e.target.value)}
//               rows={3}
//               className="resize-none"
//             />
//           </div>

//           {/* Target Score */}
//           <div className="space-y-2">
//             <Label className="text-sm font-medium">Target Score for Next Attempt</Label>
//             <Input
//               type="number"
//               placeholder="e.g. 85"
//               value={targetScore}
//               onChange={(e) => { setTargetScore(e.target.value); if (formErrors.targetScore) setFormErrors(prev => { const { targetScore, ...rest } = prev; return rest; }); }}
//               className="max-w-[200px]"
//             />
//             {formErrors.targetScore && <p className="text-xs text-red-500 mt-1">{formErrors.targetScore}</p>}
//           </div>
//         </div>

//         <DialogFooter className="mt-4">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             disabled={createMutation.isPending || !examId}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white"
//           >
//             {createMutation.isPending ? 'Saving...' : 'Save Reflection'}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ── Main Component ───────────────────────────────────────────
// export default function ReflectionsPage() {
//   const navigate = useNavigationStore();
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);

//   const { data: reflections, isLoading } = useQuery({
//     queryKey: ['reflections-list'],
//     queryFn: () => getReflections(),
//   });

//   const existingReflections = reflections ?? [];

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <Skeleton className="h-8 w-48" />
//         <Skeleton className="h-8 w-40" />
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {Array.from({ length: 3 }).map((_, i) => (
//             <Skeleton key={i} className="h-64 rounded-xl" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* ── Header ──────────────────────────────────────── */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
//             Reflections
//           </h1>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Review and learn from your exam experiences
//           </p>
//         </div>
//         <Button
//           className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800"
//           onClick={() => setCreateDialogOpen(true)}
//         >
//           <Plus className="mr-2 h-4 w-4" />
//           Create Reflection
//         </Button>
//       </div>

//       {/* ── Stats Summary ── */}
//       {existingReflections.length > 0 && (
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//           {[
//             {
//               icon: BookOpen,
//               label: 'Total Reflections',
//               value: existingReflections.length,
//               bg: 'bg-emerald-100 dark:bg-emerald-900/50',
//               iconCls: 'text-emerald-600 dark:text-emerald-400',
//             },
//             {
//               icon: Smile,
//               label: 'Confident Entries',
//               value: existingReflections.filter((r) => r.emotionalState === 'Confident').length,
//               bg: 'bg-emerald-100 dark:bg-emerald-900/50',
//               iconCls: 'text-emerald-600 dark:text-emerald-400',
//             },
//             {
//               icon: BrainCircuit,
//               label: 'Avg Confidence',
//               value: `${Math.round(
//                 existingReflections.reduce((a, r) => a + (r.confidence ?? 50), 0) / existingReflections.length,
//               )}%`,
//               bg: 'bg-teal-100 dark:bg-teal-900/50',
//               iconCls: 'text-teal-600 dark:text-teal-400',
//             },
//             {
//               icon: Heart,
//               label: 'With Action Plan',
//               value: existingReflections.filter((r) => r.actionPlan).length,
//               bg: 'bg-amber-100 dark:bg-amber-900/50',
//               iconCls: 'text-amber-600 dark:text-amber-400',
//             },
//           ].map((stat) => {
//             const Icon = stat.icon;
//             return (
//               <Card key={stat.label} className="transition-shadow duration-200 hover:shadow-md">
//                 <CardContent className="flex items-center gap-3 p-4">
//                   <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg', stat.bg)}>
//                     <Icon className={cn('h-5 w-5', stat.iconCls)} />
//                   </div>
//                   <div>
//                     <p className="text-lg font-bold text-foreground">{stat.value}</p>
//                     <p className="text-xs text-muted-foreground">{stat.label}</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}

//       {/* ── Reflections List ── */}
//       {existingReflections.length === 0 ? (
//         <EmptyReflectionState onCreateClick={() => setCreateDialogOpen(true)} />
//       ) : (
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {existingReflections.map((r) => (
//             <ReflectionCard key={r.id} reflection={r} allReflections={existingReflections} />
//           ))}
//         </div>
//       )}

//       {/* ── Create Dialog ── */}
//       <CreateReflectionDialog
//         open={createDialogOpen}
//         onOpenChange={setCreateDialogOpen}
//       />
//     </div>
//   );
// }