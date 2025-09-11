import React from "react";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerStyle: { backgroundColor: "#F6FBFF", width: 260 },
        drawerActiveTintColor: "#2D68A6",
        drawerInactiveTintColor: "#3A5C7A",
        headerShown: true,    
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Início",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
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

      {/* adotar, doar, voluntarios, registro-animal */}
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerLabelContainer: { marginLeft: -10 },
  drawerMainLabel:  { fontSize: 15, fontWeight: "600" },
  drawerSubLabel:   { fontSize: 12, fontWeight: "400", marginTop: 2 },
});
