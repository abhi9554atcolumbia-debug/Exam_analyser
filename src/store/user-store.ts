import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  plan: 'free' | 'pro';
  joinedAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailReminders: boolean;
  defaultExamType: string;
  weekStartsOn: 'monday' | 'sunday';
}

export interface UserState {
  profile: UserProfile | null;
  settings: UserSettings | null;
  notificationsCount: number;
  setProfile: (profile: UserProfile | null) => void;
  setSettings: (settings: UserSettings | null) => void;
  setNotificationsCount: (count: number) => void;
  decrementNotifications: () => void;
  clearNotifications: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  settings: null,
  notificationsCount: 3,
  setProfile: (profile) => set({ profile }),
  setSettings: (settings) => set({ settings }),
  setNotificationsCount: (count) => set({ notificationsCount: count }),
  decrementNotifications: () =>
    set((state) => ({
      notificationsCount: Math.max(0, state.notificationsCount - 1),
    })),
  clearNotifications: () => set({ notificationsCount: 0 }),
}));