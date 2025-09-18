// app/components/CustomHeaderRight.tsx

import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CustomHeaderRight() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Botão de Perfil */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/profile")} // Caminho correto
        style={styles.button}
      >
        <Ionicons name="person-circle-outline" size={30} color="#2D68A6" />
      </TouchableOpacity>
      
      {/* Botão/Texto de Cadastre-se */}
      <TouchableOpacity
        onPress={() => router.push("/signup")} // Caminho correto
      >
        <Text style={styles.signupText}>Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15, // Espaçamento da borda direita da tela
    backgroundColor: 'red',
  },
  button: {
    marginRight: 15, // Espaço entre o ícone e o texto
  },
  signupText: {
    fontSize: 16,
    color: "#2D68A6",
    fontWeight: "bold",
  },
});