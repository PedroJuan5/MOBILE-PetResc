import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OngTabLayout() {
  return (
    <Tabs
      // AQUI ESTAVA O ERRO: Mudamos de "index" para "home-ong"
      initialRouteName="home-ong" 
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#2D68A6",
        tabBarStyle: { height: 60, paddingBottom: 5 }
      }}
    >
      {/* 1. Casa -> Agora aponta para home-ong.tsx */}
      <Tabs.Screen
        name="home-ong" 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={28} color={color} />,
        }}
      />

      {/* 2. Patinha */}
      <Tabs.Screen
        name="pets"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="paw-outline" size={28} color={color} />,
        }}
      />

      {/* 3. Presente */}
      <Tabs.Screen
        name="doacoes"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="gift-outline" size={28} color={color} />,
        }}
      />

      {/* 4. Coração */}
      <Tabs.Screen
        name="solicitacoes"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="heart-outline" size={28} color={color} />,
        }}
      />

      {/* 5. Mais */}
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="add-circle-outline" size={32} color={color} />,
        }}
      />
    </Tabs>
  );
}