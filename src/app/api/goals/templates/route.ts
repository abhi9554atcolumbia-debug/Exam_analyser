import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const templates = [
      { id: 't1', title: 'Complete Syllabus Revision', description: 'Finish revising all topics in the syllabus', category: 'Study', defaultDays: 30 },
      { id: 't2', title: 'Practice 100 Questions Daily', description: 'Solve at least 100 practice questions every day', category: 'Practice', defaultDays: 14 },
      { id: 't3', title: 'Take 5 Mock Tests', description: 'Complete 5 full-length mock tests this month', category: 'Mock', defaultDays: 30 },
      { id: 't4', title: 'Improve Quantitative Aptitude', description: 'Focus on quantitative aptitude and reach 80% accuracy', category: 'Subject', defaultDays: 21 },
      { id: 't5', title: 'Master Current Affairs', description: 'Cover last 6 months of current affairs thoroughly', category: 'Study', defaultDays: 14 },
      { id: 't6', title: 'Improve Speed & Accuracy', description: 'Reduce negative marking and improve attempt rate', category: 'Strategy', defaultDays: 28 },
      { id: 't7', title: 'Complete Previous Year Papers', description: 'Solve all PYQs from the last 5 years', category: 'Practice', defaultDays: 21 },
      { id: 't8', title: 'Daily Reading Comprehension', description: 'Practice 3 reading comprehension passages daily', category: 'Practice', defaultDays: 14 },
    ]

    return NextResponse.json(templates)
  } catch (error) {
    console.error('GET /api/goals/templates error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}