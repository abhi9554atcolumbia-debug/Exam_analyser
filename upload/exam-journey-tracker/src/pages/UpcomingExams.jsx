import { Landmark, FileText, Bell, ClipboardCheck, Download, MoreVertical, Lightbulb } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import {
  upcomingExamsOverview,
  applicationsOverview,
  upcomingExams,
  importantReminders,
} from "../data/mockData";

const priorityVariant = (priority) => {
  if (priority.includes("High")) return "danger";
  if (priority.includes("Medium")) return "warning";
  return "neutral";
};

const priorityBorder = (priority) => {
  if (priority.includes("High")) return "border-l-red-400";
  if (priority.includes("Medium")) return "border-l-orange-400";
  return "border-l-blue-300";
};

export default function UpcomingExams() {
  return (
    <AppLayout showSearch showAddExam>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Upcoming Exams</h2>
          <p className="text-sm text-gray-500">Track deadlines, applications, admit cards and never miss an important date.</p>
        </div>
      </div>

      {/* 60 day overview */}
      <Card className="p-4">
        <p className="text-sm font-semibold text-gray-800 mb-4">Next 60 Days Overview</p>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {upcomingExamsOverview.map((e, idx) => (
            <div key={e.name} className="flex flex-col items-center min-w-[140px] relative">
              <div className="flex items-center w-full">
                <div className={`flex-1 h-0.5 ${idx === 0 ? "bg-transparent" : "bg-gray-200"}`} />
                <div className={`w-3 h-3 rounded-full ${idx === 0 ? "bg-primary-600" : "bg-gray-300"}`} />
                <div className={`flex-1 h-0.5 ${idx === upcomingExamsOverview.length - 1 ? "bg-transparent" : "bg-gray-200"}`} />
              </div>
              <p className="text-xs font-semibold text-gray-700 mt-2 text-center">{e.name}</p>
              <p className="text-xs text-gray-400">{e.date}</p>
              <Badge variant="info" className="mt-1">{e.daysLeft} days left</Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 text-sm rounded-lg px-4 py-3">
            <span>🔔 Stay on track! Enable reminders to get notified about deadlines, admit cards and results.</span>
            <button className="text-xs font-semibold whitespace-nowrap ml-3">Manage Reminders</button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Upcoming Exams ({upcomingExams.length})</p>
          </div>

          {upcomingExams.map((exam) => (
            <Card key={exam.name} className={`p-4 border-l-4 ${priorityBorder(exam.priority)}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                    <Landmark size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800">{exam.name}</p>
                      <Badge variant={priorityVariant(exam.priority)}>{exam.priority}</Badge>
                    </div>
                    <p className="text-xs text-gray-400">{exam.org}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary-600">{exam.daysLeft}</div>
                  <p className="text-xs text-gray-400">Days Left</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                <div>
                  <p className="text-gray-400">Exam Date</p>
                  <p className="font-medium text-gray-700">{exam.examDate}</p>
                </div>
                <div>
                  <p className="text-gray-400">Admit Card</p>
                  <p className="font-medium text-gray-700">{exam.admitCard}</p>
                </div>
                <div className="flex items-center gap-1">
                  <ClipboardCheck size={13} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{exam.application}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText size={13} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{exam.reflection}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Bell size={13} /> {exam.reminder}
                  <Download size={13} className="ml-3" /> {exam.syllabus}
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-xs font-medium bg-primary-600 text-white px-3 py-1.5 rounded-lg">View Details</button>
                  <button className="text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600">
                    {exam.application === "Completed" ? "Admit Card" : exam.application === "In Progress" ? "Continue Form" : "Apply Now"}
                  </button>
                  <MoreVertical size={16} className="text-gray-400" />
                </div>
              </div>
            </Card>
          ))}

          <button className="w-full border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            View All Upcoming Exams
          </button>
        </div>

        <div className="space-y-5">
          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Applications Overview</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed</span>
                <span className="font-semibold">{applicationsOverview.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-orange-400" /> In Progress</span>
                <span className="font-semibold">{applicationsOverview.inProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-red-400" /> Not Started</span>
                <span className="font-semibold">{applicationsOverview.notStarted}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 text-sm">
              <span className="text-gray-500">Total Applications</span>
              <span className="font-bold">{applicationsOverview.total}</span>
            </div>
            <button className="w-full mt-3 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              View All Applications
            </button>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5"><Bell size={14} /> Important Reminders</p>
            <div className="space-y-3">
              {importantReminders.map((r) => (
                <div key={r.name} className="text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                  <p className="font-medium text-gray-700">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.text} • {r.date}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              View All Reminders
            </button>
          </Card>

          <Card className="p-4 bg-amber-50 border-amber-100">
            <p className="text-sm font-semibold text-amber-700 mb-1 flex items-center gap-1.5"><Lightbulb size={14} /> Pro Tip</p>
            <p className="text-xs text-amber-700/80">
              Enable reminders and add reflections after each exam to track your progress and improve consistently.
            </p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
