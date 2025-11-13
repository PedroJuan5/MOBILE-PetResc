import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Topo */}
      <View style={styles.header}>
        <View style={styles.icons}>
          <Ionicons name="information-circle-outline" size={22} color="#0d549b" />
          <Ionicons name="notifications-outline" size={22} color="#0d549b" />
        </View>

        <Text style={styles.title}>
          Conheça seu novo{"\n"}melhor amigo!
        </Text>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Cadastrar animal</Text>
        </TouchableOpacity>
      </View>

      {/* Pedidos de adoção */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pedidos de Adoção</Text>
        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>Pedidos de adoção pendentes: 5</Text>

          {/* Card 1 */}
          <View style={styles.card}>
            <Image
              source={{ uri: "https://place-puppy.com/200x200" }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Não possui nome</Text>
              <Text style={styles.cardSubtitle}>Sem raça definida (SRD) | AD</Text>
              <Text style={styles.cardStatus}>Status: Em tratamento</Text>
            </View>
          </View>

          {/* Card 2 */}
          <View style={styles.card}>
            <Image
              source={{ uri: "https://placekitten.com/200/200" }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Amendoim</Text>
              <Text style={styles.cardSubtitle}>Sem raça definida (SRD) | FI</Text>
              <Text style={styles.cardStatus}>Status:</Text>
            </View>
          </View>

          <TouchableOpacity>
            <Text style={styles.linkText}>Ver mais</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Animais em lares temporários */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Animais em Lares Temporários</Text>
        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>Animais em lares temporários ativos: 6</Text>

          {/* Card 1 */}
          <View style={styles.card}>
            <Image
              source={{ uri: "https://place-puppy.com/201x201" }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Não possui nome</Text>
              <Text style={styles.cardSubtitle}>Sem raça definida (SRD) | AD</Text>
              <Text style={styles.cardStatus}>Status: Em tratamento</Text>
            </View>
          </View>

          {/* Card 2 */}
          <View style={styles.card}>
            <Image
              source={{ uri: "https://placekitten.com/201/201" }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Amendoim</Text>
              <Text style={styles.cardSubtitle}>Sem raça definida (SRD) | FI</Text>
              <Text style={styles.cardStatus}>Status:</Text>
            </View>
          </View>

          <TouchableOpacity>
            <Text style={styles.linkText}>Ver mais</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  title: {
    color: "#0d549b",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 10,
    lineHeight: 26,
    fontFamily: "moresugar",
  },
  addButton: {
    backgroundColor: "#2b95ffff",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#ffffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  section: {
    marginTop: 20,
    backgroundColor: "#d6e4f7",
    borderRadius: 10,
    padding: 10,
  },
  sectionTitle: {
    backgroundColor: "#a7c4ee",
    textAlign: "center",
    color: "#0d549b",
    fontWeight: "700",
    fontSize: 15,
    borderRadius: 6,
    paddingVertical: 6,
  },
  subSection: {
    backgroundColor: "#e9f1fc",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  subSectionTitle: {
    color: "#0d549b",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#d6e4f7",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: "600",
    color: "#0d549b",
    fontSize: 14,
  },
  cardSubtitle: {
    color: "#555",
    fontSize: 12,
  },
  cardStatus: {
    color: "#0d549b",
    fontSize: 12,
    marginTop: 4,
  },
  linkText: {
    color: "#0d549b",
    textAlign: "right",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 4,
  },
});

export default HomeScreen;
