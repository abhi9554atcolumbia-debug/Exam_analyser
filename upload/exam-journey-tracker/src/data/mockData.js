// Centralized mock data for the Exam Journey Tracker frontend.
// In a real app this would come from an API — kept here so every
// page has consistent, realistic data to render against.

export const currentUser = {
  name: "Aman Verma",
  role: "Pre-Med Student",
  email: "alexcarter@email.com",
  phone: "+91 98765 43210",
  location: "Bangalore, Karnataka",
  memberSince: "May 2024",
  avatar:
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman&backgroundColor=b6e3f4",
};

export const dashboardStats = [
  { label: "Total Exams", value: "28", change: "+4 this month", trend: "up" },
  { label: "Qualified", value: "12", change: "42.9% of total", trend: "up" },
  { label: "Average Score", value: "68.5%", change: "+6.3% vs last 3 exams", trend: "up" },
  { label: "Cutoff Gap (Avg)", value: "7.2 Marks", change: "-3.1 vs last 3 exams", trend: "down" },
];

export const nextExam = {
  name: "IBPS PO Pre",
  date: "18 Aug 2024",
  daysLeft: "In 14 days",
};

export const scoreTrend = [
  { label: "Jan '23", score: 52 },
  { label: "Mar '23", score: 57 },
  { label: "May '23", score: 61 },
  { label: "Jul '23", score: 66 },
  { label: "Sep '23", score: 72 },
  { label: "Nov '23", score: 76 },
];

export const weakAreas = [
  { subject: "Quantitative Aptitude", score: "48%", trend: "down", suggestion: "Focus on Practice" },
  { subject: "General Awareness", score: "52%", trend: "down", suggestion: "Revise Current Affairs" },
  { subject: "English Language", score: "62%", trend: "flat", suggestion: "Improve Vocabulary" },
  { subject: "Reasoning Ability", score: "72%", trend: "up", suggestion: "Keep Practicing" },
];

export const upcomingDeadlines = [
  { name: "IBPS PO Pre", date: "18 Aug 2024", daysLeft: "In 14 days", status: "Completed" },
  { name: "SBI Clerk Pre", date: "07 Sep 2024", daysLeft: "In 34 days", status: "In Progress" },
  { name: "SSC CGL Tier 1", date: "15 Sep 2024", daysLeft: "In 42 days", status: "Not Started" },
];

export const recentExams = [
  { name: "CAT 2023", date: "26 Nov 2023", type: "MBA Entrance", score: "84.2%", cutoff: "85%", gap: "-0.8", status: "Not Qualified", stage: "Overall" },
  { name: "IBPS Clerk Pre 2023", date: "12 Aug 2023", type: "Banking", score: "71.5%", cutoff: "64%", gap: "+7.5", status: "Qualified", stage: "Prelims" },
  { name: "SSC CGL Tier 1 2023", date: "14 Jul 2023", type: "SSC", score: "68.3%", cutoff: "72%", gap: "-3.7", status: "Not Qualified", stage: "Tier 1" },
];

export const smartInsights = [
  { icon: "trend", text: "You improved by 24% in the last 6 attempts. Keep up the momentum!" },
  { icon: "target", text: "Your average cutoff gap is reducing. You're getting closer!" },
  { icon: "book", text: "Quantitative Aptitude is your weakest area. Focus more on practice tests." },
];

// ----- Exam History -----
export const examHistoryStats = [
  { label: "Total Exams", value: "28", change: "+4 from last month" },
  { label: "Qualified", value: "12", change: "42.9% of total" },
  { label: "Average Score", value: "68.5%", change: "+6.3% vs last 3 exams" },
  { label: "Avg. Cutoff Gap", value: "-3.2 Marks", change: "Improving" },
  { label: "Reflections Added", value: "18", change: "64% of total" },
];

