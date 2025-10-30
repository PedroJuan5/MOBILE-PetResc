
import React, { useEffect } from 'react';
import { SplashScreen, Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext'; 

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(auth)';

      if (user && inAuthGroup) {
         // Se LOGADO e na tela de login -> VAI PARA A HOME
        SplashScreen.hideAsync();
        router.replace('/(tabs)/home' as any); // 2. 'as any' para o erro de tipo
      } else if (!user && !inAuthGroup) {
        // Se NÃO LOGADO e tentando acessar a área logada -> VAI PARA O LOGIN
        SplashScreen.hideAsync();
        router.replace('/login' as any); // 2. 'as any' para o erro de tipo
      } else {
         SplashScreen.hideAsync();
      }
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return null;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}