import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const exam = await db.exam.findFirst({
      where: { id, userId: USER_ID },
      include: { sectionalScores: true, reflection: { include: { sections: true } } },
    })
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }
    return NextResponse.json(exam)
  } catch (error) {
    console.error('GET /api/exams/[id] error:', error)
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
    const cutoffGap = body.cutoff !== undefined && body.score !== undefined ? body.score - body.cutoff : undefined

    const exam = await db.exam.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.org !== undefined && { org: body.org }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.stage !== undefined && { stage: body.stage }),
        ...(body.examDate !== undefined && { examDate: new Date(body.examDate) }),
        ...(body.attempt !== undefined && { attempt: body.attempt }),
        ...(body.score !== undefined && { score: body.score }),
        ...(body.maxScore !== undefined && { maxScore: body.maxScore }),
        ...(body.cutoff !== undefined && { cutoff: body.cutoff }),
        ...(cutoffGap !== undefined && { cutoffGap }),
        ...(body.result !== undefined && { result: body.result }),
        ...(body.rank !== undefined && { rank: body.rank }),
      },
      include: { sectionalScores: true },
    })

    return NextResponse.json(exam)
  } catch (error) {
    console.error('PUT /api/exams/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.exam.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/exams/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}