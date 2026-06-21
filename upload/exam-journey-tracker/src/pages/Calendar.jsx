import { ChevronLeft, ChevronRight, Flame, TrendingUp } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import {
  calendarMonth,
  calendarDays,
  todaysSchedule,
  calendarUpcomingDeadlines,
  studyStreak,
  eventsAndReminders,
} from "../data/mockData";

const DOT_COLOR = {
  exam: "bg-blue-500",
  goal: "bg-emerald-500",
  deadline: "bg-orange-400",
  reflection: "bg-purple-500",
  reminder: "bg-red-400",
};

const buildGrid = () => {
  // June 2026 starts on Monday (index reference matches the screenshot layout)
  const daysInMonth = 30;
  const startOffset = 1; // Mon as first column with 1 leading blank
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

export default function CalendarPage() {
  const cells = buildGrid();
  const eventsByDay = Object.fromEntries(calendarDays.map((d) => [d.day, d.events]));

  return (
    <AppLayout showSearch={false} showAddExam={false}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Calendar</h2>
          <p className="text-sm text-gray-500">Plan your exams, goals and important dates.</p>
        </div>
        <button className="bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg">+ Add Event</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="p-4 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-800">{calendarMonth}</p>
            <div className="flex items-center gap-2">
              <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium bg-primary-600 text-white">Month</button>
              <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600">Week</button>
              <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600">Day</button>
              <ChevronLeft size={16} className="text-gray-400 ml-2" />
              <button className="text-xs font-medium text-gray-600">Today</button>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-7 text-xs text-gray-400 font-medium mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => (
              <div
                key={idx}
                className={`min-h-[72px] border border-gray-50 rounded-md p-1.5 text-xs ${day ? "bg-white" : "bg-gray-50/50"}`}
              >
                {day && (
                  <>
                    <span className="font-medium text-gray-600">{day}</span>
                    <div className="space-y-0.5 mt-1">
                      {(eventsByDay[day] || []).slice(0, 2).map((e, i) => (
                        <div key={i} className={`text-[10px] truncate rounded px-1 py-0.5 text-white ${DOT_COLOR[e.type]}`}>
                          {e.label}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Exams</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Goals</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> Deadlines</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Reflections</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Reminders</span>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-1">Today's Schedule</p>
            <p className="text-xs text-gray-400 mb-3">12 June 2026</p>
            <div className="space-y-3">
              {todaysSchedule.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm border-b border-gray-50 pb-2 last:border-0">
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${DOT_COLOR[s.type] || "bg-gray-300"}`} />
                  <div>
                    <p className="font-medium text-gray-700">{s.label}</p>
                    <p className="text-xs text-gray-400">{s.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              View Full Day
            </button>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-800">Upcoming Deadlines</p>
              <button className="text-xs text-primary-600 font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {calendarUpcomingDeadlines.map((d) => (
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-800">Events & Reminders</p>
            <button className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600">All Events</button>
          </div>
          <div className="space-y-3">
            {eventsAndReminders.map((e, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <div className="flex items-start gap-2">
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${DOT_COLOR[e.type]}`} />
                  <div>
                    <p className="font-medium text-gray-700">{e.label} <Badge variant="neutral" className="ml-1">{e.tag}</Badge></p>
                    <p className="text-xs text-gray-400">{e.desc} • {e.date}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{e.daysLeft}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 text-primary-600 text-sm font-medium">View All Events →</button>
        </Card>

        <div className="space-y-5">
          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5"><Flame size={15} className="text-orange-500" /> Study Streak</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-orange-500">{studyStreak.current} Days</span>
              <span className="text-xs text-gray-400">Current Streak</span>
            </div>
            <div className="flex gap-1.5 mb-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, idx) => (
                <div key={d} className="text-center flex-1">
                  <div className={`w-full h-6 rounded ${studyStreak.weekDots[idx] ? "bg-emerald-500" : "bg-gray-100"}`} />
                  <span className="text-[10px] text-gray-400">{d[0]}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Longest Streak: <strong className="text-gray-700">{studyStreak.longest} Days</strong></span>
              <span>Days Studied: <strong className="text-gray-700">{studyStreak.daysThisMonth}</strong></span>
            </div>
            <button className="w-full mt-3 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5">
              <TrendingUp size={14} /> View Study Stats
            </button>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Create Quick Event</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs">
              {["Exam", "Goal", "Reminder", "Deadline", "Reflection"].map((q) => (
                <button key={q} className="border border-gray-200 rounded-lg py-2.5 font-medium text-gray-600 hover:bg-gray-50">{q}</button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
