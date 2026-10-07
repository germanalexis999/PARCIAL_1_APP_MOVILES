import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  userSession: null,
  signIn: () => {},
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);
