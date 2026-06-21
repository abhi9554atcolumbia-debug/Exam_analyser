import { useState } from "react";
import {
  User,
  KeyRound,
  Link2,
  Trash2,
  Sun,
  Moon,
  Bell,
  CloudUpload,
  Download,
  Eraser,
  HelpCircle,
  MessageSquare,
  LogOut,
  Sparkles,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const NOTIFICATIONS = [
  { label: "Exam Date Reminders", desc: "Get reminders before your exam dates" },
  { label: "Application & Deadline Alerts", desc: "Stay updated about important deadlines" },
  { label: "Goal & Plan Reminders", desc: "Get reminded about your goals and study plans" },
  { label: "Reflection Reminders", desc: "Review your reflections with timely reminders" },
  { label: "Weekly Summary", desc: "Receive weekly progress summary" },
];

const ACCENT_COLORS = ["#4f46e5", "#a855f7", "#22c55e", "#f59e0b", "#ef4444"];

export default function Settings() {
  const [toggles, setToggles] = useState(Array(NOTIFICATIONS.length).fill(true));
  const [theme, setTheme] = useState("Light");
  const [accent, setAccent] = useState(ACCENT_COLORS[0]);
  const [privacyMode, setPrivacyMode] = useState(true);

  const toggle = (idx) =>
    setToggles((t) => t.map((v, i) => (i === idx ? !v : v)));

  return (
    <AppLayout showSearch={false} showAddExam={false}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-500">Manage your preferences, account, and app experience.</p>
        </div>
        <Button>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-1">Account Settings</p>
            <p className="text-xs text-gray-400 mb-3">Manage your personal account information.</p>
            <div className="space-y-2">
              {[
                { icon: User, label: "Personal Information", desc: "Update your name, email, phone and profile details" },
                { icon: KeyRound, label: "Change Password", desc: "Update your password regularly to keep your account secure" },
                { icon: Link2, label: "Linked Accounts", desc: "Manage accounts linked with Exam Journey Tracker" },
              ].map((item) => (
                <button key={item.label} className="w-full flex items-center justify-between border border-gray-100 rounded-lg px-3 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3 text-left">
                    <item.icon size={16} className="text-gray-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-gray-300">›</span>
                </button>
              ))}
              <button className="w-full flex items-center justify-between border border-red-100 rounded-lg px-3 py-3 hover:bg-red-50">
                <div className="flex items-center gap-3 text-left">
                  <Trash2 size={16} className="text-red-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-600">Delete Account</p>
                    <p className="text-xs text-gray-400">Permanently delete your account and all data</p>
                  </div>
                </div>
                <span className="text-red-300">›</span>
              </button>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-1">Notification Settings</p>
            <p className="text-xs text-gray-400 mb-3">Choose what you want to be notified about.</p>
            <div className="space-y-3">
              {NOTIFICATIONS.map((n, idx) => (
                <div key={n.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell size={15} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{n.label}</p>
                      <p className="text-xs text-gray-400">{n.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(idx)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors ${toggles[idx] ? "bg-primary-600" : "bg-gray-200"}`}
                  >
                    <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${toggles[idx] ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-700">Email Notifications</span>
              <button className="w-10 h-6 rounded-full p-0.5 bg-primary-600"><span className="block w-5 h-5 bg-white rounded-full translate-x-4" /></button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium text-gray-700">Push Notifications</span>
              <button className="w-10 h-6 rounded-full p-0.5 bg-primary-600"><span className="block w-5 h-5 bg-white rounded-full translate-x-4" /></button>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-1">App Preferences</p>
            <p className="text-xs text-gray-400 mb-3">Customize your app experience.</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-xs text-gray-500">Language</label>
                <select className="w-full border border-gray-200 rounded-lg p-2 mt-1 outline-none">
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Date Format</label>
                <select className="w-full border border-gray-200 rounded-lg p-2 mt-1 outline-none">
                  <option>DD MMM YYYY</option>
                  <option>MM/DD/YYYY</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Week Start Day</label>
                <select className="w-full border border-gray-200 rounded-lg p-2 mt-1 outline-none">
                  <option>Monday</option>
                  <option>Sunday</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Time Format</label>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs">
                  <button className="flex-1 py-2 bg-primary-600 text-white font-medium">12 Hour</button>
                  <button className="flex-1 py-2 text-gray-600">24 Hour</button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-1">Privacy & Data</p>
            <p className="text-xs text-gray-400 mb-3">Control your data and privacy settings.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Privacy Mode</p>
                  <p className="text-xs text-gray-400">Keep your profile and data private</p>
                </div>
                <button
                  onClick={() => setPrivacyMode((p) => !p)}
                  className={`w-10 h-6 rounded-full p-0.5 ${privacyMode ? "bg-primary-600" : "bg-gray-200"}`}
                >
                  <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${privacyMode ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Data Backup</p>
                  <p className="text-xs text-gray-400">Backup your data to secure your journey</p>
                </div>
                <Button size="sm" variant="secondary" icon={CloudUpload}>Backup Now</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Export Data</p>
                  <p className="text-xs text-gray-400">Download all your data and reports</p>
                </div>
                <Button size="sm" variant="secondary" icon={Download}>Export</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Clear Local Cache</p>
                  <p className="text-xs text-gray-400">Free up space by clearing temporary data</p>
                </div>
                <Button size="sm" variant="secondary" icon={Eraser}>Clear</Button>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-1">About & Support</p>
            <p className="text-xs text-gray-400 mb-3">App information and support resources.</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2"><span className="text-gray-700">About Exam Journey Tracker</span><span className="text-gray-400">Version 1.0.0</span></div>
              <button className="w-full flex items-center justify-between border-b border-gray-50 pb-2 text-gray-700">Terms of Service <span className="text-gray-300">›</span></button>
              <button className="w-full flex items-center justify-between text-gray-700">Privacy Policy <span className="text-gray-300">›</span></button>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-1">Appearance</p>
            <p className="text-xs text-gray-400 mb-3">Customize how the app looks.</p>
            <p className="text-xs text-gray-500 mb-2">Theme</p>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-4 text-sm">
              <button onClick={() => setTheme("Light")} className={`flex-1 py-2 flex items-center justify-center gap-1.5 ${theme === "Light" ? "bg-primary-600 text-white" : "text-gray-600"}`}>
                <Sun size={14} /> Light
              </button>
              <button onClick={() => setTheme("Dark")} className={`flex-1 py-2 flex items-center justify-center gap-1.5 ${theme === "Dark" ? "bg-primary-600 text-white" : "text-gray-600"}`}>
                <Moon size={14} /> Dark
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-2">Accent Color</p>
            <div className="flex gap-2">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setAccent(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full ${accent === c ? "ring-2 ring-offset-2 ring-gray-300" : ""}`}
                />
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">Notification Preview</p>
            <p className="text-xs text-gray-400 mb-3">This is how your notifications look.</p>
            <div className="flex items-start gap-2 border border-gray-100 rounded-lg p-3">
              <Bell size={16} className="text-primary-600 mt-0.5" />
              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-gray-700">Exam Reminder</p>
                  <span className="text-[10px] text-gray-400">10m ago</span>
                </div>
                <p className="text-xs text-gray-500">Your SSC CGL Tier 1 exam is in 5 days. All the best!</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Quick Links</p>
            <div className="space-y-2 text-sm">
              <button className="w-full flex items-center justify-between text-gray-700"><span className="flex items-center gap-2"><HelpCircle size={15} /> Help Center</span><span className="text-gray-300">›</span></button>
              <button className="w-full flex items-center justify-between text-gray-700"><span className="flex items-center gap-2"><MessageSquare size={15} /> Contact Support</span><span className="text-gray-300">›</span></button>
              <button className="w-full flex items-center justify-between text-gray-700"><span className="flex items-center gap-2"><Sparkles size={15} /> Feature Requests</span><span className="text-gray-300">›</span></button>
              <button className="w-full flex items-center justify-between text-gray-700"><span className="flex items-center gap-2"><Sparkles size={15} /> What's New</span><span className="text-gray-300">›</span></button>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Account Actions</p>
            <div className="space-y-2 text-sm">
              <button className="w-full flex items-center justify-between text-gray-700"><span>Log Out from All Devices</span><span className="text-gray-300">›</span></button>
              <button className="w-full flex items-center justify-between text-red-600"><span className="flex items-center gap-2"><LogOut size={15} /> Sign Out</span><span className="text-red-300">›</span></button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
