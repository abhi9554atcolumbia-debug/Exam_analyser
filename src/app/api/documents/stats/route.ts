import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const [documents, recentDocs] = await Promise.all([
      db.document.findMany({ where: { userId: USER_ID } }),
      db.document.findMany({
        where: { userId: USER_ID },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    // Category counts
    const categoryCounts: Record<string, number> = {}
    for (const doc of documents) {
      categoryCounts[doc.category] = (categoryCounts[doc.category] || 0) + 1
    }

    // Linked exams
    const linkedExams = [...new Set(documents.filter((d) => d.examName).map((d) => d.examName!))]

    // Storage stats
    const totalSize = documents.reduce((s, d) => s + (d.fileSize || 0), 0)

    return NextResponse.json({
      categoryCounts,
      totalDocuments: documents.length,
      recentUploads: recentDocs,
      linkedExams,
      storageStats: {
        totalSize,
        totalFiles: documents.filter((d) => d.fileSize).length,
        averageSize: documents.filter((d) => d.fileSize).length > 0
          ? Math.round(totalSize / documents.filter((d) => d.fileSize).length)
          : 0,
      },
    })
  } catch (error) {
    console.error('GET /api/documents/stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}