'use client';

import { useState } from 'react';
import {
  HelpCircle, Search, BookOpen, Target, BrainCircuit, Settings, Mail,
  Phone, MessageCircle, Ticket, Play, Clock, ChevronRight, Sparkles,
  Headphones, FileText, BarChart3, ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const topics = [
  { title: 'Getting Started', description: 'Learn the basics of setting up your exam journey tracker', icon: Sparkles, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  { title: 'Exams & Entries', description: 'How to add, manage, and track your exam results', icon: FileText, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' },
  { title: 'Goals & Planning', description: 'Set goals, track progress, and build study streaks', icon: Target, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  { title: 'Reflections', description: 'Review past exams, identify patterns, and improve', icon: BrainCircuit, color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  { title: 'Account & Settings', description: 'Manage your profile, preferences, and data', icon: Settings, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
];

const guides = [
  { title: 'Setting Up Your First Exam', description: 'Learn how to add your first exam and start tracking progress', readTime: '3 min', icon: BookOpen },
  { title: 'Creating Effective Goals', description: 'Best practices for setting achievable study goals', readTime: '5 min', icon: Target },
  { title: 'Understanding Analytics', description: 'How to read your performance charts and insights', readTime: '4 min', icon: BarChart3 },
  { title: 'Using the Calendar', description: 'Plan your study schedule with the calendar view', readTime: '3 min', icon: ShieldCheck },
  { title: 'Managing Documents', description: 'Upload and organize your study materials', readTime: '2 min', icon: FileText },
  { title: 'Building Study Streaks', description: 'How to maintain consistency and track your streak', readTime: '4 min', icon: Sparkles },
];

const faqs = [
  { q: 'How do I add a new exam?', a: 'Go to the Exam History page and click the "Add Exam" button. Fill in the exam details including name, date, score, and sectional scores. You can also link reflections to exams for deeper analysis.' },
  { q: 'Can I track multiple exams at once?', a: 'Yes! You can track unlimited exams. Each exam can have its own reflections, goals, and documents. Use the Upcoming Exams page to manage exams you are preparing for.' },
  { q: 'How are smart insights generated?', a: 'Smart insights are based on your exam scores, reflection patterns, streak data, and goal progress. They are computed dynamically and updated as you add more data.' },
  { q: 'What is the weakness heatmap?', a: 'The weakness heatmap visualizes your weak areas across subjects and weakness types (time management, concept gaps, silly mistakes, etc.) based on reflection data.' },
  { q: 'Can I export my data?', a: 'Yes, go to Profile > Data & Backup section. You can export all your data, download it, or create a backup. This includes exams, reflections, goals, and documents.' },
  { q: 'Is my data secure?', a: 'Your data is stored locally and encrypted. Privacy mode is available in Settings to hide sensitive information. You can also clear local cache or delete your account at any time.' },
];

const videoTutorials = [
  { title: 'Getting Started Tour', duration: '5:30' },
  { title: 'Adding Your First Exam', duration: '3:15' },
  { title: 'Mastering Reflections', duration: '7:20' },
  { title: 'Analytics Deep Dive', duration: '6:45' },
];

const supportOptions = [
  { label: 'Live Chat', icon: MessageCircle, availability: 'Mon-Fri, 9 AM - 6 PM' },
  { label: 'Email Support', icon: Mail, availability: 'Response within 24h' },
  { label: 'Submit Ticket', icon: Ticket, availability: 'Track your issue' },
  { label: 'Call Us', icon: Phone, availability: 'Mon-Fri, 10 AM - 4 PM' },
];

export default function HelpCenterPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold">Help Center</h2>
        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.info('Support contact dialog would open')}>
          <Headphones className="size-4" /> Contact Support
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search for help articles, FAQs, and guides..."
          className="pl-10 h-11"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Topic Cards */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Browse Topics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <Card key={topic.title} className="cursor-pointer hover:border-emerald-500 transition-colors group" onClick={() => toast.info(`${topic.title} section would open`)}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className={cn('flex size-10 items-center justify-center rounded-lg shrink-0', topic.color)}>
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm group-hover:text-emerald-600 transition-colors">{topic.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{topic.description}</p>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* User Guides */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">User Guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {guides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <Card key={guide.title} className="cursor-pointer hover:border-emerald-500 transition-colors group" onClick={() => toast.info(`${guide.title} guide would open`)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Icon className="size-5 text-emerald-600" />
                        <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                          <Clock className="size-2.5" /> {guide.readTime}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm group-hover:text-emerald-600 transition-colors">{guide.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{guide.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Frequently Asked Questions</h3>
            <Card>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
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

          {/* Still have questions CTA */}
          <Card className="border-emerald-500/50 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
            <CardContent className="p-6 text-center">
              <HelpCircle className="size-10 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold">Still have questions?</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Can&apos;t find what you&apos;re looking for? Our support team is here to help.</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.info('Support contact dialog would open')}>
                <MessageCircle className="size-4 mr-2" /> Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Video Tutorials */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Play className="size-4 text-emerald-600" /> Video Tutorials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {videoTutorials.map((v, i) => (
                <button key={i} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left" onClick={() => toast.info(`Playing: ${v.title}`)}>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 shrink-0">
                    <Play className="size-3.5 fill-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{v.duration}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Support Options */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Headphones className="size-4 text-emerald-600" /> Support Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {supportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button key={option.label} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left" onClick={() => toast.info(`${option.label} would open`)}>
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted shrink-0">
                      <Icon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.availability}</p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
