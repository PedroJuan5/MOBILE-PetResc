// app/_layout.tsx
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import DrawerToggleButton from '../components/DrawerToggleButton'; // IMPORTAÇÃO AQUI!

export default function RootLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerStyle: { backgroundColor: "#F6FBFF", width: 260 },
        drawerActiveTintColor: "#2D68A6",
        drawerInactiveTintColor: "#3A5C7A",
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          title: "Início",
          headerLeft: () => <DrawerToggleButton />, // USANDO O COMPONENTE AQUI!
          drawerLabel: "Início",
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen 
        name="signup" 
        options={{
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />,
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

      <Drawer.Screen 
        name="adotar" 
        options={{
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />,
          drawerLabel: "Adotar",
          title: "Adotar",
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="paw-outline" size={size} color={color} />
          ),
        }} 
      />

      <Drawer.Screen 
        name="doar" 
        options={{
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />,
          drawerLabel: "Doar",
          title: "Doar",
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="gift-outline" size={size} color={color} />
          ),
        }} 
      />

      <Drawer.Screen 
        name="voluntarios" 
        options={{
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />,
          drawerLabel: "Voluntários",
          title: "Voluntários",
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }} 
      />
      
      <Drawer.Screen 
        name="registro-animal" 
        options={{
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />,
          drawerLabel: "Registro de Animal",
          title: "Registro de Animal",
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
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