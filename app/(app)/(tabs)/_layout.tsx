import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons'; // Adicionei o Feather aqui

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
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
        name="home"
        options={{
          title: 'Início',
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
      
      {/* --- AQUI ESTAVA O PROBLEMA --- */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          // Troquei para o Feather 'user', que é o bonequinho padrão mais seguro
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="registro-animal"
        options={{
          title: "Registro",
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
        }}
      />

      {/* Telas ocultas */}
      <Tabs.Screen
        name="pets-disponiveis"
        options={{
          href: null, 
        }}
      />
      <Tabs.Screen 
        name="perdidos-achados" 
        options={{ 
          href: null,
          headerShown: false 
        }} 
      />
    </Tabs>
  );
}