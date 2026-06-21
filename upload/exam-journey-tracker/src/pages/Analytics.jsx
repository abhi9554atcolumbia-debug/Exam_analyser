import {
  BarChart3,
  CheckCircle2,
  Target,
  TrendingUp,
  Star,
  Landmark,
  Clock,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import TrendLineChart from "../components/charts/TrendLineChart";
import SimpleBarChart from "../components/charts/SimpleBarChart";
import DonutChart from "../components/charts/DonutChart";
import {
  analyticsStats,
  analyticsScoreTrend,
  subjectPerformance,
  cutoffGapAnalysis,
  categoryPerformance,
  mistakeAnalysis,
  journeyTimeline,
  analyticsInsights,
} from "../data/mockData";

const STAT_ICONS = [BarChart3, CheckCircle2, Target, TrendingUp, Star];
const STAT_COLORS = [
  { bg: "bg-purple-50", text: "text-purple-600" },
  { bg: "bg-emerald-50", text: "text-emerald-600" },
  { bg: "bg-orange-50", text: "text-orange-600" },
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-amber-50", text: "text-amber-600" },
];

const insightIcon = (icon) => {
  if (icon === "trend") return TrendingUp;
  if (icon === "target") return Target;
  if (icon === "bank") return Landmark;
  return Clock;
};

export default function Analytics() {
  const bestCategory = categoryPerformance.reduce((a, b) => (a.score > b.score ? a : b));

  return (
    <AppLayout showSearch={false}>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500">Track your performance, identify strengths, and focus on what matters.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {analyticsStats.map((stat, idx) => (
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
            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs mt-1 font-medium text-emerald-600">{stat.change}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">Score Trend</p>
          <TrendLineChart data={analyticsScoreTrend} height={220} />
          <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp size={14} /> Consistent improvement! You've improved by 32% in the last 7 exams.
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-4">Subject Performance <span className="text-xs text-gray-400 font-normal">(Average Score)</span></p>
          <div className="space-y-4">
            {subjectPerformance.map((s) => (
              <div key={s.subject}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{s.subject}</span>
                  <span className="font-semibold text-gray-700">{s.score}%</span>
                </div>
                <ProgressBar percent={s.score} color={s.score >= 60 ? "bg-emerald-500" : s.score >= 40 ? "bg-amber-400" : "bg-red-400"} />
              </div>
            ))}
          </div>
          <button className="w-full mt-4 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            View Detailed Breakdown
          </button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">Cutoff Gap Analysis <span className="text-xs text-gray-400 font-normal">(Marks)</span></p>
          <SimpleBarChart data={cutoffGapAnalysis} dataKey="gap" xKey="exam" height={220} />
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Above Cutoff</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Below Cutoff</span>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">Exam Category Performance</p>
          <div className="flex items-center gap-6">
            <DonutChart
              data={categoryPerformance.map((c) => ({ ...c, value: c.score }))}
              centerLabel={`Best Category\n${bestCategory.category}`}
              centerValue={`${bestCategory.score}%`}
              height={180}
            />
            <div className="space-y-2 text-sm flex-1">
              {categoryPerformance.map((c) => (
                <div key={c.category} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} /> {c.category}
                  </span>
                  <span className="font-semibold text-gray-700">{c.score}%</span>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-4 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            View Category Insights
          </button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">Mistake Analysis <span className="text-xs text-gray-400 font-normal">(From Reflections)</span></p>
          <DonutChart
            data={mistakeAnalysis.map((m) => ({ ...m, value: m.count, category: m.type }))}
            centerLabel="Total Mistakes"
            centerValue={mistakeAnalysis.reduce((acc, m) => acc + m.count, 0)}
            height={170}
          />
          <div className="space-y-1.5 text-xs mt-2">
            {mistakeAnalysis.map((m) => (
              <div key={m.type} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} /> {m.type}
                </span>
                <span className="text-gray-500">{m.percent}% ({m.count})</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            View All Reflections
          </button>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">Journey Timeline</p>
          <div className="space-y-4">
            {journeyTimeline.map((j, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={`w-2.5 h-2.5 rounded-full ${j.status === "Qualified" ? "bg-emerald-500" : "bg-red-400"}`} />
                  {idx !== journeyTimeline.length - 1 && <span className="w-px flex-1 bg-gray-200 mt-1" />}
                </div>
                <div className="text-sm pb-3">
                  <p className="text-xs text-gray-400">{j.year} • {j.date}</p>
                  <p className="font-medium text-gray-700">{j.name}</p>
                  <p className={`text-xs font-medium ${j.status === "Qualified" ? "text-emerald-600" : "text-red-500"}`}>{j.status} • {j.score}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            View Full Journey
          </button>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">✨ AI Insights</p>
          <div className="space-y-3">
            {analyticsInsights.map((insight, idx) => {
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
          <button className="w-full mt-3 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            View All Insights
          </button>
        </Card>
      </div>
    </AppLayout>
  );
}
