import api from '@/lib/axios';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from "react-native";

interface SignInCredentials {
  email?: string;
  cnpj?: string;
  password: string;
  type?: 'PUBLICO' | 'ONG';
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

  // --- DEFINIÇÃO DAS CHAVES (Sem caracteres especiais proibidos) ---
  const KEY_TOKEN = "petresc_token";
  const KEY_USER = "petresc_user";

  // --- FUNÇÕES DE STORAGE SEGURAS ---
  
  async function storageGet(key: string) {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("Erro no storageGet", error);
      return null;
    }
  }

  async function storageSet(key: string, value: string) {
    try {
        if (!value || typeof value !== 'string') {
        console.warn(`[AuthContext] Tentativa de salvar valor inválido para a chave: ${key}`, value);
        return; 
        }

        if (Platform.OS === 'web') {
        return localStorage.setItem(key, value);
        }
        return await SecureStore.setItemAsync(key, value);
    } catch (error) {
        console.error("Erro no storageSet", error);
    }
  }

  async function storageRemove(key: string) {
    try {
        if (Platform.OS === 'web') {
        return localStorage.removeItem(key);
        }
        return await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.error("Erro no storageRemove", error);
    }
  }

  // -------------------------------------

  useEffect(() => {
    (async () => {
      try {
        const token = await storageGet(KEY_TOKEN);
        const storedUser = await storageGet(KEY_USER);

        if (token && storedUser) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          try {
             setUser(JSON.parse(storedUser));
          } catch (e) {
             console.log("Erro ao ler usuário salvo");
          }
        }
      } catch (e) {
        console.log("Nenhum usuário salvo ou erro de storage");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = async ({ email, password, cnpj }: SignInCredentials): Promise<User> => {
    // Decide a rota com base se tem CNPJ ou Email
    const route = cnpj ? '/auth/login-ong' : '/auth/login';
    const payload = cnpj ? { cnpj, password } : { email, password };

    try {
      // Limpa dados antigos antes de tentar novo login
      await storageRemove(KEY_TOKEN);
      await storageRemove(KEY_USER);
      
      const response = await api.post(route, payload);

      const { token, usuario } = response.data;

      if (!token) {
        throw new Error("Erro no servidor: Token de acesso não recebido.");
      }

      // Salva token e usuário
      await storageSet(KEY_TOKEN, token);
      await storageSet(KEY_USER, JSON.stringify(usuario));

      // Atualiza o Axios para chamadas futuras
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(usuario);
      return usuario;

    } catch (err: any) {
      console.error("Erro no signIn:", err);
      // Se der erro, garante limpeza
      await storageRemove(KEY_TOKEN);
      await storageRemove(KEY_USER);
      setUser(null);
      throw err; 
    }
  };

  const signOut = async () => {
    try {
        await storageRemove(KEY_TOKEN);
        await storageRemove(KEY_USER);
        delete api.defaults.headers.common['Authorization'];
        setUser(null); 
    } catch (error) {
        console.error("Erro ao sair:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};