import { create } from 'zustand';

export type PageId =
  | 'dashboard'
  | 'history'
  | 'upcoming'
  | 'analytics'
  | 'weakness-heatmap'
  | 'reflections'
  | 'documents'
  | 'goals'
  | 'calendar'
  | 'profile'
  | 'help'
  | 'sign-out'
  | 'upgrade'
  | 'settings';

export interface NavigationState {
  currentPage: PageId;
  previousPage: PageId | null;
  navigate: (page: PageId) => void;
  goBack: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  commandSearchOpen: boolean;
  setCommandSearchOpen: (open: boolean) => void;
  toggleCommandSearch: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: 'dashboard',
  previousPage: null,
  navigate: (page) =>
    set((state) => ({
      previousPage: state.currentPage,
      currentPage: page,
      sidebarOpen: false,
    })),
  goBack: () =>
    set((state) => {
      if (state.previousPage) {
        const prev = state.previousPage;
        return {
          currentPage: prev,
          previousPage: state.currentPage,
        };
      }
      return state;
    }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  commandSearchOpen: false,
  setCommandSearchOpen: (open) => set({ commandSearchOpen: open }),
  toggleCommandSearch: () => set((state) => ({ commandSearchOpen: !state.commandSearchOpen })),
}));