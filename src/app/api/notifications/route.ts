import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const notifications = await db.notification.findMany({
      where: { userId: USER_ID },
      orderBy: { createdAt: 'desc' },
    })
    const unreadCount = notifications.filter((n) => !n.isRead).length
    return NextResponse.json({ data: notifications, unreadCount })
  } catch (error) {
    console.error('GET /api/notifications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT() {
  try {
    await db.notification.updateMany({
      where: { userId: USER_ID, isRead: false },
      data: { isRead: true },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT /api/notifications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}