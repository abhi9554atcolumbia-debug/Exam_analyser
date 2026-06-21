import { useState } from "react";
import {
  Search,
  Settings2,
  CalendarPlus,
  Target,
  PenLine,
  Sliders,
  ChevronDown,
  PlayCircle,
  MessageCircle,
  Mail,
  Ticket,
  Phone,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  helpTopics,
  popularArticles,
  userGuides,
  faqs,
  videoTutorials,
} from "../data/mockData";

const TOPIC_ICONS = [Settings2, CalendarPlus, Target, PenLine, Sliders];
const TOPIC_COLORS = [
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-emerald-50", text: "text-emerald-600" },
  { bg: "bg-orange-50", text: "text-orange-600" },
  { bg: "bg-purple-50", text: "text-purple-600" },
  { bg: "bg-red-50", text: "text-red-600" },
];

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <AppLayout showSearch={false} showAddExam={false}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Help Center</h2>
          <p className="text-sm text-gray-500">Find answers, learn how to use the app, and get the support you need.</p>
        </div>
        <Button>Contact Support</Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <Card className="p-4">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 mb-4">
              <Search size={16} className="text-gray-400" />
              <input placeholder="Search for help articles, topics or keywords..." className="bg-transparent text-sm outline-none w-full" />
            </div>

            <p className="text-sm font-semibold text-gray-800 mb-3">How can we help you today?</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {helpTopics.map((t, idx) => (
                <div key={t.label} className="border border-gray-100 rounded-lg p-3 text-center hover:border-primary-200 cursor-pointer">
                  <div className={`w-9 h-9 rounded-lg mx-auto mb-2 flex items-center justify-center ${TOPIC_COLORS[idx].bg}`}>
                    {(() => {
                      const Icon = TOPIC_ICONS[idx];
                      return <Icon size={16} className={TOPIC_COLORS[idx].text} />;
                    })()}
                  </div>
                  <p className="text-xs font-semibold text-gray-700">{t.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{t.desc}</p>
                  <button className="text-[11px] text-primary-600 font-medium mt-1.5">View Articles →</button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-1">User Guides</p>
            <p className="text-xs text-gray-400 mb-3">Step-by-step guides to help you make the most of Exam Journey Tracker.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userGuides.map((g) => (
                <div key={g.label} className="border border-gray-100 rounded-lg p-3 hover:border-primary-200 cursor-pointer">
                  <p className="text-sm font-medium text-gray-700">{g.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 mb-2">{g.desc}</p>
                  <span className="text-[11px] text-gray-400">⏱ {g.time}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              View All Guides
            </button>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Frequently Asked Questions</p>
            <div className="space-y-1">
              {faqs.map((q, idx) => (
                <div key={q} className="border-b border-gray-50 last:border-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between py-3 text-sm text-gray-700 text-left"
                  >
                    {q}
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === idx && (
                    <p className="text-xs text-gray-500 pb-3">
                      You can manage this from the relevant section in the app. If you need more help, reach out to our support team below.
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-primary-600 text-sm font-medium">View All FAQs →</button>
          </Card>

          <Card className="p-5 flex flex-wrap items-center justify-between gap-4 bg-primary-50/40">
            <div>
              <p className="text-sm font-semibold text-gray-800">Still have questions?</p>
              <p className="text-xs text-gray-500">Our support team is here to help you.</p>
            </div>
            <Button icon={MessageCircle}>Contact Support</Button>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Popular Articles</p>
            <div className="space-y-3">
              {popularArticles.map((a) => (
                <div key={a.label} className="text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                  <p className="font-medium text-gray-700">{a.label}</p>
                  <p className="text-xs text-gray-400">{a.sub}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Video Tutorials</p>
            <div className="space-y-2">
              {videoTutorials.map((v) => (
                <div key={v.label} className="flex items-center gap-3">
                  <div className="w-12 h-9 bg-gray-900 rounded-md flex items-center justify-center text-white shrink-0">
                    <PlayCircle size={18} />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-700 leading-snug">{v.label}</p>
                    <p className="text-xs text-gray-400">{v.duration}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-primary-600 text-sm font-medium">View All Videos →</button>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-1">Still Need Help?</p>
            <p className="text-xs text-gray-400 mb-3">Can't find what you're looking for? Reach out to our support team.</p>
            <div className="space-y-2 text-sm">
              <button className="w-full flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2 hover:bg-gray-50"><MessageCircle size={15} className="text-primary-600" /> Live Chat</button>
              <button className="w-full flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2 hover:bg-gray-50"><Mail size={15} className="text-primary-600" /> Email Support</button>
              <button className="w-full flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2 hover:bg-gray-50"><Ticket size={15} className="text-primary-600" /> Submit a Ticket</button>
              <button className="w-full flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2 hover:bg-gray-50"><Phone size={15} className="text-primary-600" /> Call Us</button>
            </div>
            <p className="text-[11px] text-gray-400 mt-3">Available Mon - Sat, 9 AM - 7 PM</p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
