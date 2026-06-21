import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ExamHistory from "./pages/ExamHistory";
import UpcomingExams from "./pages/UpcomingExams";
import Analytics from "./pages/Analytics";
import WeaknessHeatmap from "./pages/WeaknessHeatmap";
import Reflections from "./pages/Reflections";
import Documents from "./pages/Documents";
import GoalsPlans from "./pages/GoalsPlans";
import CalendarPage from "./pages/Calendar";
import Profile from "./pages/Profile";
import HelpCenter from "./pages/HelpCenter";
import SignOut from "./pages/SignOut";
import UpgradePlan from "./pages/UpgradePlan";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/history" element={<ExamHistory />} />
      <Route path="/upcoming" element={<UpcomingExams />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/weakness-heatmap" element={<WeaknessHeatmap />} />
      <Route path="/reflections" element={<Reflections />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/goals" element={<GoalsPlans />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/sign-out" element={<SignOut />} />
      <Route path="/upgrade" element={<UpgradePlan />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}
