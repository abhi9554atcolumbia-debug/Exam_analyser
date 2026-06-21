'use client';

import { useState } from 'react';
import {
  Sparkles, Check, X, Zap, BarChart3, BrainCircuit, Target,
  Shield, Crown, Star, ChevronRight, HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface Plan {
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  badge: string;
  features: { label: string; included: boolean }[];
  current?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Free',
    tagline: 'Get started with basic tracking',
    priceMonthly: 0,
    priceYearly: 0,
    badge: 'Current Plan',
    current: true,
    features: [
      { label: 'Track up to 5 exams', included: true },
      { label: 'Basic score analytics', included: true },
      { label: 'Goal tracking (3 goals)', included: true },
      { label: 'Calendar view', included: true },
      { label: 'Basic reflections', included: true },
      { label: 'Smart insights', included: false },
      { label: 'Weakness heatmap', included: false },
      { label: 'AI-powered recommendations', included: false },
      { label: 'Document storage', included: false },
      { label: 'Priority support', included: false },
      { label: 'Custom themes', included: false },
      { label: 'Data export', included: false },
      { label: 'Advanced analytics', included: false },
    ],
  },
  {
    name: 'Premium',
    tagline: 'Unlock your full potential',
    priceMonthly: 149,
    priceYearly: 119,
    badge: 'Most Popular',
    features: [
      { label: 'Unlimited exam tracking', included: true },
      { label: 'Advanced score analytics', included: true },
      { label: 'Goal tracking (unlimited)', included: true },
      { label: 'Calendar view', included: true },
      { label: 'Advanced reflections', included: true },
      { label: 'Smart insights', included: true },
      { label: 'Weakness heatmap', included: true },
      { label: 'AI-powered recommendations', included: true },
      { label: 'Document storage (1 GB)', included: true },
      { label: 'Priority support', included: false },
      { label: 'Custom themes', included: false },
      { label: 'Data export', included: true },
      { label: 'Advanced analytics', included: true },
    ],
  },
  {
    name: 'Pro',
    tagline: 'For serious exam aspirants',
    priceMonthly: 249,
    priceYearly: 199,
    badge: 'Best Value',
    features: [
      { label: 'Unlimited exam tracking', included: true },
      { label: 'Advanced score analytics', included: true },
      { label: 'Goal tracking (unlimited)', included: true },
      { label: 'Calendar view', included: true },
      { label: 'Advanced reflections + AI', included: true },
      { label: 'Smart insights', included: true },
      { label: 'Weakness heatmap', included: true },
      { label: 'AI-powered recommendations', included: true },
      { label: 'Document storage (5 GB)', included: true },
      { label: 'Priority support', included: true },
      { label: 'Custom themes', included: true },
      { label: 'Data export', included: true },
      { label: 'Advanced analytics', included: true },
    ],
  },
];

const compareFeatures = [
  'Exams Tracked', 'Score Analytics', 'Goal Tracking', 'Calendar',
  'Reflections', 'Smart Insights', 'Weakness Heatmap', 'AI Recommendations',
  'Document Storage', 'Priority Support', 'Custom Themes', 'Data Export', 'Advanced Analytics',
];

