import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const screenWidth = Dimensions.get("window").width - 40;

export default function LarTemporarioScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER ATUALIZADO */}
      <View style={styles.header}>
        {/* Ícone HOME (Leva para Home ONG) */}
        <TouchableOpacity onPress={() => router.push('/(ong)/home-ong' as any)}>
            <Ionicons name="home-outline" size={24} color="#1A3C6E" />
        </TouchableOpacity>
        
        {/* Ícone NOTIFICAÇÃO (Leva para Notificações ONG) */}
        <TouchableOpacity onPress={() => router.push('/(ong)/notificacao-ong' as any)}>
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

      {/* --- ÍCONE DE VOLUNTÁRIOS (ADICIONADO AQUI) --- */}
      <View style={styles.volunteersIconContainer}>
        <TouchableOpacity onPress={() => router.push('/(ong)/voluntarios-lar-temporario' as any)}>
            <Ionicons name="people" size={28} color="#1A3C6E" />
        </TouchableOpacity>
      </View>
      
      {/* CARD DE PET 1 */}
      <View style={styles.petCard}>
        <Image
          source={require("../../assets/images/pets/branquinho.png")}
          style={styles.petImg}
        />

        <View style={styles.petInfo}>
          <Text style={styles.petName}>Nome</Text>
          <Text style={styles.petSub}>Sem raça definida (SRD) - AD</Text>
          <Text style={styles.petDetails}>
            Adotado em 00/00/0000 {"\n"}
            Status: Visita Agendada
          </Text>
 
          <TouchableOpacity style={styles.infoButton} onPress={() => router.push("/detalhes-pet-ong")}>
            <Text style={styles.infoButtonText}>Ver informações</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CARD DE PET 2 */}
      <View style={styles.petCard}>
        <Image
          source={require("../../assets/images/pets/branquinho.png")}
          style={styles.petImg}
        />

        <View style={styles.petInfo}>
          <Text style={styles.petName}>Nome</Text>
          <Text style={styles.petSub}>Sem raça definida (SRD) - AD</Text>
          <Text style={styles.petDetails}>
            Adotado em 00/00/0000 {"\n"}
            Status: Visita Agendada
          </Text>
 
          <TouchableOpacity style={styles.infoButton} onPress={() => router.push("/detalhes-pet-ong")}>
            <Text style={styles.infoButtonText}>Ver informações</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CARD DE PET 3 */}
      <View style={styles.petCard}>
        <Image
          source={require("../../assets/images/pets/branquinho.png")}
          style={styles.petImg}
        />

        <View style={styles.petInfo}>
          <Text style={styles.petName}>Nome</Text>
          <Text style={styles.petSub}>Sem raça definida (SRD) - AD</Text>
          <Text style={styles.petDetails}>
            Adotado em 00/00/0000 {"\n"}
            Status: Visita Agendada
          </Text>
 
          <TouchableOpacity style={styles.infoButton} onPress={() => router.push("/detalhes-pet-ong")}>
            <Text style={styles.infoButtonText}>Ver informações</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FOOTER DE CONFIGURAÇÃO */}
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
    marginBottom: 10, // Reduzido para aproximar o ícone
  },

  // ESTILO DO NOVO ÍCONE DE VOLUNTÁRIOS
  volunteersIconContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: 5,
    marginLeft: 5,
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

  petCard: {
    flexDirection: "row",
    backgroundColor: "#87b0ceff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    gap: 15,
    position: "relative",
  },

  petImg: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  petInfo: {
    flex: 1,
  },

  petName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3C6E",
  },

  petSub: {
    fontSize: 14,
    color: "#1A3C6E",
    marginTop: 2,
  },

  petDetails: {
    fontSize: 14,
    color: "#1A3C6E",
    marginTop: 5,
  },

  infoButton: {
    position: "absolute",
    right: 15,
    bottom: 15,
    backgroundColor: "transparent",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 0,
    elevation: 0,
  },

  infoButtonText: {
    color: "#1A3C6E",
    fontWeight: "600",
    fontSize: 12,
  },
});