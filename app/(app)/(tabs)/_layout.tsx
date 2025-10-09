import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#2D68A6",
        tabBarInactiveTintColor: "#3A5C7A",
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
        <Tabs.Screen
        name="home" // A rota que ele deve encontrar
        options={{
          title: 'Início',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="adotar"
        options={{
          title: "Adoção",
          headerShown: true, //mostra o cabeçalho nesta tela
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="doar"
        options={{
          title: "Doar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="voluntarios"
        options={{
          title: "Voluntários",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="registro-animal"
        options={{
          title: "Registro",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
    
    </Tabs>
  );
}