import { z } from 'zod';

export const examFormSchema = z.object({
  name: z.string().min(3, 'Exam name must be at least 3 characters'),
  org: z.string().min(2, 'Organization is required'),
  category: z.string().min(1, 'Category is required'),
  stage: z.string().min(1, 'Stage is required'),
  score: z.coerce.number().min(0, 'Score must be positive').max(999, 'Score seems too high'),
  maxScore: z.coerce.number().min(1, 'Max score must be at least 1'),
  cutoff: z.coerce.number().min(0, 'Cutoff must be positive').optional(),
  result: z.string().min(1, 'Result is required'),
  examDate: z.string().min(1, 'Exam date is required'),
});

export type ExamFormValues = z.infer<typeof examFormSchema>;

export const goalFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  priority: z.string().min(1, 'Priority is required'),
  description: z.string().optional(),
  subject: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  linkedExam: z.string().optional(),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;

export const reflectionFormSchema = z.object({
  examId: z.string().min(1, 'Please select an exam'),
  difficulty: z.string().min(1, 'Difficulty is required'),
  confidence: z.number().min(0, 'Confidence must be 0-100').max(100, 'Confidence must be 0-100'),
  emotionalState: z.string().min(1, 'Emotional state is required'),
  whatWentWell: z.string().min(5, 'Describe what went well (min 5 chars)'),
  whatWentWrong: z.string().min(5, 'Describe what went wrong (min 5 chars)'),
  biggestLesson: z.string().min(3, 'Biggest lesson is required'),
  actionPlan: z.string().optional(),
  targetScore: z.coerce.number().min(0).max(999).optional(),
});

export type ReflectionFormValues = z.infer<typeof reflectionFormSchema>;

export const documentFormSchema = z.object({
  name: z.string().min(3, 'Document name must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  type: z.string().optional(),
  description: z.string().optional(),
  linkedExam: z.string().optional(),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;
