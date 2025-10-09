import React from "react";
import { Stack } from 'expo-router/stack';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const { session } = useAuth();
  if (!session) return null;

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#F6FBFF" },
        headerTintColor: "#2D68A6",
      }}>
      <Stack.Screen
        name="(tabs)"
        options={{

          headerShown: false, 
        }}
      />
      <Stack.Screen name="perfil" options={{ title: "Meu Perfil", presentation: 'modal' }} />
      <Stack.Screen name="notificacoes" options={{ title: "Notificação" }} />
    </Stack>
  );
}