import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = parseInt(searchParams.get('month') || new Date().getMonth().toString())
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())

    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0, 23, 59, 59)

    const events = await db.calendarEvent.findMany({
      where: {
        userId: USER_ID,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('GET /api/calendar/events error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const event = await db.calendarEvent.create({
      data: {
        userId: USER_ID,
        type: body.type,
        label: body.label,
        date: new Date(body.date),
        time: body.time,
      },
    })
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('POST /api/calendar/events error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}