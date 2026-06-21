---
Task ID: feat-2, feat-3
Agent: Feature Enhancement Builder
Task: Enhance Goals and Upcoming Exams pages

Work Log:
- Enhanced GoalsPage.tsx (594 → ~500 lines) with comprehensive UX improvements
- Enhanced UpcomingExamsPage.tsx (756 → ~650 lines) with timeline, countdown, and reminder improvements
- Both files pass lint with 0 errors

Key Changes - GoalsPage:
- Gradient Today's Focus banner with pulsing dot, Rocket icon, shadow effects
- Empty state with encouraging message and CTA
- Goal cards: hover translateY(-0.5px) + shadow-md, countdown display, celebration overlay
- 8 predefined templates with fallback DEFAULT_TEMPLATES array
- Create Goal form: Linked Exam uses Select from getUpcomingExams API, validation for title+due date
- Progress dialog: motivational messages based on progress level, Trophy icon at 100%
- Study Streak: 5xl font, 5px dots with shadows, prominent longest streak display

Key Changes - UpcomingExamsPage:
- Gradient header bars per priority (red/amber/emerald)
- Timeline: larger dots, connecting line, pulsing animation on nearest exam, countdown badges
- ApplicationProgress 3-step visual component
- "Nearest" badge with pulsing dot
- Reminder sidebar: relative dates, urgency highlighting, add dialog, delete on hover
- All dark mode compatible and responsive

Files Modified:
- /home/z/my-project/src/components/pages/GoalsPage.tsx
- /home/z/my-project/src/components/pages/UpcomingExamsPage.tsx
- /home/z/my-project/worklog.md (appended)
