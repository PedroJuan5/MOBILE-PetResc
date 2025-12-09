import React from 'react';  
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const COLORS = {
  primary: '#2D68A6',
  inactive: '#A0B4CC',
  bg: '#FFFFFF',
  border: '#F0F0F0'
};

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarShowLabel: false, 
        tabBarStyle: {
          backgroundColor: COLORS.bg,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 60, 
          paddingTop: 10, 
        },
      }}
    >
      {/* 1. HOME (Casinha) */}
      <Tabs.Screen
        name="home-admin"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={28} color={color} />
          ),
        }}
      />

      {/* 2. GERENCIAR ONGS (Presente) */}
      <Tabs.Screen
        name="gerenciar-ongs"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift-outline" size={28} color={color} />
          ),
        }}
      />

      {/* 3. USUÁRIOS (Coração) */}
      <Tabs.Screen
        name="gerenciar-usuarios"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={28} color={color} />
          ),
        }}
      />

      {/* 4. LOGS (Engrenagem)*/}
      <Tabs.Screen
        name="logs"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={28} color={color} />
          ),
        }}
      />

      
      {/* Gerenciar Pets(so da para acessar pelo banner da home)*/}
      <Tabs.Screen
        name="gerenciar-pets"
        options={{
          href: null,
        }}
      />

        <Tabs.Screen
        name="ong-parceira"
        options={{ href: null 
        }} 
      />

      <Tabs.Screen
       name="periodo-cadastro"
       options={{ href: null 
       }}
       
      />

      <Tabs.Screen 
      name="detalhes-ong" 
      options={{ href: null 
      }} 
      />

      <Tabs.Screen
       name="gerenciar-pets-ong"
        options={{ href: null 
        }} 
      />
      <Tabs.Screen
       name="monitoramento-temperatura" 
       options={{ href: null 
       }} 
      />
    </Tabs>
  );
}