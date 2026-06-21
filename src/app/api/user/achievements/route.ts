import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const [exams, reflections, goals, streak] = await Promise.all([
      db.exam.findMany({ where: { userId: USER_ID } }),
      db.reflection.findMany({ where: { userId: USER_ID } }),
      db.goal.findMany({ where: { userId: USER_ID } }),
      db.studyStreak.findUnique({ where: { userId: USER_ID } }),
    ])

    const qualified = exams.filter((e) => e.result === 'Qualified').length
    const attempted = exams.length
    const avgScore =
      attempted > 0
        ? exams.reduce((s, e) => s + (e.score / e.maxScore) * 100, 0) / attempted
        : 0

    const achievements = []

    if (attempted >= 1) achievements.push({ key: 'first_exam', label: 'First Exam', description: 'Tracked your first exam', icon: '🎯', unlocked: true })
    if (attempted >= 5) achievements.push({ key: 'five_exams', label: 'Five Exams', description: 'Tracked 5+ exams', icon: '📋', unlocked: true })
    if (attempted >= 10) achievements.push({ key: 'ten_exams', label: 'Exam Veteran', description: 'Tracked 10+ exams', icon: '🏆', unlocked: true })
    if (qualified >= 1) achievements.push({ key: 'first_qualify', label: 'First Qualification', description: 'Qualified in your first exam', icon: '✅', unlocked: true })
    if (qualified >= 3) achievements.push({ key: 'triple_qualify', label: 'Triple Qualified', description: 'Qualified in 3+ exams', icon: '🌟', unlocked: true })
    if (reflections.length >= 1) achievements.push({ key: 'first_reflection', label: 'Self Reflector', description: 'Wrote your first reflection', icon: '🪞', unlocked: true })
    if (reflections.length >= 5) achievements.push({ key: 'five_reflections', label: 'Deep Thinker', description: 'Wrote 5+ reflections', icon: '🧠', unlocked: true })
    if (streak?.currentStreak && streak.currentStreak >= 7) achievements.push({ key: 'week_streak', label: 'Week Warrior', description: '7-day study streak', icon: '🔥', unlocked: true })
    if (streak?.currentStreak && streak.currentStreak >= 30) achievements.push({ key: 'month_streak', label: 'Monthly Master', description: '30-day study streak', icon: '💪', unlocked: true })
    if (avgScore >= 70) achievements.push({ key: 'score_70', label: 'Score Master', description: 'Average score above 70%', icon: '📊', unlocked: true })
    if (avgScore >= 85) achievements.push({ key: 'score_85', label: 'Top Scorer', description: 'Average score above 85%', icon: '👑', unlocked: true })
    const completedGoals = goals.filter((g) => g.status === 'completed').length
    if (completedGoals >= 1) achievements.push({ key: 'goal_achieved', label: 'Goal Getter', description: 'Completed your first goal', icon: '🎯', unlocked: true })
    if (completedGoals >= 5) achievements.push({ key: 'five_goals', label: 'Goal Crusher', description: 'Completed 5+ goals', icon: '🚀', unlocked: true })

    return NextResponse.json({ achievements, totalUnlocked: achievements.length })
  } catch (error) {
    console.error('GET /api/user/achievements error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}