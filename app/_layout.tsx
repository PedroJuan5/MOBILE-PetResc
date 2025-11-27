import React from 'react'; 
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Registrando todas as pastas principais */}
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="(ong)" /> 
        <Stack.Screen name="index" />
      </Stack>
    </AuthProvider>
  );
}