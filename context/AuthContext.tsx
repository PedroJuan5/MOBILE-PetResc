import React, { createContext, useState, useContext, useEffect } from 'react';

// Tipos que definem o "contrato" dos nossos dados
interface Session { id: string; }
interface AuthContextData {
  session: Session | null;
  signIn: () => void;
  signOut: () => void;
  isLoading: boolean;
}

// Cria o contexto com o contrato definido
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Hook customizado para facilitar o uso do contexto em outras telas
export function useAuth() {
  return useContext(AuthContext);
}

// O componente "Provedor" que vai envolver todo o aplicativo
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // No futuro, aqui você pode adicionar a lógica para verificar
    // se existe um token de login salvo no celular.
    // Por enquanto, apenas finalizamos o carregamento.
    setIsLoading(false);
  }, []);

  const signIn = () => {
    // Simula um login bem-sucedido
    setSession({ id: '123' });
  };

  const signOut = () => {
    // Limpa a sessão para fazer o logout
    setSession(null);
  };

  // Disponibiliza o estado e as funções para todo o app
  return (
    <AuthContext.Provider value={{ session, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}