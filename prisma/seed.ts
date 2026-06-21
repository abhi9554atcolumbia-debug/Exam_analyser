import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const db = new PrismaClient();

const USER_ID = "user-demo-001";

async function seed() {
  console.log("Seeding database...");

  // Clean existing data
  await db.studyStreak.deleteMany();
  await db.device.deleteMany();
  await db.notification.deleteMany();
  await db.reminder.deleteMany();
  await db.calendarEvent.deleteMany();
  await db.goal.deleteMany();
  await db.document.deleteMany();
  await db.reflectionSection.deleteMany();
  await db.reflection.deleteMany();
  await db.sectionalScore.deleteMany();
  await db.upcomingExam.deleteMany();
  await db.exam.deleteMany();
  await db.userSettings.deleteMany();
  await db.user.deleteMany();

  // ─── User ──────────────────────────────────────────────
  const user = await db.user.create({
    data: {
      id: USER_ID,
      name: "Aman Verma",
      email: "alexcarter@email.com",
      phone: "+91 98765 43210",
      location: "Bangalore, Karnataka",
      role: "Pre-Med Student",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman&backgroundColor=b6e3f4",
      memberSince: "May 2024",
      primaryExam: "IBPS PO",
      secondaryExam: "SSC CGL",
      targetYear: "2025",
      currentStage: "Prelims Preparation",
      language: "English",
      studyTime: "4-6 hours",
      preferredTime: "Morning (6 AM - 10 AM)",
      hoursPerDay: "5-6",
      learningMode: "Self Study",
      weekendStudy: "Yes, extended hours",
      plan: "free",
    },
  });

  // ─── User Settings ─────────────────────────────────────
  await db.userSettings.create({
    data: {
      userId: USER_ID,
      emailNotifications: true,
      pushNotifications: true,
      examReminders: true,
      goalReminders: true,
      weeklyReport: true,
      newFeatureAlerts: true,
      marketingEmails: false,
      theme: "light",
      accentColor: "emerald",
      language: "en",
      dateFormat: "DD/MM/YYYY",
      weekStart: "monday",
      timeFormat: "12h",
      privacyMode: false,
    },
  });

  // ─── Exams (History) ───────────────────────────────────
  const exams = [
    {
      id: "exam-001", userId: USER_ID, name: "IBPS PO Prelims 2024", org: "IBPS", category: "Banking", stage: "Prelims", examDate: new Date("2024-10-19"), attempt: 1, score: 62.5, maxScore: 100, cutoff: 56, cutoffGap: -6.5, result: "Qualified", rank: 342,
      sectionalScores: { create: [
        { section: "Quantitative Aptitude", score: 16.5, max: 35 },
        { section: "Reasoning Ability", score: 24, max: 35 },
        { section: "English Language", score: 22, max: 30 },
      ]},
    },
    {
      id: "exam-002", userId: USER_ID, name: "IBPS PO Mains 2024", org: "IBPS", category: "Banking", stage: "Mains", examDate: new Date("2024-11-05"), attempt: 1, score: 58.75, maxScore: 100, cutoff: 62, cutoffGap: 3.25, result: "Not Qualified",
      sectionalScores: { create: [
        { section: "Quantitative Aptitude", score: 14.25, max: 35 },
        { section: "Reasoning Ability", score: 20.5, max: 35 },
        { section: "English Language", score: 12, max: 30 },
        { section: "General Awareness", score: 12, max: 40 },
      ]},
    },
    {
      id: "exam-003", userId: USER_ID, name: "SSC CGL Tier 1 2024", org: "SSC", category: "SSC", stage: "Tier 1", examDate: new Date("2024-09-09"), attempt: 2, score: 142, maxScore: 200, cutoff: 135, cutoffGap: -7, result: "Qualified", rank: 1245,
      sectionalScores: { create: [
        { section: "General Intelligence", score: 38, max: 50 },
        { section: "Quantitative Aptitude", score: 30, max: 50 },
        { section: "English Language", score: 38, max: 50 },
        { section: "General Awareness", score: 36, max: 50 },
      ]},
    },
    {
      id: "exam-004", userId: USER_ID, name: "SSC CGL Tier 2 2024", org: "SSC", category: "SSC", stage: "Tier 2", examDate: new Date("2024-10-25"), attempt: 1, score: 310, maxScore: 400, cutoff: 325, cutoffGap: 15, result: "Not Qualified",
      sectionalScores: { create: [
        { section: "Quantitative Aptitude", score: 72, max: 100 },
        { section: "English Language", score: 85, max: 100 },
        { section: "General Studies", score: 78, max: 100 },
        { section: "Reasoning", score: 75, max: 100 },
      ]},
    },
    {
      id: "exam-005", userId: USER_ID, name: "IBPS Clerk Prelims 2024", org: "IBPS", category: "Banking", stage: "Prelims", examDate: new Date("2024-08-24"), attempt: 1, score: 72, maxScore: 100, cutoff: 58, cutoffGap: -14, result: "Qualified", rank: 198,
      sectionalScores: { create: [
        { section: "Quantitative Aptitude", score: 25, max: 35 },
        { section: "Reasoning Ability", score: 28, max: 35 },
        { section: "English Language", score: 19, max: 30 },
      ]},
    },
    {
      id: "exam-006", userId: USER_ID, name: "IBPS Clerk Mains 2024", org: "IBPS", category: "Banking", stage: "Mains", examDate: new Date("2024-10-14"), attempt: 1, score: 68.5, maxScore: 100, cutoff: 65, cutoffGap: -3.5, result: "Qualified", rank: 89,
      sectionalScores: { create: [
        { section: "Quantitative Aptitude", score: 20, max: 35 },
        { section: "Reasoning Ability", score: 22, max: 35 },
        { section: "English Language", score: 18.5, max: 30 },
        { section: "General Awareness", score: 8, max: 25 },
      ]},
    },
    {
      id: "exam-007", userId: USER_ID, name: "SBI PO Prelims 2023", org: "SBI", category: "Banking", stage: "Prelims", examDate: new Date("2023-11-01"), attempt: 1, score: 54, maxScore: 100, cutoff: 52, cutoffGap: -2, result: "Qualified", rank: 567,
      sectionalScores: { create: [
        { section: "Quantitative Aptitude", score: 15, max: 35 },
        { section: "Reasoning Ability", score: 22, max: 35 },
        { section: "English Language", score: 17, max: 30 },
      ]},
    },
    {
      id: "exam-008", userId: USER_ID, name: "SBI PO Mains 2023", org: "SBI", category: "Banking", stage: "Mains", examDate: new Date("2023-12-05"), attempt: 1, score: 48.5, maxScore: 100, cutoff: 55, cutoffGap: 6.5, result: "Not Qualified",
      sectionalScores: { create: [
        { section: "Quantitative Aptitude", score: 12, max: 35 },
        { section: "Reasoning Ability", score: 16.5, max: 35 },
        { section: "English Language", score: 10, max: 30 },
        { section: "General Awareness", score: 10, max: 40 },
      ]},
    },
    {
      id: "exam-009", userId: USER_ID, name: "RRB NTPC CBT 1 2023", org: "RRB", category: "Railway", stage: "CBT 1", examDate: new Date("2023-09-02"), attempt: 1, score: 68, maxScore: 100, cutoff: 60, cutoffGap: -8, result: "Qualified", rank: 890,
      sectionalScores: { create: [
        { section: "Mathematics", score: 22, max: 30 },
        { section: "General Intelligence", score: 24, max: 30 },
        { section: "General Awareness", score: 22, max: 40 },
      ]},
    },
    {
      id: "exam-010", userId: USER_ID, name: "IBPS RRB PO Pre 2023", org: "IBPS", category: "Banking", stage: "Prelims", examDate: new Date("2023-08-12"), attempt: 1, score: 58, maxScore: 100, cutoff: 54, cutoffGap: -4, result: "Qualified", rank: 445,
      sectionalScores: { create: [
        { section: "Quantitative Aptitude", score: 18, max: 35 },
        { section: "Reasoning Ability", score: 23, max: 35 },
        { section: "English Language", score: 17, max: 30 },
      ]},
    },
  ];

  for (const exam of exams) {
    await db.exam.create({ data: exam });
  }

  // ─── Upcoming Exams ────────────────────────────────────
  const upcomingExams = [
    { id: "up-001", userId: USER_ID, name: "IBPS PO Prelims 2025", org: "IBPS", priority: "High", examDate: new Date("2025-08-18"), daysLeft: 45, admitCard: false, applicationStatus: "completed", hasReflection: false, hasSyllabus: true, reminderSet: true },
    { id: "up-002", userId: USER_ID, name: "SSC CGL Tier 1 2025", org: "SSC", priority: "High", examDate: new Date("2025-09-15"), daysLeft: 73, admitCard: false, applicationStatus: "in_progress", hasReflection: false, hasSyllabus: true, reminderSet: true },
    { id: "up-003", userId: USER_ID, name: "RBI Grade B Phase 1", org: "RBI", priority: "Medium", examDate: new Date("2025-10-20"), daysLeft: 108, admitCard: false, applicationStatus: "not_started", hasReflection: false, hasSyllabus: false, reminderSet: false },
    { id: "up-004", userId: USER_ID, name: "SBI Clerk Prelims 2025", org: "SBI", priority: "Low", examDate: new Date("2025-11-10"), daysLeft: 129, admitCard: false, applicationStatus: "not_started", hasReflection: false, hasSyllabus: false, reminderSet: false },
  ];

  for (const ue of upcomingExams) {
    await db.upcomingExam.create({ data: ue });
  }

  // ─── Reflections ───────────────────────────────────────
  await db.reflection.create({
    data: {
      id: "ref-001", userId: USER_ID, examId: "exam-001",
      examName: "IBPS PO Prelims 2024", examDate: new Date("2024-10-19"),
      score: 62.5, cutoff: 56, gap: -6.5, result: "Qualified",
      difficulty: "Moderate", confidence: 72, emotionalState: "Confident",
      mistakeTags: "Time Management,Concept Gap",
      strengthTags: "Strong in Reasoning,Good Speed",
      whatWentWrong: "Lost time on tricky DI sets in Quant. Should have skipped earlier.",
      whatWentWell: "Reasoning was smooth. Puzzles were moderate and attempted all.",
      biggestLesson: "Time management is key. Skip difficult questions early.",
      actionPlan: "Practice DI sets daily for 30 min. Take 2 sectional tests per week.",
      targetScore: 70, goalDescription: "Score 70+ in next prelims attempt",
      sections: {
        create: [
          { section: "Quantitative Aptitude", score: 16.5, strength: "Arithmetic topics", weakness: "DI sets", actionPlan: "Daily DI practice" },
          { section: "Reasoning Ability", score: 24, strength: "Puzzles and seating", weakness: "Input-output", actionPlan: "Practice input-output patterns" },
          { section: "English Language", score: 22, strength: "Reading comprehension", weakness: "Error spotting", actionPlan: "Daily grammar rules review" },
        ],
      },
    },
  });

  await db.reflection.create({
    data: {
      id: "ref-002", userId: USER_ID, examId: "exam-003",
      examName: "SSC CGL Tier 1 2024", examDate: new Date("2024-09-09"),
      score: 142, cutoff: 135, gap: -7, result: "Qualified",
      difficulty: "Moderate", confidence: 65, emotionalState: "Neutral",
      mistakeTags: "Silly Mistakes,Revision Gap",
      strengthTags: "Strong in Reasoning,Good Speed,Accurate in English",
      whatWentWrong: "Made calculation errors in Quant. Some GA questions were unfamiliar.",
      whatWentWell: "English and Reasoning sections were strong. Good time management overall.",
      biggestLesson: "Need to revise more consistently and double-check calculations.",
      actionPlan: "Daily GA quiz. Weekly full-length mock tests. Revise formulas daily.",
      targetScore: 165, goalDescription: "Clear Tier 2 cutoff comfortably",
      sections: {
        create: [
          { section: "General Intelligence", score: 38, strength: "Series and analogy", weakness: "Statement-conclusion", actionPlan: "Practice reasoning variety" },
          { section: "Quantitative Aptitude", score: 30, strength: "Algebra", weakness: "Geometry", actionPlan: "Geometry concept revision" },
          { section: "English Language", score: 38, strength: "Vocabulary", weakness: "Idioms", actionPlan: "Daily idiom practice" },
          { section: "General Awareness", score: 36, strength: "Static GK", weakness: "Current Affairs", actionPlan: "Daily news digest" },
        ],
      },
    },
  });

  // ─── Documents ─────────────────────────────────────────
  const docs = [
    { id: "doc-001", userId: USER_ID, name: "IBPS PO 2024 Scorecard.pdf", note: "Prelims scorecard", examName: "IBPS PO Prelims 2024", category: "Scorecard", fileSize: 245000, year: "2024" },
    { id: "doc-002", userId: USER_ID, name: "SSC CGL Tier 1 Admit Card.pdf", note: "Hall ticket", examName: "SSC CGL Tier 1 2024", category: "Admit Card", fileSize: 180000, year: "2024" },
    { id: "doc-003", userId: USER_ID, name: "IBPS PO Mains Result.pdf", note: "Mains result notification", examName: "IBPS PO Mains 2024", category: "Result", fileSize: 320000, year: "2024" },
    { id: "doc-004", userId: USER_ID, name: "SSC CGL Question Paper.pdf", note: "Tier 1 question paper with answers", examName: "SSC CGL Tier 1 2024", category: "Question Paper", fileSize: 1500000, year: "2024" },
    { id: "doc-005", userId: USER_ID, name: "IBPS Clerk Answer Key.pdf", note: "Official answer key", examName: "IBPS Clerk Prelims 2024", category: "Answer Key", fileSize: 890000, year: "2024" },
    { id: "doc-006", userId: USER_ID, name: "Banking Syllabus 2025.pdf", note: "Complete banking exam syllabus", examName: "IBPS PO Prelims 2025", category: "Syllabus", fileSize: 450000, year: "2025" },
    { id: "doc-007", userId: USER_ID, name: "Quant Notes - DI Sets.pdf", note: "Data interpretation practice notes", examName: "", category: "Notes", fileSize: 670000, year: "2024" },
    { id: "doc-008", userId: USER_ID, name: "GA Current Affairs June.pdf", note: "Monthly current affairs compilation", examName: "", category: "Notes", fileSize: 1200000, year: "2024" },
  ];

  for (const doc of docs) {
    await db.document.create({ data: doc });
  }

  // ─── Goals ─────────────────────────────────────────────
  const goals = [
    { id: "goal-001", userId: USER_ID, title: "Complete DI Practice Set", priority: "High", linkedExam: "IBPS PO Prelims 2025", subject: "Quantitative Aptitude", dueDate: new Date("2025-07-20"), status: "active", progress: 65, description: "Complete 50 DI sets before IBPS PO Pre" },
    { id: "goal-002", userId: USER_ID, title: "Daily GA Quiz Streak", priority: "Medium", linkedExam: "SSC CGL Tier 1 2025", subject: "General Awareness", dueDate: new Date("2025-09-10"), status: "active", progress: 40, description: "Maintain daily GA quiz for 30 consecutive days" },
    { id: "goal-003", userId: USER_ID, title: "Revise Grammar Rules", priority: "High", linkedExam: "IBPS PO Prelims 2025", subject: "English Language", dueDate: new Date("2025-07-25"), status: "active", progress: 80, description: "Complete Wren & Martin revision" },
    { id: "goal-004", userId: USER_ID, title: "Take 10 Mock Tests", priority: "Medium", linkedExam: "SSC CGL Tier 1 2025", subject: "All Sections", dueDate: new Date("2025-08-30"), status: "active", progress: 30, description: "Complete 10 full-length mock tests for CGL" },
    { id: "goal-005", userId: USER_ID, title: "Geometry Revision", priority: "Low", linkedExam: "SSC CGL Tier 1 2025", subject: "Quantitative Aptitude", dueDate: new Date("2025-08-15"), status: "active", progress: 20, description: "Complete geometry chapter from R.S. Aggarwal" },
    { id: "goal-006", userId: USER_ID, title: "Complete Reasoning Puzzles", priority: "High", linkedExam: "IBPS PO Prelims 2025", subject: "Reasoning Ability", dueDate: new Date("2025-07-10"), status: "completed", progress: 100, description: "Complete 100 puzzle sets", completedAt: new Date("2025-07-08") },
    { id: "goal-007", userId: USER_ID, title: "Vocabulary Builder - 500 Words", priority: "Medium", linkedExam: "SSC CGL Tier 1 2025", subject: "English Language", dueDate: new Date("2025-07-05"), status: "completed", progress: 100, description: "Learn 500 new words", completedAt: new Date("2025-07-04") },
  ];

  for (const goal of goals) {
    await db.goal.create({ data: goal });
  }

  // ─── Calendar Events ───────────────────────────────────
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const calEvents = [
    { id: "cal-001", userId: USER_ID, type: "exam", label: "IBPS PO Prelims 2025", date: new Date(year, month, 18), time: "10:00 AM" },
    { id: "cal-002", userId: USER_ID, type: "goal", label: "Complete DI Practice Set", date: new Date(year, month, 20), time: "All Day" },
    { id: "cal-003", userId: USER_ID, type: "deadline", label: "SSC CGL Application Last Date", date: new Date(year, month, 25), time: "11:59 PM" },
    { id: "cal-004", userId: USER_ID, type: "reminder", label: "Mock Test - Full Length", date: new Date(year, month, 10), time: "2:00 PM" },
    { id: "cal-005", userId: USER_ID, type: "reflection", label: "Weekly Reflection", date: new Date(year, month, 7), time: "8:00 PM" },
    { id: "cal-006", userId: USER_ID, type: "exam", label: "SSC CGL Tier 1 2025", date: new Date(year, month + 1, 15), time: "10:00 AM" },
    { id: "cal-007", userId: USER_ID, type: "deadline", label: "RBI Grade B Apply", date: new Date(year, month + 1, 5), time: "11:59 PM" },
    { id: "cal-008", userId: USER_ID, type: "goal", label: "Take Mock Test #5", date: new Date(year, month, 14), time: "2:00 PM" },
  ];

  for (const ev of calEvents) {
    await db.calendarEvent.create({ data: ev });
  }

  // ─── Reminders ─────────────────────────────────────────
  const reminders = [
    { id: "rem-001", userId: USER_ID, name: "IBPS PO Admit Card", text: "Download admit card when available", date: new Date(year, month, 10) },
    { id: "rem-002", userId: USER_ID, name: "SSC CGL Application", text: "Complete application form before deadline", date: new Date(year, month, 20) },
    { id: "rem-003", userId: USER_ID, name: "Weekly Mock Test", text: "Take a full-length mock test this weekend", date: new Date(year, month, 12) },
  ];

  for (const rem of reminders) {
    await db.reminder.create({ data: rem });
  }

  // ─── Notifications ─────────────────────────────────────
  const notifications = [
    { id: "notif-001", userId: USER_ID, title: "New Mock Test Available", message: "A new IBPS PO Prelims mock test has been added.", type: "info", isRead: false },
    { id: "notif-002", userId: USER_ID, title: "Goal Deadline Approaching", message: "Your 'Complete DI Practice Set' goal is due in 5 days.", type: "warning", isRead: false },
    { id: "notif-003", userId: USER_ID, title: "Study Streak: 7 Days!", message: "Congratulations! You've maintained a 7-day study streak.", type: "success", isRead: true },
    { id: "notif-004", userId: USER_ID, title: "Exam Result Update", message: "IBPS Clerk Mains 2024 result has been declared.", type: "info", isRead: false },
  ];

  for (const notif of notifications) {
    await db.notification.create({ data: notif });
  }

  // ─── Devices ───────────────────────────────────────────
  const devices = [
    { id: "dev-001", userId: USER_ID, device: "Chrome on Windows", location: "Bangalore, India", isCurrent: true, lastActive: new Date() },
    { id: "dev-002", userId: USER_ID, device: "Safari on iPhone", location: "Bangalore, India", isCurrent: false, lastActive: new Date(Date.now() - 86400000) },
    { id: "dev-003", userId: USER_ID, device: "Chrome on MacOS", location: "Delhi, India", isCurrent: false, lastActive: new Date(Date.now() - 604800000) },
    { id: "dev-004", userId: USER_ID, device: "Firefox on Linux", location: "Mumbai, India", isCurrent: false, lastActive: new Date(Date.now() - 2592000000) },
  ];

  for (const dev of devices) {
    await db.device.create({ data: dev });
  }

  // ─── Study Streak ──────────────────────────────────────
  await db.studyStreak.create({
    data: {
      userId: USER_ID,
      currentStreak: 7,
      longestStreak: 14,
      daysThisMonth: 18,
      lastStudyDate: new Date(),
      weekDots: "1,1,1,0,1,1,1",
    },
  });

  console.log("Seed completed successfully!");
  console.log(`  - User: ${user.name}`);
  console.log(`  - Exams: ${exams.length}`);
  console.log(`  - Upcoming Exams: ${upcomingExams.length}`);
  console.log(`  - Reflections: 2`);
  console.log(`  - Documents: ${docs.length}`);
  console.log(`  - Goals: ${goals.length}`);
  console.log(`  - Calendar Events: ${calEvents.length}`);
  console.log(`  - Reminders: ${reminders.length}`);
  console.log(`  - Notifications: ${notifications.length}`);
  console.log(`  - Devices: ${devices.length}`);
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());