export const examHistory = [
  {
    year: 2024,
    date: "12 Oct 2024",
    category: "UPSC",
    stage: "Prelims",
    name: "Civil Services Preliminary Examination",
    org: "Union Public Service Commission",
    score: "114.5",
    maxScore: "200",
    cutoff: "88.22",
    gap: "+26.28 Above",
    status: "Qualified",
    reflection: true,
  },
  {
    year: 2024,
    date: "05 Aug 2024",
    category: "BANKING",
    stage: "Mains",
    name: "SBI PO Mains",
    org: "State Bank of India",
    score: "82.0",
    maxScore: "250",
    cutoff: "88.93",
    gap: "-6.93 Below",
    status: "Not Qualified",
    reflection: true,
  },
  {
    year: 2024,
    date: "15 Jul 2024",
    category: "SSC",
    stage: "Tier 1",
    name: "CGL Tier 1",
    org: "Staff Selection Commission",
    score: "--",
    maxScore: "200",
    cutoff: "--",
    gap: "Awaiting Results",
    status: "Awaiting Result",
    reflection: false,
  },
  {
    year: 2023,
    date: "26 Nov 2023",
    category: "BANKING",
    stage: "Prelims",
    name: "IBPS PO Prelims",
    org: "Institute of Banking Personnel Selection",
    score: "71.5",
    maxScore: "100",
    cutoff: "64.00",
    gap: "+7.50 Above",
    status: "Qualified",
    reflection: true,
  },
  {
    year: 2023,
    date: "14 Jul 2023",
    category: "SSC",
    stage: "Tier 1",
    name: "SSC CGL Tier 1",
    org: "Staff Selection Commission",
    score: "68.3",
    maxScore: "200",
    cutoff: "72.00",
    gap: "-3.70 Below",
    status: "Not Qualified",
    reflection: true,
  },
];

export const examDetailPanel = {
  category: "UPSC",
  stage: "Prelims",
  name: "Civil Services Preliminary Examination",
  org: "Union Public Service Commission",
  examDate: "Oct 12, 2024",
  attempt: "1st Attempt",
  score: "114.5 / 200",
  cutoff: "88.22",
  cutoffGap: "+26.28 (Above)",
  result: "Qualified",
  rank: "--",
  sectionalScores: [
    { label: "General Studies", score: 58, max: 100 },
    { label: "CSAT", score: 56.5, max: 100 },
  ],
  reflectionSummary: {
    strengths: "Polity, History, Environment",
    weakAreas: "Current Affairs, Economy",
    topMistakes: "Time management, Guessing",
    nextActionPlan: "Focus on Current Affairs daily & Practice more mocks",
  },
};

// ----- Upcoming Exams -----
export const upcomingExamsOverview = [
  { name: "SSC CGL Tier 1", date: "Oct 20, 2024", daysLeft: 18 },
  { name: "IBPS PO Prelims", date: "Nov 02, 2024", daysLeft: 31 },
  { name: "RBI Assistant Prelims", date: "Nov 17, 2024", daysLeft: 46 },
  { name: "SBI PO Prelims", date: "Dec 01, 2024", daysLeft: 60 },
];

export const applicationsOverview = {
  completed: 2,
  inProgress: 1,
  notStarted: 1,
  total: 4,
};

export const upcomingExams = [
  {
    name: "SSC CGL Tier 1",
    org: "Staff Selection Commission",
    priority: "High Priority",
    examDate: "Oct 20, 2024 (Sun)",
    daysLeft: 18,
    admitCard: "Yet to be released",
    application: "Completed",
    reflection: "Reflection Added",
    syllabus: "Syllabus Downloaded",
    reminder: "8:00 AM",
  },
  {
    name: "IBPS PO Prelims",
    org: "Institute of Banking Personnel Selection",
    priority: "Medium Priority",
    examDate: "Nov 02, 2024 (Sat)",
    daysLeft: 31,
    admitCard: "Oct 25, 2024 (Exp.)",
    application: "In Progress",
    reflection: "3 days before",
    syllabus: "Pending",
    reminder: "3 days before",
  },
  {
    name: "RBI Assistant Prelims",
    org: "Reserve Bank of India",
    priority: "Medium Priority",
    examDate: "Nov 17, 2024 (Sun)",
    daysLeft: 46,
    admitCard: "Nov 07, 2024 (Exp.)",
    application: "Completed",
    reflection: "Reflection Added",
    syllabus: "Daily at 7:00 AM",
    reminder: "Daily at 7:00 AM",
  },
  {
    name: "SBI PO Prelims",
    org: "State Bank of India",
    priority: "Low Priority",
    examDate: "Dec 01, 2024 (Sun)",
    daysLeft: 60,
    admitCard: "Dec 20, 2024 (Exp.)",
    application: "Not Started",
    reflection: "No Entry",
    syllabus: "Not Downloaded",
    reminder: "Off",
  },
];

export const importantReminders = [
  { name: "SSC CGL Tier 1", text: "Admit Card Release", date: "Oct 14, 2024" },
  { name: "IBPS PO Prelims", text: "Application Deadline", date: "Oct 21, 2024" },
  { name: "RBI Assistant Prelims", text: "Admit Card Release", date: "Nov 07, 2024" },
];

