import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const [exams, reflections] = await Promise.all([
      db.exam.findMany({
        where: { userId: USER_ID },
        include: { sectionalScores: true, reflection: true },
      }),
      db.reflection.findMany({ where: { userId: USER_ID }, include: { sections: true } }),
    ])

    const byExam = exams.map((exam) => {
      // Find weaknesses from sectional scores
      const weakSections = exam.sectionalScores
        .filter((s) => (s.score / s.max) * 100 < 60)
        .map((s) => ({
          section: s.section,
          score: Math.round((s.score / s.max) * 1000) / 10,
        }))

      // Find reflection for this exam
      const reflection = reflections.find((r) => r.examId === exam.id)
      const mistakeTags = reflection?.mistakeTags
        ? reflection.mistakeTags.split(',').map((t) => t.trim()).filter(Boolean)
        : []

      // Weaknesses from reflection sections
      const sectionWeaknesses = reflection?.sections
        .filter((s) => s.weakness)
        .map((s) => ({ section: s.section, weakness: s.weakness })) || []

      return {
        id: exam.id,
        name: exam.name,
        category: exam.category,
        stage: exam.stage,
        date: exam.examDate,
        score: Math.round((exam.score / exam.maxScore) * 1000) / 10,
        result: exam.result,
        weakSections,
        mistakeTags,
        sectionWeaknesses,
        hasReflection: !!reflection,
      }
    })

    return NextResponse.json({ byExam })
  } catch (error) {
    console.error('GET /api/weakness/by-exam error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}