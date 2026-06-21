import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

const USER_ID = 'user-demo-001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const sortStr = searchParams.get('sort') || 'createdAt:desc'
    const [sortField, sortOrder] = sortStr.split(':')
    const examName = searchParams.get('examName') || undefined
    const category = searchParams.get('category') || undefined
    const year = searchParams.get('year') || undefined
    const search = searchParams.get('search') || undefined

    const where: Prisma.DocumentWhereInput = { userId: USER_ID }
    if (examName) where.examName = { contains: examName }
    if (category) where.category = category
    if (year) where.year = year
    if (search) where.OR = [
      { name: { contains: search } },
      { note: { contains: search } },
      { examName: { contains: search } },
    ]

    const orderBy: any = {}
    orderBy[sortField] = sortOrder

    const [documents, total] = await Promise.all([
      db.document.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.document.count({ where }),
    ])

    return NextResponse.json({
      data: documents,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET /api/documents error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const document = await db.document.create({
      data: {
        userId: USER_ID,
        name: body.name,
        note: body.note,
        examName: body.examName,
        category: body.category,
        fileUrl: body.fileUrl || null,
        fileSize: body.fileSize || null,
        year: body.year,
      },
    })
    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('POST /api/documents error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}