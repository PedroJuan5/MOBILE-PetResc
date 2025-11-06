import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Stack, SplashScreen, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

// Esta é a sua lógica de navegação e autenticação
function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(auth)';

      if (user && inAuthGroup) {
        SplashScreen.hideAsync();
        router.replace('/(tabs)/home' as any);
      } else if (!user && !inAuthGroup) {
        console.log("Chegou aqui");
        console.log(user);
        console.log(inAuthGroup);
        SplashScreen.hideAsync();
        router.replace('/' as any); // Ou router.replace('/(auth)');
      } else {
        SplashScreen.hideAsync();
      }
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return null; // A SplashScreen continua visível
  }

  return (
    <Stack
      screenOptions={{
        // Esconde o cabeçalho azul padrão do Stack
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function AppGroupLayout() {
  return (
    <RootLayoutNav />
  );
}