import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Href } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.56.1:3000'; 


interface Session {
  id: number;
  email: string;
  role: string;
}

interface AuthContextData {
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
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
    setSession(null);
    await AsyncStorage.removeItem('@AuthData:token');
    await AsyncStorage.removeItem('@AuthData:user');
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}