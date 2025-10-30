
// Arquivo: app/(app)/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
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

    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#2D68A6",
        tabBarInactiveTintColor: "#3A5C7A",
        headerStyle: {
          backgroundColor: '#2D68A6',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          // A home possui um cabeçalho custom dentro do próprio componente.
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="adotar"
        options={{
          title: 'Adoção',
          tabBarIcon: ({ color, size }) => <Ionicons name="paw-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="doar"
        options={{
          title: "Doar",
          tabBarIcon: ({ color, size }) => <Ionicons name="gift-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="voluntarios"
        options={{
          title: "Voluntários",
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="registro-animal"
        options={{
          title: "Registro", // Este título será substituído pelo do próprio arquivo
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
        }}
      />
    </Tabs>

  );
}