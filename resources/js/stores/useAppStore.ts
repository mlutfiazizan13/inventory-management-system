import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';

interface AppState {
  // Auth state (synced with Inertia)
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timestamp: number;
  }>;
  
  // Loading states
  globalLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        sidebarOpen: true,
        theme: 'light',
        notifications: [],
        globalLoading: false,
        
        // Actions
        setUser: (user) => set({ 
          user, 
          isAuthenticated: !!user 
        }),
        
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        
        setTheme: (theme) => set({ theme }),
        
        addNotification: (message, type) => {
          const id = Date.now().toString() + Math.random();
          set((state) => ({
            notifications: [...state.notifications, {
              id,
              message,
              type,
              timestamp: Date.now(),
            }]
          }));
          
          // Auto-remove after 5 seconds
          setTimeout(() => {
            get().removeNotification(id);
          }, 5000);
        },
        
        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        })),
        
        clearNotifications: () => set({ notifications: [] }),
        
        setGlobalLoading: (loading) => set({ globalLoading: loading }),
      }),
      {
        name: 'app-store',
        storage: createJSONStorage(() => localStorage),
        // Only persist UI preferences, not user data
        partialize: (state) => ({ 
          theme: state.theme, 
          sidebarOpen: state.sidebarOpen 
        }),
      }
    )
  )
);