import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const exams = await db.exam.findMany({
      where: { userId: USER_ID },
      orderBy: { examDate: 'asc' },
    })

    const trend = exams.map((e) => ({
      id: e.id,
      name: e.name,
      date: e.examDate.toISOString().split('T')[0],
      score: Math.round((e.score / e.maxScore) * 1000) / 10,
      maxScore: e.maxScore,
      cutoff: e.cutoff ? Math.round((e.cutoff / e.maxScore) * 1000) / 10 : null,
      cutoffGap: e.cutoffGap,
      result: e.result,
      category: e.category,
    }))

    // Compute moving average (3-exam window)
    const movingAvg = trend.map((_, i) => {
      if (i < 2) return null
      const window = trend.slice(i - 2, i + 1)
      return Math.round((window.reduce((s, e) => s + e.score, 0) / 3) * 10) / 10
    })

    return NextResponse.json({ trend, movingAvg })
  } catch (error) {
    console.error('GET /api/analytics/score-trend error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}