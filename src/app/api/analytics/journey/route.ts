import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const exams = await db.exam.findMany({
      where: { userId: USER_ID },
      orderBy: { examDate: 'asc' },
    })

    const timeline = exams.map((e) => ({
      id: e.id,
      name: e.name,
      category: e.category,
      stage: e.stage,
      date: e.examDate,
      score: Math.round((e.score / e.maxScore) * 1000) / 10,
      result: e.result,
      rank: e.rank,
      attempt: e.attempt,
    }))

    // Group by year
    const byYear: Record<string, typeof timeline> = {}
    for (const t of timeline) {
      const year = new Date(t.date).getFullYear().toString()
      if (!byYear[year]) byYear[year] = []
      byYear[year].push(t)
    }

    return NextResponse.json({ timeline, byYear })
  } catch (error) {
    console.error('GET /api/analytics/journey error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}