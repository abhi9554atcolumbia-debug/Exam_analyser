'use client';

import { useNavigationStore, type PageId } from '@/store/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import DashboardPage from '@/components/pages/DashboardPage';
import ExamHistoryPage from '@/components/pages/ExamHistoryPage';
import UpcomingExamsPage from '@/components/pages/UpcomingExamsPage';
import AnalyticsPage from '@/components/pages/AnalyticsPage';
import WeaknessHeatmapPage from '@/components/pages/WeaknessHeatmapPage';
import ReflectionsPage from '@/components/pages/ReflectionsPage';
import DocumentsPage from '@/components/pages/DocumentsPage';
import GoalsPage from '@/components/pages/GoalsPage';
import CalendarPage from '@/components/pages/CalendarPage';
import ProfilePage from '@/components/pages/ProfilePage';
import SettingsPage from '@/components/pages/SettingsPage';
import HelpCenterPage from '@/components/pages/HelpCenterPage';
import SignOutPage from '@/components/pages/SignOutPage';
import UpgradePlanPage from '@/components/pages/UpgradePlanPage';

const PAGE_COMPONENTS: Record<PageId, React.ComponentType> = {
  dashboard: DashboardPage,
  history: ExamHistoryPage,
  upcoming: UpcomingExamsPage,
  analytics: AnalyticsPage,
  'weakness-heatmap': WeaknessHeatmapPage,
  reflections: ReflectionsPage,
  documents: DocumentsPage,
  goals: GoalsPage,
  calendar: CalendarPage,
  profile: ProfilePage,
  settings: SettingsPage,
  help: HelpCenterPage,
  'sign-out': SignOutPage,
  upgrade: UpgradePlanPage,
};

export default function Home() {
  const { currentPage } = useNavigationStore();
  const PageComponent = PAGE_COMPONENTS[currentPage];

  return (
    <AppLayout>
      {PageComponent ? <PageComponent /> : null}
    </AppLayout>
  );
}