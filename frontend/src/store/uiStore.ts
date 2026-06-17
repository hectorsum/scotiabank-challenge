import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface UIStore {
  sidebarOpen: boolean;
  notification: Notification | null;
  toggleSidebar: () => void;
  showNotification: (type: Notification['type'], message: string) => void;
  hideNotification: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  notification: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  showNotification: (type, message) =>
    set({ notification: { id: Date.now().toString(), type, message } }),
  hideNotification: () =>
    set({ notification: null }),
}));

export default useUIStore;
