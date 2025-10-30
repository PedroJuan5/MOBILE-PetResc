import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { AxiosError } from '@/lib/axios';

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
      const token = await AsyncStorage.getItem('@PetResc:token');
      const storedUser = await AsyncStorage.getItem('@PetResc:user');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      setIsLoading(false);
    }
    loadUserFromStorage();
  }, []);

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const response = await api.post('./auth/login', {
      email,
        password,
      });

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