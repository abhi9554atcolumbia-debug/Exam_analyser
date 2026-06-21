'use client';

import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar, MobileSidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandSearch } from '@/components/CommandSearch';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useNavigationStore } from '@/store/navigation';
import { useUserStore } from '@/store/user-store';
import { useQuery } from '@tanstack/react-query';
import { getUser, getNotifications } from '@/lib/api';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.2,
};

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { currentPage } = useNavigationStore();
  const setProfile = useUserStore((s) => s.setProfile);
  const setNotificationsCount = useUserStore((s) => s.setNotificationsCount);

  // Fetch real user profile from API
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUser,
    staleTime: 60_000,
  });

  // Fetch notification count
  const { data: notifications } = useQuery({
    queryKey: ['notifications-count'],
    queryFn: getNotifications,
    staleTime: 30_000,
  });

  // Sync user profile to store
  useEffect(() => {
    if (userProfile) {
      setProfile({
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        avatarUrl: userProfile.avatar,
        plan: userProfile.plan as 'free' | 'pro',
        joinedAt: userProfile.memberSince ?? '2024',
      });
    }
  }, [userProfile, setProfile]);

  // Sync notification count
  useEffect(() => {
    if (notifications) {
      setNotificationsCount(notifications.filter((n) => !n.isRead).length);
    }
  }, [notifications, setNotificationsCount]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar sheet */}
      <MobileSidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 pb-20 sm:pb-6">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="mx-auto w-full max-w-7xl"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>

      {/* Global Command Search Dialog */}
      <CommandSearch />
    </div>
  );
}