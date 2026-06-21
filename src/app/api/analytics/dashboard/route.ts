import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const [exams, upcomingExams, reflections, goals] = await Promise.all([
      db.exam.findMany({
        where: { userId: USER_ID },
        include: { sectionalScores: true },
        orderBy: { examDate: 'desc' },
      }),
      db.upcomingExam.findMany({
        where: { userId: USER_ID, examDate: { gte: new Date() } },
        orderBy: { examDate: 'asc' },
      }),
      db.reflection.findMany({ where: { userId: USER_ID } }),
      db.goal.findMany({ where: { userId: USER_ID } }),
    ])

    // Basic stats
    const totalExams = exams.length
    const qualified = exams.filter((e) => e.result === 'Qualified').length
    const avgScore =
      totalExams > 0
        ? Math.round((exams.reduce((s, e) => s + (e.score / e.maxScore) * 100, 0) / totalExams) * 10) / 10
        : 0
    const avgCutoffGap =
      totalExams > 0
        ? Math.round((exams.reduce((s, e) => s + (e.cutoffGap || 0), 0) / totalExams) * 10) / 10
        : 0

    // Next exam
    const nextExam = upcomingExams[0] || null

    // Score trend (last 10)
    const scoreTrend = exams.slice(0, 10).reverse().map((e) => ({
      name: e.name,
      date: e.examDate,
      score: Math.round((e.score / e.maxScore) * 1000) / 10,
      cutoff: e.cutoff ? Math.round((e.cutoff / e.maxScore) * 1000) / 10 : null,
    }))

    // Weak areas from sectional scores
    const sectionMap: Record<string, { total: number; count: number; max: number }> = {}
    for (const exam of exams) {
      for (const s of exam.sectionalScores) {
        if (!sectionMap[s.section]) sectionMap[s.section] = { total: 0, count: 0, max: 0 }
        sectionMap[s.section].total += (s.score / s.max) * 100
        sectionMap[s.section].count++
        sectionMap[s.section].max = s.max
      }
    }
    const weakAreas = Object.entries(sectionMap)
      .map(([section, data]) => ({
        section,
        avgScore: Math.round((data.total / data.count) * 10) / 10,
        exams: data.count,
      }))
      .sort((a, b) => a.avgScore - b.avgScore)
      .slice(0, 5)

    // Upcoming deadlines
    const upcomingDeadlines = upcomingExams
      .filter((e) => e.applicationStatus !== 'completed')
      .slice(0, 5)
      .map((e) => ({
        id: e.id,
        name: e.name,
        examDate: e.examDate,
        daysLeft: e.daysLeft,
        priority: e.priority,
      }))

    // Recent exams
    const recentExams = exams.slice(0, 5).map((e) => ({
      id: e.id,
      name: e.name,
      date: e.examDate,
      score: Math.round((e.score / e.maxScore) * 1000) / 10,
      result: e.result,
      category: e.category,
    }))

    // Smart insights
    const insights: string[] = []
    if (totalExams >= 2) {
      const recent = exams.slice(0, 3)
      const recentAvg = recent.reduce((s, e) => s + (e.score / e.maxScore) * 100, 0) / recent.length
      const older = exams.slice(3, 6)
      if (older.length > 0) {
        const olderAvg = older.reduce((s, e) => s + (e.score / e.maxScore) * 100, 0) / older.length
        if (recentAvg > olderAvg + 5) insights.push('Your recent performance shows improvement! Keep up the momentum.')
        else if (recentAvg < olderAvg - 5) insights.push('Your recent scores have dipped. Consider reviewing your study plan.')
      }
    }
    if (weakAreas.length > 0 && weakAreas[0].avgScore < 50) {
      insights.push(`${weakAreas[0].section} is your weakest area (avg ${weakAreas[0].avgScore}%). Focus here for quick gains.`)
    }
    if (qualified > 0 && totalExams > 0) {
      const qualRate = Math.round((qualified / totalExams) * 100)
      insights.push(`Your qualification rate is ${qualRate}%. ${qualRate >= 50 ? 'Great consistency!' : 'There is room for improvement.'}`)
    }
    if (upcomingExams.length > 0 && upcomingExams[0].daysLeft !== null && upcomingExams[0].daysLeft! <= 7) {
      insights.push(`⚠️ ${upcomingExams[0].name} is in ${upcomingExams[0].daysLeft} days. Final revision mode!`)
    }
    if (reflections.length === 0 && totalExams > 0) {
      insights.push('Write reflections after each exam to identify patterns and improve faster.')
    }
    const activeGoals = goals.filter((g) => g.status === 'active')
    if (activeGoals.length === 0) {
      insights.push('Set study goals to stay on track and measure your progress.')
    }

    return NextResponse.json({
      stats: { totalExams, qualified, avgScore, avgCutoffGap },
      nextExam,
      scoreTrend,
      weakAreas,
      upcomingDeadlines,
      recentExams,
      smartInsights: insights,
    })
  } catch (error) {
    console.error('GET /api/analytics/dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}