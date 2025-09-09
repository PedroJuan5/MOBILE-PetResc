import React from "react";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: "#F6FBFF", width: 260 },
        drawerActiveTintColor: "#2D68A6",
        drawerInactiveTintColor: "#3A5C7A",
      }}
    >
      {/* 1. Tela principal (grupo de abas) */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          href: null,
          drawerLabel: "Início",
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      
      {/* 2. Tela de Cadastro com o estilo personalizado */}
      <Drawer.Screen
        name="signup"
        options={{
          drawerIcon: ({ focused, size, color }: { focused: boolean; size: number; color: string }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
          drawerLabel: ({ focused, color }: { focused: boolean; color: string }) => (
            <View style={styles.drawerLabelContainer}>
              <Text style={[styles.drawerMainLabel, { color: focused ? '#2D68A6' : '#3A5C7A' }]}>
                Cadastre-se
              </Text>
              <Text style={[styles.drawerSubLabel, { color: focused ? '#2D68A6' : '#3A5C7A' }]}>
                Cadastre sua ONG
              </Text>
            </View>
          ),
          title: "Cadastro de Usuário/ONG",
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerLabelContainer: {
    marginLeft: -10,
  },
  drawerMainLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  drawerSubLabel: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 2,
  },
});