// ----- Analytics -----
export const analyticsStats = [
  { label: "Average Score", value: "68.5%", change: "+6.3% vs last 6 months" },
  { label: "Qualified Exams", value: "12 / 28", change: "42.9% success rate" },
  { label: "Average Cutoff Gap", value: "-4.3 Marks", change: "+1.8 marks improvement" },
  { label: "Highest Score", value: "84.2%", change: "SBI PO (Aug 2024)" },
  { label: "Most Improved", value: "Reasoning", change: "+12% improvement" },
];

export const analyticsScoreTrend = [
  { label: "Dec '23", score: 52 },
  { label: "Feb '24", score: 58 },
  { label: "Apr '24", score: 61 },
  { label: "Jun '24", score: 66 },
  { label: "Aug '24", score: 72 },
  { label: "Oct '24", score: 78 },
  { label: "Now", score: 84 },
];

export const subjectPerformance = [
  { subject: "Reasoning", score: 82 },
  { subject: "Quantitative Aptitude", score: 68 },
  { subject: "English Language", score: 74 },
  { subject: "General Awareness", score: 45 },
  { subject: "Computer Knowledge", score: 38 },
];

export const cutoffGapAnalysis = [
  { exam: "SSC CGL Tier 1", gap: -6.2 },
  { exam: "SBI PO Prelims", gap: 7.5 },
  { exam: "IBPS PO Prelims", gap: -1.3 },
  { exam: "RBI Assistant Prelims", gap: 4.8 },
  { exam: "SSC CHSL Tier 1", gap: -2.1 },
  { exam: "IBPS Clerk Prelims", gap: 9.2 },
];

export const categoryPerformance = [
  { category: "Banking", score: 78, color: "#4f46e5" },
  { category: "SSC", score: 62, color: "#a78bfa" },
  { category: "Railways", score: 55, color: "#f59e0b" },
  { category: "UPSC", score: 41, color: "#1e293b" },
  { category: "State Exams", score: 48, color: "#fb923c" },
];

export const mistakeAnalysis = [
  { type: "Time Management", count: 48, percent: 38, color: "#6366f1" },
  { type: "Current Affairs", count: 28, percent: 22, color: "#34d399" },
  { type: "Calculation Errors", count: 23, percent: 18, color: "#fbbf24" },
  { type: "Guessing", count: 15, percent: 12, color: "#fb923c" },
  { type: "Conceptual Gaps", count: 13, percent: 10, color: "#f87171" },
];

export const journeyTimeline = [
  { year: 2024, date: "Aug 2024", name: "SBI PO Prelims", status: "Qualified", score: "84.2%" },
  { year: 2024, date: "Jun 2024", name: "RBI Assistant Prelims", status: "Qualified", score: "72.6%" },
  { year: 2024, date: "Mar 2024", name: "IBPS PO Prelims", status: "Qualified", score: "65.1%" },
  { year: 2023, date: "Dec 2023", name: "SSC CGL Tier 1", status: "Not Qualified", score: "59.8%" },
  { year: 2023, date: "Sep 2023", name: "SSC CHSL Tier 1", status: "Not Qualified", score: "48.7%" },
];

export const analyticsInsights = [
  { icon: "trend", text: "You've improved your score by 32% in the last 7 exams. Keep it up!" },
  { icon: "target", text: "Quantitative Aptitude needs more focus. Consider more practice tests." },
  { icon: "bank", text: "You perform best in Banking exams. 78% success rate in this category." },
  { icon: "clock", text: "Time Management is your most frequent issue. Work on pacing." },
];

// ----- Weakness Heatmap -----
export const weaknessSummary = [
  { label: "Most Weak Subject", value: "General Awareness", sub: "Score: 45%" },
  { label: "Most Repeated Mistake", value: "Time Management", sub: "Occurred in 38% attempts" },
  { label: "Weakest Exam Stage", value: "Mains", sub: "Avg Score 52%" },
  { label: "Improvement Needed", value: "18%", sub: "To reach your goal" },
];

export const weaknessHeatmapRows = [
  { subject: "Quantitative Aptitude", timeManagement: 72, conceptGap: 58, sillyMistakes: 40, revisionGap: 45, calculationErrors: 68, pressureHandling: 35, guessing: 30, overall: 62 },
  { subject: "Reasoning Ability", timeManagement: 48, conceptGap: 36, sillyMistakes: 42, revisionGap: 38, calculationErrors: 30, pressureHandling: 32, guessing: 28, overall: 43 },
  { subject: "General Awareness", timeManagement: 78, conceptGap: 62, sillyMistakes: 55, revisionGap: 75, calculationErrors: 40, pressureHandling: 60, guessing: 45, overall: 65 },
  { subject: "English Language", timeManagement: 30, conceptGap: 28, sillyMistakes: 35, revisionGap: 32, calculationErrors: 25, pressureHandling: 20, guessing: 22, overall: 31 },
  { subject: "Data Interpretation", timeManagement: 55, conceptGap: 42, sillyMistakes: 38, revisionGap: 33, calculationErrors: 62, pressureHandling: 30, guessing: 26, overall: 46 },
];

