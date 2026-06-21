import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const [exams, reflections] = await Promise.all([
      db.exam.findMany({ where: { userId: USER_ID }, include: { sectionalScores: true } }),
      db.reflection.findMany({ where: { userId: USER_ID } }),
    ])

    // Count weaknesses from mistake tags
    const tagCount: Record<string, number> = {}
    for (const r of reflections) {
      if (!r.mistakeTags) continue
      r.mistakeTags.split(',').map((t) => t.trim()).filter(Boolean).forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    }

    // Count from low sectional scores
    const weakSections: string[] = []
    const sectionMap: Record<string, number[]> = {}
    for (const exam of exams) {
      for (const s of exam.sectionalScores) {
        if (!sectionMap[s.section]) sectionMap[s.section] = []
        sectionMap[s.section].push((s.score / s.max) * 100)
      }
    }
    for (const [section, scores] of Object.entries(sectionMap)) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      if (avg < 60) weakSections.push(section)
    }

    const totalWeaknesses = Object.keys(tagCount).length + weakSections.length
    const examsWithWeakness = new Set([
      ...reflections.filter((r) => r.mistakeTags).map((r) => r.examId),
    ]).size

    return NextResponse.json({
      totalWeaknessTypes: totalWeaknesses,
      totalMistakeTags: Object.values(tagCount).reduce((a, b) => a + b, 0),
      weakSubjects: weakSections.length,
      examsWithReflections: reflections.length,
      examsWithWeakness,
    })
  } catch (error) {
    console.error('GET /api/weakness/summary error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}