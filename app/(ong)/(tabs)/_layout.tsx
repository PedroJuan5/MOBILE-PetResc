import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OngTabLayout() {
  return (
    <Tabs
      // AQUI: Aponta para o seu arquivo home-ong
      initialRouteName="home-ong" 
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#2D68A6",
        tabBarInactiveTintColor: "#8FA7B8",
        tabBarStyle: {
          height: 60,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingBottom: 5,
        }
      }}
    >
      {/* 1. Casinha (Arquivo: home-ong.tsx) */}
      <Tabs.Screen
        name="home-ong" // Tem que ser igual ao nome do seu arquivo
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={28} color={color} />
          ),
        }}
      />

      {/* 2. Patinha (Arquivo: pets.tsx) */}
      <Tabs.Screen
        name="pets"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="paw-outline" size={28} color={color} />
          ),
        }}
      />

      {/* 3. Presente (Arquivo: doacoes.tsx) */}
      <Tabs.Screen
        name="doacoes"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="gift-outline" size={28} color={color} />
          ),
        }}
      />

      {/* 4. Coração (Arquivo: solicitacoes.tsx) */}
      <Tabs.Screen
        name="solicitacoes"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-outline" size={28} color={color} />
          ),
        }}
      />

      {/* 5. Mais (Arquivo: perfil.tsx) */}
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={32} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}