export const weaknessTrend = [
  { label: "May '24", timeManagement: 75, generalAwareness: 70, calculationErrors: 35, conceptGap: 30 },
  { label: "Jun '24", timeManagement: 70, generalAwareness: 68, calculationErrors: 33, conceptGap: 28 },
  { label: "Jul '24", timeManagement: 72, generalAwareness: 66, calculationErrors: 30, conceptGap: 26 },
  { label: "Aug '24", timeManagement: 68, generalAwareness: 63, calculationErrors: 28, conceptGap: 22 },
  { label: "Sep '24", timeManagement: 65, generalAwareness: 60, calculationErrors: 26, conceptGap: 20 },
  { label: "Oct '24", timeManagement: 62, generalAwareness: 58, calculationErrors: 24, conceptGap: 18 },
];

export const weaknessByStage = [
  { stage: "Prelims", value: 42, color: "#4f46e5" },
  { stage: "Mains", value: 68, color: "#60a5fa" },
  { stage: "Interview", value: 35, color: "#fbbf24" },
  { stage: "Skill Test", value: 40, color: "#34d399" },
  { stage: "Not Applicable", value: 20, color: "#cbd5e1" },
];

export const weaknessByExam = [
  { exam: "SSC CGL 2024", quant: 65, reasoning: 72, english: 68, ga: 45, di: 60, overall: 62 },
  { exam: "SBI PO 2024", quant: 70, reasoning: 65, english: 75, ga: 50, di: 68, overall: 66 },
  { exam: "IBPS PO 2024", quant: 60, reasoning: 55, english: 70, ga: 48, di: 58, overall: 58 },
];

export const topWeaknesses = [
  { rank: 1, label: "Time Management", sub: "Affects 38% of your attempts" },
  { rank: 2, label: "General Awareness", sub: "Score below average" },
  { rank: 3, label: "Calculation Errors", sub: "Affects 28% of your attempts" },
];

export const recommendedActions = [
  "Take timed mock tests regularly",
  "Revise Current Affairs daily",
  "Practice calculation drills for 30 mins",
  "Review incorrect answers weekly",
];

// ----- Reflections -----
export const reflectionExamOptions = ["SSC CGL Tier 1 (15 Jul 2026)", "SBI PO Mains (05 Aug 2024)", "CGL Tier 1 (15 Jul 2024)"];

export const reflectionData = {
  exam: "SSC CGL Tier 1",
  date: "15 Jul 2026",
  score: "118/200",
  cutoff: "124",
  gap: "-6 Marks",
  result: "Not Qualified",
  difficulty: "Hard",
  confidence: 70,
  emotionalState: "Nervous",
  mistakeTags: ["Time Management", "Calculation Error", "Guessing", "Stress / Pressure"],
  strengthTags: ["Strong in Reasoning", "Good Speed", "Better Accuracy", "Good Revision"],
  whatWentWrong:
    "Spent too much time on Quantitative Aptitude questions. Could not attempt the last 10 questions. General Awareness was weak due to less revision. Made few calculation errors in DI section.",
  whatWentWell:
    "Reasoning section was excellent. Solved more questions than last attempt. Accuracy has improved in English section. Better focus throughout the exam.",
  biggestLesson: "Never spend more than 25 minutes on any single section.",
  actionPlan: [
    "Solve 20 timed mocks",
    "Revise Current Affairs daily",
    "Practice arithmetic for 30 mins daily",
    "Improve speed in DI",
    "Reduce guessing in English section",
  ],
  targetScore: "130",
  goalDescription: "Increase score by 10+ marks and qualify with a safe margin.",
  sectionWise: [
    { section: "Quantitative Aptitude", score: "28/50", strength: "Arithmetic", weakness: "Time & DI", actionPlan: "Practice DI daily" },
    { section: "Reasoning Ability", score: "36/50", strength: "Puzzles", weakness: "High Level Sets", actionPlan: "Solve more sets" },
    { section: "English Language", score: "24/50", strength: "Vocabulary", weakness: "Reading Comp.", actionPlan: "Read daily" },
    { section: "General Awareness", score: "18/50", strength: "Static GK", weakness: "Current Affairs", actionPlan: "Daily CA revision" },
    { section: "Computer Knowledge", score: "12/25", strength: "Basics", weakness: "New Topics", actionPlan: "Revise from notes" },
  ],
  attachments: ["Scorecard_SSC_CGL_Tier1.pdf", "Answer_Key.pdf", "Question_Paper.pdf"],
};

