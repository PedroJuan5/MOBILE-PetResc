import React, { createContext, useState, useContext, useEffect } from 'react';
<<<<<<< HEAD

// Tipos que definem o "contrato" dos nossos dados
interface Session { id: string; }
=======
import { useRouter, useSegments } from 'expo-router';
import { Href } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.56.1:3000'; 


interface Session {
  id: number;
  email: string;
  role: string;
}

>>>>>>> 86d25d2d54bf34f1ba775e5f31cc386a179aaca3
interface AuthContextData {
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}
<<<<<<< HEAD

// Cria o contexto com o contrato definido
=======
>>>>>>> 86d25d2d54bf34f1ba775e5f31cc386a179aaca3
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
<<<<<<< HEAD
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
=======
    async function loadUserFromStorage() {
      try {
        const token = await AsyncStorage.getItem('@AuthData:token');
        if (token) {
          
          const userJson = await AsyncStorage.getItem('@AuthData:user');
          if(userJson) {
            setSession(JSON.parse(userJson));
          }
        }
      } catch (e) {
       
      } finally {
        setIsLoading(false);
      }
    }

    loadUserFromStorage();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const inAppGroup = segments.length > 0 && segments[0] === '(app)';

    if (session && !inAppGroup) {
      router.replace('/(tabs)/home' as Href); 
    } else if (!session && inAppGroup) {
      router.replace('/' as Href); 
    }
  }, [session, segments, isLoading]);

const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSession(data.usuario);
        await AsyncStorage.setItem('@AuthData:token', data.token); 
        await AsyncStorage.setItem('@AuthData:user', JSON.stringify(data.usuario)); 
      } else {
        throw new Error(data.error || 'Credenciais inválidas.');
      }
    } catch (error) {
      console.error("Erro no signIn:", error);
      throw error; 
    }
  };

  const signOut = async () => {
>>>>>>> 86d25d2d54bf34f1ba775e5f31cc386a179aaca3
    setSession(null);
    await AsyncStorage.removeItem('@AuthData:token');
    await AsyncStorage.removeItem('@AuthData:user');
  };

  // Disponibiliza o estado e as funções para todo o app
  return (
    <AuthContext.Provider value={{ session, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}