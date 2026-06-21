import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const exams = await db.exam.findMany({
      where: { userId: USER_ID },
      include: { sectionalScores: true },
      orderBy: { examDate: 'desc' },
    })

    const subjectMap: Record<string, { scores: number[]; max: number; count: number }> = {}
    for (const exam of exams) {
      for (const s of exam.sectionalScores) {
        if (!subjectMap[s.section]) subjectMap[s.section] = { scores: [], max: s.max, count: 0 }
        subjectMap[s.section].scores.push((s.score / s.max) * 100)
        subjectMap[s.section].count++
      }
    }

    const performance = Object.entries(subjectMap).map(([subject, data]) => {
      const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length
      const best = Math.max(...data.scores)
      const worst = Math.min(...data.scores)
      const trend = data.scores.length >= 2
        ? data.scores[data.scores.length - 1] - data.scores[data.scores.length - 2]
        : 0
      return {
        subject,
        avgScore: Math.round(avg * 10) / 10,
        bestScore: Math.round(best * 10) / 10,
        worstScore: Math.round(worst * 10) / 10,
        attempts: data.count,
        trend: Math.round(trend * 10) / 10,
        consistency: Math.round(Math.sqrt(data.scores.reduce((s, v) => s + (v - avg) ** 2, 0) / data.scores.length) * 10) / 10,
      }
    }).sort((a, b) => a.avgScore - b.avgScore)

    return NextResponse.json({ performance })
  } catch (error) {
    console.error('GET /api/analytics/subject-performance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}