// ----- Documents -----
export const documentCategories = [
  { label: "Scorecards", count: 24 },
  { label: "Admit Cards", count: 18 },
  { label: "Results", count: 12 },
  { label: "Question Papers", count: 32 },
  { label: "Answer Keys", count: 20 },
  { label: "Syllabus", count: 10 },
  { label: "Notes", count: 16 },
  { label: "Miscellaneous", count: 8 },
];

export const documentsList = [
  { name: "SSC_CGL_Tier_1_Scorecard.pdf", note: "My scorecard for Tier 1", exam: "SSC CGL Tier 1 (15 Jul 2026)", category: "Scorecard", uploaded: "15 Jul 2026", size: "245 KB" },
  { name: "SSC_CGL_Tier_1_AdmitCard.pdf", note: "Admit card for exam", exam: "SSC CGL Tier 1 (15 Jul 2026)", category: "Admit Card", uploaded: "10 Jul 2026", size: "522 KB" },
  { name: "SSC_CGL_Tier_1_AnswerKey.pdf", note: "Official answer key", exam: "SSC CGL Tier 1 (15 Jul 2026)", category: "Answer Key", uploaded: "22 Jul 2026", size: "1.2 MB" },
  { name: "SSC_CGL_Tier_1_Result.pdf", note: "Result notification", exam: "SSC CGL Tier 1 (15 Jul 2026)", category: "Result", uploaded: "05 Aug 2026", size: "312 KB" },
  { name: "RRB_NTPC_AdmitCard.jpg", note: "RRB NTPC admit card", exam: "RRB NTPC CBT 1 (10 Jun 2026)", category: "Admit Card", uploaded: "02 Jun 2026", size: "812 KB" },
  { name: "RRB_NTPC_QuestionPaper.pdf", note: "Official question paper", exam: "RRB NTPC CBT 1 (10 Jun 2026)", category: "Question Paper", uploaded: "11 Jun 2026", size: "1.8 MB" },
  { name: "RRB_NTPC_Scorecard.pdf", note: "My scorecard", exam: "RRB NTPC CBT 1 (10 Jun 2026)", category: "Scorecard", uploaded: "25 Jun 2026", size: "236 KB" },
  { name: "SBI_PO_Syllabus.pdf", note: "Syllabus for preparation", exam: "SBI PO Prelims (19 Aug 2026)", category: "Syllabus", uploaded: "20 May 2026", size: "1.1 MB" },
];

export const recentUploads = [
  { name: "SSC_CGL_Tier_1_Scorecard.pdf", date: "15 Jul 2026", size: "245 KB" },
  { name: "SSC_CGL_Tier_1_AdmitCard.pdf", date: "10 Jul 2026", size: "522 KB" },
  { name: "RRB_NTPC_Scorecard.pdf", date: "25 Jun 2026", size: "236 KB" },
  { name: "SBI_PO_Syllabus.pdf", date: "20 May 2026", size: "1.1 MB" },
];

export const linkedExams = [
  { name: "SSC CGL Tier 1 (15 Jul 2026)", count: 8 },
  { name: "RRB NTPC CBT 1 (10 Jun 2026)", count: 6 },
  { name: "SBI PO Prelims (19 Aug 2026)", count: 5 },
  { name: "IBPS PO Prelims (5 Oct 2026)", count: 4 },
  { name: "SSC CHSL Tier 1 (9 Sep 2025)", count: 7 },
];

// ----- Goals & Plans -----
export const goalsStats = [
  { label: "Active Goals", value: "5", change: "+2 from last month" },
  { label: "Completed Goals", value: "12", change: "+4 from last month" },
  { label: "Overdue Goals", value: "1", change: "-1 from last month" },
  { label: "Success Rate", value: "78%", change: "+8% from last month" },
];

export const todaysFocus = {
  title: "Complete 2 Quant Mock Tests",
  linkedExam: "SSC CGL Tier 1 (2026)",
  progress: "1/2",
  percent: 50,
  due: "Due Today",
};

