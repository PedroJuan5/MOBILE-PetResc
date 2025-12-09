import api, { AxiosError } from '@/lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SignInCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  nome: string;
  email: string;
  role: 'PUBLICO' | 'ONG' | 'ADMIN';
  publico?: any;
  ong?: any;
  admin?: any;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromStorage() {
      console.log('Auth: start loading user from storage');
      const safety = setTimeout(() => {
        console.log('Auth: safety timeout fired - forcing isLoading=false');
        setIsLoading(false);
      }, 500);

      try {
        const token = await AsyncStorage.getItem('@PetResc:token');
        const storedUser = await AsyncStorage.getItem('@PetResc:user');
        console.log('Auth: storage values', { hasToken: !!token, hasStoredUser: !!storedUser });

        if (token && storedUser) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          try {
            const response = await api.get('/api/auth/me');
            console.log('Auth: /api/auth/me response', response?.data ? 'ok' : 'no-data');
            setUser(response.data);
          } catch (e) {
            console.log('Auth: /api/auth/me failed', e);
            await AsyncStorage.removeItem('@PetResc:token');
            await AsyncStorage.removeItem('@PetResc:user');
          }
        }
      } catch (e) {
        console.log('Auth: loadUserFromStorage unexpected error', e);
      } finally {
        clearTimeout(safety);
        setIsLoading(false);
        console.log('Auth: finished loading, isLoading=false');
      }
    }
    loadUserFromStorage();
  }, []);

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      const { token, usuario } = response.data;

      await AsyncStorage.setItem('@PetResc:token', token);
      await AsyncStorage.setItem('@PetResc:user', JSON.stringify(usuario));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(usuario);

    } catch (error: any) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.error || 'Erro ao fazer login');
      }
      throw new Error('Não foi possível se conectar ao servidor.');
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('@PetResc:token');
    await AsyncStorage.removeItem('@PetResc:user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};