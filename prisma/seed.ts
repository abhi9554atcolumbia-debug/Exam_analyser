import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const db = new PrismaClient();

const USER_ID = "user-demo-001";

async function seed() {
  console.log("Seeding database...");

  // Clean existing data
  await db.studyStreak.deleteMany();
  await db.journalEntry.deleteMany();
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
      targetYear: "2026",
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

  // ─── Exams (History) — 15 total ───────────────────────
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
    // ── 5 NEW EXAMS (exam-011 to exam-015) ──
    {
      id: "exam-011", userId: USER_ID, name: "RRB NTPC CBT 2 2024", org: "RRB", category: "Railway", stage: "CBT 2", examDate: new Date("2024-06-15"), attempt: 1, score: 72, maxScore: 100, cutoff: 68, cutoffGap: -4, result: "Qualified", rank: 234,
      sectionalScores: { create: [
        { section: "General Awareness", score: 28, max: 40 },
        { section: "Mathematics", score: 22, max: 30 },
        { section: "General Intelligence", score: 22, max: 30 },
      ]},
    },
    {
      id: "exam-012", userId: USER_ID, name: "LIC AAO Prelims 2024", org: "LIC", category: "Insurance", stage: "Prelims", examDate: new Date("2024-05-18"), attempt: 1, score: 58, maxScore: 100, cutoff: 55, cutoffGap: -3, result: "Qualified", rank: 312,
      sectionalScores: { create: [
        { section: "Quantitative Aptitude", score: 18, max: 35 },
        { section: "Reasoning Ability", score: 22, max: 35 },
        { section: "English Language", score: 18, max: 30 },
      ]},
    },
    {
      id: "exam-013", userId: USER_ID, name: "LIC AAO Mains 2024", org: "LIC", category: "Insurance", stage: "Mains", examDate: new Date("2024-06-23"), attempt: 1, score: 112, maxScore: 200, cutoff: 120, cutoffGap: 8, result: "Not Qualified",
      sectionalScores: { create: [
        { section: "Quantitative Aptitude", score: 28, max: 50 },
        { section: "Reasoning Ability", score: 30, max: 50 },
        { section: "English Language", score: 26, max: 50 },
        { section: "General Knowledge", score: 28, max: 50 },
      ]},
    },
    {
      id: "exam-014", userId: USER_ID, name: "UPSC CSE Prelims 2024", org: "UPSC", category: "UPSC", stage: "Prelims", examDate: new Date("2024-05-26"), attempt: 1, score: 88, maxScore: 200, cutoff: 92, cutoffGap: 4, result: "Not Qualified",
      sectionalScores: { create: [
        { section: "General Studies Paper 1", score: 48, max: 100 },
        { section: "CSAT", score: 40, max: 100 },
      ]},
    },
    {
      id: "exam-015", userId: USER_ID, name: "SBI Clerk Prelims 2024", org: "SBI", category: "Banking", stage: "Prelims", examDate: new Date("2024-02-22"), attempt: 1, score: 70, maxScore: 100, cutoff: 62, cutoffGap: -8, result: "Qualified", rank: 156,
      sectionalScores: { create: [
        { section: "Quantitative Aptitude", score: 24, max: 35 },
        { section: "Reasoning Ability", score: 26, max: 35 },
        { section: "English Language", score: 20, max: 30 },
      ]},
    },
  ];

  for (const exam of exams) {
    await db.exam.create({ data: exam });
  }

  // ─── Upcoming Exams ────────────────────────────────────
  const upcomingExams = [
    { id: "up-001", userId: USER_ID, name: "IBPS PO Prelims 2026", org: "IBPS", priority: "High", examDate: new Date("2026-08-18"), daysLeft: 58, admitCard: false, applicationStatus: "completed", hasReflection: false, hasSyllabus: true, reminderSet: true },
    { id: "up-002", userId: USER_ID, name: "SSC CGL Tier 1 2026", org: "SSC", priority: "High", examDate: new Date("2026-09-15"), daysLeft: 86, admitCard: false, applicationStatus: "in_progress", hasReflection: false, hasSyllabus: true, reminderSet: true },
    { id: "up-003", userId: USER_ID, name: "RBI Grade B Phase 1", org: "RBI", priority: "Medium", examDate: new Date("2026-10-20"), daysLeft: 121, admitCard: false, applicationStatus: "not_started", hasReflection: false, hasSyllabus: false, reminderSet: false },
    { id: "up-004", userId: USER_ID, name: "SBI Clerk Prelims 2026", org: "SBI", priority: "Low", examDate: new Date("2026-11-10"), daysLeft: 142, admitCard: false, applicationStatus: "not_started", hasReflection: false, hasSyllabus: false, reminderSet: false },
  ];

  for (const ue of upcomingExams) {
    await db.upcomingExam.create({ data: ue });
  }

  // ─── Reflections — 8 total ────────────────────────────
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

  // ── 6 NEW REFLECTIONS (ref-003 to ref-008) ──
  await db.reflection.create({
    data: {
      id: "ref-003", userId: USER_ID, examId: "exam-002",
      examName: "IBPS PO Mains 2024", examDate: new Date("2024-11-05"),
      score: 58.75, cutoff: 62, gap: 3.25, result: "Not Qualified",
      difficulty: "Hard", confidence: 45, emotionalState: "Frustrated",
      mistakeTags: "Concept Gap,Time Management,Poor Accuracy",
      strengthTags: "Good Attempt Strategy,Strong Reasoning Basics",
      whatWentWrong: "GA section was very tough with unexpected current affairs. Lost 15 minutes on a tough DI set. English descriptive paper needed better structure.",
      whatWentWell: "Reasoning puzzles went well. Maintained composure for the first hour. Attempted all questions in Reasoning.",
      biggestLesson: "Need to widen GA preparation beyond banking awareness. Descriptive writing needs structured practice.",
      actionPlan: "Subscribe to daily current affairs digest. Practice 2 descriptive essays per week. Focus on insurance and finance GK.",
      targetScore: 68, goalDescription: "Clear IBPS PO Mains cutoff in next attempt",
      sections: {
        create: [
          { section: "Quantitative Aptitude", score: 14.25, strength: "Data Sufficiency", weakness: "Data Interpretation", actionPlan: "Practice high-level DI sets" },
          { section: "Reasoning Ability", score: 20.5, strength: "Puzzles", weakness: "Decision Making", actionPlan: "Practice decision making caselets" },
          { section: "English Language", score: 12, strength: "Comprehension", weakness: "Descriptive Writing", actionPlan: "Essay practice twice a week" },
          { section: "General Awareness", score: 12, strength: "Banking Awareness", weakness: "Current Affairs", actionPlan: "Daily CA quiz + monthly compilation" },
        ],
      },
    },
  });

  await db.reflection.create({
    data: {
      id: "ref-004", userId: USER_ID, examId: "exam-005",
      examName: "IBPS Clerk Prelims 2024", examDate: new Date("2024-08-24"),
      score: 72, cutoff: 58, gap: -14, result: "Qualified",
      difficulty: "Easy", confidence: 85, emotionalState: "Confident",
      mistakeTags: "Over-confidence,Minor Errors",
      strengthTags: "Excellent Speed,Strong Basics,Accurate Calculation",
      whatWentWrong: "Tried to attempt all questions in Quant even though 2 were very time-consuming. Minor error in one simplification.",
      whatWentWell: "Cleared prelims with a very comfortable margin. Speed was excellent. English cloze test was easy.",
      biggestLesson: "Don't get greedy — leaving 2 hard questions is smarter than wasting 5 minutes.",
      actionPlan: "Maintain current prep level. Focus on Mains-specific topics now. Start GA preparation for Mains.",
      targetScore: 75, goalDescription: "Score 75+ in Clerk Mains",
      sections: {
        create: [
          { section: "Quantitative Aptitude", score: 25, strength: "Simplification", weakness: "Number Series (hard)", actionPlan: "Practice tricky number series" },
          { section: "Reasoning Ability", score: 28, strength: "Syllogism", weakness: "Coding-Decoding variations", actionPlan: "Try new coding-decoding patterns" },
          { section: "English Language", score: 19, strength: "Cloze Test", weakness: "Para Jumbles", actionPlan: "Daily para jumble practice" },
        ],
      },
    },
  });

  await db.reflection.create({
    data: {
      id: "ref-005", userId: USER_ID, examId: "exam-004",
      examName: "SSC CGL Tier 2 2024", examDate: new Date("2024-10-25"),
      score: 310, cutoff: 325, gap: 15, result: "Not Qualified",
      difficulty: "Hard", confidence: 50, emotionalState: "Anxious",
      mistakeTags: "Silly Mistakes,Time Management,Concept Gap,Poor Accuracy",
      strengthTags: "Good English,Strong Vocabulary,Decent Reasoning",
      whatWentWrong: "Quant section had very lengthy calculations. Missed 8 questions due to time shortage. Some topics like Mensuration were poorly prepared.",
      whatWentWell: "English section was strong as always. Reasoning was moderate and manageable. Vocabulary helped in saving time.",
      biggestLesson: "Tier 2 demands deeper Quant preparation. Cannot rely solely on speed — need accuracy too.",
      actionPlan: "Focus on advanced Quant: Mensuration, Trigonometry, Algebra. Take 3 full-length mocks per week. Analyze each mock thoroughly.",
      targetScore: 350, goalDescription: "Score 350+ in SSC CGL Tier 2 next attempt",
      sections: {
        create: [
          { section: "Quantitative Aptitude", score: 72, strength: "Algebra", weakness: "Mensuration,Trigonometry", actionPlan: "Advanced Quant topic revision" },
          { section: "English Language", score: 85, strength: "Vocabulary,Comprehension", weakness: "Active-Passive Voice", actionPlan: "Voice change practice daily" },
          { section: "General Studies", score: 78, strength: "Indian Polity", weakness: "Economics", actionPlan: "Read NCERT Economics" },
          { section: "Reasoning", score: 75, strength: "Series,Analogy", weakness: "Statement-Assumption", actionPlan: "Practice logical reasoning sets" },
        ],
      },
    },
  });

  await db.reflection.create({
    data: {
      id: "ref-006", userId: USER_ID, examId: "exam-011",
      examName: "RRB NTPC CBT 2 2024", examDate: new Date("2024-06-15"),
      score: 72, cutoff: 68, gap: -4, result: "Qualified",
      difficulty: "Moderate", confidence: 70, emotionalState: "Motivated",
      mistakeTags: "Speed Issue,Hesitation",
      strengthTags: "Accurate Attempts,Strong GA,Calm Under Pressure",
      whatWentWrong: "Could have attempted 3-4 more questions in Mathematics if I had managed time better. Hesitated on a few tricky ones.",
      whatWentWell: "GA section was well-prepared. Accuracy was above 85%. Stayed calm throughout the exam.",
      biggestLesson: "Trust your preparation. Don't overthink easy questions — they're meant to be scored quickly.",
      actionPlan: "Work on speed Mathematics for the next stage. Practice computer-based test simulations to build exam stamina.",
      targetScore: 80, goalDescription: "Clear RRB NTPC final selection",
      sections: {
        create: [
          { section: "General Awareness", score: 28, strength: "Railway GK,Current Affairs", weakness: "Science basics", actionPlan: "Revise basic science for Railways" },
          { section: "Mathematics", score: 22, strength: "Arithmetic", weakness: "Advanced Math", actionPlan: "Practice advanced math topics" },
          { section: "General Intelligence", score: 22, strength: "Reasoning", weakness: "Statement analysis", actionPlan: "Practice statement-based questions" },
        ],
      },
    },
  });

  await db.reflection.create({
    data: {
      id: "ref-007", userId: USER_ID, examId: "exam-008",
      examName: "SBI PO Mains 2023", examDate: new Date("2023-12-05"),
      score: 48.5, cutoff: 55, gap: 6.5, result: "Not Qualified",
      difficulty: "Hard", confidence: 40, emotionalState: "Frustrated",
      mistakeTags: "Concept Gap,Low Confidence,Poor Time Management",
      strengthTags: "Determination,Identified Weak Areas",
      whatWentWrong: "This was my first Mains attempt and I underestimated the difficulty. GA section was extremely tough. Couldn't complete the paper.",
      whatWentWell: "Attempted Reasoning first which was the right strategy. Learned what Mains-level difficulty looks like.",
      biggestLesson: "Mains requires dedicated preparation — Prelims prep alone is not enough. Need a structured study plan for descriptive + objective.",
      actionPlan: "Create a dedicated Mains study schedule. Focus on descriptive English and advanced GA. Take at least 5 Mains-level mocks before next attempt.",
      targetScore: 60, goalDescription: "Clear SBI PO Mains cutoff in future attempt",
      sections: {
        create: [
          { section: "Quantitative Aptitude", score: 12, strength: "Data Sufficiency", weakness: "Data Analysis", actionPlan: "High-level DI practice" },
          { section: "Reasoning Ability", score: 16.5, strength: "Puzzles", weakness: "Critical Reasoning", actionPlan: "Practice critical reasoning" },
          { section: "English Language", score: 10, strength: "Reading", weakness: "Letter Writing", actionPlan: "Formal letter writing practice" },
          { section: "General Awareness", score: 10, strength: "Basic Banking", weakness: "Economic Survey,Budget", actionPlan: "Read Economic Survey summary" },
        ],
      },
    },
  });

  await db.reflection.create({
    data: {
      id: "ref-008", userId: USER_ID, examId: "exam-014",
      examName: "UPSC CSE Prelims 2024", examDate: new Date("2024-05-26"),
      score: 88, cutoff: 92, gap: 4, result: "Not Qualified",
      difficulty: "Very Hard", confidence: 55, emotionalState: "Neutral",
      mistakeTags: "Overthinking,Elimination Errors,CSAT Under-prepared",
      strengthTags: "GS Paper Strong,Broad Knowledge Base,Good Reading Habit",
      whatWentWrong: "CSAT paper was taken too lightly — scored only 40. Overthought several GS questions and changed correct answers. Negative marking ate into the score.",
      whatWentWell: "GS Paper 1 was decent at 48. Static GK and Polity questions were accurate. Current affairs preparation was on the right track.",
      biggestLesson: "UPSC requires a completely different approach than banking exams. CSAT cannot be ignored. Answer only what you're sure about.",
      actionPlan: "Decided to focus primarily on banking exams. UPSC was an exploratory attempt. Will revisit only after securing a banking job.",
      targetScore: 100, goalDescription: "Consider UPSC attempt after banking exam success",
      sections: {
        create: [
          { section: "General Studies Paper 1", score: 48, strength: "Polity,History", weakness: "Environment,Science & Tech", actionPlan: "Focus on core banking exams" },
          { section: "CSAT", score: 40, strength: "Reading Comprehension", weakness: "Quant,Logical Reasoning", actionPlan: "Not prioritizing currently" },
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
    { id: "doc-006", userId: USER_ID, name: "Banking Syllabus 2026.pdf", note: "Complete banking exam syllabus", examName: "IBPS PO Prelims 2026", category: "Syllabus", fileSize: 450000, year: "2026" },
    { id: "doc-007", userId: USER_ID, name: "Quant Notes - DI Sets.pdf", note: "Data interpretation practice notes", examName: "", category: "Notes", fileSize: 670000, year: "2024" },
    { id: "doc-008", userId: USER_ID, name: "GA Current Affairs June.pdf", note: "Monthly current affairs compilation", examName: "", category: "Notes", fileSize: 1200000, year: "2024" },
  ];

  for (const doc of docs) {
    await db.document.create({ data: doc });
  }

  // ─── Goals — 12 total ──────────────────────────────────
  const goals = [
    { id: "goal-001", userId: USER_ID, title: "Complete DI Practice Set", priority: "High", linkedExam: "IBPS PO Prelims 2026", subject: "Quantitative Aptitude", dueDate: new Date("2026-07-20"), status: "active", progress: 65, description: "Complete 50 DI sets before IBPS PO Pre" },
    { id: "goal-002", userId: USER_ID, title: "Daily GA Quiz Streak", priority: "Medium", linkedExam: "SSC CGL Tier 1 2026", subject: "General Awareness", dueDate: new Date("2026-09-10"), status: "active", progress: 40, description: "Maintain daily GA quiz for 30 consecutive days" },
    { id: "goal-003", userId: USER_ID, title: "Revise Grammar Rules", priority: "High", linkedExam: "IBPS PO Prelims 2026", subject: "English Language", dueDate: new Date("2026-07-25"), status: "active", progress: 80, description: "Complete Wren & Martin revision" },
    { id: "goal-004", userId: USER_ID, title: "Take 10 Mock Tests", priority: "Medium", linkedExam: "SSC CGL Tier 1 2026", subject: "All Sections", dueDate: new Date("2026-08-30"), status: "active", progress: 30, description: "Complete 10 full-length mock tests for CGL" },
    { id: "goal-005", userId: USER_ID, title: "Geometry Revision", priority: "Low", linkedExam: "SSC CGL Tier 1 2026", subject: "Quantitative Aptitude", dueDate: new Date("2026-08-15"), status: "active", progress: 20, description: "Complete geometry chapter from R.S. Aggarwal" },
    { id: "goal-006", userId: USER_ID, title: "Complete Reasoning Puzzles", priority: "High", linkedExam: "IBPS PO Prelims 2026", subject: "Reasoning Ability", dueDate: new Date("2026-07-10"), status: "completed", progress: 100, description: "Complete 100 puzzle sets", completedAt: new Date("2026-07-08") },
    { id: "goal-007", userId: USER_ID, title: "Vocabulary Builder - 500 Words", priority: "Medium", linkedExam: "SSC CGL Tier 1 2026", subject: "English Language", dueDate: new Date("2026-07-05"), status: "completed", progress: 100, description: "Learn 500 new words", completedAt: new Date("2026-07-04") },
    // ── 5 NEW GOALS (goal-008 to goal-012) ──
    { id: "goal-008", userId: USER_ID, title: "Current Affairs Daily Digest", priority: "High", linkedExam: "IBPS PO Prelims 2026", subject: "General Awareness", dueDate: new Date("2026-08-15"), status: "active", progress: 55, description: "Read and note daily current affairs for 60 days straight before the exam" },
    { id: "goal-009", userId: USER_ID, title: "Descriptive Writing Practice", priority: "Medium", linkedExam: "IBPS PO Mains 2026", subject: "English Language", dueDate: new Date("2026-09-01"), status: "active", progress: 10, description: "Write 20 essays and 15 letters on banking/financial topics" },
    { id: "goal-010", userId: USER_ID, title: "Daily Exercise Routine", priority: "Low", linkedExam: "", subject: "Health", dueDate: new Date("2026-12-31"), status: "active", progress: 35, description: "Exercise 30 minutes daily for better focus and exam stamina" },
    { id: "goal-011", userId: USER_ID, title: "Complete 5000+ Reasoning Questions", priority: "High", linkedExam: "SSC CGL Tier 1 2026", subject: "Reasoning Ability", dueDate: new Date("2026-09-01"), status: "paused", progress: 42, description: "Solve 5000+ reasoning questions across all sub-topics" },
    { id: "goal-012", userId: USER_ID, title: "Speed Math Mastery", priority: "Medium", linkedExam: "IBPS Clerk Prelims 2026", subject: "Quantitative Aptitude", dueDate: new Date("2026-06-30"), status: "completed", progress: 100, description: "Master Vedic Math and shortcut techniques for faster calculation", completedAt: new Date("2026-06-28") },
  ];

  for (const goal of goals) {
    await db.goal.create({ data: goal });
  }

  // ─── Calendar Events — 15 total ────────────────────────
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const calEvents = [
    { id: "cal-001", userId: USER_ID, type: "exam", label: "IBPS PO Prelims 2026", date: new Date(year, month, 18), time: "10:00 AM" },
    { id: "cal-002", userId: USER_ID, type: "goal", label: "Complete DI Practice Set", date: new Date(year, month, 20), time: "All Day" },
    { id: "cal-003", userId: USER_ID, type: "deadline", label: "SSC CGL Application Last Date", date: new Date(year, month, 25), time: "11:59 PM" },
    { id: "cal-004", userId: USER_ID, type: "reminder", label: "Mock Test - Full Length", date: new Date(year, month, 10), time: "2:00 PM" },
    { id: "cal-005", userId: USER_ID, type: "reflection", label: "Weekly Reflection", date: new Date(year, month, 7), time: "8:00 PM" },
    { id: "cal-006", userId: USER_ID, type: "exam", label: "SSC CGL Tier 1 2026", date: new Date(year, month + 1, 15), time: "10:00 AM" },
    { id: "cal-007", userId: USER_ID, type: "deadline", label: "RBI Grade B Apply", date: new Date(year, month + 1, 5), time: "11:59 PM" },
    { id: "cal-008", userId: USER_ID, type: "goal", label: "Take Mock Test #5", date: new Date(year, month, 14), time: "2:00 PM" },
    // ── 7 NEW CALENDAR EVENTS (cal-009 to cal-015) ──
    { id: "cal-009", userId: USER_ID, type: "study", label: "Quant - DI Sets Practice", date: new Date(year, month + 1, 3), time: "7:00 AM" },
    { id: "cal-010", userId: USER_ID, type: "mock_test", label: "IBPS PO Mock Test #8", date: new Date(year, month + 1, 8), time: "10:00 AM" },
    { id: "cal-011", userId: USER_ID, type: "review", label: "SSC CGL Tier 2 Mistake Analysis", date: new Date(year, month + 1, 12), time: "6:00 PM" },
    { id: "cal-012", userId: USER_ID, type: "break", label: "Study Break Day", date: new Date(year, month + 1, 20), time: "All Day" },
    { id: "cal-013", userId: USER_ID, type: "study", label: "GA Revision - Banking Awareness", date: new Date(year, month + 2, 1), time: "8:00 AM" },
    { id: "cal-014", userId: USER_ID, type: "personal", label: "Birthday Celebration", date: new Date(year, month + 2, 15), time: "All Day" },
    { id: "cal-015", userId: USER_ID, type: "deadline", label: "RBI Grade B Phase 1 Last Date", date: new Date(year, month + 2, 20), time: "11:59 PM" },
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

  // ─── Notifications — 8 total ───────────────────────────
  const notifications = [
    { id: "notif-001", userId: USER_ID, title: "New Mock Test Available", message: "A new IBPS PO Prelims mock test has been added.", type: "info", isRead: false },
    { id: "notif-002", userId: USER_ID, title: "Goal Deadline Approaching", message: "Your 'Complete DI Practice Set' goal is due in 5 days.", type: "warning", isRead: false },
    { id: "notif-003", userId: USER_ID, title: "Study Streak: 7 Days!", message: "Congratulations! You've maintained a 7-day study streak.", type: "success", isRead: true },
    { id: "notif-004", userId: USER_ID, title: "Exam Result Update", message: "IBPS Clerk Mains 2024 result has been declared.", type: "info", isRead: false },
    // ── 4 NEW NOTIFICATIONS (notif-005 to notif-008) ──
    { id: "notif-005", userId: USER_ID, title: "SSC CGL Application Reminder", message: "Don't forget to submit your SSC CGL Tier 1 2026 application before the deadline.", type: "reminder", isRead: true },
    { id: "notif-006", userId: USER_ID, title: "Goal Completed: Speed Math Mastery", message: "You've completed the 'Speed Math Mastery' goal! Great job mastering Vedic Math techniques.", type: "achievement", isRead: true },
    { id: "notif-007", userId: USER_ID, title: "Weekly Performance Insight", message: "Your Quant scores improved by 12% this week. Keep up the DI practice!", type: "insight", isRead: false },
    { id: "notif-008", userId: USER_ID, title: "System Update", message: "New features added: Calendar sync and improved analytics dashboard. Check them out!", type: "system", isRead: true },
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

  // ─── Journal Entries ────────────────────────────────────
  const journalEntries = [
    { id: "journal-001", userId: USER_ID, date: new Date("2026-06-15"), mood: "motivated", content: "Completed DI practice sets. Feeling confident about upcoming IBPS PO exam. Need to focus more on reasoning puzzles.", studyHours: 4.5, topics: "DI,Reasoning" },
    { id: "journal-002", userId: USER_ID, date: new Date("2026-06-16"), mood: "happy", content: "Great day! Scored 78% in mock test. Current affairs revision going well. GA quiz streak at 12 days.", studyHours: 6, topics: "Mock Test,GA,Current Affairs" },
    { id: "journal-003", userId: USER_ID, date: new Date("2026-06-17"), mood: "tired", content: "Long study session but felt drained towards the end. Need to take proper breaks. Maybe try Pomodoro technique.", studyHours: 7, topics: "Quantitative,English" },
    { id: "journal-004", userId: USER_ID, date: new Date("2026-06-18"), mood: "neutral", content: "Average day. Covered grammar rules and vocabulary. Error spotting needs more practice.", studyHours: 3.5, topics: "English,Grammar,Vocabulary" },
    { id: "journal-005", userId: USER_ID, date: new Date("2026-06-19"), mood: "frustrated", content: "Struggled with reasoning puzzles today. Time management in sectional tests is still an issue. Will focus on speed drills tomorrow.", studyHours: 5, topics: "Reasoning,Puzzles,Speed" },
    { id: "journal-006", userId: USER_ID, date: new Date("2026-06-20"), mood: "motivated", content: "Better day! Improved puzzle solving speed. Completed 3 full sectional tests. Feeling prepared for the upcoming exam.", studyHours: 5.5, topics: "Reasoning,Mock Test,Sectional" },
    { id: "journal-007", userId: USER_ID, date: new Date("2026-06-21"), mood: "happy", content: "Review day. Went through all weak areas identified this week. Made a study plan for next 2 weeks. Feeling organized and ready!", studyHours: 3, topics: "Review,Planning,Revision" },
  ];

  for (const entry of journalEntries) {
    await db.journalEntry.create({ data: entry });
  }

  console.log("Seed completed successfully!");
  console.log(`  - User: ${user.name}`);
  console.log(`  - Exams: ${exams.length}`);
  console.log(`  - Upcoming Exams: ${upcomingExams.length}`);
  console.log(`  - Reflections: 8`);
  console.log(`  - Documents: ${docs.length}`);
  console.log(`  - Goals: ${goals.length}`);
  console.log(`  - Calendar Events: ${calEvents.length}`);
  console.log(`  - Reminders: ${reminders.length}`);
  console.log(`  - Notifications: ${notifications.length}`);
  console.log(`  - Devices: ${devices.length}`);
  console.log(`  - Journal Entries: ${journalEntries.length}`);
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
