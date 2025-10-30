import React, { useState } from "react";import {SafeAreaView,View,Text,StyleSheet,TouchableOpacity,ScrollView,} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";


const UNREAD = [
  { id: "1", icon: "alert-circle", text: "Termos de uso e privacidade" },
  { id: "2", icon: "gift", text: "Nova campanha de doação iniciada!" },
];
const READ = [
  { id: "3", icon: "paw", text: "Bem-vindo ao PetCo!" },
  { id: "4", icon: "checkmark-circle", text: "Seu cadastro foi concluído." },
];



const ItemNotificacao = ({ item }: { item: { id: string; icon: string; text: string } }) => (
  <TouchableOpacity style={styles.row} accessibilityRole="button">
    <Ionicons name={item.icon as any} size={24} color="#3A5C7A" />
    <Text style={styles.rowText}>{item.text}</Text>
    <Ionicons name="chevron-forward" size={20} color="#B0C4DE" />
  </TouchableOpacity>
);

export default function Notificacoes() {
  const [aba, setAba] = useState<"UNREAD" | "READ">("UNREAD");

  const lista = aba === "READ" ? READ : UNREAD;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Abas (Lidos / Não lidos) */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, aba === "READ" && styles.activeTab]}
            onPress={() => setAba("READ")}
            accessibilityRole="tab"
            accessibilityState={{ selected: aba === "READ" }}
          >
            <Text style={[styles.tabText, aba === "READ" && styles.activeTabText]}>LIDOS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, aba === "UNREAD" && styles.activeTab]}
            onPress={() => setAba("UNREAD")}
            accessibilityRole="tab"
            accessibilityState={{ selected: aba === "UNREAD" }}
          >
            <Text style={[styles.tabText, aba === "UNREAD" && styles.activeTabText]}>NÃO LIDOS</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de notificações */}
        <ScrollView>
          {lista.map((item) => (
            <ItemNotificacao key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>

      {/* Patinhas decorativas no canto inferior direito */}
      <View style={styles.pawsContainer} pointerEvents="none">
        <FontAwesome5 name="paw" size={20} color="#D6EAF7" style={styles.paw1} />
        <FontAwesome5 name="paw" size={16} color="#E6F0FA" style={styles.paw2} />
        <FontAwesome5 name="paw" size={18} color="#D6EAF7" style={styles.paw3} />
      </View>
    </SafeAreaView>
  );
}

/* Estilos */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6FBFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Abas
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#E6F0FA",
    borderRadius: 20,
    marginVertical: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#2D68A6",
  },
  tabText: {
    color: "#3A5C7A",
    fontWeight: "700",
  },
  activeTabText: {
    color: "#FFFFFF",
  },

  // Itens da lista
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E6F0FA",
  },
  rowText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#3A5C7A",
  },

  // Patinhas decorativas
  pawsContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 100,
    height: 100,
  },
  paw1: {
    position: "absolute",
    bottom: 10,
    right: 40,
    transform: [{ rotate: "20deg" }],
  },
  paw2: {
    position: "absolute",
    bottom: 50,
    right: 60,
    transform: [{ rotate: "-10deg" }],
  },
  paw3: {
    position: "absolute",
    bottom: 80,
    right: 20,
    transform: [{ rotate: "30deg" }],
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 10,
  },
  linkText: {
    color: "#2D68A6",
    fontSize: 16,
  },
});
