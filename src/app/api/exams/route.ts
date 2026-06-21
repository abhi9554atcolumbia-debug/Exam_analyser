import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

const USER_ID = 'user-demo-001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const sortField = searchParams.get('sort')?.split(':')[0] || 'examDate'
    const sortOrder = searchParams.get('sort')?.split(':')[1] || 'desc'
    const category = searchParams.get('category') || undefined
    const year = searchParams.get('year') || undefined
    const status = searchParams.get('status') || undefined

    const where: Prisma.ExamWhereInput = { userId: USER_ID }
    if (category) where.category = category
    if (year) where.examDate = { gte: new Date(`${year}-01-01`), lt: new Date(`${parseInt(year) + 1}-01-01`) }
    if (status) where.result = status

    const orderBy: any = {}
    orderBy[sortField] = sortOrder

    const [exams, total] = await Promise.all([
      db.exam.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { sectionalScores: true },
      }),
      db.exam.count({ where }),
    ])

    return NextResponse.json({
      data: exams,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET /api/exams error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const cutoffGap = body.cutoff && body.score ? body.score - body.cutoff : null

    const exam = await db.exam.create({
      data: {
        userId: USER_ID,
        name: body.name,
        org: body.org,
        category: body.category,
        stage: body.stage,
        examDate: new Date(body.examDate),
        attempt: body.attempt || 1,
        score: body.score,
        maxScore: body.maxScore,
        cutoff: body.cutoff,
        cutoffGap,
        result: body.result,
        rank: body.rank,
        sectionalScores: body.sectionalScores
          ? {
              create: body.sectionalScores.map((s: { section: string; score: number; max: number }) => ({
                section: s.section,
                score: s.score,
                max: s.max,
              })),
            }
          : undefined,
      },
      include: { sectionalScores: true },
    })

    return NextResponse.json(exam, { status: 201 })
  } catch (error) {
    console.error('POST /api/exams error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}