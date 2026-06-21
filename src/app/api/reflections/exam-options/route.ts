import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const reflectedExamIds = await db.reflection.findMany({
      where: { userId: USER_ID, examId: { not: null } },
      select: { examId: true },
    })
    const reflectedIds = new Set(reflectedExamIds.map((r) => r.examId!))

    const exams = await db.exam.findMany({
      where: { userId: USER_ID, id: { notIn: Array.from(reflectedIds) } },
      select: { id: true, name: true, examDate: true, category: true, score: true, maxScore: true, result: true },
      orderBy: { examDate: 'desc' },
    })

    return NextResponse.json(exams)
  } catch (error) {
    console.error('GET /api/reflections/exam-options error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}