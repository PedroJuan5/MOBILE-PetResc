import { useAuth } from '@/context/AuthContext';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

//SplashScreen.preventAutoHideAsync();

//lógica de navegação e autenticação
function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(auth)';
      console.log('RootLayoutNav: hiding splash', { user: !!user, isLoading, segments });

      (async () => {
        try {
          if (user && inAuthGroup) {
            await SplashScreen.hideAsync();
            router.replace('/(tabs)/home' as any);
          } else if (!user && !inAuthGroup) {
            console.log('RootLayoutNav: redirecting to login', { user: !!user, inAuthGroup });
            await SplashScreen.hideAsync();
            router.replace('/' as any);
          } else {
            await SplashScreen.hideAsync();
          }
        } catch (e) {
          console.log('RootLayoutNav: error hiding splash', e);
          try {
            await SplashScreen.hideAsync();
          } catch (e2) {
            console.log('RootLayoutNav: second attempt to hide splash failed', e2);
          }
        }
      })();
    }
  }, [user, isLoading, segments]);
  
  if (isLoading) {
    return null; 
  }

  SplashScreen.hide()

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
  {/* Mostrar header nativo apenas nessas telas específicas */}
  <Stack.Screen name="seguranca"   />
  <Stack.Screen name="HistoricoSolicitacoes" options={{ headerShown: true, title: 'Histórico' }} />
  <Stack.Screen name="notificacoes"  options={{ headerShown: true, title: 'Histórico' }} />
  <Stack.Screen name="AlterarSenha-ong" options={{ headerShown: true, title: 'Alterar Senha' }} />
    </Stack>
  );
}

export default function AppGroupLayout() {
  return (
    <RootLayoutNav />
  );
}