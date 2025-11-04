
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

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
        router.replace('/(tabs)/home' as any);
      } else if (!user && !inAuthGroup) {
        console.log("Chegou aqui")
        console.log(user)
        console.log(inAuthGroup)
        SplashScreen.hideAsync();
        router.replace('/' as any);
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