const benefits = [
  { title: 'AI-Powered Insights', description: 'Get personalized recommendations based on your performance patterns and study habits', icon: BrainCircuit, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  { title: 'Advanced Analytics', description: 'Deep performance analysis with trend charts, cutoff gap tracking, and score predictions', icon: BarChart3, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' },
  { title: 'Smart Goal Tracking', description: 'AI suggests goals based on your weak areas and upcoming exam schedule', icon: Target, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  { title: 'Priority Support', description: 'Get faster responses and dedicated support for your exam preparation journey', icon: Shield, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
];

const faqs = [
  { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel your subscription at any time. You will continue to have access to premium features until the end of your billing period. No questions asked.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, UPI, and net banking. All payments are processed securely through our payment partner.' },
  { q: 'Is there a free trial?', a: 'Yes! All premium plans come with a 7-day free trial. You can explore all features before committing. Cancel anytime during the trial period at no charge.' },
  { q: 'Can I switch between plans?', a: 'Absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you get immediate access to new features. When downgrading, changes take effect at the next billing cycle.' },
  { q: 'What happens to my data if I downgrade?', a: 'Your data is always yours. If you downgrade, your data is preserved but some features may become read-only. You can export all your data at any time.' },
];

export default function UpgradePlanPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold">Upgrade to Pro</h2>
        <Button variant="outline" className="gap-2" onClick={() => toast.info('Sales contact dialog would open')}>
          <HelpCircle className="size-4" /> Contact Sales
        </Button>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={cn('text-sm font-medium', billing === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>Monthly</span>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'relative px-8 gap-2',
            billing === 'yearly' && 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:text-white',
          )}
          onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
        >
          <Crown className="size-3.5" />
          {billing === 'yearly' ? 'Yearly' : 'Switch to Yearly'}
          {billing === 'monthly' && (
            <Badge className="ml-1 bg-amber-100 text-amber-700 text-[10px] dark:bg-amber-900/40 dark:text-amber-300">Save 20%</Badge>
          )}
        </Button>
        <span className={cn('text-sm font-medium', billing === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}>Yearly</span>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const price = billing === 'monthly' ? plan.priceMonthly : plan.priceYearly;
          const isPremium = plan.name === 'Premium';
          return (
            <Card key={plan.name} className={cn(
              'relative flex flex-col',
              isPremium && 'border-emerald-500 border-2 shadow-lg',
            )}>
              {plan.badge && (
                <div className={cn(
                  'absolute -top-3 left-1/2 -translate-x-1/2',
                  isPremium ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground',
                  'text-xs font-medium px-3 py-1 rounded-full',
                )}>
                  {plan.badge}
                </div>
              )}
              <CardHeader className="pb-2 pt-6 text-center">
                <CardTitle className="text-lg">
                  {plan.name === 'Premium' && <Crown className="size-5 inline mr-1.5 text-emerald-600" />}
                  {plan.name === 'Pro' && <Sparkles className="size-5 inline mr-1.5 text-amber-500" />}
                  {plan.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{plan.tagline}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="text-center my-4">
                  <span className="text-4xl font-bold">₹{price}</span>
                  <span className="text-sm text-muted-foreground">/{billing === 'monthly' ? 'mo' : 'mo, billed yearly'}</span>
                  {billing === 'yearly' && plan.priceYearly < plan.priceMonthly && (
                    <p className="text-xs text-emerald-600 mt-1">Save ₹{(plan.priceMonthly - plan.priceYearly) * 12}/year</p>
                  )}
                </div>

                <Separator className="mb-4" />

                <div className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <div key={f.label} className="flex items-center gap-2">
                      {f.included ? (
                        <Check className="size-4 text-emerald-600 shrink-0" />
                      ) : (
                        <X className="size-4 text-muted-foreground/40 shrink-0" />
                      )}
                      <span className={cn('text-sm', f.included ? 'text-foreground' : 'text-muted-foreground/60')}>
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  className={cn(
                    'mt-6 w-full',
                    plan.current ? 'bg-muted text-muted-foreground cursor-default' : '',
                    isPremium && !plan.current ? 'bg-emerald-600 hover:bg-emerald-700' : '',
                    !isPremium && !plan.current ? 'bg-foreground hover:bg-foreground/90' : '',
                  )}
                  onClick={() => {
                    if (plan.current) return;
                    toast.success(`Redirecting to ${plan.name} checkout...`);
                  }}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Money-Back Guarantee */}
      <Card className="border-emerald-500/50 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0 dark:bg-emerald-900/40">
            <Shield className="size-6" />
          </div>
          <div>
            <h4 className="font-semibold">7-Day Money-Back Guarantee</h4>
            <p className="text-sm text-muted-foreground">Not satisfied? Get a full refund within 7 days. No questions asked.</p>
          </div>
        </CardContent>
      </Card>

      {/* Compare Plans Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Compare Plans</h3>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-sm font-medium text-muted-foreground p-3">Feature</th>
                  {plans.map((p) => (
                    <th key={p.name} className="text-center text-sm font-semibold p-3">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans[0].features.map((f, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="text-sm p-3 text-muted-foreground">{f.label}</td>
                    {plans.map((p) => {
                      const included = p.features[i]?.included;
                      return (
                        <td key={p.name} className="text-center p-3">
                          {included ? (
                            <Check className="size-4 text-emerald-600 mx-auto" />
                          ) : (
                            <X className="size-4 text-muted-foreground/40 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Why Upgrade */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Why Upgrade?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.title}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={cn('flex size-10 items-center justify-center rounded-lg shrink-0', b.color)}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{b.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
        <Card>
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`plan-faq-${i}`}>
                  <AccordionTrigger className="px-5 text-sm font-medium">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 text-sm text-muted-foreground pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
