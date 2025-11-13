import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Stack, SplashScreen, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

//lógica de navegação e autenticação
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
        router.replace('/' as any); 
      } else {
        SplashScreen.hideAsync();
      }
    }
  }, [user, isLoading, segments]);
  
  if (isLoading) {
    return null; 
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="formulario-interesse" />
      <Stack.Screen name="pet/[id]" />
      <Stack.Screen name="formulario-voluntarios" />
      <Stack.Screen name="meus-dados" />
      <Stack.Screen name="seguranca" />
      <Stack.Screen name="notificacoes" />
    </Stack>
  );
}

export default function AppGroupLayout() {
  return (
    <RootLayoutNav />
  );
}