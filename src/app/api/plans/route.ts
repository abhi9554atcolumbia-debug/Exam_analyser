import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'INR',
        interval: 'forever',
        features: [
          'Track up to 10 exams',
          'Basic analytics',
          '5 goals at a time',
          '10 document uploads',
          'Community support',
        ],
        limits: { exams: 10, goals: 5, documents: 10, reflections: 5 },
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 199,
        currency: 'INR',
        interval: 'month',
        features: [
          'Unlimited exam tracking',
          'Advanced analytics & insights',
          'Unlimited goals',
          '50 document uploads',
          'Weakness heatmap',
          'AI-powered recommendations',
          'Email support',
        ],
        limits: { exams: Infinity, goals: Infinity, documents: 50, reflections: Infinity },
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 499,
        currency: 'INR',
        interval: 'month',
        features: [
          'Everything in Premium',
          'Unlimited document uploads',
          'Priority support',
          'Custom study plans',
          'Export all data',
          'Early access to features',
          'Study streak analytics',
        ],
        limits: { exams: Infinity, goals: Infinity, documents: Infinity, reflections: Infinity },
      },
    ]

    return NextResponse.json(plans)
  } catch (error) {
    console.error('GET /api/plans error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}