import api from '@/lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from "react-native";

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

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function storageGet(key: string) {
    if (Platform.OS === "web") return localStorage.getItem(key);
    return await AsyncStorage.getItem(key);
  }

  async function storageSet(key: string, value: string) {
    if (Platform.OS === "web") return localStorage.setItem(key, value);
    return await AsyncStorage.setItem(key, value);
  }

  async function storageRemove(key: string) {
    if (Platform.OS === "web") return localStorage.removeItem(key);
    return await AsyncStorage.removeItem(key);
  }

  useEffect(() => {
    async function loadUser() {
      const token = await storageGet('@PetResc:token');
      const storedUser = await storageGet('@PetResc:user');

      if (token && storedUser) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch {
          await storageRemove('@PetResc:token');
          await storageRemove('@PetResc:user');
        }
      }
      setIsLoading(false);
    }

    loadUser();
  }, []);

  const signIn = async ({ email, password }: SignInCredentials) => {
    const response = await api.post('/auth/login', { email, password });

    const { token, usuario } = response.data;

    await storageSet('@PetResc:token', token);
    await storageSet('@PetResc:user', JSON.stringify(usuario));

    setUser(usuario);
  };

  const signOut = async () => {
    await storageRemove('@PetResc:token');
    await storageRemove('@PetResc:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
