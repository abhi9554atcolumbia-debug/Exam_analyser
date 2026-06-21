import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const [exams, reflections, upcomingExams, goals, streak] = await Promise.all([
      db.exam.findMany({ where: { userId: USER_ID }, include: { sectionalScores: true } }),
      db.reflection.findMany({ where: { userId: USER_ID } }),
      db.upcomingExam.findMany({ where: { userId: USER_ID, examDate: { gte: new Date() } }, orderBy: { examDate: 'asc' } }),
      db.goal.findMany({ where: { userId: USER_ID } }),
      db.studyStreak.findUnique({ where: { userId: USER_ID } }),
    ])

    const insights: { type: string; title: string; description: string; priority: 'high' | 'medium' | 'low' }[] = []

    // Score trajectory insight
    if (exams.length >= 3) {
      const last3 = exams.slice(0, 3)
      const scores = last3.map((e) => (e.score / e.maxScore) * 100)
      if (scores[0] > scores[1] && scores[1] > scores[2]) {
        insights.push({ type: 'warning', title: 'Declining Scores', description: 'Your last 3 exams show a declining trend. Review your preparation strategy.', priority: 'high' })
      } else if (scores[0] < scores[1] && scores[1] < scores[2]) {
        insights.push({ type: 'success', title: 'Improving Trend', description: 'Your scores have been consistently improving! Keep this momentum going.', priority: 'low' })
      }
    }

    // Qualification insight
    const qualRate = exams.length > 0 ? exams.filter((e) => e.result === 'Qualified').length / exams.length : 0
    if (qualRate < 0.3 && exams.length >= 3) {
      insights.push({ type: 'warning', title: 'Low Qualification Rate', description: `You've qualified in only ${Math.round(qualRate * 100)}% of attempts. Consider focusing on fewer exams with deeper preparation.`, priority: 'high' })
    }

    // Weak subject insight
    const subjectMap: Record<string, number[]> = {}
    for (const exam of exams) {
      for (const s of exam.sectionalScores) {
        if (!subjectMap[s.section]) subjectMap[s.section] = []
        subjectMap[s.section].push((s.score / s.max) * 100)
      }
    }
    const weakSubjects = Object.entries(subjectMap)
      .filter(([, scores]) => scores.reduce((a, b) => a + b, 0) / scores.length < 50)
      .map(([subject]) => subject)
    if (weakSubjects.length > 0) {
      insights.push({ type: 'action', title: 'Focus Areas', description: `Consider strengthening: ${weakSubjects.join(', ')}. These subjects consistently score below 50%.`, priority: 'medium' })
    }

    // Upcoming exam urgency
    if (upcomingExams.length > 0 && upcomingExams[0].daysLeft !== null && upcomingExams[0].daysLeft! <= 14) {
      insights.push({ type: 'urgent', title: 'Exam Approaching', description: `${upcomingExams[0].name} is in ${upcomingExams[0].daysLeft} days. Shift to revision mode.`, priority: 'high' })
    }

    // Reflection gap
    const recentExams = exams.filter((e) => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return e.examDate > thirtyDaysAgo
    })
    const recentReflections = reflections.filter((r) => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return r.createdAt > thirtyDaysAgo
    })
    if (recentExams.length > recentReflections.length) {
      insights.push({ type: 'tip', title: 'Missing Reflections', description: `You have ${recentExams.length - recentReflections.length} recent exam(s) without reflections. Writing reflections helps identify patterns.`, priority: 'low' })
    }

    // Streak insight
    if (streak && streak.currentStreak >= 7) {
      insights.push({ type: 'success', title: 'Great Streak!', description: `You've maintained a ${streak.currentStreak}-day study streak. Consistency is key!`, priority: 'low' })
    }

    // Goal insight
    const overdueGoals = goals.filter((g) => g.status === 'overdue')
    if (overdueGoals.length > 0) {
      insights.push({ type: 'warning', title: 'Overdue Goals', description: `You have ${overdueGoals.length} overdue goal(s). Consider revising deadlines or breaking them into smaller tasks.`, priority: 'medium' })
    }

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('GET /api/analytics/insights error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}