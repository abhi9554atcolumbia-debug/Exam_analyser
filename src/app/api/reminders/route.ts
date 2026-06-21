import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const reminders = await db.reminder.findMany({
      where: { userId: USER_ID },
      orderBy: { date: 'asc' },
    })
    return NextResponse.json(reminders)
  } catch (error) {
    console.error('GET /api/reminders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const reminder = await db.reminder.create({
      data: {
        userId: USER_ID,
        name: body.name,
        text: body.text,
        date: new Date(body.date),
      },
    })
    return NextResponse.json(reminder, { status: 201 })
  } catch (error) {
    console.error('POST /api/reminders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}