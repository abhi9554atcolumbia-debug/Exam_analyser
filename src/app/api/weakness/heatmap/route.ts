import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

const WEAKNESS_COLUMNS = ['timeManagement', 'conceptGap', 'sillyMistakes', 'revisionGap', 'calculationErrors', 'pressureHandling', 'guessing'] as const

export async function GET() {
  try {
    const [exams, reflections] = await Promise.all([
      db.exam.findMany({ where: { userId: USER_ID }, include: { sectionalScores: true } }),
      db.reflection.findMany({ where: { userId: USER_ID }, include: { sections: true } }),
    ])

    // Collect unique subjects
    const subjectMap: Record<string, number[]> = {}
    for (const exam of exams) {
      for (const s of exam.sectionalScores) {
        if (!subjectMap[s.section]) subjectMap[s.section] = []
        subjectMap[s.section].push((s.score / s.max) * 100)
      }
    }
    const subjects = Object.keys(subjectMap)

    // Count mistake tags per subject from reflections
    const subjectTagCounts: Record<string, Record<string, number>> = {}
    for (const subj of subjects) {
      subjectTagCounts[subj] = {}
      for (const col of WEAKNESS_COLUMNS) subjectTagCounts[subj][col] = 0
    }

    for (const r of reflections) {
      if (!r.mistakeTags) continue
      const tags = r.mistakeTags.split(',').map(t => t.trim()).filter(Boolean)
      for (const s of r.sections) {
        for (const tag of tags) {
          const key = tagToColumn(tag)
          if (key && subjectTagCounts[s.section]) {
            subjectTagCounts[s.section][key]++
          }
        }
      }
    }

    // Build heatmap rows with 0-100 weakness scores
    const heatmap = subjects.map(subject => {
      const avgScore = subjectMap[subject].reduce((a, b) => a + b, 0) / subjectMap[subject].length
      const inversion = Math.round((100 - avgScore)) // lower avg score = higher weakness

      const row: Record<string, number> = { subject, overall: inversion }

      for (const col of WEAKNESS_COLUMNS) {
        const count = subjectTagCounts[subject][col] || 0
        // Convert count to 0-100 scale (max 3 mentions = ~100)
        const fromTags = Math.min(100, Math.round((count / 3) * 100))
        // Combine with score-based weakness
        const combined = Math.min(100, Math.round(inversion * 0.5 + fromTags * 0.5))
        row[col] = combined
      }

      return row
    })

    // Normalize overall to be average of all weakness columns
    for (const row of heatmap) {
      const cols = WEAKNESS_COLUMNS.map(c => row[c])
      row.overall = Math.round(cols.reduce((a, b) => a + b, 0) / cols.length)
    }

    return NextResponse.json(heatmap)
  } catch (error) {
    console.error('GET /api/weakness/heatmap error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function tagToColumn(tag: string): string | null {
  const map: Record<string, string> = {
    'Time Management': 'timeManagement',
    'Concept Gap': 'conceptGap',
    'Silly Mistakes': 'sillyMistakes',
    'Revision Gap': 'revisionGap',
    'Calculation Errors': 'calculationErrors',
    'Pressure Handling': 'pressureHandling',
    'Guessing': 'guessing',
  }
  return map[tag] || null
}