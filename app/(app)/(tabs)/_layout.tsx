// app/_layout.tsx (O Layout Raiz - O GUARDA DA PORTA)

import React, { useEffect } from 'react';
import { SplashScreen, Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext'; 

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, isLoading } = useAuth(); 
  const segments = useSegments(); 
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(auth)';

      if (user && inAuthGroup) {
        SplashScreen.hideAsync(); 
        router.replace('/home'); 
      } else if (!user && !inAuthGroup) {
        SplashScreen.hideAsync();
        router.replace('/login'); 
      } else {
        
         SplashScreen.hideAsync();
      }
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return null; 
  }

  return <Slot />; 
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}