import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const goals = await db.goal.findMany({ where: { userId: USER_ID } })

    const active = goals.filter((g) => g.status === 'active').length
    const completed = goals.filter((g) => g.status === 'completed').length
    const overdue = goals.filter((g) => g.status === 'overdue').length

    const now = new Date()
    const nextDue = goals
      .filter((g) => g.dueDate && g.status === 'active' && g.dueDate > now)
      .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime())[0] || null

    const completionRate = goals.length > 0 ? Math.round((completed / goals.length) * 100) : 0

    return NextResponse.json({
      active,
      completed,
      overdue,
      total: goals.length,
      completionRate,
      nextDueGoal: nextDue
        ? { id: nextDue.id, title: nextDue.title, dueDate: nextDue.dueDate, progress: nextDue.progress }
        : null,
    })
  } catch (error) {
    console.error('GET /api/goals/stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}