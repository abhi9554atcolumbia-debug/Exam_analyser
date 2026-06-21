import { Target, AlertTriangle, Building2, TrendingUp, Info, CheckCircle2 } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import DonutChart from "../components/charts/DonutChart";
import {
  weaknessSummary,
  weaknessHeatmapRows,
  weaknessByStage,
  weaknessByExam,
  topWeaknesses,
  recommendedActions,
} from "../data/mockData";

const STAT_ICONS = [Target, AlertTriangle, Building2, TrendingUp];
const STAT_COLORS = [
  { bg: "bg-red-50", text: "text-red-500" },
  { bg: "bg-orange-50", text: "text-orange-500" },
  { bg: "bg-amber-50", text: "text-amber-500" },
  { bg: "bg-emerald-50", text: "text-emerald-600" },
];

const heatColor = (value) => {
  if (value >= 70) return "bg-red-200 text-red-800";
  if (value >= 40) return "bg-amber-100 text-amber-800";
  if (value >= 20) return "bg-yellow-50 text-yellow-700";
  return "bg-emerald-50 text-emerald-700";
};

const columns = [
  { key: "timeManagement", label: "Time Management" },
  { key: "conceptGap", label: "Concept Gap" },
  { key: "sillyMistakes", label: "Silly Mistakes" },
  { key: "revisionGap", label: "Revision Gap" },
  { key: "calculationErrors", label: "Calculation Errors" },
  { key: "pressureHandling", label: "Pressure Handling" },
  { key: "guessing", label: "Guessing" },
  { key: "overall", label: "Overall Weakness" },
];

export default function WeaknessHeatmap() {
  return (
    <AppLayout showSearch={false}>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Weakness Heatmap</h2>
        <p className="text-sm text-gray-500">Identify your weak areas across subjects, mistakes, and exam stages.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {weaknessSummary.map((stat, idx) => (
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
            <div className="text-lg font-bold text-gray-900">{stat.value}</div>
            <Badge variant={idx === 3 ? "success" : "danger"} className="mt-1">{stat.sub}</Badge>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="p-4 xl:col-span-2 overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">Weakness Heatmap <Info size={13} className="text-gray-400" /></p>
          </div>
          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr>
                <th className="text-left py-2 font-medium text-gray-400">Subject</th>
                {columns.map((c) => (
                  <th key={c.key} className="py-2 font-medium text-gray-400 px-1">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weaknessHeatmapRows.map((row) => (
                <tr key={row.subject} className="border-t border-gray-50">
                  <td className="py-2 font-medium text-gray-700 whitespace-nowrap">{row.subject}</td>
                  {columns.map((c) => (
                    <td key={c.key} className="py-2 px-1">
                      <div className={`text-center rounded-md py-1.5 font-semibold ${heatColor(row[c.key])}`}>
                        {row[c.key]}%
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-200" /> Very Weak (70-100%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-100" /> Weak (40-69%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-yellow-50" /> Medium (20-39%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-50" /> Strong (0-19%)</span>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Insights</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Your weakest subject is General Awareness.</li>
              <li>• Time Management is affecting your performance the most.</li>
              <li>• You lose more marks in Mains compared to other stages.</li>
              <li className="text-emerald-600">✓ Focus on improving these areas to increase your score by up to 18%.</li>
            </ul>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Top 3 Weaknesses</p>
            <div className="space-y-3">
              {topWeaknesses.map((w) => (
                <div key={w.rank} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-red-500 text-xs font-bold flex items-center justify-center shrink-0">{w.rank}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{w.label}</p>
                    <p className="text-xs text-gray-400">{w.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Recommended Action</p>
            <div className="space-y-2">
              {recommendedActions.map((a, idx) => (
                <label key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={15} className="text-primary-500" /> {a}
                </label>
              ))}
            </div>
            <button className="w-full mt-3 text-primary-600 text-sm font-medium">View All Recommendations →</button>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">Weakness by Exam Stage</p>
          <div className="flex items-center gap-6">
            <DonutChart data={weaknessByStage.map((w) => ({ ...w, value: w.value, category: w.stage }))} centerLabel="Average Weakness Score" centerValue="" height={170} />
            <div className="space-y-1.5 text-xs flex-1">
              {weaknessByStage.map((w) => (
                <div key={w.stage} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: w.color }} /> {w.stage}
                  </span>
                  <span className="text-gray-500">{w.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-4 overflow-x-auto">
          <p className="text-sm font-semibold text-gray-800 mb-3">Weakness by Exams <span className="text-xs text-gray-400 font-normal">(Subject wise average score)</span></p>
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="py-2 font-medium">Exam</th>
                <th className="py-2 font-medium">Quant</th>
                <th className="py-2 font-medium">Reasoning</th>
                <th className="py-2 font-medium">English</th>
                <th className="py-2 font-medium">GA</th>
                <th className="py-2 font-medium">DI</th>
                <th className="py-2 font-medium">Overall Weakness</th>
              </tr>
            </thead>
            <tbody>
              {weaknessByExam.map((row) => (
                <tr key={row.exam} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 font-medium text-gray-700">{row.exam}</td>
                  <td className="py-3 text-gray-500">{row.quant}%</td>
                  <td className="py-3 text-gray-500">{row.reasoning}%</td>
                  <td className="py-3 text-gray-500">{row.english}%</td>
                  <td className="py-3 text-gray-500">{row.ga}%</td>
                  <td className="py-3 text-gray-500">{row.di}%</td>
                  <td className="py-3"><Badge variant="danger">{row.overall}%</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="w-full mt-3 text-primary-600 text-sm font-medium text-right">View Detailed Exam Analysis →</button>
        </Card>
      </div>
    </AppLayout>
  );
}
