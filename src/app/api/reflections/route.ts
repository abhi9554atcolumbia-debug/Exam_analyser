import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

const USER_ID = 'user-demo-001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const examId = searchParams.get('examId') || undefined

    const where: Prisma.ReflectionWhereInput = { userId: USER_ID }
    if (examId) where.examId = examId

    const reflections = await db.reflection.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { sections: true },
    })

    return NextResponse.json(reflections)
  } catch (error) {
    console.error('GET /api/reflections error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const reflection = await db.reflection.create({
      data: {
        userId: USER_ID,
        examId: body.examId || null,
        examName: body.examName,
        examDate: body.examDate ? new Date(body.examDate) : null,
        score: body.score,
        cutoff: body.cutoff,
        gap: body.gap,
        result: body.result,
        difficulty: body.difficulty,
        confidence: body.confidence,
        emotionalState: body.emotionalState,
        mistakeTags: body.mistakeTags,
        strengthTags: body.strengthTags,
        whatWentWrong: body.whatWentWrong,
        whatWentWell: body.whatWentWell,
        biggestLesson: body.biggestLesson,
        actionPlan: body.actionPlan,
        targetScore: body.targetScore,
        goalDescription: body.goalDescription,
        reminderType: body.reminderType,
        reminderDate: body.reminderDate ? new Date(body.reminderDate) : null,
        sections: body.sections
          ? {
              create: body.sections.map(
                (s: { section: string; score?: number; strength?: string; weakness?: string; actionPlan?: string }) => ({
                  section: s.section,
                  score: s.score,
                  strength: s.strength,
                  weakness: s.weakness,
                  actionPlan: s.actionPlan,
                })
              ),
            }
          : undefined,
      },
      include: { sections: true },
    })

    // If linked to an exam, mark the exam's hasReflection
    if (body.examId) {
      await db.upcomingExam.updateMany({ where: { userId: USER_ID, name: body.examName }, data: { hasReflection: true } })
    }

    return NextResponse.json(reflection, { status: 201 })
  } catch (error) {
    console.error('POST /api/reflections error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}