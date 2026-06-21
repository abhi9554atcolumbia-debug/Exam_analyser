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
    const reminder = await db.reminder.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.text !== undefined && { text: body.text }),
        ...(body.date !== undefined && { date: new Date(body.date) }),
        ...(body.isRead !== undefined && { isRead: body.isRead }),
      },
    })
    return NextResponse.json(reminder)
  } catch (error) {
    console.error('PUT /api/reminders/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.reminder.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/reminders/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}