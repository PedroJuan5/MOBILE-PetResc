// app/_layout.tsx
import React from "react";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: "#F6FBFF", width: 260 },
        drawerLabelStyle: { marginLeft: -10, fontSize: 15, fontWeight: "600" },
        drawerActiveTintColor: "#2D68A6",
        drawerInactiveTintColor: "#3A5C7A",
      }}
    >
      {/* A rota '(tabs)' agora renderiza todo o seu Tab Navigator.
        Isso é o que cria a conexão correta entre o menu lateral e as abas.
      */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Início",
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      
      {/* Para outras telas que devem aparecer apenas no menu (sem abas),
        elas devem ser colocadas na raiz da pasta 'app/' e referenciadas aqui.
        Por exemplo, se você tem 'signup.tsx' na raiz, a rota seria 'signup'.w
      */}
      <Drawer.Screen
        name="signup"
        options={{
          drawerLabel: "Cadastre-se",
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}