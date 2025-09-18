import React from "react";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import DrawerToggleButton from "./components/DrawerToggleButton";

export default function RootLayout() {
  const router = useRouter();

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
          headerLeft: () => <DrawerToggleButton />,
          headerRight: () => (
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => router.push("profile")}
                style={styles.button}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={28}
                  color="#2D68A6"
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => router.push("signup")}
                style={styles.button}
              >
                <Ionicons name="add-circle-outline" size={28} color="#2D68A6" />
              </TouchableOpacity>
            </View>
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
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginRight: 15,
  },
  button: {
    marginLeft: 15,
  },
});