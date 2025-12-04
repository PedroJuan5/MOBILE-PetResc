import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OngTabLayout() {
  return (
    <Tabs
      initialRouteName="home-ong"
      screenOptions={{
        headerShown: false, 
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#2D68A6", 
        tabBarInactiveTintColor: "#3A5C7A", 
        tabBarStyle: {
          paddingBottom: 5, 
          height: 60,
        }
      }}
    >
  
      <Tabs.Screen
        name="home-ong"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="pets"
        options={{
          title: 'Pets',
          tabBarIcon: ({ color, size }) => <Ionicons name="paw-outline" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="doacoes"
        options={{
          title: "Doações",
          tabBarIcon: ({ color, size }) => <Ionicons name="gift-outline" size={size} color={color} />,
        }}
      />
   
      <Tabs.Screen
        name="registroAnimal-ong"
        options={{
          title: "Registro",
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={30} color={color} />, // Ícone levemente maior
        }}
      />

      {/* 6. Perfil (Bonequinho) */}
      <Tabs.Screen
        name="perfil-ong"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen 
        name="perdidos-achados-ong" 
        options={{ 
          href: null, //Oculta o botão, mas mantém a navegação
          headerShown: false 
        }} 
      />
    </Tabs>
  );
}