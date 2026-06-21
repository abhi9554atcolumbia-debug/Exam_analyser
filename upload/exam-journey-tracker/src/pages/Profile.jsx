import {
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Camera,
  Pencil,
  Star,
  Award,
  Plus,
  KeyRound,
  ShieldCheck,
  Download,
  CloudUpload,
  Trash2,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import {
  currentUser,
  myExamFocus,
  profileProgressSummary,
  profileAchievements,
  examInterests,
  studyPreferences,
} from "../data/mockData";

export default function Profile() {
  return (
    <AppLayout showSearch={false} showAddExam>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Profile</h2>
          <p className="text-sm text-gray-500">View and manage your profile information and preferences.</p>
        </div>
        <Button icon={Pencil}>Edit Profile</Button>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-full border border-gray-200" />
              <span className="absolute bottom-0 right-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white">
                <Camera size={12} />
              </span>
            </div>
            <div>
              <p className="font-bold text-gray-900">{currentUser.name}</p>
              <p className="text-sm text-gray-500">{currentUser.role}</p>
              <div className="space-y-1 mt-2 text-xs text-gray-500">
                <p className="flex items-center gap-1.5"><Mail size={12} /> {currentUser.email}</p>
                <p className="flex items-center gap-1.5"><Phone size={12} /> {currentUser.phone}</p>
                <p className="flex items-center gap-1.5"><MapPin size={12} /> {currentUser.location}</p>
                <p className="flex items-center gap-1.5"><CalendarDays size={12} /> Member since {currentUser.memberSince}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">🎯 My Exam Focus</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Primary Exam</span><Badge variant="indigo">{myExamFocus.primaryExam}</Badge></div>
              <div className="flex justify-between"><span className="text-gray-500">Secondary Exam</span><Badge variant="info">{myExamFocus.secondaryExam}</Badge></div>
              <div className="flex justify-between"><span className="text-gray-500">Target Year</span><span className="font-medium text-gray-700">{myExamFocus.targetYear}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Preparation Stage</span><Badge variant="warning">{myExamFocus.stage}</Badge></div>
              <div className="flex justify-between"><span className="text-gray-500">Preferred Language</span><span className="font-medium text-gray-700">{myExamFocus.language}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Study Time / Day</span><span className="font-medium text-gray-700">{myExamFocus.studyTime}</span></div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800 mb-2">Account Settings</p>
            {["Change Password", "Update Email", "Update Phone Number", "Manage Devices"].map((s) => (
              <button key={s} className="w-full flex items-center justify-between text-sm text-gray-600 border border-gray-100 rounded-lg px-3 py-2 hover:bg-gray-50">
                {s} <span className="text-gray-300">›</span>
              </button>
            ))}
            <button className="w-full flex items-center justify-between text-sm text-red-500 border border-red-100 rounded-lg px-3 py-2 hover:bg-red-50">
              Delete Account <span className="text-red-300">›</span>
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <p className="text-sm font-semibold text-gray-800 mb-4">📈 Progress Summary</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4">
          <div><p className="text-xs text-gray-400">Exams Tracked</p><p className="text-xl font-bold text-gray-900">{profileProgressSummary.examsTracked}</p></div>
          <div><p className="text-xs text-gray-400">Exams Attempted</p><p className="text-xl font-bold text-gray-900">{profileProgressSummary.examsAttempted}</p></div>
          <div><p className="text-xs text-gray-400">Exams Qualified</p><p className="text-xl font-bold text-gray-900">{profileProgressSummary.examsQualified}</p></div>
          <div><p className="text-xs text-gray-400">Average Score</p><p className="text-xl font-bold text-gray-900">{profileProgressSummary.averageScore}</p></div>
          <div><p className="text-xs text-gray-400">Best Score</p><p className="text-xl font-bold text-gray-900">{profileProgressSummary.bestScore}</p><p className="text-[11px] text-gray-400">{profileProgressSummary.bestScoreExam}</p></div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5"><Award size={15} className="text-amber-500" /> Achievements</p>
          <button className="text-xs text-primary-600 font-medium">View All</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {profileAchievements.map((a) => (
            <div key={a.label} className="border border-gray-100 rounded-lg p-3 text-center">
              <Star size={16} className="text-amber-400 mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-700 leading-snug">{a.label}</p>
              <p className="text-[11px] text-gray-400">{a.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-gray-800 mb-3">📑 Exam Interests</p>
          <div className="flex flex-wrap gap-2">
            {examInterests.map((e) => (
              <span key={e.label} className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700">
                {e.label} {e.tag === "Primary" && <Badge variant="success">Primary</Badge>}
                {e.tag === "Secondary" && <Badge variant="info">Secondary</Badge>}
              </span>
            ))}
            <button className="flex items-center gap-1 border border-dashed border-gray-300 rounded-full px-3 py-1.5 text-xs font-medium text-gray-500">
              <Plus size={13} /> Add Exam
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-gray-800 mb-3">🕐 Study Preferences</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><p className="text-xs text-gray-400">Preferred Study Time</p><p className="font-medium text-gray-700">{studyPreferences.preferredTime}</p></div>
            <div><p className="text-xs text-gray-400">Study Hours / Day</p><p className="font-medium text-gray-700">{studyPreferences.hoursPerDay}</p></div>
            <div><p className="text-xs text-gray-400">Preferred Learning Mode</p><p className="font-medium text-gray-700">{studyPreferences.learningMode}</p></div>
            <div><p className="text-xs text-gray-400">Weekend Study</p><p className="font-medium text-gray-700">{studyPreferences.weekendStudy}</p></div>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-gray-800 mb-3">Data & Backup</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button variant="secondary" icon={Download} className="w-full">Export</Button>
            <Button variant="secondary" icon={Download} className="w-full">Download</Button>
            <Button variant="secondary" icon={CloudUpload} className="w-full">Backup Now</Button>
            <Button variant="danger" icon={Trash2} className="w-full">Delete</Button>
          </div>
        </div>
      </Card>
    </AppLayout>
  );
}
