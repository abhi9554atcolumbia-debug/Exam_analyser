import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> },
) {
  try {
    const { date: dateStr } = await params
    const entryDate = new Date(dateStr)

    const entry = await db.journalEntry.findFirst({
      where: { userId: USER_ID, date: entryDate },
    })

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error('GET /api/journal/[date] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> },
) {
  try {
    const { date: dateStr } = await params
    const entryDate = new Date(dateStr)
    const body = await request.json()

    const existing = await db.journalEntry.findFirst({
      where: { userId: USER_ID, date: entryDate },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    const entry = await db.journalEntry.update({
      where: { id: existing.id },
      data: {
        ...(body.mood && { mood: body.mood }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.studyHours !== undefined && { studyHours: body.studyHours }),
        ...(body.topics !== undefined && { topics: body.topics }),
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('PUT /api/journal/[date] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> },
) {
  try {
    const { date: dateStr } = await params
    const entryDate = new Date(dateStr)

    const existing = await db.journalEntry.findFirst({
      where: { userId: USER_ID, date: entryDate },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    await db.journalEntry.delete({
      where: { id: existing.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/journal/[date] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}