export const activeGoals = [
  { title: "Quant Speed Improvement", priority: "High Priority", priorityColor: "red", linkedExam: "SSC CGL Tier 1 (2026)", subject: "Quantitative Aptitude", due: "15 Aug 2026", status: "In Progress", progress: "6 / 20 Mocks", percent: 30 },
  { title: "Current Affairs Revision", priority: "Medium Priority", priorityColor: "amber", linkedExam: "SBI PO (2026)", subject: "General Awareness", due: "30 Aug 2026", status: "In Progress", progress: "12 / 30 Days", percent: 40 },
  { title: "Improve Accuracy", priority: "High Priority", priorityColor: "red", linkedExam: "SSC CGL Tier 1 (2026)", subject: "All Sections", due: "10 Aug 2026", status: "In Progress", progress: "70 / 100 Questions", percent: 70 },
  { title: "English Vocabulary Building", priority: "Low Priority", priorityColor: "slate", linkedExam: "IBPS PO (2026)", subject: "English Language", due: "25 Aug 2026", status: "Not Started", progress: "0 / 500 Words", percent: 0 },
  { title: "Reduce Silly Mistakes", priority: "Medium Priority", priorityColor: "amber", linkedExam: "SSC CGL Tier 1 (2026)", subject: "All Sections", due: "05 Aug 2026", status: "Overdue", progress: "4 / 10 Days", percent: 40 },
];

export const completedGoals = [
  { title: "Completed 20 Quant Mocks", date: "10 Jul 2026" },
  { title: "30 Day Current Affairs Challenge", date: "05 Jul 2026" },
  { title: "Improve DI Accuracy", date: "28 Jun 2026" },
  { title: "1000 Vocabulary Challenge", date: "20 Jun 2026" },
  { title: "Weekly Mock Streak 4 Weeks", date: "15 Jun 2026" },
];

export const goalUpcomingDeadlines = [
  { name: "SSC CGL Tier 1 (2026)", date: "Exam on 31 Aug 2026", daysLeft: "15 Days" },
  { name: "SBI PO Prelims (2026)", date: "Exam on 15 Sep 2026", daysLeft: "30 Days" },
  { name: "IBPS PO Prelims (2026)", date: "Exam on 22 Sep 2026", daysLeft: "37 Days" },
];

export const priorityGoals = [
  { name: "Quant Speed Improvement", due: "Due in 15 days", level: "High" },
  { name: "Improve Accuracy", due: "Due in 10 days", level: "High" },
  { name: "Reduce Silly Mistakes", due: "Overdue by 3 days", level: "Medium" },
];

export const goalSmartSuggestions = [
  "You got 3 goals related to Quant. Keep practicing consistently!",
  "Your General Awareness is weak. Consider adding a daily revision goal.",
  "Try completing at least one mock daily to improve your speed.",
];

// ----- Calendar -----
export const calendarMonth = "June 2026";
export const calendarDays = [
  { day: 1, events: [{ type: "exam", label: "Quant Practice", time: "2:00 PM" }] },
  { day: 2, events: [{ type: "exam", label: "SBI PO Prelims", time: "Exam" }] },
  { day: 3, events: [{ type: "deadline", label: "Admit Card", time: "Release" }] },
  { day: 8, events: [{ type: "goal", label: "GA Revision", time: "1:00 PM" }] },
  { day: 10, events: [{ type: "reflection", label: "Reflection Review", time: "6:00 PM" }] },
  { day: 11, events: [{ type: "goal", label: "Mock Test", time: "10:00 AM" }] },
  { day: 13, events: [{ type: "deadline", label: "Application Last Date", time: "Deadline" }] },
  { day: 15, events: [{ type: "goal", label: "Quant Mock Test", time: "9:00 AM" }] },
  { day: 17, events: [{ type: "exam", label: "SSC CGL Tier 1", time: "Exam" }] },
  { day: 18, events: [{ type: "reflection", label: "Analysis & Notes", time: "5:00 PM" }] },
  { day: 22, events: [{ type: "goal", label: "English Practice", time: "2:00 PM" }] },
  { day: 24, events: [{ type: "goal", label: "Current Affairs", time: "8:00 AM" }] },
  { day: 26, events: [{ type: "reflection", label: "Reflection", time: "7:00 PM" }] },
  { day: 29, events: [{ type: "goal", label: "Mock Test", time: "10:00 AM" }] },
  { day: 30, events: [{ type: "deadline", label: "Result Expected", time: "SSC CGL" }] },
];

export const todaysSchedule = [
  { type: "goal", label: "Quant Practice", time: "2:00 PM - 3:00 PM" },
  { type: "reminder", label: "Read Editorial", time: "7:30 PM - 8:00 PM" },
];

