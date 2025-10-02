import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Href } from 'expo-router';

// Define o "formato" dos nossos dados para o TypeScript
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
    // Aqui é onde, no futuro, você verificaria se o usuário já tem um login salvo no celular
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const inAppGroup = segments.length > 0 && segments[0] === '(app)';

    if (session && !inAppGroup) {
      // Se o usuário está LOGADO e NÃO está na área privada, nós o levamos para a home.
      router.replace('/home' as Href); 
    } else if (!session && inAppGroup) {
      // Se o usuário NÃO está logado e TENTA acessar a área privada, nós o levamos para a tela de entrada.
      router.replace('/' as Href); 
    }
  }, [session, segments, isLoading]);

  // Função para simular o login
  const signIn = () => {
    setSession({ id: '123' });
    router.replace('/home' as Href);
  };

  // Função para fazer o logout
  const signOut = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}