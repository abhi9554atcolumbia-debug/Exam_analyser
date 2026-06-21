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
    const event = await db.calendarEvent.update({
      where: { id },
      data: {
        ...(body.type !== undefined && { type: body.type }),
        ...(body.label !== undefined && { label: body.label }),
        ...(body.date !== undefined && { date: new Date(body.date) }),
        ...(body.time !== undefined && { time: body.time }),
      },
    })
    return NextResponse.json(event)
  } catch (error) {
    console.error('PUT /api/calendar/events/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.calendarEvent.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/calendar/events/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}