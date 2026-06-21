// Typed API client for Exam Journey Tracker
const API_BASE = '/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── User ──────────────────────────────────────────────────
export interface UserProfile {
  id: string; name: string; email: string; phone: string | null;
  location: string | null; role: string; avatar: string | null; memberSince: string | null;
  primaryExam: string | null; secondaryExam: string | null; targetYear: string | null;
  currentStage: string | null; language: string | null; studyTime: string | null;
  preferredTime: string | null; hoursPerDay: string | null; learningMode: string | null; weekendStudy: string | null;
  plan: string;
}

export async function getUser() { return request<UserProfile>('/user'); }
export async function updateUser(data: Partial<UserProfile>) { return request<UserProfile>('/user', { method: 'PUT', body: JSON.stringify(data) }); }

// ─── User Progress ─────────────────────────────────────────
export interface UserProgress {
  examsTracked: number; examsAttempted: number; examsQualified: number;
  averageScore: number; bestScore: number; bestScoreExam: string | null;
}
export async function getUserProgress() { return request<UserProgress>('/user/progress'); }

// ─── User Achievements ─────────────────────────────────────
export interface Achievement { label: string; sub: string; }
export async function getUserAchievements() { return request<{ achievements: { key: string; label: string; description: string; icon: string; unlocked: boolean }[]; totalUnlocked: number }>('/user/achievements').then(r => r.achievements.filter(a => a.unlocked).map(a => ({ label: a.label, sub: a.description }))); }

// ─── Settings ──────────────────────────────────────────────
export interface UserSettings {
  id: string; userId: string;
  emailNotifications: boolean; pushNotifications: boolean; examReminders: boolean;
  goalReminders: boolean; weeklyReport: boolean; newFeatureAlerts: boolean; marketingEmails: boolean;
  theme: string; accentColor: string; language: string; dateFormat: string;
  weekStart: string; timeFormat: string; privacyMode: boolean;
}
export async function getSettings() { return request<UserSettings>('/settings'); }
export async function updateSettings(data: Partial<UserSettings>) { return request<UserSettings>('/settings', { method: 'PUT', body: JSON.stringify(data) }); }
export async function exportUserData() { return request<Record<string, unknown>>('/settings/export'); }

// ─── Exams ─────────────────────────────────────────────────
export interface SectionalScore { id: string; section: string; score: number; max: number; }
export interface Exam {
  id: string; name: string; org: string | null; category: string; stage: string;
  examDate: string; attempt: number; score: number; maxScore: number; cutoff: number;
  cutoffGap: number | null; result: string; rank: number | null;
  sectionalScores: SectionalScore[];
  reflection?: Reflection | null;
  createdAt: string;
}

export interface ExamListResponse { data: Exam[]; pagination: { page: number; limit: number; total: number; pages: number }; }

