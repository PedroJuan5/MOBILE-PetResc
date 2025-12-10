import api from '@/lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  signOut(): void;
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function storageGet(key: string) {
    return Platform.OS === "web"
      ? localStorage.getItem(key)
      : AsyncStorage.getItem(key);
  }

  async function storageSet(key: string, value: string) {
    return Platform.OS === "web"
      ? localStorage.setItem(key, value)
      : AsyncStorage.setItem(key, value);
  }

  async function storageRemove(key: string) {
    return Platform.OS === "web"
      ? localStorage.removeItem(key)
      : AsyncStorage.removeItem(key);
  }

  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const token = await storageGet('@PetResc:token');
        const storedUser = await storageGet('@PetResc:user');

        if (token && storedUser) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          const response = await api.get('/auth/me');
          setUser(response.data);
        }
      } catch (e) {
        await storageRemove('@PetResc:token');
        await storageRemove('@PetResc:user');
      } finally {
        setIsLoading(false);
      }
    }

    loadUserFromStorage();
  }, []);

const signIn = async ({ email, cnpj, password, type }: SignInCredentials): Promise<User> => {
    const route = '/auth/login'; 

    const payload = { 
        email: email, 
        password: password 
    };

    try {
        const response = await api.post(route, payload);
        
        const { token, usuario } = response.data;

        // Validação de segurança
        if (type === 'ONG' && usuario.role !== 'ONG') {
             throw new Error("Esta conta não é de uma ONG.");
        }

        await storageSet('@PetResc:token', token);
        await storageSet('@PetResc:user', JSON.stringify(usuario));

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(usuario);
        
        return usuario; // <--- RETORNA O USUÁRIO LOGADO

    } catch (error) {
        throw error; 
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
