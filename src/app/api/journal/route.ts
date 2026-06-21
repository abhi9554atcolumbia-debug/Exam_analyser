import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

const USER_ID = 'user-demo-001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') ? Number(searchParams.get('month')) : undefined
    const year = searchParams.get('year') ? Number(searchParams.get('year')) : undefined
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 30

    const where: Prisma.JournalEntryWhereInput = { userId: USER_ID }

    if (month !== undefined && year !== undefined) {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0, 23, 59, 59, 999)
      where.date = { gte: startDate, lte: endDate }
    } else if (year !== undefined) {
      const startDate = new Date(year, 0, 1)
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999)
      where.date = { gte: startDate, lte: endDate }
    }

    const entries = await db.journalEntry.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit,
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('GET /api/journal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const entryDate = new Date(body.date)

    // Find existing entry for this user+date
    const existing = await db.journalEntry.findFirst({
      where: { userId: USER_ID, date: entryDate },
    })

    let entry
    if (existing) {
      entry = await db.journalEntry.update({
        where: { id: existing.id },
        data: {
          mood: body.mood || existing.mood,
          content: body.content ?? existing.content,
          studyHours: body.studyHours !== undefined ? body.studyHours : existing.studyHours,
          topics: body.topics !== undefined ? body.topics : existing.topics,
        },
      })
    } else {
      entry = await db.journalEntry.create({
        data: {
          userId: USER_ID,
          date: entryDate,
          mood: body.mood || 'neutral',
          content: body.content,
          studyHours: body.studyHours ?? null,
          topics: body.topics ?? null,
        },
      })
    }

    return NextResponse.json(entry, { status: existing ? 200 : 201 })
  } catch (error) {
    console.error('POST /api/journal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}