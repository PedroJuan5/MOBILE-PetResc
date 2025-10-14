import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
// ... seus outros imports de componentes de header

export default function AppLayout() {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se a sessão não está carregando e não há sessão (usuário deslogado)...
    if (!isLoading && !session) {
      // ...expulsa o usuário para a tela de entrada.
      router.replace('/');
    }
  }, [session, isLoading]);

  // Enquanto carrega a sessão ou se não há sessão, não mostra nada.
  if (isLoading || !session) {
    return null;
  }

  // Se passou pelas verificações, mostra a área privada.
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* ... suas outras telas privadas */}
    </Stack>
  );
}