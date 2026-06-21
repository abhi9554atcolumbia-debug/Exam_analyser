import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

    const [events, upcomingExams, reminders, goals] = await Promise.all([
      db.calendarEvent.findMany({
        where: { userId: USER_ID, date: { gte: startOfDay, lte: endOfDay } },
        orderBy: [{ date: 'asc' }, { time: 'asc' }],
      }),
      db.upcomingExam.findMany({
        where: { userId: USER_ID, examDate: { gte: startOfDay, lte: endOfDay } },
      }),
      db.reminder.findMany({
        where: { userId: USER_ID, date: { gte: startOfDay, lte: endOfDay } },
        orderBy: { date: 'asc' },
      }),
      db.goal.findMany({
        where: { userId: USER_ID, status: 'active', dueDate: { lte: endOfDay } },
      }),
    ])

    return NextResponse.json({
      date: startOfDay,
      events,
      upcomingExams,
      reminders,
      dueGoals: goals,
    })
  } catch (error) {
    console.error('GET /api/calendar/schedule error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}