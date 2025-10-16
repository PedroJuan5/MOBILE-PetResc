import React from 'react';
import { Stack } from 'expo-router/stack';

export default function AuthLayout() {
  // Este layout define que as telas públicas (login, signup) usarão uma navegação de pilha
  // e não terão um cabeçalho por padrão.
  return <Stack screenOptions={{ headerShown: false }} />;
}