import React from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  // Envolve o app com o provedor de autenticação e renderiza a rota atual.
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}