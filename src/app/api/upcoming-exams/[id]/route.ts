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

    const exam = await db.upcomingExam.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.org !== undefined && { org: body.org }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.examDate !== undefined && {
          examDate: new Date(body.examDate),
          daysLeft: Math.max(0, Math.ceil((new Date(body.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
        }),
        ...(body.admitCard !== undefined && { admitCard: body.admitCard }),
        ...(body.applicationStatus !== undefined && { applicationStatus: body.applicationStatus }),
        ...(body.hasReflection !== undefined && { hasReflection: body.hasReflection }),
        ...(body.hasSyllabus !== undefined && { hasSyllabus: body.hasSyllabus }),
        ...(body.reminderSet !== undefined && { reminderSet: body.reminderSet }),
      },
    })

    return NextResponse.json(exam)
  } catch (error) {
    console.error('PUT /api/upcoming-exams/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.upcomingExam.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/upcoming-exams/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}