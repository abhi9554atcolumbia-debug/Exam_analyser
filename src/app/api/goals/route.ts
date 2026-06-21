import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

const USER_ID = 'user-demo-001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined

    const where: Prisma.GoalWhereInput = { userId: USER_ID }
    if (status) where.status = status

    const goals = await db.goal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('GET /api/goals error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const goal = await db.goal.create({
      data: {
        userId: USER_ID,
        title: body.title,
        priority: body.priority || 'Medium',
        linkedExam: body.linkedExam,
        subject: body.subject,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        status: body.status || 'active',
        progress: body.progress || 0,
        description: body.description,
      },
    })
    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('POST /api/goals error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}