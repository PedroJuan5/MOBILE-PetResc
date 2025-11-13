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
        router.replace('/' as any); 
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
        headerShown: false,
      }}
    >

      <Stack.Screen name="(tabs)" />
      
      {/* Telas de Adoção */}
      <Stack.Screen name="formulario-interesse" />
      
      {/* --- ESTA LINHA FOI REMOVIDA --- */}
      {/* <Stack.Screen name="pets-disponiveis" /> */}
      {/* --- FIM DA CORREÇÃO --- */}
      
      <Stack.Screen name="pet/[id]" />

      {/* Telas de Voluntariado */}
      <Stack.Screen name="formulario-voluntarios" />
      
      {/* Telas de Configuração (que movemos anteriormente) */}
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