import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se a verificação de login já terminou E o usuário NÃO está logado...
    if (!isLoading && !session) {
      // ...expulsa o usuário de volta para a tela de entrada.
      router.replace('/');
    }
  }, [session, isLoading]);

  // Enquanto a sessão está sendo verificada ou se o usuário não está logado,
  // não renderiza nada para evitar que a tela privada "pisque" rapidamente.
  if (isLoading || !session) {
    return null;
  }

  // Se passou pelas verificações, o usuário tem permissão para ver a área privada.
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="perfil" options={{ title: "Meu Perfil", presentation: 'modal' }} />
      <Stack.Screen name="notificacoes" options={{ title: "Notificação" }} />
    </Stack>
  );
}