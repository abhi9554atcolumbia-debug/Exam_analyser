import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

const USER_ID = 'user-demo-001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const priority = searchParams.get('priority') || undefined
    const status = searchParams.get('status') || undefined

    const where: Prisma.UpcomingExamWhereInput = { userId: USER_ID, examDate: { gte: new Date() } }
    if (priority) where.priority = priority
    if (status) where.applicationStatus = status

    const exams = await db.upcomingExam.findMany({
      where,
      orderBy: { examDate: 'asc' },
    })

    return NextResponse.json(exams)
  } catch (error) {
    console.error('GET /api/upcoming-exams error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const examDate = new Date(body.examDate)
    const daysLeft = Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

    const exam = await db.upcomingExam.create({
      data: {
        userId: USER_ID,
        name: body.name,
        org: body.org,
        priority: body.priority || 'Medium',
        examDate,
        daysLeft: Math.max(0, daysLeft),
      },
    })

    return NextResponse.json(exam, { status: 201 })
  } catch (error) {
    console.error('POST /api/upcoming-exams error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}