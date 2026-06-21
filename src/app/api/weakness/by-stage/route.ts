import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const exams = await db.exam.findMany({
      where: { userId: USER_ID },
      include: { sectionalScores: true },
    })

    const stageMap: Record<string, { scores: number[]; weakSections: Record<string, number> }> = {}
    for (const exam of exams) {
      if (!stageMap[exam.stage]) stageMap[exam.stage] = { scores: [], weakSections: {} }
      stageMap[exam.stage].scores.push((exam.score / exam.maxScore) * 100)
      for (const s of exam.sectionalScores) {
        const pct = (s.score / s.max) * 100
        if (pct < 60) {
          stageMap[exam.stage].weakSections[s.section] = (stageMap[exam.stage].weakSections[s.section] || 0) + 1
        }
      }
    }

    const byStage = Object.entries(stageMap).map(([stage, data]) => {
      const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length
      const topWeaknesses = Object.entries(data.weakSections)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([section, count]) => ({ section, count }))
      return {
        stage,
        avgScore: Math.round(avgScore * 10) / 10,
        attempts: data.scores.length,
        weaknesses: topWeaknesses,
      }
    })

    return NextResponse.json({ byStage })
  } catch (error) {
    console.error('GET /api/weakness/by-stage error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}