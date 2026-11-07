import { create } from 'zustand';
import { getUserSession, clearUserSession } from '../services/storage';

export const useAuthStore = create((set) => ({
  userSession: null,
  loadingSession: true,
  signIn: (session) => set({ userSession: session }),
  signOut: () => set({ userSession: null }),
  restoreSession: async () => {
    try {
      const session = await getUserSession();
      set({ userSession: session, loadingSession: false });
    } catch (e) {
      set({ loadingSession: false });
    }
  },
  logout: async () => {
    await clearUserSession();
    set({ userSession: null });
  },
}));
