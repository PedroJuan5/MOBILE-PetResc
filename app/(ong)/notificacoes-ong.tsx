import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router'; // Importar useRouter
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar } from "react-native";

const UNREAD = [
  { id: "1", icon: "alert-circle", text: "Termos de uso e privacidade" },
  { id: "2", icon: "gift", text: "Nova campanha de doação iniciada!" },
];
const READ = [
  { id: "3", icon: "paw", text: "Bem-vindo ao PetResc!" },
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
  const router = useRouter(); // Hook de navegação
  const [aba, setAba] = useState<"UNREAD" | "READ">("UNREAD");

  const lista = aba === "READ" ? READ : UNREAD;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6FBFF" />
      
      {/* CABEÇALHO PERSONALIZADO COM SETA DE VOLTAR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2D68A6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 24 }} /> {/* Espaçador para centralizar título */}
      </View>

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
        <ScrollView showsVerticalScrollIndicator={false}>
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
  
  // ESTILO DO CABEÇALHO
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E6F0FA',
    backgroundColor: "#F6FBFF",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D68A6',
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
});