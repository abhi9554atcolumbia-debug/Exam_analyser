import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const streak = await db.studyStreak.findUnique({ where: { userId: USER_ID } })

    if (!streak) {
      return NextResponse.json({
        currentStreak: 0,
        longestStreak: 0,
        daysThisMonth: 0,
        weekDots: [0, 0, 0, 0, 0, 0, 0],
      })
    }

    return NextResponse.json({
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      daysThisMonth: streak.daysThisMonth,
      weekDots: streak.weekDots ? streak.weekDots.split(',').map(Number) : [0, 0, 0, 0, 0, 0, 0],
    })
  } catch (error) {
    console.error('GET /api/goals/streak error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}