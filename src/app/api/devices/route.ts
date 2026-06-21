import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const devices = await db.device.findMany({
      where: { userId: USER_ID },
      orderBy: { lastActive: 'desc' },
    })
    return NextResponse.json(devices)
  } catch (error) {
    console.error('GET /api/devices error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}