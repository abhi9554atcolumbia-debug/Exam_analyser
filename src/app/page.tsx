'use client';

import { useNavigationStore, type PageId } from '@/store/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import dynamic from 'next/dynamic';

const DashboardPage = dynamic(() => import('@/components/pages/DashboardPage'), { ssr: false });
const ExamHistoryPage = dynamic(() => import('@/components/pages/ExamHistoryPage'), { ssr: false });
const UpcomingExamsPage = dynamic(() => import('@/components/pages/UpcomingExamsPage'), { ssr: false });
const AnalyticsPage = dynamic(() => import('@/components/pages/AnalyticsPage'), { ssr: false });
const WeaknessHeatmapPage = dynamic(() => import('@/components/pages/WeaknessHeatmapPage'), { ssr: false });
const ReflectionsPage = dynamic(() => import('@/components/pages/ReflectionsPage'), { ssr: false });
const DocumentsPage = dynamic(() => import('@/components/pages/DocumentsPage'), { ssr: false });
const GoalsPage = dynamic(() => import('@/components/pages/GoalsPage'), { ssr: false });
const CalendarPage = dynamic(() => import('@/components/pages/CalendarPage'), { ssr: false });
const JournalPage = dynamic(() => import('@/components/pages/JournalPage'), { ssr: false });
const ProfilePage = dynamic(() => import('@/components/pages/ProfilePage'), { ssr: false });
const SettingsPage = dynamic(() => import('@/components/pages/SettingsPage'), { ssr: false });
const HelpCenterPage = dynamic(() => import('@/components/pages/HelpCenterPage'), { ssr: false });
const SignOutPage = dynamic(() => import('@/components/pages/SignOutPage'), { ssr: false });
const UpgradePlanPage = dynamic(() => import('@/components/pages/UpgradePlanPage'), { ssr: false });

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
  journal: JournalPage,
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