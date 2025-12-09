import { Stack } from 'expo-router';
import React, { StrictMode } from 'react';
import 'react-native-gesture-handler';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <StrictMode>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Registrando todas as pastas principais */}
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
          <Stack.Screen name="(ong)" />
          <Stack.Screen name="index" />
        </Stack>
      </AuthProvider>
    </StrictMode>
  );
}