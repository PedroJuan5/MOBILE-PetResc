import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
<<<<<<< HEAD
        headerShown: false,
=======
>>>>>>> 9b139b1cedcc7850e2c6e1cc63761cbc3309750a
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
          headerShown: false, 
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="adotar"
        options={{
          title: 'Adoção',
          headerShown: true,
          tabBarIcon: ({ color, size }) => <Ionicons name="paw-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="doar"
        options={{
          title: "Doar",
          headerShown: true,
          tabBarIcon: ({ color, size }) => <Ionicons name="gift-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="voluntarios"
        options={{
          title: "Voluntários",
          headerShown: true,
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="registro-animal"
        options={{
          title: "Registro",
          headerShown: true,
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}