import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        // --- ADICIONE ESTA LINHA ---
        headerShown: false, // Isso desliga o cabeçalho azul do topo
        // --- FIM DA MUDANÇA ---

        // O resto das suas opções continua valendo
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#2D68A6",
        tabBarInactiveTintColor: "#3A5C7A",
        
        // Essas duas opções abaixo não farão mais efeito,
        // pois o header está desligado
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
          title: "Registro",
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pets-disponiveis"
        options={{
          href: null, 
        }}
      />
    </Tabs>
  );
}