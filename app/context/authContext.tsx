import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Href } from 'expo-router/build/link/href';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Aqui você verificaria o AsyncStorage por um token salvo
    // Por enquanto, vamos começar como deslogado
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // MUDANÇA 1: Adicionamos uma verificação para garantir que 'segments' não está vazio
    const inAppGroup = segments.length > 0 && segments[0] === '(app)';

    if (session && !inAppGroup) {
      // MUDANÇA 2: Passamos a rota como um objeto para segurança de tipo
      router.replace('/(app)/(tabs)/' as Href);
    } else if (!session && inAppGroup) {
      // MUDANÇA 3: Passamos a rota como um objeto para segurança de tipo
      router.replace('/login' as Href);
    }
  }, [session, segments, isLoading]);

  const signIn = () => {
    setSession({ id: '123' });
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