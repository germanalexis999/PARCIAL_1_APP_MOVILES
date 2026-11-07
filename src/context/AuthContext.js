import { useAuthStore } from '../store/authStore';

// Compatibilidad: el contexto fue reemplazado por el store global (Zustand).
export const useAuth = () => {
  const userSession = useAuthStore((s) => s.userSession);
  const signIn = useAuthStore((s) => s.signIn);
  const signOut = useAuthStore((s) => s.signOut);
  return { userSession, signIn, signOut };
};