export const calendarUpcomingDeadlines = [
  { name: "SBI PO Prelims (2026)", date: "Exam on 2 Jun 2026", daysLeft: "20 Days" },
  { name: "SSC CGL Tier 1 (2026)", date: "Exam on 17 Jun 2026", daysLeft: "35 Days" },
  { name: "IBPS PO Prelims (2026)", date: "Exam on 22 Sep 2026", daysLeft: "132 Days" },
  { name: "RRB NTPC (2026)", date: "Exam on 15 Oct 2026", daysLeft: "155 Days" },
];

export const studyStreak = {
  current: 7,
  longest: 14,
  daysThisMonth: 18,
  weekDots: [true, true, true, true, true, true, false],
};

export const eventsAndReminders = [
  { type: "exam", label: "SBI PO Prelims (2026)", tag: "Exam", desc: "Exam Day", date: "2 Jun 2026 • 09:00 AM", daysLeft: "20 Days Left" },
  { type: "deadline", label: "Admit Card Release", tag: "Deadline", desc: "IBPS PO Prelims (2026)", date: "3 Jun 2026", daysLeft: "21 Days Left" },
  { type: "goal", label: "Quant Practice", tag: "Goal", desc: "Solve 50 quant questions", date: "Today, 2:00 PM", daysLeft: "Today" },
  { type: "reflection", label: "Reflection Review", tag: "Reflection", desc: "Review SSC CGL Tier 1 reflection", date: "10 Jun 2026 • 06:00 PM", daysLeft: "3 Days Left" },
  { type: "deadline", label: "Application Last Date", tag: "Deadline", desc: "SSC CGL Tier 1 (2026)", date: "13 Jun 2026", daysLeft: "6 Days Left" },
];

// ----- Profile -----
export const myExamFocus = {
  primaryExam: "SSC CGL",
  secondaryExam: "SBI PO",
  targetYear: "2026",
  stage: "Preparation",
  language: "English",
  studyTime: "3 - 4 hours",
};

export const profileProgressSummary = {
  examsTracked: "24",
  examsAttempted: "18",
  examsQualified: "6",
  averageScore: "72.4%",
  bestScore: "89.8%",
  bestScoreExam: "SBI PO Prelims",
};

export const profileAchievements = [
  { label: "10 Exams Tracked", sub: "Great going!" },
  { label: "5 Reflections Completed", sub: "Keep reflecting!" },
  { label: "7 Day Study Streak", sub: "Consistency rocks!" },
  { label: "3 Goals Achieved", sub: "Keep it up!" },
  { label: "Score Improved by 12%", sub: "Fantastic!" },
];

export const examInterests = [
  { label: "SSC CGL", tag: "Primary" },
  { label: "SBI PO", tag: "Secondary" },
  { label: "IBPS PO", tag: "Interested" },
  { label: "RRB NTPC", tag: "Interested" },
  { label: "SSC CHSL", tag: "Interested" },
];

export const studyPreferences = {
  preferredTime: "Evening (6 PM - 10 PM)",
  hoursPerDay: "3 - 4 hours",
  learningMode: "Self Study",
  weekendStudy: "Saturdays & Sundays",
};

// ----- Help Center -----
export const helpTopics = [
  { label: "Getting Started", desc: "Learn the basics and set up your account" },
  { label: "Exams & Entries", desc: "Add exams, track dates and results" },
  { label: "Goals & Planning", desc: "Create goals, plans and track progress" },
  { label: "Reflections", desc: "Reflect on exams and improve your strategy" },
  { label: "Account & Settings", desc: "Manage your profile, preferences & privacy" },
];

export const popularArticles = [
  { label: "How to Add Exams and Dates", sub: "Step-by-step guide" },
  { label: "Understanding Exam Analytics", sub: "Detailed explanation" },
  { label: "How to Set Study Goals", sub: "Tips and best practices" },
  { label: "Reflection Guide for Better Improvement", sub: "Make the most out of reflections" },
  { label: "Managing Reminders", sub: "Never miss important dates" },
];

export const userGuides = [
  { label: "How to Add Your First Exam", desc: "Learn how to add an exam and track all important dates.", time: "5 min read" },
  { label: "Tracking Your Exam Progress", desc: "Understand how to log results and track your performance.", time: "6 min read" },
  { label: "Setting Goals and Plans", desc: "Create effective study goals and monitor your progress.", time: "7 min read" },
  { label: "Using Reflections Effectively", desc: "Reflect on your performance and identify key learnings.", time: "4 min read" },
  { label: "Understanding Analytics", desc: "Explore analytics, heatmaps and performance insights.", time: "8 min read" },
  { label: "Managing Documents", desc: "Upload, organize and access all your important documents.", time: "4 min read" },
];

