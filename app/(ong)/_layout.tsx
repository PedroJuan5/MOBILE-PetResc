import React from 'react';
import { Stack } from 'expo-router';

export default function OngGroupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Isso é uma Stack (Pilha). 
         Ela é invisível e serve apenas para carregar a pasta (tabs).
         A barra de navegação virá apenas de dentro da pasta (tabs).
      */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}