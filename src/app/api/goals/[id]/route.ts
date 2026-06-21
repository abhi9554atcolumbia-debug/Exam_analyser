import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const goal = await db.goal.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.linkedExam !== undefined && { linkedExam: body.linkedExam }),
        ...(body.subject !== undefined && { subject: body.subject }),
        ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.progress !== undefined && { progress: body.progress }),
        ...(body.description !== undefined && { description: body.description }),
      },
    })
    return NextResponse.json(goal)
  } catch (error) {
    console.error('PUT /api/goals/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.goal.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/goals/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const goal = await db.goal.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        progress: 100,
      },
    })
    return NextResponse.json(goal)
  } catch (error) {
    console.error('PATCH /api/goals/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}