export const faqs = [
  "How do I add a new exam?",
  "How can I update exam results?",
  "How does the analytics and heatmap work?",
  "Can I set reminders for exam dates and deadlines?",
  "How do reflections help me improve?",
  "Is my data safe and private?",
];

export const videoTutorials = [
  { label: "Getting Started with the App", duration: "3:45" },
  { label: "Adding Exams and Tracking", duration: "4:12" },
  { label: "Using Analytics Dashboard", duration: "5:08" },
  { label: "Creating Goals and Plans", duration: "4:30" },
];

// ----- Sign Out -----
export const signedInDevices = [
  { device: "Windows • Chrome", location: "Bangalore, Karnataka • IP 122.168.1.10", current: true, lastActive: "Active now" },
  { device: "Android • Mobile App", location: "Bangalore, Karnataka", current: false, lastActive: "Last active 2 days ago" },
  { device: "iPad • Safari", location: "Bangalore, Karnataka", current: false, lastActive: "Last active 5 days ago" },
  { device: "Mac OS • Chrome", location: "Bangalore, Karnataka", current: false, lastActive: "Last active 12 days ago" },
];

export const securityTips = [
  { label: "Always sign out from shared devices", desc: "This helps protect your personal information." },
  { label: "Enable two-factor authentication", desc: "Add an extra layer of security to your account." },
  { label: "Keep your password strong", desc: "Use a combination of letters, numbers and symbols." },
  { label: "Review your active sessions regularly", desc: "Remove any devices you don't recognize." },
  { label: "Never share your account details", desc: "Your account is for your personal use only." },
];

// ----- Upgrade Plan -----
export const plans = [
  {
    name: "Free",
    tagline: "For getting started",
    price: "₹0",
    badge: null,
    features: [
      { label: "Track unlimited exams", included: true },
      { label: "Add exam dates & details", included: true },
      { label: "Basic analytics", included: true },
      { label: "5 document uploads", included: true },
      { label: "3 reflections per month", included: true },
      { label: "AI insights", included: false },
      { label: "Advanced analytics", included: false },
      { label: "Unlimited documents", included: false },
      { label: "Custom reminders", included: false },
      { label: "Export reports", included: false },
      { label: "Priority support", included: false },
    ],
  },
  {
    name: "Premium",
    tagline: "For serious aspirants",
    price: "₹149",
    badge: "Most Popular",
    features: [
      { label: "Everything in Free", included: true },
      { label: "AI-powered insights", included: true },
      { label: "Advanced analytics", included: true },
      { label: "Unlimited documents", included: true },
      { label: "Unlimited reflections", included: true },
      { label: "Custom reminders", included: true },
      { label: "Export reports (PDF/Excel)", included: true },
      { label: "Study streak tracking", included: true },
      { label: "Priority support", included: true },
    ],
  },
  {
    name: "Pro",
    tagline: "For advanced preparation",
    price: "₹249",
    badge: null,
    features: [
      { label: "Everything in Premium", included: true },
      { label: "Multi-exam comparison", included: true },
      { label: "Exam prediction insights", included: true },
      { label: "Custom goal recommendations", included: true },
      { label: "Detailed performance reports", included: true },
      { label: "Cloud backup & sync", included: true },
      { label: "Early access to new features", included: true },
      { label: "Dedicated support", included: true },
    ],
  },
];

export const compareFeatures = [
  { label: "Track Unlimited Exams", free: true, premium: true, pro: true },
  { label: "Add Exam Dates & Details", free: true, premium: true, pro: true },
  { label: "Basic Analytics", free: true, premium: true, pro: true },
  { label: "AI-Powered Insights", free: false, premium: true, pro: true },
  { label: "Advanced Analytics", free: false, premium: true, pro: true },
  { label: "Unlimited Documents", free: false, premium: true, pro: true },
  { label: "Unlimited Reflections", free: false, premium: true, pro: true },
  { label: "Custom Reminders", free: false, premium: true, pro: true },
  { label: "Export Reports (PDF/Excel)", free: false, premium: true, pro: true },
  { label: "Multi-Exam Comparison", free: false, premium: false, pro: true },
  { label: "Dedicated Support", free: false, premium: false, pro: true },
  { label: "Cloud Backup & Sync", free: false, premium: false, pro: true },
  { label: "Early Access to New Features", free: false, premium: false, pro: true },
];

export const upgradeFaqs = [
  "Can I change my plan later?",
  "Is my payment information safe?",
  "Do you offer refunds?",
  "What payment methods do you accept?",
  "Can I cancel anytime?",
];