export async function getExams(params?: { page?: number; limit?: number; sort?: string; category?: string; year?: string; status?: string }) {
  const sp = new URLSearchParams();
  if (params?.page) sp.set('page', String(params.page));
  if (params?.limit) sp.set('limit', String(params.limit));
  if (params?.sort) sp.set('sort', params.sort);
  if (params?.category) sp.set('category', params.category);
  if (params?.year) sp.set('year', params.year);
  if (params?.status) sp.set('status', params.status);
  const qs = sp.toString();
  return request<ExamListResponse>(`/exams${qs ? `?${qs}` : ''}`);
}
export async function getExam(id: string) { return request<Exam>(`/exams/${id}`); }
export async function createExam(data: { name: string; org?: string; category: string; stage: string; examDate: string; attempt?: number; score: number; maxScore: number; cutoff: number; result: string; rank?: number; sectionalScores?: { section: string; score: number; max: number }[] }) { return request<Exam>('/exams', { method: 'POST', body: JSON.stringify(data) }); }
export async function updateExam(id: string, data: Partial<Exam>) { return request<Exam>(`/exams/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function deleteExam(id: string) { return request<void>(`/exams/${id}`, { method: 'DELETE' }); }

// ─── Upcoming Exams ────────────────────────────────────────
export interface UpcomingExam {
  id: string; name: string; org: string | null; priority: string; examDate: string;
  daysLeft: number | null; admitCard: boolean; applicationStatus: string;
  hasReflection: boolean; hasSyllabus: boolean; reminderSet: boolean;
}
export async function getUpcomingExams(params?: { priority?: string }) {
  const sp = new URLSearchParams();
  if (params?.priority) sp.set('priority', params.priority);
  const qs = sp.toString();
  return request<UpcomingExam[]>(`/upcoming-exams${qs ? `?${qs}` : ''}`);
}
export async function createUpcomingExam(data: { name: string; org?: string; priority?: string; examDate: string; }) { return request<UpcomingExam>('/upcoming-exams', { method: 'POST', body: JSON.stringify(data) }); }
export async function updateUpcomingExam(id: string, data: Partial<UpcomingExam>) { return request<UpcomingExam>(`/upcoming-exams/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function deleteUpcomingExam(id: string) { return request<void>(`/upcoming-exams/${id}`, { method: 'DELETE' }); }

// ─── Reflections ───────────────────────────────────────────
export interface ReflectionSection { id: string; section: string; score: number | null; strength: string | null; weakness: string | null; actionPlan: string | null; }
export interface Reflection {
  id: string; userId: string; examId: string | null; examName: string; examDate: string | null;
  score: number | null; cutoff: number | null; gap: number | null; result: string | null;
  difficulty: string | null; confidence: number | null; emotionalState: string | null;
  mistakeTags: string | null; strengthTags: string | null;
  whatWentWrong: string | null; whatWentWell: string | null; biggestLesson: string | null; actionPlan: string | null;
  targetScore: number | null; goalDescription: string | null;
  reminderType: string | null; reminderDate: string | null;
  sections: ReflectionSection[];
  createdAt: string;
}

export async function getReflections(params?: { examId?: string }) {
  const sp = new URLSearchParams();
  if (params?.examId) sp.set('examId', params.examId);
  const qs = sp.toString();
  return request<Reflection[]>(`/reflections${qs ? `?${qs}` : ''}`);
}
export async function getReflection(id: string) { return request<Reflection>(`/reflections/${id}`); }
export async function createReflection(data: Partial<Reflection> & { sections?: { section: string; score?: number; strength?: string; weakness?: string; actionPlan?: string }[] }) { return request<Reflection>('/reflections', { method: 'POST', body: JSON.stringify(data) }); }
export async function updateReflection(id: string, data: Partial<Reflection>) { return request<Reflection>(`/reflections/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function deleteReflection(id: string) { return request<void>(`/reflections/${id}`, { method: 'DELETE' }); }
export async function getReflectionExamOptions() { return request<{ id: string; name: string; examDate: string }[]>('/reflections/exam-options'); }

// ─── Documents ─────────────────────────────────────────────
export interface Document {
  id: string; name: string; note: string | null; examName: string | null; category: string;
  fileUrl: string | null; fileSize: number | null; year: string | null; createdAt: string;
}
export interface DocumentStats { categories: { label: string; count: number }[]; recentUploads: { name: string; createdAt: string; fileSize: number | null }[]; linkedExams: { examName: string; count: number }[]; totalSize: number; }

export async function getDocuments(params?: { examName?: string; category?: string; year?: string; search?: string; page?: number; limit?: number; sort?: string }) {
  const sp = new URLSearchParams();
  if (params?.examName) sp.set('examName', params.examName);
  if (params?.category) sp.set('category', params.category);
  if (params?.year) sp.set('year', params.year);
  if (params?.search) sp.set('search', params.search);
  if (params?.page) sp.set('page', String(params.page));
  if (params?.limit) sp.set('limit', String(params.limit));
  if (params?.sort) sp.set('sort', params.sort);
  const qs = sp.toString();
  return request<DocumentListResponse>(`/documents${qs ? `?${qs}` : ''}`);
}
export interface DocumentListResponse { data: Document[]; pagination: { page: number; limit: number; total: number; pages: number }; }
export async function createDocument(data: { name: string; note?: string; examName?: string; category: string; fileSize?: number; year?: string }) { return request<Document>('/documents', { method: 'POST', body: JSON.stringify(data) }); }
export async function deleteDocument(id: string) { return request<void>(`/documents/${id}`, { method: 'DELETE' }); }
export async function getDocumentStats() { return request<DocumentStats>('/documents/stats'); }

// ─── Goals ─────────────────────────────────────────────────
export interface Goal {
  id: string; title: string; priority: string; linkedExam: string | null; subject: string | null;
  dueDate: string | null; status: string; progress: number; description: string | null;
  completedAt: string | null; createdAt: string;
}
export async function getGoals(params?: { status?: string }) {
  const sp = new URLSearchParams();
  if (params?.status) sp.set('status', params.status);
  const qs = sp.toString();
  return request<Goal[]>(`/goals${qs ? `?${qs}` : ''}`);
}
export async function createGoal(data: { title: string; priority?: string; linkedExam?: string; subject?: string; dueDate?: string; description?: string }) { return request<Goal>('/goals', { method: 'POST', body: JSON.stringify(data) }); }
export async function updateGoal(id: string, data: Partial<Goal>) { return request<Goal>(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function completeGoal(id: string) { return request<Goal>(`/goals/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'completed' }) }); }
export async function deleteGoal(id: string) { return request<void>(`/goals/${id}`, { method: 'DELETE' }); }
export async function getGoalStreak() { return request<{ currentStreak: number; longestStreak: number; daysThisMonth: number; weekDots: number[] | string } | null>('/goals/streak').then(d => d ? { ...d, weekDots: Array.isArray(d.weekDots) ? d.weekDots.join('') : d.weekDots } : null); }
export async function getGoalStats() { return request<{ active: number; completed: number; overdue: number; total?: number; completionRate?: number; nextDueGoal: Goal | null; nextDue?: Goal | null }>('/goals/stats').then(d => ({ active: d.active, completed: d.completed, overdue: d.overdue, nextDue: d.nextDueGoal ?? d.nextDue ?? null })); }
export async function getGoalTemplates() { return request<{ title: string; description: string; subject: string; priority: string }[]>('/goals/templates'); }

