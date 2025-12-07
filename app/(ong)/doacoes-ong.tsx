import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const screenWidth = Dimensions.get("window").width - 40;

export default function DoacoesOngScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(ong)/home-ong' as any)}>
            <Ionicons name="home-outline" size={24} color="#1A3C6E" />
        </TouchableOpacity>
        

        <TouchableOpacity onPress={() => router.push('/(ong)/notificacoes-ong' as any)}>
            <Ionicons name="notifications-outline" size={24} color="#1A3C6E" />
        </TouchableOpacity>
      </View>

      {/* BANNER DA ONG */}
      <View style={styles.cardOng}>
        <Image
          source={require("../../assets/images/ui/institutoCaramelo.png")}
          style={styles.ongImage}
        />
        <View style={styles.ongProfileCircle} />
      </View>

      <Text style={styles.ongName}>Nome da ONG</Text>
      
      {/* CONTATO E LOCAL */}
      <View style={styles.infoRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Contato</Text>
          <Text style={styles.infoText}>username@gmail.com</Text>
          <Text style={styles.infoText}>11 96584 2214</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Localização</Text>
          <Text style={styles.infoText}>SP, Brasil</Text>
        </View>
      </View>
        
      {/* BOTÕES */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.buttonsScrollView}
      >
        <TouchableOpacity style={styles.btn} onPress={() => router.push("/perfil-ong")}>
          <Text style={styles.btnText}>Adotados</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.btn} onPress={() => router.push("/registrados")}>
          <Text style={styles.btnText}>Registrados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => router.push("/lar-temporario")}>
          <Text style={styles.btnText}>Lar Temporario</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => router.push("/doacoes-ong")}>
          <Text style={styles.btnText}>Doações</Text>
        </TouchableOpacity>
      </ScrollView>

       {/* MENSAGEM INFORMATIVA */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoContainerText}>
          Todos os meses, nossa ONG resgata, cuida e alimenta dezenas de cães e gatos abandonados. Com sua ajuda, podemos salvar ainda mais vidas.
        </Text>
      </View>

      <View style={{ alignItems: "flex-end", marginTop: 20, marginBottom: 40 }}>
        <TouchableOpacity onPress={() => router.push("/(ong)/menuconfiguracoes-ong" as any)}>
          <Ionicons name="settings-outline" size={28} color="#1A3C6E" />
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    padding: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A3C6E",
  },

  cardOng: {
    width: "100%",
    height: 140,
    backgroundColor: "#CCE1FF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  ongImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    opacity: 0.5,
  },

  ongProfileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1A3C6E",
    position: "absolute",
    top: 100,
  },

  ongName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A3C6E",
    marginTop: 45,
    marginBottom: 25,
    textAlign: "center",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A3C6E",
    marginBottom: 5,
  },

  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },

  buttonsScrollView: {
    marginBottom: 20,
  },

  btn: {
    minWidth: 140,
    backgroundColor: "#87b0ceff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },

  btnText: {
    color: "#1A3C6E",
    fontWeight: "600",
    fontSize: 14,
  },

  infoContainer: {
    backgroundColor: "#e2e2e2ff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  infoContainerText: {
    color: "#333",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
    fontWeight: "500",
  },
});