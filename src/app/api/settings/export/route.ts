import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const [user, settings, exams, upcomingExams, reflections, documents, goals, calendarEvents, reminders, notifications, streak] =
      await Promise.all([
        db.user.findUnique({ where: { id: USER_ID } }),
        db.userSettings.findUnique({ where: { userId: USER_ID } }),
        db.exam.findMany({ where: { userId: USER_ID }, include: { sectionalScores: true } }),
        db.upcomingExam.findMany({ where: { userId: USER_ID } }),
        db.reflection.findMany({ where: { userId: USER_ID }, include: { sections: true } }),
        db.document.findMany({ where: { userId: USER_ID } }),
        db.goal.findMany({ where: { userId: USER_ID } }),
        db.calendarEvent.findMany({ where: { userId: USER_ID } }),
        db.reminder.findMany({ where: { userId: USER_ID } }),
        db.notification.findMany({ where: { userId: USER_ID } }),
        db.studyStreak.findUnique({ where: { userId: USER_ID } }),
      ])

    return NextResponse.json({
      user,
      settings,
      exams,
      upcomingExams,
      reflections,
      documents,
      goals,
      calendarEvents,
      reminders,
      notifications,
      studyStreak: streak,
      exportedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('GET /api/settings/export error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}