import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const user = await db.user.findUnique({
      where: { id: USER_ID },
      include: { settings: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const exams = await db.exam.findMany({ where: { userId: USER_ID } })
    const qualified = exams.filter((e) => e.result === 'Qualified').length
    const avgScore =
      exams.length > 0
        ? exams.reduce((s, e) => s + (e.score / e.maxScore) * 100, 0) / exams.length
        : 0

    return NextResponse.json({
      ...user,
      password: undefined,
      settings: user.settings,
      progressSummary: {
        examsTracked: exams.length,
        examsQualified: qualified,
        averageScore: Math.round(avgScore * 10) / 10,
      },
    })
  } catch (error) {
    console.error('GET /api/user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const user = await db.user.update({
      where: { id: USER_ID },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.primaryExam !== undefined && { primaryExam: body.primaryExam }),
        ...(body.secondaryExam !== undefined && { secondaryExam: body.secondaryExam }),
        ...(body.targetYear !== undefined && { targetYear: body.targetYear }),
        ...(body.currentStage !== undefined && { currentStage: body.currentStage }),
        ...(body.language !== undefined && { language: body.language }),
        ...(body.studyTime !== undefined && { studyTime: body.studyTime }),
        ...(body.preferredTime !== undefined && { preferredTime: body.preferredTime }),
        ...(body.hoursPerDay !== undefined && { hoursPerDay: body.hoursPerDay }),
        ...(body.learningMode !== undefined && { learningMode: body.learningMode }),
        ...(body.weekendStudy !== undefined && { weekendStudy: body.weekendStudy }),
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('PUT /api/user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}