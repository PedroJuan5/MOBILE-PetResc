import React from "react";
import { Stack } from 'expo-router/stack';
import { useAuth } from '../../context/AuthContext'; 
import CustomHeaderLeft from "../../components/elementosEsquerda"; 
import CustomHeaderRight from "../../components/elementosDireita"; 
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AppLayout() {
  const { session } = useAuth();
  if (!session) return null;

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#F6FBFF" },
        headerTintColor: "#2D68A6",
      }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          title: "Início",
          headerLeft: () => <CustomHeaderLeft />,
          headerRight: () => <CustomHeaderRight />,
        }}
      />
      <Stack.Screen name="perfil" options={{ title: "Meu Perfil", presentation: 'modal' }} />
      <Stack.Screen
        name="notificacoes"
        options={{
          title: "Notificação",
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 20 }}>
              <Ionicons name="search" size={24} color="#2D68A6" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}