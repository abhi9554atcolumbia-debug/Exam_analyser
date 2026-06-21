import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const reflections = await db.reflection.findMany({
      where: { userId: USER_ID, mistakeTags: { not: null } },
    })

    const tagCount: Record<string, number> = {}
    for (const r of reflections) {
      if (!r.mistakeTags) continue
      const tags = r.mistakeTags.split(',').map((t) => t.trim()).filter(Boolean)
      for (const tag of tags) {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      }
    }

    const mistakes = Object.entries(tagCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)

    // Also analyze by difficulty
    const difficultyMap: Record<string, number> = {}
    for (const r of reflections) {
      if (r.difficulty) {
        difficultyMap[r.difficulty] = (difficultyMap[r.difficulty] || 0) + 1
      }
    }
    const byDifficulty = Object.entries(difficultyMap).map(([level, count]) => ({ level, count }))

    // Emotional state analysis
    const emotionMap: Record<string, number> = {}
    for (const r of reflections) {
      if (r.emotionalState) {
        emotionMap[r.emotionalState] = (emotionMap[r.emotionalState] || 0) + 1
      }
    }
    const byEmotion = Object.entries(emotionMap).map(([state, count]) => ({ state, count }))

    return NextResponse.json({
      topMistakes: mistakes.slice(0, 10),
      allMistakes: mistakes,
      byDifficulty,
      byEmotion,
      totalReflections: reflections.length,
    })
  } catch (error) {
    console.error('GET /api/analytics/mistake-analysis error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}