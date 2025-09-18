// App.js
import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const pets = [
  { id: "1", name: "Caramelo", breed: "Sem raça definida (SRD)", gender: "AD.", image: require("../../assets/caramelo.png") },
  { id: "2", name: "Amarula", breed: "Sem raça definida (SRD)", gender: "AD.", image: require("../../assets/Amarula.png") },
  { id: "3", name: "Django", breed: "Pitbull", gender: "FI.", image: require ("../../assets/django.png") },
  { id: "4", name: "Mel", breed: "Sem raça definida (SRD)", gender: "AD.", image: require("../../assets/mel.png") },
  { id: "5", name: "Jim Jim", breed: "Sem raça definida (SRD)", gender: "AD.", image: require("../../assets/jimjim.png") },
  { id: "6", name: "Pingo", breed: "Sem raça definida (SRD)", gender: "FI.", image: require("../../assets/pingo.png") },
];

export default function App() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={28} color="#1f5fa3" />
        <Ionicons name="notifications-outline" size={28} color="#1f5fa3" />
      </View>

      <Text style={styles.title}>Pets adotados</Text>
      <View style={styles.subHeader}>
        <Text style={styles.subtitle}>Animais em destaque</Text>
        <Ionicons name="options-outline" size={22} color="#1f5fa3" />
      </View>

      {/* Lista de pets */}
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.petName}>{item.name}</Text>
            <Text style={styles.petInfo}>
              {item.breed} {item.gender}
            </Text>
          </View>
        )}
      />

      {/* Ver mais */}
      <TouchableOpacity style={styles.moreButton}>
        <Text style={styles.moreText}>Ver mais...</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f5fa3",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f5fa3",
  },
  card: {
    width: "48%",
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 12,
  },
  petName: {
    marginTop: 6,
    fontWeight: "bold",
    fontSize: 14,
    color: "#1f5fa3",
  },
  petInfo: {
    fontSize: 12,
    color: "#555",
  },
  moreButton: {
    alignItems: "center",
    marginTop: 5,
  },
  moreText: {
    color: "#1f5fa3",
    fontWeight: "500",
    fontSize: 14,
  },
});