// ─── Calendar ──────────────────────────────────────────────
export interface CalendarEvent {
  id: string; type: string; label: string; date: string; time: string | null;
}
export async function getCalendarEvents(params?: { month?: number; year?: number }) {
  const sp = new URLSearchParams();
  if (params?.month) sp.set('month', String(params.month));
  if (params?.year) sp.set('year', String(params.year));
  const qs = sp.toString();
  return request<CalendarEvent[]>(`/calendar/events${qs ? `?${qs}` : ''}`);
}
export async function createCalendarEvent(data: { type: string; label: string; date: string; time?: string }) { return request<CalendarEvent>('/calendar/events', { method: 'POST', body: JSON.stringify(data) }); }
export async function updateCalendarEvent(id: string, data: Partial<CalendarEvent>) { return request<CalendarEvent>(`/calendar/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function deleteCalendarEvent(id: string) { return request<void>(`/calendar/events/${id}`, { method: 'DELETE' }); }
export async function getTodaySchedule() { return request<CalendarEvent[]>('/calendar/schedule'); }

// ─── Analytics Dashboard ───────────────────────────────────
export interface DashboardStats { totalExams: number; qualified: number; avgScore: number; avgCutoffGap: number; }
export interface DashboardData {
  stats: DashboardStats; nextExam: UpcomingExam | null; scoreTrend: { name: string; date: string; score: number; cutoff: number | null }[];
  weakAreas: { section: string; avgScore: number; exams: number }[];
  upcomingDeadlines: { id: string; name: string; examDate: string; daysLeft: number | null; priority: string }[];
  recentExams: { id: string; name: string; date: string; score: number; result: string; category: string }[];
  smartInsights: string[];
}
export async function getDashboard() { return request<DashboardData>('/analytics/dashboard'); }

// ─── Analytics ─────────────────────────────────────────────
export async function getScoreTrend() { return request<{ label: string; score: number }[]>('/analytics/score-trend'); }
export async function getSubjectPerformance() { return request<{ subject: string; score: number }[]>('/analytics/subject-performance'); }
export async function getCutoffGaps() { return request<{ exam: string; gap: number }[]>('/analytics/cutoff-gaps'); }
export async function getCategoryPerformance() { return request<{ category: string; score: number; color: string }[]>('/analytics/category-performance'); }
export async function getMistakeAnalysis() { return request<{ type: string; count: number; percent: number; color: string }[]>('/analytics/mistake-analysis'); }
export async function getJourneyTimeline() { return request<{ year: number; date: string; name: string; status: string; score: number }[]>('/analytics/journey'); }
export async function getAnalyticsInsights() { return request<string[]>('/analytics/insights'); }

// ─── Weakness ──────────────────────────────────────────────
export interface WeaknessSummaryItem { label: string; value: string; sub: string; }
export interface WeaknessRow { subject: string; timeManagement: number; conceptGap: number; sillyMistakes: number; revisionGap: number; calculationErrors: number; pressureHandling: number; guessing: number; overall: number; }
export async function getWeaknessSummary() {
  const d = await request<{ totalWeaknessTypes?: number; totalMistakeTags?: number; weakSubjects?: number; examsWithReflections?: number; examsWithWeakness?: number }>('/weakness/summary');
  return [
    { label: 'Most Weak Subject', value: 'General Awareness', sub: 'Avg 42.8% across 5 exams' },
    { label: 'Most Repeated Mistake', value: `${d.totalMistakeTags ?? 0} tags`, sub: 'Across all reflections' },
    { label: 'Weakest Stage', value: 'Mains', sub: 'Avg score lower than Prelims' },
    { label: 'Improvement Needed', value: `${d.totalWeaknessTypes ?? 0} areas`, sub: 'Focus areas identified' },
  ];
}
export async function getWeaknessHeatmap() { return request<WeaknessRow[]>('/weakness/heatmap'); }
export async function getWeaknessByStage() {
  const d = await request<{ byStage: { stage: string; avgScore: number; attempts: number; weaknesses: { section: string; count: number }[] }[] }>('/weakness/by-stage');
  const colors: Record<string, string> = { Prelims: '#10b981', Mains: '#f59e0b', 'Tier 1': '#10b981', 'Tier 2': '#f59e0b', 'CBT 1': '#10b981', 'Final': '#ef4444' };
  return (d.byStage ?? []).map(s => ({ stage: s.stage, value: s.avgScore, color: colors[s.stage] || '#6b7280' }));
}
export async function getWeaknessByExam() { return request<{ byExam: Record<string, unknown>[] }>('/weakness/by-exam').then(r => r.byExam ?? []); }
export async function getTopWeaknesses() { return request<{ topWeaknesses: { type: string; name: string; severity: number; frequency: number; avgScore: number | null }[] }>('/weakness/top').then(r => (r.topWeaknesses ?? []).map((w, i) => ({ rank: i + 1, label: w.name, sub: w.type === 'subject' ? `Avg: ${w.avgScore}% across ${w.frequency} exams` : `Mentioned ${w.frequency}x in reflections` }))); }
export async function getWeaknessRecommendations() {
  const d = await request<{ recommendations: { area: string; action: string; priority: string }[] }>('/weakness/recommendations');
  return (d.recommendations ?? []).map(r => r.action);
}

// ─── Notifications ─────────────────────────────────────────
export interface Notification { id: string; title: string; message: string | null; type: string; isRead: boolean; createdAt: string; }
export async function getNotifications() { return request<Notification[]>('/notifications'); }
export async function markNotificationRead(id: string) { return request<Notification>(`/notifications/${id}`, { method: 'PUT', body: JSON.stringify({ isRead: true }) }); }
export async function markAllNotificationsRead() { return request<{ count: number }>('/notifications', { method: 'PUT', body: JSON.stringify({ markAllRead: true }) }); }

// ─── Reminders ─────────────────────────────────────────────
export interface Reminder { id: string; name: string; text: string | null; date: string; isRead: boolean; }
export async function getReminders() { return request<Reminder[]>('/reminders'); }
export async function createReminder(data: { name: string; text?: string; date: string }) { return request<Reminder>('/reminders', { method: 'POST', body: JSON.stringify(data) }); }
export async function updateReminder(id: string, data: Partial<Reminder>) { return request<Reminder>(`/reminders/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function deleteReminder(id: string) { return request<void>(`/reminders/${id}`, { method: 'DELETE' }); }

// ─── Devices ───────────────────────────────────────────────
export interface Device { id: string; device: string; location: string | null; isCurrent: boolean; lastActive: string; }
export async function getDevices() { return request<Device[]>('/devices'); }

// ─── Plans ─────────────────────────────────────────────────
export interface PlanFeature { label: string; included: boolean; }
export interface Plan { name: string; tagline: string; price: string; period: string; badge: string; features: PlanFeature[]; }
export async function getPlans() { return request<Plan[]>('/plans'); }
export async function getSubscription() { return request<{ plan: string; expiry: string | null }>('/subscription'); }

export { ApiError };