import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const user = await db.user.findUnique({ where: { id: USER_ID } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      plan: user.plan,
      planExpiry: user.planExpiry,
      isActive: user.plan === 'free' || (user.planExpiry && user.planExpiry > new Date()),
    })
  } catch (error) {
    console.error('GET /api/subscription error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}