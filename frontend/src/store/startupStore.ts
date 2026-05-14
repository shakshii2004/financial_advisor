import { create } from 'zustand';
import type { Startup } from '../types/schema';

interface StartupState {
  startups: Startup[];
  currentStartup: Startup | null;
  isLoading: boolean;
  setStartups: (startups: Startup[]) => void;
  setCurrentStartup: (startup: Startup | null) => void;
  setLoading: (loading: boolean) => void;
  addStartup: (startup: Startup) => void;
  updateStartup: (startup: Startup) => void;
  deleteStartup: (id: number) => void;
}

export const useStartupStore = create<StartupState>((set) => ({
  startups: [],
  currentStartup: null,
  isLoading: false,
  
  setStartups: (startups) => set({ startups }),
  setCurrentStartup: (startup) => set({ currentStartup: startup }),
  setLoading: (loading) => set({ isLoading: loading }),
  
  addStartup: (startup) =>
    set((state) => ({
      startups: [...state.startups, startup],
    })),
  
  updateStartup: (startup) =>
    set((state) => ({
      startups: state.startups.map((s) =>
        s.id === startup.id ? startup : s
      ),
      currentStartup:
        state.currentStartup?.id === startup.id
          ? startup
          : state.currentStartup,
    })),
  
  deleteStartup: (id) =>
    set((state) => ({
      startups: state.startups.filter((s) => s.id !== id),
      currentStartup:
        state.currentStartup?.id === id ? null : state.currentStartup,
    })),
}));
