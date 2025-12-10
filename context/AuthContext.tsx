import api from '@/lib/axios'; // Certifique-se que este caminho aponta para o seu arquivo Axios.ts
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from "react-native";

interface SignInCredentials {
  email?: string;
  cnpj?: string;
  password: string;
  type: 'PUBLICO' | 'ONG';
}

interface User {
  id: number;
  nome: string;
  email?: string;
  role: 'PUBLICO' | 'ONG' | 'ADMIN';
  publico?: any;
  ong?: any;
  admin?: any;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<User>;
  signOut(): Promise<void>;
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- FUNÇÕES DE STORAGE CORRIGIDAS ---
  // Agora usam SecureStore no mobile para bater com o seu Axios.ts

  async function storageGet(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  }

  async function storageSet(key: string, value: string) {
    if (Platform.OS === 'web') {
      return localStorage.setItem(key, value);
    }
    return await SecureStore.setItemAsync(key, value);
  }

  async function storageRemove(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.removeItem(key);
    }
    return await SecureStore.deleteItemAsync(key);
  }

  // -------------------------------------

  useEffect(() => {
    (async () => {
      try {
        const token = await storageGet('@PetResc:token');
        const storedUser = await storageGet('@PetResc:user');

        if (token && storedUser) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Opcional: Validar se o token ainda é válido chamando /me
          const response = await api.get('/auth/me');

          if (response?.data) {
            setUser(response.data);
          } else {
            // Se falhar, usa o usuário do cache temporariamente ou faz logout
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (e) {
        // Token inválido ou erro de rede
        await storageRemove('@PetResc:token');
        await storageRemove('@PetResc:user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = async ({ email, password, type }: SignInCredentials): Promise<User> => {
    const route = '/auth/login';

    await storageRemove('@PetResc:token');
    await storageRemove('@PetResc:user');
    setUser(null);

    try {
      const response = await api.post(route, { email, password });

      const { token, usuario } = response.data;

      if (type === 'ONG' && usuario.role !== 'ONG') {
        throw new Error('Esta conta não é de uma ONG.');
      }
      
      // Salva usando SecureStore (mobile) ou LocalStorage (web)
      await storageSet('@PetResc:token', token);
      await storageSet('@PetResc:user', JSON.stringify(usuario));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(usuario);
      return usuario;
    } catch (err) {
      throw err;
    }
  };

  const signOut = async () => {
    await storageRemove('@PetResc:token');
    await storageRemove('@PetResc:user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null); 
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};