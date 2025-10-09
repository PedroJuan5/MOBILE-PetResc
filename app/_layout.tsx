import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Este componente é o "Porteiro" real
function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAppGroup = segments[0] === '(app)';

    if (session && !inAppGroup) {
      //se logado e não está na área privada, redireciona para a home privada
      router.replace('/(app)/(tabs)/home');
    } else if (!session && inAppGroup) {
      // se deslogado e tentando acessar a área privada, redireciona para a home pública
      router.replace('/');
    }
  }, [session, isLoading]);

  return (
    <Stack>
      {/* Telas Públicas */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: 'Cadastro', presentation: 'modal' }} />

      {/* Telas Privadas (Área VIP) */}
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

// O Layout principal que envolve tudo com o AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}