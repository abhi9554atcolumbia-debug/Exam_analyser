import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const exams = await db.exam.findMany({
      where: { userId: USER_ID },
      orderBy: { examDate: 'desc' },
    })

    const gaps = exams.map((e) => ({
      id: e.id,
      name: e.name,
      category: e.category,
      date: e.examDate,
      score: e.score,
      cutoff: e.cutoff,
      cutoffGap: e.cutoffGap,
      gapPercentage: e.maxScore > 0 ? Math.round((e.cutoffGap! / e.maxScore) * 10000) / 100 : 0,
      result: e.result,
      positive: (e.cutoffGap || 0) >= 0,
    }))

    // Summary stats
    const totalGaps = gaps.filter((g) => g.cutoffGap !== null)
    const avgGap = totalGaps.length > 0
      ? Math.round(totalGaps.reduce((s, g) => s + g.cutoffGap!, 0) / totalGaps.length * 10) / 10
      : 0
    const widestGap = totalGaps.length > 0
      ? totalGaps.reduce((a, b) => (a.cutoffGap! < b.cutoffGap! ? a : b))
      : null
    const closestCall = totalGaps.length > 0
      ? totalGaps
          .filter((g) => g.cutoffGap !== null && g.cutoffGap! >= 0)
          .sort((a, b) => a.cutoffGap! - b.cutoffGap!)[0] || null
      : null

    return NextResponse.json({ gaps, summary: { avgGap, widestGap, closestCall, totalExams: exams.length } })
  } catch (error) {
    console.error('GET /api/analytics/cutoff-gaps error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}