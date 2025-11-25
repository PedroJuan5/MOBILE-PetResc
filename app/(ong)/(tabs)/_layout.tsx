import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OngTabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false, // Cabeçalho nativo desligado
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#2D68A6", // Azul escuro (ativo)
        tabBarInactiveTintColor: "#3A5C7A", // Azul acinzentado (inativo)
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Painel',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="meus-pets"
        options={{
          title: 'Meus Pets',
          tabBarIcon: ({ color, size }) => <Ionicons name="paw-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="solicitacoes"
        options={{
          title: 'Solicitações',
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil da ONG',
          tabBarIcon: ({ color, size }) => <Ionicons name="business-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}