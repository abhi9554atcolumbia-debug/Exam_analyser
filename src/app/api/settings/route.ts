import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const USER_ID = 'user-demo-001'

export async function GET() {
  try {
    const settings = await db.userSettings.findUnique({ where: { userId: USER_ID } })
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }
    return NextResponse.json(settings)
  } catch (error) {
    console.error('GET /api/settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const settings = await db.userSettings.upsert({
      where: { userId: USER_ID },
      update: {
        ...(body.theme !== undefined && { theme: body.theme }),
        ...(body.accentColor !== undefined && { accentColor: body.accentColor }),
        ...(body.language !== undefined && { language: body.language }),
        ...(body.dateFormat !== undefined && { dateFormat: body.dateFormat }),
        ...(body.weekStart !== undefined && { weekStart: body.weekStart }),
        ...(body.timeFormat !== undefined && { timeFormat: body.timeFormat }),
        ...(body.emailNotifications !== undefined && { emailNotifications: body.emailNotifications }),
        ...(body.pushNotifications !== undefined && { pushNotifications: body.pushNotifications }),
        ...(body.examReminders !== undefined && { examReminders: body.examReminders }),
        ...(body.goalReminders !== undefined && { goalReminders: body.goalReminders }),
        ...(body.weeklyReport !== undefined && { weeklyReport: body.weeklyReport }),
        ...(body.newFeatureAlerts !== undefined && { newFeatureAlerts: body.newFeatureAlerts }),
        ...(body.marketingEmails !== undefined && { marketingEmails: body.marketingEmails }),
        ...(body.privacyMode !== undefined && { privacyMode: body.privacyMode }),
      },
      create: {
        userId: USER_ID,
        ...(body.theme !== undefined && { theme: body.theme }),
        ...(body.accentColor !== undefined && { accentColor: body.accentColor }),
        ...(body.language !== undefined && { language: body.language }),
        ...(body.dateFormat !== undefined && { dateFormat: body.dateFormat }),
        ...(body.weekStart !== undefined && { weekStart: body.weekStart }),
        ...(body.timeFormat !== undefined && { timeFormat: body.timeFormat }),
        ...(body.emailNotifications !== undefined && { emailNotifications: body.emailNotifications }),
        ...(body.pushNotifications !== undefined && { pushNotifications: body.pushNotifications }),
        ...(body.examReminders !== undefined && { examReminders: body.examReminders }),
        ...(body.goalReminders !== undefined && { goalReminders: body.goalReminders }),
        ...(body.weeklyReport !== undefined && { weeklyReport: body.weeklyReport }),
        ...(body.newFeatureAlerts !== undefined && { newFeatureAlerts: body.newFeatureAlerts }),
        ...(body.marketingEmails !== undefined && { marketingEmails: body.marketingEmails }),
        ...(body.privacyMode !== undefined && { privacyMode: body.privacyMode }),
      },
    })
    return NextResponse.json(settings)
  } catch (error) {
    console.error('PUT /api/settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}