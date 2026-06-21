import { useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  BarChart3,
  Target,
  CalendarClock,
  X,
  ChevronDown,
  Filter,
  MoreVertical,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ProgressBar from "../components/ui/ProgressBar";
import { examHistoryStats, examHistory, examDetailPanel } from "../data/mockData";

const STAT_ICONS = [ClipboardList, CheckCircle2, BarChart3, Target, CalendarClock];
const STAT_COLORS = [
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-emerald-50", text: "text-emerald-600" },
  { bg: "bg-purple-50", text: "text-purple-600" },
  { bg: "bg-orange-50", text: "text-orange-600" },
  { bg: "bg-blue-50", text: "text-blue-600" },
];

const statusVariant = (status) => {
  if (status === "Qualified") return "success";
  if (status === "Not Qualified") return "danger";
  return "warning";
};

const groupByYear = (items) => {
  const groups = {};
  items.forEach((item) => {
    groups[item.year] = groups[item.year] || [];
    groups[item.year].push(item);
  });
  return groups;
};

export default function ExamHistory() {
  const [selected, setSelected] = useState(examDetailPanel);
  const [tab, setTab] = useState("Overview");
  const grouped = groupByYear(examHistory);
  const years = Object.keys(grouped).sort((a, b) => b - a);

  return (
    <AppLayout showSearch showAddExam>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Exam History</h2>
          <p className="text-sm text-gray-500">Review your past performance and reflections.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={Filter}>Filters</Button>
          <Button variant="secondary" size="sm">Sort by Date (Newest) <ChevronDown size={14} /></Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {examHistoryStats.map((stat, idx) => (
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
            <div className="text-xs mt-1 font-medium text-emerald-600">{stat.change}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-6">
          {years.map((year) => (
            <div key={year}>
              <p className="text-xs font-semibold text-gray-400 mb-2">{year}</p>
              <div className="space-y-3">
                {grouped[year].map((exam) => (
                  <Card
                    key={exam.name + exam.date}
                    className="p-4 cursor-pointer hover:border-primary-200 transition-colors"
                    onClick={() => setSelected({ ...examDetailPanel, ...exam, examDate: exam.date, score: `${exam.score} / ${exam.maxScore}`, result: exam.status, cutoffGap: exam.gap, name: exam.name, org: exam.org })}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex gap-4">
                        <div className="text-sm text-gray-400 w-16 shrink-0">
                          <p className="font-semibold text-gray-700 text-base">{exam.date.split(" ")[0]}</p>
                          <p>{exam.date.split(" ").slice(1).join(" ")}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="indigo">{exam.category}</Badge>
                            <Badge variant="neutral">{exam.stage}</Badge>
                          </div>
                          <p className="font-semibold text-gray-800">{exam.name}</p>
                          <p className="text-xs text-gray-400">{exam.org}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {exam.score} <span className="text-xs text-gray-400 font-normal">/ {exam.maxScore}</span>
                        </p>
                        <p className="text-xs text-gray-400">Cutoff: {exam.cutoff}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                        <Badge variant={statusVariant(exam.status)}>{exam.status}</Badge>
                        <span className={`text-xs font-medium ${exam.gap.startsWith("+") ? "text-emerald-600" : exam.gap.startsWith("-") ? "text-red-500" : "text-amber-600"}`}>
                          {exam.gap}
                        </span>
                        {exam.reflection && <span className="text-xs text-gray-400">📝 Reflection Added</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-xs font-medium bg-primary-600 text-white px-3 py-1.5 rounded-lg">Open Entry</button>
                        <MoreVertical size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
          <button className="w-full border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Load More Exams
          </button>
        </div>

        {/* Detail panel */}
        <Card className="p-4 h-fit xl:sticky xl:top-20">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="indigo">{selected.category}</Badge>
              <Badge variant="neutral">{selected.stage}</Badge>
            </div>
            <X size={16} className="text-gray-400 cursor-pointer" onClick={() => setSelected(examDetailPanel)} />
          </div>
          <p className="font-bold text-gray-900">{selected.name}</p>
          <p className="text-xs text-gray-400 mb-4">{selected.org}</p>

          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div>
              <p className="text-xs text-gray-400">Exam Date</p>
              <p className="font-medium text-gray-700">{selected.examDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Attempt</p>
              <p className="font-medium text-gray-700">{selected.attempt}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Score</p>
              <p className="font-medium text-gray-700">{selected.score}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Cutoff</p>
              <p className="font-medium text-gray-700">{selected.cutoff}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Cutoff Gap</p>
              <p className="font-medium text-emerald-600">{selected.cutoffGap}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Result</p>
              <Badge variant={statusVariant(selected.result)}>{selected.result}</Badge>
            </div>
            <div>
              <p className="text-xs text-gray-400">Rank</p>
              <p className="font-medium text-gray-700">{selected.rank}</p>
            </div>
          </div>

          <div className="flex gap-4 border-b border-gray-100 mb-3 text-sm">
            {["Overview", "Reflection", "Notes", "Docs"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-2 font-medium ${tab === t ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Overview" && selected.sectionalScores && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500">Sectional Scores</p>
              {selected.sectionalScores.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{s.label}</span>
                    <span className="text-gray-500">{s.score} / {s.max}</span>
                  </div>
                  <ProgressBar percent={(s.score / s.max) * 100} color="bg-emerald-500" />
                </div>
              ))}
            </div>
          )}

          {tab === "Reflection" && selected.reflectionSummary && (
            <div className="space-y-2 text-sm">
              <p className="text-xs font-semibold text-gray-500 mb-1">Reflection Summary</p>
              <p><span className="text-emerald-600 font-medium">✓ Strengths:</span> {selected.reflectionSummary.strengths}</p>
              <p><span className="text-red-500 font-medium">⚠ Weak Areas:</span> {selected.reflectionSummary.weakAreas}</p>
              <p><span className="text-amber-600 font-medium">✕ Top Mistakes:</span> {selected.reflectionSummary.topMistakes}</p>
              <p><span className="text-primary-600 font-medium">▸ Next Action Plan:</span> {selected.reflectionSummary.nextActionPlan}</p>
            </div>
          )}

          {tab === "Notes" && <p className="text-sm text-gray-400">No notes added yet.</p>}
          {tab === "Docs" && <p className="text-sm text-gray-400">No documents linked yet.</p>}

          <button className="w-full mt-4 bg-primary-50 text-primary-700 rounded-lg py-2 text-sm font-medium hover:bg-primary-100">
            View Full Reflection
          </button>
        </Card>
      </div>
    </AppLayout>
  );
}
