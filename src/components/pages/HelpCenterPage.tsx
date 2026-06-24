// 'use client';

// import { useState } from 'react';
// import {
//   HelpCircle, Search, BookOpen, Target, BrainCircuit, Settings, Mail,
//   Phone, MessageCircle, Ticket, Play, Clock, ChevronRight, Sparkles,
//   Headphones, FileText, BarChart3, ShieldCheck, BookMarked,
//   GraduationCap, Users, Send, ArrowRight,
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import {
//   Accordion, AccordionContent, AccordionItem, AccordionTrigger,
// } from '@/components/ui/accordion';
// import { Separator } from '@/components/ui/separator';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';

// const topicBorderColors = [
//   'border-l-emerald-500',
//   'border-l-teal-500',
//   'border-l-amber-500',
//   'border-l-violet-500',
//   'border-l-rose-500',
// ];

// const faqCategories = [
//   { name: 'Getting Started', items: [0, 1] },
//   { name: 'Features', items: [2, 3] },
//   { name: 'Data & Security', items: [4, 5] },
// ];

// const contactSubjects = [
//   'Account Issue', 'Feature Request', 'Bug Report', 'Payment Query', 'Other',
// ];

// const topics = [
//   { title: 'Getting Started', description: 'Learn the basics of setting up your exam journey tracker', icon: Sparkles, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', articles: 8 },
//   { title: 'Exams & Entries', description: 'How to add, manage, and track your exam results', icon: FileText, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300', articles: 12 },
//   { title: 'Goals & Planning', description: 'Set goals, track progress, and build study streaks', icon: Target, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', articles: 6 },
//   { title: 'Reflections', description: 'Review past exams, identify patterns, and improve', icon: BrainCircuit, color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300', articles: 9 },
//   { title: 'Account & Settings', description: 'Manage your profile, preferences, and data', icon: Settings, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300', articles: 5 },
// ];

// const guides = [
//   { title: 'Setting Up Your First Exam', description: 'Learn how to add your first exam and start tracking progress', readTime: '3 min', icon: BookOpen, gradient: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5' },
//   { title: 'Creating Effective Goals', description: 'Best practices for setting achievable study goals', readTime: '5 min', icon: Target, gradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5' },
//   { title: 'Understanding Analytics', description: 'How to read your performance charts and insights', readTime: '4 min', icon: BarChart3, gradient: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/5 dark:to-purple-500/5' },
//   { title: 'Using the Calendar', description: 'Plan your study schedule with the calendar view', readTime: '3 min', icon: ShieldCheck, gradient: 'from-sky-500/10 to-blue-500/10 dark:from-sky-500/5 dark:to-blue-500/5' },
//   { title: 'Managing Documents', description: 'Upload and organize your study materials', readTime: '2 min', icon: FileText, gradient: 'from-rose-500/10 to-pink-500/10 dark:from-rose-500/5 dark:to-pink-500/5' },
//   { title: 'Building Study Streaks', description: 'How to maintain consistency and track your streak', readTime: '4 min', icon: Sparkles, gradient: 'from-teal-500/10 to-cyan-500/10 dark:from-teal-500/5 dark:to-cyan-500/5' },
// ];

// const faqs = [
//   { q: 'How do I add a new exam?', a: 'Go to the Exam History page and click the "Add Exam" button. Fill in the exam details including name, date, score, and sectional scores. You can also link reflections to exams for deeper analysis.' },
//   { q: 'Can I track multiple exams at once?', a: 'Yes! You can track unlimited exams. Each exam can have its own reflections, goals, and documents. Use the Upcoming Exams page to manage exams you are preparing for.' },
//   { q: 'How are smart insights generated?', a: 'Smart insights are based on your exam scores, reflection patterns, streak data, and goal progress. They are computed dynamically and updated as you add more data.' },
//   { q: 'What is the weakness heatmap?', a: 'The weakness heatmap visualizes your weak areas across subjects and weakness types (time management, concept gaps, silly mistakes, etc.) based on reflection data.' },
//   { q: 'Can I export my data?', a: 'Yes, go to Profile > Data & Backup section. You can export all your data, download it, or create a backup. This includes exams, reflections, goals, and documents.' },
//   { q: 'Is my data secure?', a: 'Your data is stored locally and encrypted. Privacy mode is available in Settings to hide sensitive information. You can also clear local cache or delete your account at any time.' },
// ];

// const videoTutorials = [
//   { title: 'Getting Started Tour', duration: '5:30' },
//   { title: 'Adding Your First Exam', duration: '3:15' },
//   { title: 'Mastering Reflections', duration: '7:20' },
//   { title: 'Analytics Deep Dive', duration: '6:45' },
// ];

// const supportOptions = [
//   { label: 'Live Chat', icon: MessageCircle, availability: 'Mon-Fri, 9 AM - 6 PM', available: true },
//   { label: 'Email Support', icon: Mail, availability: 'Response within 24h', available: true },
//   { label: 'Submit Ticket', icon: Ticket, availability: 'Track your issue', available: true },
//   { label: 'Call Us', icon: Phone, availability: 'Mon-Fri, 10 AM - 4 PM', available: false },
// ];

// export default function HelpCenterPage() {
//   const [search, setSearch] = useState('');
//   const [searchFocused, setSearchFocused] = useState(false);
//   const [contactName, setContactName] = useState('');
//   const [contactEmail, setContactEmail] = useState('');
//   const [contactSubject, setContactSubject] = useState('');
//   const [contactMessage, setContactMessage] = useState('');
//   const [sendingContact, setSendingContact] = useState(false);

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
//             <div className="flex items-center gap-3">
//               <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md">
//                 <HelpCircle className="size-6 text-white drop-shadow-sm" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold">Help Center</h2>
//                 <p className="text-xs text-muted-foreground">Find answers, guides, and support</p>
//               </div>
//             </div>
//             <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all duration-200" onClick={() => toast.info('Support contact dialog would open')}>
//               <Headphones className="size-4" /> Contact Support
//             </Button>
//           </div>
//         </div>
//       </Card>

//       {/* Search with enhanced styling */}
//       <div className={cn(
//         'relative transition-all duration-300 group',
//         searchFocused && 'scale-[1.01]',
//       )}>
//         <Search className={cn(
//           'absolute left-4 top-1/2 -translate-y-1/2 size-5 transition-all duration-200',
//           searchFocused ? 'text-emerald-600 scale-110' : 'text-muted-foreground',
//         )} />
//         <Input
//           placeholder="Search for help articles, FAQs, and guides..."
//           className={cn(
//             'pl-12 h-12 rounded-xl text-sm transition-all duration-200 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
//             searchFocused && 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10',
//           )}
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           onFocus={() => setSearchFocused(true)}
//           onBlur={() => setSearchFocused(false)}
//         />
//         {!search && (
//           <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md border bg-muted/80 text-[10px] font-mono text-muted-foreground">
//             <span className="text-xs">⌘</span>K
//           </kbd>
//         )}
//         {search && (
//           <button
//             className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-md px-1.5 py-0.5 transition-colors"
//             onClick={() => setSearch('')}
//           >
//             Clear
//           </button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           {/* Topic Cards - with gradient section header */}
//           <div>
//             <div className="flex items-center gap-3 mb-4">
//               <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 px-3 py-1.5">
//                 <BookMarked className="size-3.5 text-emerald-600 dark:text-emerald-400" />
//                 <h3 className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Browse Topics</h3>
//               </div>
//               <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/20 to-transparent" />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {topics.map((topic, i) => {
//                 const Icon = topic.icon;
//                 return (
//                   <Card
//                     key={topic.title}
//                     className={cn(
//                       'cursor-pointer rounded-xl border-l-[3px] transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
//                       topicBorderColors[i],
//                     )}
//                     onClick={() => toast.info(`${topic.title} section would open`)}
//                   >
//                     <CardContent className="p-4 flex items-start gap-3">
//                       <div className={cn('flex size-10 items-center justify-center rounded-xl shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-200', topic.color)}>
//                         <Icon className="size-5" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-semibold text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{topic.title}</p>
//                         <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{topic.description}</p>
//                       </div>
//                       <div className="flex flex-col items-end gap-1 shrink-0">
//                         <Badge variant="secondary" className="text-[10px] font-semibold">{topic.articles} articles</Badge>
//                         <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           </div>

//           {/* User Guides - with gradient section header */}
//           <div>
//             <div className="flex items-center gap-3 mb-4">
//               <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5 px-3 py-1.5">
//                 <GraduationCap className="size-3.5 text-amber-600 dark:text-amber-400" />
//                 <h3 className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">User Guides</h3>
//               </div>
//               <div className="flex-1 h-px bg-gradient-to-r from-amber-500/20 to-transparent" />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {guides.map((guide) => {
//                 const Icon = guide.icon;
//                 return (
//                   <Card
//                     key={guide.title}
//                     className="cursor-pointer rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
//                     onClick={() => toast.info(`${guide.title} guide would open`)}
//                   >
//                     <CardContent className="p-4">
//                       <div className="flex items-start justify-between mb-2.5">
//                         <div className={cn('flex size-9 items-center justify-center rounded-lg bg-gradient-to-br text-emerald-700 dark:text-emerald-300 shrink-0 group-hover:scale-110 transition-transform duration-200', guide.gradient)}>
//                           <Icon className="size-4" />
//                         </div>
//                         <Badge variant="secondary" className="text-[10px] flex items-center gap-1 font-semibold">
//                           <Clock className="size-2.5" /> {guide.readTime}
//                         </Badge>
//                       </div>
//                       <p className="font-semibold text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{guide.title}</p>
//                       <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{guide.description}</p>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           </div>

//           {/* FAQ Accordion - with category sections and enhanced styling */}
//           <div>
//             <div className="flex items-center gap-3 mb-4">
//               <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-500/10 to-cyan-500/10 dark:from-teal-500/5 dark:to-cyan-500/5 px-3 py-1.5">
//                 <HelpCircle className="size-3.5 text-teal-600 dark:text-teal-400" />
//                 <h3 className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wider">Frequently Asked Questions</h3>
//               </div>
//               <div className="flex-1 h-px bg-gradient-to-r from-teal-500/20 to-transparent" />
//             </div>
//             <Card className="rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
//               <CardContent className="p-0">
//                 <Accordion type="single" collapsible className="w-full">
//                   {faqCategories.map((cat) => (
//                     <div key={cat.name}>
//                       <div className="px-5 pt-4 pb-2">
//                         <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-md">{cat.name}</span>
//                       </div>
//                       {cat.items.map((faqIdx) => (
//                         <AccordionItem key={faqIdx} value={`faq-${faqIdx}`} className="px-5 group">
//                           <AccordionTrigger className="text-sm font-medium hover:no-underline py-3.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 group-hover:pl-1">
//                             <span className="flex items-center gap-2">
//                               <Sparkles className="size-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
//                               {faqs[faqIdx].q}
//                             </span>
//                           </AccordionTrigger>
//                           <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed pl-7">
//                             {faqs[faqIdx].a}
//                           </AccordionContent>
//                         </AccordionItem>
//                       ))}
//                       <Separator className="mx-5" />
//                     </div>
//                   ))}
//                 </Accordion>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Contact Form CTA */}
//           <Card className="rounded-2xl overflow-hidden border-emerald-500/30 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-emerald-950/30">
//             <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
//             <CardContent className="p-6">
//               <div className="text-center mb-6">
//                 <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25 mx-auto mb-4">
//                   <Send className="size-6 text-white drop-shadow-sm" />
//                 </div>
//                 <h3 className="text-lg font-bold">Still have questions?</h3>
//                 <p className="text-sm text-muted-foreground mt-1">Can&apos;t find what you&apos;re looking for? Send us a message.</p>
//               </div>
//               <div className="space-y-3 max-w-md mx-auto">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <div>
//                     <Label className="text-xs text-muted-foreground">Name</Label>
//                     <Input placeholder="Your name" className="mt-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm" value={contactName} onChange={(e) => setContactName(e.target.value)} />
//                   </div>
//                   <div>
//                     <Label className="text-xs text-muted-foreground">Email</Label>
//                     <Input placeholder="you@email.com" type="email" className="mt-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="text-xs text-muted-foreground">Subject</Label>
//                   <div className="flex flex-wrap gap-1.5 mt-1.5">
//                     {contactSubjects.map((sub) => (
//                       <button
//                         key={sub}
//                         className={cn(
//                           'px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 border',
//                           contactSubject === sub
//                             ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
//                             : 'bg-white/60 dark:bg-gray-900/60 border-border hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20',
//                         )}
//                         onClick={() => setContactSubject(contactSubject === sub ? '' : sub)}
//                       >
//                         {sub}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="text-xs text-muted-foreground">Message</Label>
//                   <Textarea placeholder="Describe your issue or question..." className="mt-1 min-h-[80px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} />
//                 </div>
//                 <Button
//                   className="w-full bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all duration-200"
//                   disabled={sendingContact}
//                   onClick={() => {
//                     setSendingContact(true);
//                     setTimeout(() => {
//                       toast.success('Message sent! We\'ll get back to you soon.');
//                       setSendingContact(false);
//                       setContactName('');
//                       setContactEmail('');
//                       setContactSubject('');
//                       setContactMessage('');
//                     }, 1500);
//                   }}
//                 >
//                   <Send className="size-4 mr-2" /> {sendingContact ? 'Sending...' : 'Send Message'}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Video Tutorials */}
//           <Card className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-semibold flex items-center gap-2">
//                 <div className="flex size-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
//                   <Play className="size-4" />
//                 </div>
//                 Video Tutorials
//                 <Badge variant="secondary" className="text-[10px] ml-auto font-semibold">{videoTutorials.length} videos</Badge>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               {videoTutorials.map((v, i) => (
//                 <button key={i} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-200 text-left group" onClick={() => toast.info(`Playing: ${v.title}`)}>
//                   <div className="relative flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 shrink-0 group-hover:shadow-sm group-hover:scale-105 transition-all duration-200">
//                     <Play className="size-4 fill-current" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium truncate group-hover:text-emerald-600 transition-colors">{v.title}</p>
//                     <Badge variant="secondary" className="text-[10px] mt-0.5 font-semibold">{v.duration}</Badge>
//                   </div>
//                   <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
//                 </button>
//               ))}
//             </CardContent>
//           </Card>

//           {/* Support Options */}
//           <Card className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-semibold flex items-center gap-2">
//                 <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
//                   <Headphones className="size-4" />
//                 </div>
//                 Support Options
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               {supportOptions.map((option) => {
//                 const Icon = option.icon;
//                 return (
//                   <button key={option.label} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/80 transition-all duration-200 text-left group hover:shadow-sm" onClick={() => toast.info(`${option.label} would open`)}>
//                     <div className="flex size-10 items-center justify-center rounded-xl bg-muted shrink-0 group-hover:scale-105 transition-transform duration-200">
//                       <Icon className="size-4 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2">
//                         <p className="text-sm font-medium">{option.label}</p>
//                         <div className={cn(
//                           'size-2 rounded-full shrink-0',
//                           option.available ? 'bg-emerald-500' : 'bg-amber-500',
//                         )} />
//                       </div>
//                       <p className="text-xs text-muted-foreground">{option.availability}</p>
//                     </div>
//                     <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
//                   </button>
//                 );
//               })}
//             </CardContent>
//           </Card>

//           {/* Community Stats */}
//           <Card className="rounded-2xl border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 overflow-hidden">
//             <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
//             <CardContent className="p-5">
//               <div className="flex items-center gap-2 mb-3">
//                 <Users className="size-4 text-emerald-600 dark:text-emerald-400" />
//                 <h4 className="font-semibold text-sm">Community</h4>
//               </div>
//               <div className="space-y-3">
//                 {[
//                   { label: 'Active Learners', value: '12.5K+' },
//                   { label: 'Exams Tracked', value: '85K+' },
//                   { label: 'Avg. Score Improvement', value: '+18%' },
//                 ].map((stat) => (
//                   <div key={stat.label} className="flex items-center justify-between">
//                     <span className="text-xs text-muted-foreground">{stat.label}</span>
//                     <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{stat.value}</span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';

import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const SUPPORT_EMAIL = 'yourmail@gmail.com';

export default function HelpCenterPage() {
  const [contactMessage, setContactMessage] = useState('');

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl overflow-hidden rounded-2xl border-emerald-500/30 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 shadow-lg dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-emerald-950/30">
        <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />

        <CardContent className="p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25">
              <MessageCircle className="size-6 text-white" />
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">Report an Issue</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Found a bug or facing a problem? Tell us what happened and we'll respond by email.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Label className="text-sm font-medium">Describe the issue</Label>
            <Textarea
              placeholder="Example: The dashboard crashes when I add a new exam..."
              className="min-h-[180px] resize-none bg-white/80 dark:bg-gray-900/80"
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
            />
          </div>

          <Button
            className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25"
            disabled={!contactMessage.trim()}
            onClick={() => {
              const subject = encodeURIComponent('Bug Report - Exam Journey Tracker');
              const body = encodeURIComponent(contactMessage.trim());

              window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
            }}
          >
            <Send className="mr-2 size-4" />
            Report Issue
          </Button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            This will open your default mail app.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}