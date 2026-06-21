import { Link } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle2,
  BarChart3,
  Target,
  CalendarDays,
  Plus,
  CalendarPlus,
  Upload,
  PenLine,
  Eye,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import TrendLineChart from "../components/charts/TrendLineChart";
import {
  currentUser,
  dashboardStats,
  nextExam,
  scoreTrend,
  weakAreas,
  upcomingDeadlines,
  recentExams,
  smartInsights,
} from "../data/mockData";

const STAT_ICONS = [ClipboardList, CheckCircle2, BarChart3, Target];
const STAT_COLORS = [
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-emerald-50", text: "text-emerald-600" },
  { bg: "bg-purple-50", text: "text-purple-600" },
  { bg: "bg-orange-50", text: "text-orange-600" },
];

const statusVariant = (status) => {
  if (status === "Qualified") return "success";
  if (status === "Not Qualified") return "danger";
  return "warning";
};

const insightIcon = (icon) => {
  if (icon === "trend") return TrendingUp;
  if (icon === "target") return Target;
  return BookOpen;
};

export default function Dashboard() {
  return (
    <AppLayout showSearch={false}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hello, {currentUser.name.split(" ")[0]}! 👋</h2>
          <p className="text-sm text-gray-500">Here's your exam journey overview.</p>
        </div>
        <div className="text-xs text-gray-400 whitespace-nowrap">Last updated: Today, 10:30 AM</div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {dashboardStats.map((stat, idx) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${STAT_COLORS[idx].bg}`}>
                {(() => {
                  const Icon = STAT_ICONS[idx];
                  return <Icon size={18} className={STAT_COLORS[idx].text} />;
                })()}
              </div>
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className={`text-xs mt-1 font-medium flex items-center gap-1 ${stat.trend === "down" ? "text-red-500" : "text-emerald-600"}`}>
              {stat.trend === "down" ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
              {stat.change}
            </div>
          </Card>
        ))}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-50">
              <CalendarDays size={18} className="text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Next Exam</span>
          </div>
          <div className="text-base font-bold text-gray-900">{nextExam.name}</div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">{nextExam.date}</span>
            <Badge variant="info">{nextExam.daysLeft}</Badge>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Quick actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Plus size={16} className="text-primary-600" /> Add Exam
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <CalendarPlus size={16} className="text-emerald-600" /> Add Upcoming Exam
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Upload size={16} className="text-purple-600" /> Upload Scorecard
            <Badge variant="indigo" className="ml-1">NEW</Badge>
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <PenLine size={16} className="text-orange-600" /> Add Reflection
          </button>
        </div>
      </Card>

      {/* Score trend + weak areas + deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-4 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-800">Score Trend Across Attempts</p>
          </div>
          <TrendLineChart data={scoreTrend} height={200} />
          <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp size={14} /> Keep going! You've improved by 24% in the last 6 attempts.
          </p>
        </Card>

        <Card className="p-4 lg:col-span-1">
          <p className="text-sm font-semibold text-gray-800 mb-3">Weak Areas <span className="text-xs text-gray-400 font-normal">(Based on last 5 exams)</span></p>
          <div className="space-y-3">
            {weakAreas.map((w) => (
              <div key={w.subject} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-gray-700">{w.subject}</p>
                  <p className="text-xs text-gray-400">{w.suggestion}</p>
                </div>
                <span className={`text-sm font-semibold ${w.trend === "down" ? "text-red-500" : w.trend === "up" ? "text-emerald-600" : "text-gray-500"}`}>
                  {w.score}
                </span>
              </div>
            ))}
          </div>
          <Link to="/weakness-heatmap" className="text-xs text-primary-600 font-medium flex items-center gap-1 mt-3">
            View Detailed Heatmap <ArrowRight size={12} />
          </Link>
        </Card>

        <Card className="p-4 lg:col-span-1">
          <p className="text-sm font-semibold text-gray-800 mb-3">Upcoming Deadlines</p>
          <div className="space-y-3">
            {upcomingDeadlines.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-gray-700">{d.name}</p>
                  <p className="text-xs text-gray-400">{d.date} • Application: {d.status}</p>
                </div>
                <Badge variant="info">{d.daysLeft}</Badge>
              </div>
            ))}
          </div>
          <Link to="/upcoming" className="text-xs text-primary-600 font-medium flex items-center gap-1 mt-3">
            View All Upcoming <ArrowRight size={12} />
          </Link>
        </Card>
      </div>

      {/* Recent exams + insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-4 lg:col-span-2 overflow-x-auto">
          <p className="text-sm font-semibold text-gray-800 mb-3">Recent Exams</p>
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="py-2 font-medium">Exam Name</th>
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">Exam Type</th>
                <th className="py-2 font-medium">Score</th>
                <th className="py-2 font-medium">Cutoff</th>
                <th className="py-2 font-medium">Gap</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Stage</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {recentExams.map((e) => (
                <tr key={e.name} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 font-medium text-gray-800">{e.name}</td>
                  <td className="py-3 text-gray-500">{e.date}</td>
                  <td className="py-3 text-gray-500">{e.type}</td>
                  <td className="py-3 text-gray-700">{e.score}</td>
                  <td className="py-3 text-gray-500">{e.cutoff}</td>
                  <td className={`py-3 font-medium ${e.gap.startsWith("-") ? "text-red-500" : "text-emerald-600"}`}>{e.gap}</td>
                  <td className="py-3"><Badge variant={statusVariant(e.status)}>{e.status}</Badge></td>
                  <td className="py-3 text-gray-500">{e.stage}</td>
                  <td className="py-3 text-gray-400"><Eye size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/history" className="inline-block w-full text-center mt-3 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            View All Exam History
          </Link>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
            <Sparkles size={15} className="text-amber-500" /> Smart Insights
          </p>
          <div className="space-y-3">
            {smartInsights.map((insight, idx) => {
              const Icon = insightIcon(insight.icon);
              return (
                <div key={idx} className="flex items-start gap-2.5 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={14} className="text-primary-600" />
                  </div>
                  <p className="text-gray-600 leading-snug">{insight.text}</p>
                </div>
              );
            })}
          </div>
          <Link to="/analytics" className="block w-full text-center mt-4 bg-primary-50 text-primary-700 rounded-lg py-2 text-sm font-medium hover:bg-primary-100">
            View All Insights
          </Link>
        </Card>
      </div>
    </AppLayout>
  );
}
