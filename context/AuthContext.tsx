import React, { createContext, useState, useContext, useEffect } from 'react';

// Tipos
interface Session { id: string; }
interface AuthContextData {
  session: Session | null;
  signIn: () => void;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // No futuro, aqui você verificaria um token salvo no celular
    setIsLoading(false);
  }, []);

  const signIn = () => { setSession({ id: '123' }); };
  const signOut = () => { setSession(null); };

  return (
    <AuthContext.Provider value={{ session, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}