// 'use client';

// import { useState } from 'react';
// import {
//   Sparkles, Check, X, Zap, BarChart3, BrainCircuit, Target,
//   Shield, Crown, Star, ChevronRight, HelpCircle, Quote,
//   Gem, ArrowRight,
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import {
//   Accordion, AccordionContent, AccordionItem, AccordionTrigger,
// } from '@/components/ui/accordion';
// import { cn } from '@/lib/utils';

// interface Plan {
//   name: string;
//   tagline: string;
//   priceMonthly: number;
//   priceYearly: number;
//   badge: string;
//   borderColor: string;
//   gradientFrom: string;
//   gradientTo: string;
//   features: { label: string; included: boolean }[];
//   current?: boolean;
// }

// const plans: Plan[] = [
//   {
//     name: 'Free',
//     tagline: 'Get started with basic tracking',
//     priceMonthly: 0,
//     priceYearly: 0,
//     badge: 'Current Plan',
//     borderColor: 'border-gray-300 dark:border-gray-600',
//     gradientFrom: 'from-gray-400',
//     gradientTo: 'to-gray-500',
//     current: true,
//     features: [
//       { label: 'Track up to 5 exams', included: true },
//       { label: 'Basic score analytics', included: true },
//       { label: 'Goal tracking (3 goals)', included: true },
//       { label: 'Calendar view', included: true },
//       { label: 'Basic reflections', included: true },
//       { label: 'Smart insights', included: false },
//       { label: 'Weakness heatmap', included: false },
//       { label: 'AI-powered recommendations', included: false },
//       { label: 'Document storage', included: false },
//       { label: 'Priority support', included: false },
//       { label: 'Custom themes', included: false },
//       { label: 'Data export', included: false },
//       { label: 'Advanced analytics', included: false },
//     ],
//   },
//   {
//     name: 'Premium',
//     tagline: 'Unlock your full potential',
//     priceMonthly: 149,
//     priceYearly: 119,
//     badge: 'Most Popular',
//     borderColor: 'border-emerald-500',
//     gradientFrom: 'from-emerald-400',
//     gradientTo: 'to-emerald-600',
//     features: [
//       { label: 'Unlimited exam tracking', included: true },
//       { label: 'Advanced score analytics', included: true },
//       { label: 'Goal tracking (unlimited)', included: true },
//       { label: 'Calendar view', included: true },
//       { label: 'Advanced reflections', included: true },
//       { label: 'Smart insights', included: true },
//       { label: 'Weakness heatmap', included: true },
//       { label: 'AI-powered recommendations', included: true },
//       { label: 'Document storage (1 GB)', included: true },
//       { label: 'Priority support', included: false },
//       { label: 'Custom themes', included: false },
//       { label: 'Data export', included: true },
//       { label: 'Advanced analytics', included: true },
//     ],
//   },
//   {
//     name: 'Pro',
//     tagline: 'For serious exam aspirants',
//     priceMonthly: 249,
//     priceYearly: 199,
//     badge: 'Best Value',
//     borderColor: 'border-amber-500',
//     gradientFrom: 'from-amber-400',
//     gradientTo: 'to-amber-600',
//     features: [
//       { label: 'Unlimited exam tracking', included: true },
//       { label: 'Advanced score analytics', included: true },
//       { label: 'Goal tracking (unlimited)', included: true },
//       { label: 'Calendar view', included: true },
//       { label: 'Advanced reflections + AI', included: true },
//       { label: 'Smart insights', included: true },
//       { label: 'Weakness heatmap', included: true },
//       { label: 'AI-powered recommendations', included: true },
//       { label: 'Document storage (5 GB)', included: true },
//       { label: 'Priority support', included: true },
//       { label: 'Custom themes', included: true },
//       { label: 'Data export', included: true },
//       { label: 'Advanced analytics', included: true },
//     ],
//   },
// ];

// const benefits = [
//   { title: 'AI-Powered Insights', description: 'Get personalized recommendations based on your performance patterns and study habits', icon: BrainCircuit, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20' },
//   { title: 'Advanced Analytics', description: 'Deep performance analysis with trend charts, cutoff gap tracking, and score predictions', icon: BarChart3, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300', gradient: 'from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20' },
//   { title: 'Smart Goal Tracking', description: 'AI suggests goals based on your weak areas and upcoming exam schedule', icon: Target, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', gradient: 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20' },
//   { title: 'Priority Support', description: 'Get faster responses and dedicated support for your exam preparation journey', icon: Shield, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300', gradient: 'from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20' },
// ];

// const faqs = [
//   { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel your subscription at any time. You will continue to have access to premium features until the end of your billing period. No questions asked.' },
//   { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, UPI, and net banking. All payments are processed securely through our payment partner.' },
//   { q: 'Is there a free trial?', a: 'Yes! All premium plans come with a 7-day free trial. You can explore all features before committing. Cancel anytime during the trial period at no charge.' },
//   { q: 'Can I switch between plans?', a: 'Absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you get immediate access to new features. When downgrading, changes take effect at the next billing cycle.' },
//   { q: 'What happens to my data if I downgrade?', a: 'Your data is always yours. If you downgrade, your data is preserved but some features may become read-only. You can export all your data at any time.' },
// ];

// const testimonials = [
//   {
//     name: 'Priya Sharma',
//     exam: 'CAT 2024',
//     avatar: 'PS',
//     quote: 'The weakness heatmap helped me identify exactly where I was losing marks. Improved my score by 15% in just 2 months!',
//     rating: 5,
//     color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
//   },
//   {
//     name: 'Rahul Patel',
//     exam: 'GATE CS 2025',
//     avatar: 'RP',
//     quote: 'AI-powered insights are a game changer. It predicted my weak areas before I even realized them. Totally worth the Pro plan.',
//     rating: 5,
//     color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
//   },
//   {
//     name: 'Ananya Gupta',
//     exam: 'UPSC Prelims',
//     avatar: 'AG',
//     quote: 'The study streak feature kept me consistent for 90 days straight. Premium analytics helped me track every section of my preparation.',
//     rating: 5,
//     color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
//   },
// ];

// export default function UpgradePlanPage() {
//   const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

//   return (
//     <div className="space-y-6">
//       {/* Header with Gradient */}
//       <Card className="rounded-2xl overflow-hidden border-emerald-500/30 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-emerald-950/30">
//         <div className="relative px-6 py-6 sm:px-8">
//           <div className="absolute inset-0 opacity-20 overflow-hidden">
//             <div className="absolute -top-8 -right-8 size-40 rounded-full bg-emerald-300/30 blur-2xl" />
//             <div className="absolute -bottom-8 -left-8 size-48 rounded-full bg-teal-300/30 blur-2xl" />
//           </div>
//           <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <div className="flex items-center gap-3 mb-1">
//                 <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm">
//                   <Gem className="size-5 text-white drop-shadow-sm" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold">Upgrade to Pro</h2>
//                   <p className="text-xs text-muted-foreground">Unlock premium features to boost your exam preparation</p>
//                 </div>
//               </div>
//             </div>
//             <Button variant="outline" className="gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" onClick={() => toast.info('Sales contact dialog would open')}>
//               <HelpCircle className="size-4" /> Contact Sales
//             </Button>
//           </div>
//         </div>
//       </Card>

//       {/* Billing Toggle */}
//       <div className="flex items-center justify-center gap-4">
//         <span className={cn('text-sm font-medium transition-colors', billing === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>Monthly</span>
//         <Button
//           variant="outline"
//           size="sm"
//           className={cn(
//             'relative px-6 gap-2 rounded-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
//             billing === 'yearly' ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:text-white shadow-md' : '',
//           )}
//           onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
//         >
//           <Crown className="size-3.5" />
//           {billing === 'yearly' ? 'Yearly' : 'Switch to Yearly'}
//           {billing === 'monthly' && (
//             <Badge className="ml-1 bg-amber-100 text-amber-700 text-[10px] dark:bg-amber-900/40 dark:text-amber-300 animate-pulse font-semibold">Save 20%</Badge>
//           )}
//         </Button>
//         <span className={cn('text-sm font-medium transition-colors', billing === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}>Yearly</span>
//       </div>

//       {/* Plan Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {plans.map((plan) => {
//           const price = billing === 'monthly' ? plan.priceMonthly : plan.priceYearly;
//           const isPremium = plan.name === 'Premium';
//           const isPro = plan.name === 'Pro';
//           return (
//             <Card key={plan.name} className={cn(
//               'relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2',
//               'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md',
//               plan.current ? 'border-muted' : '',
//               isPremium ? `border-2 ${plan.borderColor} shadow-xl shadow-emerald-500/15 ring-1 ring-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/20` : '',
//               isPro ? `border-2 ${plan.borderColor} shadow-xl shadow-amber-500/15 ring-1 ring-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/20` : '',
//               !plan.current && !isPremium && !isPro ? 'hover:shadow-lg' : '',
//             )}>
//               {/* Animated Colored Top Bar with gradient glow */}
//               <div className={cn('h-1.5 bg-gradient-to-r relative', plan.gradientFrom, plan.gradientTo)}>
//                 {isPremium && (
//                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-[length:200%_100%] animate-[pulse-glow_2s_ease-in-out_infinite]" />
//                 )}
//               </div>

//               {/* Badge Ribbon */}
//               {plan.badge && (
//                 <div className={cn(
//                   'absolute -top-0 left-1/2 -translate-x-1/2 translate-y-1',
//                   isPremium ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
//                   isPro ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-lg shadow-amber-500/30' :
//                   'bg-muted text-muted-foreground',
//                   'text-[10px] font-bold px-4 py-1.5 rounded-b-lg uppercase tracking-wider',
//                 )}>
//                   <span className="flex items-center gap-1">
//                     {(isPremium || isPro) && <Sparkles className="size-2.5" />}
//                     {plan.badge}
//                   </span>
//                 </div>
//               )}

//               <CardHeader className="pb-2 pt-6 text-center">
//                 <CardTitle className="text-lg flex items-center justify-center gap-1.5">
//                   {isPremium && <Crown className="size-5 text-emerald-600" />}
//                   {isPro && <Sparkles className="size-5 text-amber-500" />}
//                   {plan.name === 'Free' && <Star className="size-5 text-gray-500" />}
//                   {plan.name}
//                 </CardTitle>
//                 <p className="text-sm text-muted-foreground">{plan.tagline}</p>
//               </CardHeader>
//               <CardContent className="flex-1 flex flex-col">
//                 {/* Price Display */}
//                 <div className="text-center my-4">
//                   {price === 0 ? (
//                     <div>
//                       <span className="text-4xl font-bold">Free</span>
//                       <p className="text-sm text-muted-foreground mt-1">Forever free</p>
//                     </div>
//                   ) : (
//                     <div>
//                       <span className="text-4xl font-bold tabular-nums">₹{price}</span>
//                       <span className="text-sm text-muted-foreground">/{billing === 'monthly' ? 'mo' : 'mo, billed yearly'}</span>
//                       {billing === 'yearly' && plan.priceYearly < plan.priceMonthly && (
//                         <div className="inline-flex items-center gap-1 mt-1">
//                           <Badge className="bg-emerald-100 text-emerald-700 text-[10px] dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold">
//                             Save ₹{(plan.priceMonthly - plan.priceYearly) * 12}/year
//                           </Badge>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 <Separator className="mb-4" />

//                 {/* Features with animated checkmarks */}
//                 <div className="space-y-2.5 flex-1">
//                   {plan.features.map((f) => (
//                     <div key={f.label} className={cn(
//                       'flex items-center gap-2.5 p-1.5 rounded-lg transition-all duration-200',
//                       f.included ? 'hover:bg-muted/50 hover:translate-x-0.5' : '',
//                     )}>
//                       {f.included ? (
//                         <div className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 shrink-0 transition-transform duration-200 hover:scale-125">
//                           <Check className="size-3" strokeWidth={3} />
//                         </div>
//                       ) : (
//                         <div className="flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground/40 shrink-0">
//                           <X className="size-3" />
//                         </div>
//                       )}
//                       <span className={cn('text-sm', f.included ? 'text-foreground' : 'text-muted-foreground/50')}>
//                         {f.label}
//                       </span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* CTA Button with glow effect */}
//                 <Button
//                   className={cn(
//                     'mt-6 w-full transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden',
//                     plan.current ? 'bg-muted text-muted-foreground cursor-default hover:bg-muted hover:-translate-y-0' : '',
//                     isPremium && !plan.current ? 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30' : '',
//                     isPro && !plan.current ? 'bg-foreground hover:bg-foreground/90 hover:shadow-lg hover:shadow-amber-500/20' : '',
//                   )}
//                   onClick={() => {
//                     if (plan.current) return;
//                     toast.success(`Redirecting to ${plan.name} checkout...`);
//                   }}
//                   disabled={plan.current}
//                 >
//                   {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
//                   {!plan.current && <ArrowRight className="size-4 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />}
//                   {!plan.current && (isPremium || isPro) && (
//                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
//                   )}
//                 </Button>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Money-Back Guarantee */}
//       <Card className="rounded-2xl border-emerald-500/30 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-emerald-950/30 overflow-hidden">
//         <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
//         <CardContent className="p-5 flex items-center gap-4">
//           <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shrink-0 dark:bg-emerald-900/40 shadow-sm">
//             <Shield className="size-6" />
//           </div>
//           <div className="flex-1">
//             <h4 className="font-bold">7-Day Money-Back Guarantee</h4>
//             <p className="text-sm text-muted-foreground">Not satisfied? Get a full refund within 7 days. No questions asked.</p>
//           </div>
//           <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-semibold shrink-0">100% Secure</Badge>
//         </CardContent>
//       </Card>

//       {/* Compare Plans Table */}
//       <div>
//         <div className="flex items-center gap-3 mb-4">
//           <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 px-3 py-1.5">
//             <BarChart3 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
//             <h3 className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Compare Plans</h3>
//           </div>
//           <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/20 to-transparent" />
//         </div>
//         <Card className="rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
//           <CardContent className="p-0 overflow-x-auto">
//             <table className="w-full min-w-[500px]">
//               <thead>
//                 <tr className="border-b">
//                   <th className="text-left text-sm font-semibold text-muted-foreground p-4 bg-muted/30">Feature</th>
//                   {plans.map((p) => (
//                     <th key={p.name} className={cn(
//                       'text-center text-sm font-bold p-4 transition-colors',
//                       p.name === 'Premium' ? 'text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400' :
//                       p.name === 'Pro' ? 'text-amber-600 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-400' : 'bg-muted/10',
//                     )}>
//                       <span className="flex items-center justify-center gap-1">
//                         {p.name === 'Premium' && <Crown className="size-3.5" />}
//                         {p.name === 'Pro' && <Sparkles className="size-3.5" />}
//                         {p.name}
//                       </span>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {plans[0].features.map((f, i) => (
//                   <tr key={i} className={cn(
//                     'border-b last:border-b-0 transition-colors hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10',
//                     i % 2 === 1 && 'bg-muted/20',
//                   )}>
//                     <td className="text-sm p-4 text-muted-foreground font-medium">{f.label}</td>
//                     {plans.map((p) => {
//                       const included = p.features[i]?.included;
//                       return (
//                         <td key={p.name} className={cn(
//                           'text-center p-4',
//                           p.name === 'Premium' && included && 'bg-emerald-50/30 dark:bg-emerald-950/10',
//                           p.name === 'Pro' && included && 'bg-amber-50/30 dark:bg-amber-950/10',
//                         )}>
//                           {included ? (
//                             <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 mx-auto transition-transform duration-200 hover:scale-110">
//                               <Check className="size-4" strokeWidth={3} />
//                             </div>
//                           ) : (
//                             <div className="flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground/40 mx-auto">
//                               <X className="size-3.5" />
//                             </div>
//                           )}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Benefits */}
//       <div>
//         <div className="flex items-center gap-3 mb-4">
//           <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-500/10 to-cyan-500/10 dark:from-teal-500/5 dark:to-cyan-500/5 px-3 py-1.5">
//             <Zap className="size-3.5 text-teal-600 dark:text-teal-400" />
//             <h3 className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wider">Why Upgrade?</h3>
//           </div>
//           <div className="flex-1 h-px bg-gradient-to-r from-teal-500/20 to-transparent" />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {benefits.map((b) => {
//             const Icon = b.icon;
//             return (
//               <Card key={b.title} className={cn('rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm')}>
//                 <div className={cn('h-1 bg-gradient-to-r opacity-50', b.gradient.replace(/from-/, 'from-emerald-400/').replace(/to-/, 'to-teal-400/'))} />
//                 <CardContent className="p-5">
//                   <div className="flex items-start gap-4">
//                     <div className={cn('flex size-12 items-center justify-center rounded-xl shrink-0 shadow-sm', b.color)}>
//                       <Icon className="size-6" />
//                     </div>
//                     <div>
//                       <p className="font-bold text-sm">{b.title}</p>
//                       <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{b.description}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       </div>

//       {/* Testimonials */}
//       <div>
//         <div className="flex items-center gap-3 mb-4">
//           <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5 px-3 py-1.5">
//             <Star className="size-3.5 text-amber-600 dark:text-amber-400" />
//             <h3 className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">What Students Say</h3>
//           </div>
//           <div className="flex-1 h-px bg-gradient-to-r from-amber-500/20 to-transparent" />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {testimonials.map((t) => (
//             <Card key={t.name} className="rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
//               <CardContent className="p-5">
//                 <Quote className="size-6 text-emerald-300 dark:text-emerald-700 mb-3" />
//                 <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.quote}</p>
//                 <div className="flex items-center gap-3">
//                   <div className={cn('flex size-9 items-center justify-center rounded-full text-xs font-bold', t.color)}>
//                     {t.avatar}
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold">{t.name}</p>
//                     <div className="flex items-center gap-1 mt-0.5">
//                       {Array.from({ length: t.rating }).map((_, i) => (
//                         <Star key={i} className="size-3 text-amber-500 fill-amber-500" />
//                       ))}
//                       <span className="text-[10px] text-muted-foreground ml-1">{t.exam}</span>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* FAQ */}
//       <div>
//         <div className="flex items-center gap-3 mb-4">
//           <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 px-3 py-1.5">
//             <HelpCircle className="size-3.5 text-emerald-600 dark:text-emerald-400" />
//             <h3 className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Frequently Asked Questions</h3>
//           </div>
//           <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/20 to-transparent" />
//         </div>
//         <Card className="rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
//           <CardContent className="p-0">
//             <Accordion type="single" collapsible className="w-full">
//               {faqs.map((faq, i) => (
//                 <AccordionItem key={i} value={`plan-faq-${i}`} className="px-5">
//                   <AccordionTrigger className="text-sm font-medium hover:no-underline py-4 hover:text-emerald-600 transition-colors">
//                     {faq.q}
//                   </AccordionTrigger>
//                   <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
//                     {faq.a}
//                   </AccordionContent>
//                   {i < faqs.length - 1 && <Separator />}
//                 </AccordionItem>
//               ))}
//             </Accordion>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
