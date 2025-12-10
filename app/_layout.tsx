import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { StrictMode } from 'react';
import 'react-native-gesture-handler';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  // Carrega a fonte
  const [loaded, error] = useFonts({
    'MoreSugar': require('../assets/fonts/MoreSugar-Regular.otf'), // <--- Nome que você vai usar : Caminho do arquivo
  });
  
  return (
    <StrictMode>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Registrando todas as pastas principais */}
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
          <Stack.Screen name="(ong)" />
        </Stack>
      </AuthProvider>
    </StrictMode>
  );
}