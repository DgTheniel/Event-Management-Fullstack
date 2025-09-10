import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  currentInterface: 'public' | 'management';
  setCurrentInterface: (interfaceType: 'public' | 'management') => void;
  userPreferences: {
    theme: 'light' | 'dark';
    language: string;
  };
  setUserPreferences: (preferences: Partial<AppState['userPreferences']>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentInterface: 'public',
      setCurrentInterface: (interfaceType) => set({ currentInterface: interfaceType }),
      userPreferences: {
        theme: 'light',
        language: 'en',
      },
      setUserPreferences: (preferences) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences },
        })),
    }),
    {
      name: 'event-app-storage',
    }
  )
);
