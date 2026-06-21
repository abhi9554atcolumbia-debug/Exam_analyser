import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const [exams, reflections] = await Promise.all([
      db.exam.findMany({ where: { userId: USER_ID }, include: { sectionalScores: true } }),
      db.reflection.findMany({ where: { userId: USER_ID } }),
    ])

    // Top weak subjects from sectional scores
    const subjectMap: Record<string, number[]> = {}
    for (const exam of exams) {
      for (const s of exam.sectionalScores) {
        if (!subjectMap[s.section]) subjectMap[s.section] = []
        subjectMap[s.section].push((s.score / s.max) * 100)
      }
    }
    const weakSubjects = Object.entries(subjectMap)
      .map(([subject, scores]) => ({
        type: 'subject',
        name: subject,
        severity: Math.round((100 - scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
        frequency: scores.length,
        avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10,
      }))
      .filter((s) => s.avgScore < 65)
      .sort((a, b) => b.severity - a.severity)
      .slice(0, 5)

    // Top mistake tags
    const tagCount: Record<string, number> = {}
    for (const r of reflections) {
      if (!r.mistakeTags) continue
      r.mistakeTags.split(',').map((t) => t.trim()).filter(Boolean).forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    }
    const topMistakes = Object.entries(tagCount)
      .map(([name, frequency]) => ({ type: 'mistake', name, severity: frequency, frequency, avgScore: null }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5)

    // Combine and sort
    const topWeaknesses = [...weakSubjects, ...topMistakes]
      .sort((a, b) => b.severity - a.severity)
      .slice(0, 10)

    return NextResponse.json({ topWeaknesses })
  } catch (error) {
    console.error('GET /api/weakness/top error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}