import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const exams = await db.exam.findMany({ where: { userId: USER_ID } })

    const categoryMap: Record<string, { scores: number[]; qualified: number; total: number }> = {}
    for (const e of exams) {
      const cat = e.category
      if (!categoryMap[cat]) categoryMap[cat] = { scores: [], qualified: 0, total: 0 }
      categoryMap[cat].scores.push((e.score / e.maxScore) * 100)
      categoryMap[cat].total++
      if (e.result === 'Qualified') categoryMap[cat].qualified++
    }

    const performance = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length * 10) / 10,
      bestScore: Math.round(Math.max(...data.scores) * 10) / 10,
      worstScore: Math.round(Math.min(...data.scores) * 10) / 10,
      totalExams: data.total,
      qualified: data.qualified,
      qualificationRate: Math.round((data.qualified / data.total) * 100),
      lastAttempt: data.scores.length > 0 ? data.scores[data.scores.length - 1] : 0,
    })).sort((a, b) => b.qualificationRate - a.qualificationRate)

    return NextResponse.json({ performance })
  } catch (error) {
    console.error('GET /api/analytics/category-performance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}