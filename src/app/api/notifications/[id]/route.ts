import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const notification = await db.notification.update({
      where: { id },
      data: { isRead: true },
    })
    return NextResponse.json(notification)
  } catch (error) {
    console.error('PUT /api/notifications/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}