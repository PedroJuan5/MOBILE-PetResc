import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DenuncieModal } from "../../../components/denuncieModal"; // Ajuste o import se necessário

export default function HomeScreen(): React.ReactElement {
  const [denuncieVisible, setDenuncieVisible] = useState<boolean>(false);
  const router = useRouter();

  const animalCard = (name: string, race: string, status?: string): React.ReactElement => (
    <View style={styles.animalCard}>
      <Image
        // Certifique-se que a imagem existe ou troque por uri se necessário
        source={require("../../../assets/images/pets/branquinho.png")}
        style={styles.petImage}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.animalName}>{name}</Text>
        <Text style={styles.animalRace}>{race}</Text>
        <Text style={styles.animalStatus}>
          Status: <Text style={{ fontWeight: "600" }}>{status}</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Ajustei o paddingBottom para o conteúdo não ficar escondido atrás da TabBar oficial */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* TOP HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => setDenuncieVisible(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="alert-circle-outline" size={26} color="#D9534F" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/notificacoes')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="notifications-outline" size={26} color="#2D68A6" />
            </TouchableOpacity>
          </View>

          <Text style={styles.pageTitle}>Conheça seu novo{"\n"}melhor amigo!</Text>

          <TouchableOpacity style={styles.btnCadastrar}>
            <Text style={styles.btnCadastrarText}>Cadastrar animal</Text>
          </TouchableOpacity>
        </View>

        {/* SEÇÕES DE ANIMAIS */}
        <Section title="Pedidos de Adoção" subtitle="Pedidos de adoção pendentes: 5">
          {animalCard("Não possui nome", "Sem raça definida (SRD)   AD", "Em tratamento")}
          {animalCard("Amendoim", "Sem raça definida (SRD)   FL", "")}
          <TouchableOpacity style={styles.verMaisBtn}>
            <Text style={styles.verMaisText}>Ver mais</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Animais em Lares Temporários" subtitle="Animais em lares temporários ativos: 6">
          {animalCard("Não possui nome", "Sem raça definida (SRD)   AD", "Em tratamento")}
          {animalCard("Amendoim", "Sem raça definida (SRD)   FL", "")}
          <TouchableOpacity style={styles.verMaisBtn}>
            <Text style={styles.verMaisText}>Ver mais</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Animais registrados recentemente" subtitle="Animais aguardando vaga: 8">
          {animalCard("Não possui nome", "Sem raça definida (SRD)   AD", "Em tratamento")}
          {animalCard("Amendoim", "Sem raça definida (SRD)   FL", "")}
          <TouchableOpacity style={styles.verMaisBtn}>
            <Text style={styles.verMaisText}>Ver mais</Text>
          </TouchableOpacity>
        </Section>

        {/* MINHAS CAMPANHAS */}
        <View style={styles.campanhasContainer}>
          <Text style={styles.campanhasTitle}>Minhas campanhas</Text>

          <Text style={styles.campanhasText}>
            Crie novas campanhas para arrecadar doações e ajudar a transformar a vida de mais animais.{"\n"}
            Aqui você também encontra todas as suas campanhas anteriores, com relatórios e histórico de contribuições.
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
            {/* Certifique-se que a imagem existe */}
            <Image source={require("../../../assets/images/ui/gatoHome.png")} style={styles.campanhaCat} resizeMode="contain" />
            
            <View>
                <TouchableOpacity style={styles.newCampanhaBtn}>
                <Text style={styles.newCampanhaText}>Nova campanha</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.oldCampanhaBtn}>
                <Text style={styles.oldCampanhaText}>Campanhas anteriores</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* --- AQUI EU REMOVI O "FOOTER MENU" (View styles.bottomNav) --- 
          O menu agora virá automaticamente do arquivo _layout.tsx
      */}

      {/* Denuncie Modal */}
      <DenuncieModal visible={denuncieVisible} onClose={() => setDenuncieVisible(false)} />
    </View>
  );
}

// Componente Auxiliar de Seção
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }): React.ReactElement {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F2F5" },

  headerContainer: { paddingTop: 40, paddingHorizontal: 20, paddingBottom: 15 },
  headerIcons: { flexDirection: "row", justifyContent: "space-between" },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D68A6",
    marginTop: 10,
    marginBottom: 15,
  },
  btnCadastrar: {
    backgroundColor: "#5DA9F6",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    width: 150,
  },
  btnCadastrarText: { color: "#fff", fontWeight: "700" },

  section: { marginTop: 15, paddingHorizontal: 15 },
  sectionHeader: {
    backgroundColor: "#BFD6F5",
    padding: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#2D68A6" },
  sectionSubtitle: {
    backgroundColor: "#DCE9FA",
    padding: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#2D68A6",
  },
  sectionContent: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  animalCard: {
    backgroundColor: "#E7F1FC",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    gap: 10,
  },
  petImage: { width: 80, height: 80, borderRadius: 12 },
  animalName: { fontSize: 16, fontWeight: "700", color: "#333" },
  animalRace: { fontSize: 13, marginTop: 2, color: "#666" },
  animalStatus: { marginTop: 5, fontSize: 13, color: "#666" },

  verMaisBtn: { alignSelf: "flex-end", marginTop: 5 },
  verMaisText: { color: "#2D68A6", fontWeight: "600" },

  campanhasContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  campanhasTitle: { fontSize: 18, fontWeight: "700", color: "#2D68A6" },
  campanhasText: { marginTop: 8, color: "#444", lineHeight: 20 },
  campanhaCat: { width: 100, height: 100, marginRight: 10 },
  newCampanhaBtn: {
    backgroundColor: "#BFD6F5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center'
  },
  newCampanhaText: { color: "#2D68A6", fontWeight: "700" },
  oldCampanhaBtn: {
    backgroundColor: "#DCE9FA",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center'
  },
  oldCampanhaText: { color: "#2D68A6", fontWeight: "700" },

});