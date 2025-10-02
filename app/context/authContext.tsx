import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Href } from 'expo-router';

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
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // Esta é a linha em questão, escrita da forma mais segura e explícita possível.
    const inAppGroup = segments.length > 0 && segments[0] === '(app)';

    if (session && !inAppGroup) {
      router.replace('/home' as Href); 
    } else if (!session && inAppGroup) {
      router.replace('/' as Href); 
    }
  }, [session, segments, isLoading]);

  const signIn = () => {
    setSession({ id: '123' });
    router.replace('/home' as Href);
  };

  const signOut = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}