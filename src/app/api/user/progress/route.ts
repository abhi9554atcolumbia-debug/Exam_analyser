import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const exams = await db.exam.findMany({ where: { userId: USER_ID } })

    const examsTracked = exams.length
    const examsAttempted = exams.length
    const examsQualified = exams.filter((e) => e.result === 'Qualified').length

    let averageScore = 0
    let bestScore = 0
    let bestScoreExam = null

    if (exams.length > 0) {
      const pctScores = exams.map((e) => ({ pct: (e.score / e.maxScore) * 100, name: e.name }))
      averageScore = pctScores.reduce((s, e) => s + e.pct, 0) / pctScores.length
      const best = pctScores.reduce((a, b) => (a.pct > b.pct ? a : b))
      bestScore = best.pct
      bestScoreExam = best.name
    }

    return NextResponse.json({
      examsTracked,
      examsAttempted,
      examsQualified,
      averageScore: Math.round(averageScore * 10) / 10,
      bestScore: Math.round(bestScore * 10) / 10,
      bestScoreExam,
    })
  } catch (error) {
    console.error('GET /api/user/progress error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}