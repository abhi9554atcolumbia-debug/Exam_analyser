import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const reflection = await db.reflection.findFirst({
      where: { id, userId: USER_ID },
      include: { sections: true },
    })
    if (!reflection) {
      return NextResponse.json({ error: 'Reflection not found' }, { status: 404 })
    }
    return NextResponse.json(reflection)
  } catch (error) {
    console.error('GET /api/reflections/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const reflection = await db.reflection.update({
      where: { id },
      data: {
        ...(body.examName !== undefined && { examName: body.examName }),
        ...(body.examDate !== undefined && { examDate: body.examDate ? new Date(body.examDate) : null }),
        ...(body.score !== undefined && { score: body.score }),
        ...(body.cutoff !== undefined && { cutoff: body.cutoff }),
        ...(body.gap !== undefined && { gap: body.gap }),
        ...(body.result !== undefined && { result: body.result }),
        ...(body.difficulty !== undefined && { difficulty: body.difficulty }),
        ...(body.confidence !== undefined && { confidence: body.confidence }),
        ...(body.emotionalState !== undefined && { emotionalState: body.emotionalState }),
        ...(body.mistakeTags !== undefined && { mistakeTags: body.mistakeTags }),
        ...(body.strengthTags !== undefined && { strengthTags: body.strengthTags }),
        ...(body.whatWentWrong !== undefined && { whatWentWrong: body.whatWentWrong }),
        ...(body.whatWentWell !== undefined && { whatWentWell: body.whatWentWell }),
        ...(body.biggestLesson !== undefined && { biggestLesson: body.biggestLesson }),
        ...(body.actionPlan !== undefined && { actionPlan: body.actionPlan }),
        ...(body.targetScore !== undefined && { targetScore: body.targetScore }),
        ...(body.goalDescription !== undefined && { goalDescription: body.goalDescription }),
        ...(body.reminderType !== undefined && { reminderType: body.reminderType }),
        ...(body.reminderDate !== undefined && { reminderDate: body.reminderDate ? new Date(body.reminderDate) : null }),
      },
      include: { sections: true },
    })

    return NextResponse.json(reflection)
  } catch (error) {
    console.error('PUT /api/reflections/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.reflection.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/reflections/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}