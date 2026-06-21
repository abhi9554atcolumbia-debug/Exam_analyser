import {
  LayoutDashboard,
  History,
  CalendarClock,
  BarChart3,
  Grid3x3,
  PenLine,
  FileText,
  Target,
  Calendar,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Exam History", icon: History, path: "/history" },
  { label: "Upcoming Exams", icon: CalendarClock, path: "/upcoming" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Weakness Heatmap", icon: Grid3x3, path: "/weakness-heatmap" },
  { label: "Reflections", icon: PenLine, path: "/reflections" },
  { label: "Documents", icon: FileText, path: "/documents" },
  { label: "Goals & Plan", icon: Target, path: "/goals" },
  { label: "Calendar", icon: Calendar, path: "/calendar" },
  { label: "Profile", icon: User, path: "/profile" },
];

export const NAV_FOOTER_ITEMS = [
  { label: "Help & Support", icon: HelpCircle, path: "/help" },
  { label: "Logout", icon: LogOut, path: "/sign-out" },
];
