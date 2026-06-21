import { Target, CheckCircle2, AlertCircle, Gauge, CalendarDays, Flame, Lightbulb, MoreVertical } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import ProgressBar from "../components/ui/ProgressBar";
import {
  goalsStats,
  todaysFocus,
  activeGoals,
  completedGoals,
  goalUpcomingDeadlines,
  priorityGoals,
  studyStreak,
  goalSmartSuggestions,
} from "../data/mockData";

const STAT_ICONS = [Target, CheckCircle2, AlertCircle, Gauge, CalendarDays];
const STAT_COLORS = [
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-emerald-50", text: "text-emerald-600" },
  { bg: "bg-red-50", text: "text-red-500" },
  { bg: "bg-indigo-50", text: "text-indigo-600" },
  { bg: "bg-blue-50", text: "text-blue-600" },
];

const statusVariant = (status) => {
  if (status === "In Progress") return "info";
  if (status === "Overdue") return "danger";
  return "neutral";
};

const priorityVariant = (color) => {
  if (color === "red") return "danger";
  if (color === "amber") return "warning";
  return "neutral";
};

const progressColor = (status) => {
  if (status === "Overdue") return "bg-red-400";
  return "bg-primary-600";
};

export default function GoalsPlans() {
  return (
    <AppLayout showSearch={false}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Goals & Plans</h2>
          <p className="text-sm text-gray-500">Set goals, create plans and track your progress toward success.</p>
        </div>
        <div className="flex gap-2">
          <button className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white">Goal Templates</button>
          <button className="bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-medium">+ New Goal</button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {goalsStats.map((stat, idx) => (
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
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-50">
              <CalendarDays size={18} className="text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Next Goal Due</span>
          </div>
          <div className="text-base font-bold text-gray-900">Today</div>
          <div className="text-xs mt-1 text-gray-400">Quant Mock Test 2</div>
        </Card>
      </div>

      <Card className="p-4 border-l-4 border-l-primary-500 bg-primary-50/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Target size={18} className="text-primary-600" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Today's Focus</p>
              <p className="font-semibold text-gray-800">{todaysFocus.title}</p>
              <p className="text-xs text-gray-400">Linked Exam: {todaysFocus.linkedExam} • Due Today</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">{todaysFocus.percent}% Completed</p>
              <p className="text-sm font-semibold text-gray-700">{todaysFocus.progress}</p>
            </div>
            <button className="bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg">Mark Complete</button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Active Goals ({activeGoals.length})</p>
          </div>
          {activeGoals.map((goal) => (
            <Card key={goal.title} className={`p-4 border-l-4 ${goal.priorityColor === "red" ? "border-l-red-400" : goal.priorityColor === "amber" ? "border-l-orange-400" : "border-l-gray-300"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-800">{goal.title}</p>
                    <Badge variant={priorityVariant(goal.priorityColor)}>{goal.priority}</Badge>
                  </div>
                  <p className="text-xs text-gray-400">Linked Exam: {goal.linkedExam}</p>
                  <p className="text-xs text-gray-400">Subject: {goal.subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Due Date</p>
                  <p className="text-sm font-medium text-gray-700">{goal.due}</p>
                  <Badge variant={statusVariant(goal.status)} className="mt-1">{goal.status}</Badge>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-gray-700">{goal.progress}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar percent={goal.percent} color={progressColor(goal.status)} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-9 text-right">{goal.percent}%</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-3">
                <button className="text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600">View Details</button>
                <MoreVertical size={16} className="text-gray-400" />
              </div>
            </Card>
          ))}

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-800">Completed Goals <span className="text-xs text-gray-400 font-normal">(Recent)</span></p>
              <button className="text-xs text-primary-600 font-medium">View All</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {completedGoals.map((g) => (
                <div key={g.title} className="border border-gray-100 rounded-lg p-3 text-center">
                  <CheckCircle2 size={16} className="text-emerald-500 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-700 leading-snug">{g.title}</p>
                  <p className="text-[11px] text-gray-400 mt-1">Completed on<br />{g.date}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-800">Upcoming Deadlines</p>
              <button className="text-xs text-primary-600 font-medium">View Calendar</button>
            </div>
            <div className="space-y-3">
              {goalUpcomingDeadlines.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-700">{d.name}</p>
                    <p className="text-xs text-gray-400">{d.date}</p>
                  </div>
                  <Badge variant="warning">{d.daysLeft}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Priority Goals</p>
            <div className="space-y-3">
              {priorityGoals.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-700">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.due}</p>
                  </div>
                  <Badge variant={p.level === "High" ? "danger" : "warning"}>{p.level}</Badge>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-primary-600 text-sm font-medium">View All Goals →</button>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5"><Flame size={15} className="text-orange-500" /> Goal Streak</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-orange-500">{studyStreak.current} Day Streak</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">Keep it up! You're doing great.</p>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Longest Streak:</span><span className="font-medium text-gray-700">{studyStreak.longest} Days</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Goals Completed This Month:</span><span className="font-medium text-gray-700">4</span>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5"><Lightbulb size={15} className="text-amber-500" /> Smart Suggestions</p>
            <div className="space-y-2 text-sm text-gray-600">
              {goalSmartSuggestions.map((s, idx) => (
                <p key={idx} className="border-b border-gray-50 pb-2 last:border-0 last:pb-0">{s}</p>
              ))}
            </div>
            <button className="w-full mt-3 text-primary-600 text-sm font-medium">View All Suggestions →</button>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
