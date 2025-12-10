import { useAuth } from '@/context/AuthContext';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

// Previne o Splash de sumir antes da hora
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    const hideSplashAndNavigate = async () => {
      try {
        if (user && inAuthGroup) {
          // --- CORREÇÃO DO REDIRECIONAMENTO ---
          await SplashScreen.hideAsync();
          
          if (user.role === 'ONG') {
            // Se for ONG, manda para a pasta (ong)
            router.replace('/(ong)/(tabs)/home-ong' as any);
          } else {
            // Se for PÚBLICO, manda para a pasta (tabs)
            router.replace('/(tabs)/home' as any);
          }

        } else if (!user && !inAuthGroup) {
          // Se não tem usuário e não está no login, manda pro login
          await SplashScreen.hideAsync();
          router.replace('/' as any); 
        } else {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn('Erro navegação:', e);
        SplashScreen.hideAsync();
      }
    };

    hideSplashAndNavigate();

  }, [user, isLoading, segments]);
  
  if (isLoading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#2D68A6"/>
      </View>
    ); 
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Grupo de Autenticação */}
      <Stack.Screen name="(auth)" />

      {/* Grupo de Usuário Comum */}
      <Stack.Screen name="(tabs)" />
      
      {/* Grupo da ONG (ESSENCIAL ADICIONAR ISTO) */}
      <Stack.Screen name="(ong)" />

      {/* Outras telas soltas */}
      <Stack.Screen name="formulario-interesse" />
      <Stack.Screen name="pet/[id]" />
      <Stack.Screen name="formulario-voluntarios" />
      <Stack.Screen name="meus-dados" />
      <Stack.Screen name="seguranca" />
      <Stack.Screen name="HistoricoSolicitacoes" options={{ headerShown: true, title: 'Histórico' }} />
      <Stack.Screen name="notificacoes" options={{ headerShown: true, title: 'Notificações' }} />
      <Stack.Screen name="AlterarSenha-ong" options={{ headerShown: true, title: 'Alterar Senha' }} />
    </Stack>
  );
}

export default function AppGroupLayout() {
  return (
    <RootLayoutNav />
  );
}