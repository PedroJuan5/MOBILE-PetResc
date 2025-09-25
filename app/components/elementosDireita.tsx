
import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CustomHeaderRight() {
  const router = useRouter();

  return (
    <View style={styles.container}>
    
      <TouchableOpacity
        onPress={() => router.push("/perfil")} 
        style={styles.button}
      >
        <Ionicons name="person-circle-outline" size={30} color="#2D68A6" />
      </TouchableOpacity>
      
      
      <TouchableOpacity
        onPress={() => router.push("/signup")} 
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
    marginRight: 15, 
  },
  button: {
    marginRight: 15, 
  },
  signupText: {
    fontSize: 16,
    color: "#2D68A6",
    fontWeight: "bold",
  },
});