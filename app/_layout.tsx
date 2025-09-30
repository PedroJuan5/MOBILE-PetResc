import 'react-native-gesture-handler';
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router/stack';

//componentes de cabeçalho
import CustomHeaderLeft from "./components/elementosEsquerda";
import CustomHeaderRight from "./components/elementosDireita";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#F6FBFF",
        },
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
      <Stack.Screen
        name="perfil" 
        options={{
          title: "Meu Perfil", 
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Cadastro",
          presentation: 'modal',
        }}
      />
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