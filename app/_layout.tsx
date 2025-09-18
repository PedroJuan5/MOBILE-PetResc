import 'react-native-gesture-handler';

import React from "react";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";


import CustomHeaderRight from "./components/elementosDireita";

export default function RootLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerStyle: { backgroundColor: "#F6FBFF", width: 260 },
        drawerActiveTintColor: "#2D68A6",
        drawerInactiveTintColor: "#3A5C7A",
        headerShown: true,
        headerTitleAlign: "center", 
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Início",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
         
          headerLeft: () => null,
         
          headerRight: () => <CustomHeaderRight />,
        }}
      />
      <Drawer.Screen
        name="signup"
        options={{
          title: "Cadastro de Usuário/ONG",
          drawerLabel: "Cadastre-se",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

