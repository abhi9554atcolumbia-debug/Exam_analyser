import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const [exams, reflections] = await Promise.all([
      db.exam.findMany({ where: { userId: USER_ID }, include: { sectionalScores: true } }),
      db.reflection.findMany({ where: { userId: USER_ID }, include: { sections: true } }),
    ])

    const recommendations: { area: string; action: string; priority: 'high' | 'medium' | 'low' }[] = []

    // Subject-based recommendations
    const subjectMap: Record<string, number[]> = {}
    for (const exam of exams) {
      for (const s of exam.sectionalScores) {
        if (!subjectMap[s.section]) subjectMap[s.section] = []
        subjectMap[s.section].push((s.score / s.max) * 100)
      }
    }

    for (const [subject, scores] of Object.entries(subjectMap)) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      if (avg < 40) {
        recommendations.push({
          area: subject,
          action: `Urgent: Rebuild ${subject} fundamentals. Start with basic concepts before attempting practice questions.`,
          priority: 'high',
        })
      } else if (avg < 55) {
        recommendations.push({
          area: subject,
          action: `Practice more ${subject} questions daily. Focus on understanding why you get questions wrong.`,
          priority: 'medium',
        })
      } else if (avg < 65) {
        recommendations.push({
          area: subject,
          action: `${subject} needs moderate improvement. Try timed practice and analyze mistakes carefully.`,
          priority: 'low',
        })
      }
    }

    // Mistake-based recommendations
    const tagCount: Record<string, number> = {}
    for (const r of reflections) {
      if (!r.mistakeTags) continue
      r.mistakeTags.split(',').map((t) => t.trim()).filter(Boolean).forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    }

    if (tagCount['Time Management'] && tagCount['Time Management'] >= 2) {
      recommendations.push({
        area: 'Time Management',
        action: 'Practice with strict time limits. Take sectional tests to improve speed.',
        priority: 'high',
      })
    }
    if (tagCount['Concept Gap'] && tagCount['Concept Gap'] >= 2) {
      recommendations.push({
        area: 'Concept Gap',
        action: 'Revise theory for weak topics. Use video lectures and note-making to strengthen concepts.',
        priority: 'high',
      })
    }
    if (tagCount['Silly Mistakes'] && tagCount['Silly Mistakes'] >= 2) {
      recommendations.push({
        area: 'Silly Mistakes',
        action: 'Read questions twice before answering. Develop a habit of rechecking marked answers.',
        priority: 'medium',
      })
    }
    if (tagCount['Negative Marking'] && tagCount['Negative Marking'] >= 2) {
      recommendations.push({
        area: 'Negative Marking',
        action: 'Only attempt questions you are confident about. Skip doubtful questions strategically.',
        priority: 'high',
      })
    }

    // Section weakness action plans from reflections
    const sectionActions = new Map<string, string[]>()
    for (const r of reflections) {
      for (const s of r.sections) {
        if (s.weakness && s.actionPlan) {
          if (!sectionActions.has(s.section)) sectionActions.set(s.section, [])
          sectionActions.get(s.section)!.push(s.actionPlan)
        }
      }
    }
    for (const [section, actions] of sectionActions) {
      recommendations.push({
        area: section,
        action: actions[0],
        priority: 'medium',
      })
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

    return NextResponse.json({ recommendations: recommendations.slice(0, 10) })
  } catch (error) {
    console.error('GET /api/weakness/recommendations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}