'use client';

import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar, MobileSidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useNavigationStore } from '@/store/navigation';
import { useUserStore } from '@/store/user-store';

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

  // Set mock user data so the UI has something to render
  const setProfile = useUserStore((s) => s.setProfile);
  useEffect(() => {
    if (!useUserStore.getState().profile) {
      setProfile({
        id: '1',
        name: 'Alex Chen',
        email: 'alex@example.com',
        avatarUrl: null,
        plan: 'free',
        joinedAt: '2025-01-15',
      });
    }
  }, [setProfile]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar sheet */}
      <MobileSidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6">
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
        </main>
      </div>
    </div>
  );
}