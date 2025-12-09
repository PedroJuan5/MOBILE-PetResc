import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DenuncieModal } from "../../../components/denuncieModal"; 

// --- IMPORTAÇÃO DOS SEUS COMPONENTES DE CABEÇALHO ---
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';

export default function HomeScreen(): React.ReactElement {
  const [denuncieVisible, setDenuncieVisible] = useState<boolean>(false);
  const router = useRouter();

  // ATUALIZAÇÃO: Adicionei o parâmetro imageSource
  const animalCard = (name: string, race: string, status: string, imageSource: any): React.ReactElement => (
    <View style={styles.animalCard}>
      <Image
        source={imageSource} // Usa a imagem passada por parâmetro
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
      
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>

        {/* TOP HEADER */}
        <View style={styles.headerContainer}>
          
          <View style={styles.headerIcons}>
            
            {/* Esquerda: Alerta */}
            <CustomHeaderLeft onDenunciePress={() => setDenuncieVisible(true)} />
            
            {/* Direita: Notificação */}
            <CustomHeaderRight 
                onNotificationPress={() => router.push('/(ong)/notificacoes-ong' as any)} 
            />
          
          </View>

          {/* TÍTULO COM AS PATINHAS */}
          <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>Conheça seu novo{"\n"}melhor amigo!</Text>

            <Image 
              source={require("../../../assets/images/ui/pata.png")} 
              style={[styles.paw, styles.paw1]} 
              resizeMode="contain"
            />
            <Image 
              source={require("../../../assets/images/ui/pata.png")} 
              style={[styles.paw, styles.paw2]} 
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity style={styles.btnCadastrar} onPress={() => router.push('/(ong)/(tabs)/registroAnimal-ong' as any)}>
            <Text style={styles.btnCadastrarText}>Cadastrar animal</Text>
          </TouchableOpacity>
        </View>

        {/* SEÇÕES DE ANIMAIS (COM FOTOS DIFERENTES AGORA) */}
        <Section title="Pedidos de Adoção" subtitle="Pedidos de adoção pendentes: 5">
          {/* Pet 1 - Branquinho */}
          {animalCard("Não possui nome", "Sem raça definida (SRD)   AD", "Em tratamento", require("../../../assets/images/pets/branquinho.png"))}
          
          {/* Pet 2 - Neguinho (Exemplo de outra foto) */}
          {animalCard("Amendoim", "Sem raça definida (SRD)   FL", "", require("../../../assets/images/pets/neguinho.png"))}
          
          <TouchableOpacity style={styles.verMaisBtn}><Text style={styles.verMaisText}>Ver mais</Text></TouchableOpacity>
        </Section>

        <Section title="Animais em Lares Temporários" subtitle="Animais em lares temporários ativos: 6">
          {/* Pet 3 - Caramelo */}
          {animalCard("Rex", "Pastor Alemão", "Em tratamento", require("../../../assets/images/pets/caramelo.png"))}
          
          {/* Pet 4 - Shanti */}
          {animalCard("Luna", "Vira-lata", "Disponível", require("../../../assets/images/pets/shanti.png"))}
          
          <TouchableOpacity style={styles.verMaisBtn}><Text style={styles.verMaisText}>Ver mais</Text></TouchableOpacity>
        </Section>

        <Section title="Animais registrados recentemente" subtitle="Animais aguardando vaga: 8">
          {animalCard("Bob", "Poodle", "Aguardando", require("../../../assets/images/pets/neguinho.png"))}
          {animalCard("Mel", "Labrador", "Em análise", require("../../../assets/images/pets/branquinho.png"))}
          <TouchableOpacity style={styles.verMaisBtn}><Text style={styles.verMaisText}>Ver mais</Text></TouchableOpacity>
        </Section>

        {/* ÁREA DE CAMPANHAS */}
        <View style={styles.campanhasContainer}>
          <Text style={styles.campanhasTitle}>Minhas campanhas</Text>

          <View style={styles.campanhasRow}>
            {/* Coluna da Esquerda */}
            <View style={styles.campanhasLeftCol}>
              <Text style={styles.campanhasText}>
                Crie novas campanhas para arrecadar doações e ajude a transformar a vida de mais animais.
                {"\n\n"}
                Aqui você também encontra todas as suas campanhas anteriores, com relatórios e histórico.
              </Text>
              
              <TouchableOpacity style={styles.btnCampanhasAnteriores}>
                <Text style={styles.btnTextBlue}>Campanhas anteriores</Text>
              </TouchableOpacity>
            </View>

            {/* Coluna da Direita */}
            <View style={styles.campanhasRightCol}>
              <Image 
                source={require("../../../assets/images/ui/gatoHome.png")} 
                style={styles.gatoImage} 
                resizeMode="contain" 
              />
              <TouchableOpacity style={styles.btnNovaCampanha}>
                <Text style={styles.btnTextBlue}>Nova campanha</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>
      <DenuncieModal visible={denuncieVisible} onClose={() => setDenuncieVisible(false)} />
    </View>
  );
}

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
  
  // Header Icons alinhados
  headerIcons: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 10,
    alignItems: 'center' 
  },
  
  titleContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  pageTitle: { 
    fontSize: 24, 
    fontWeight: "700", 
    color: "#2D68A6", 
    width: "70%", 
    marginTop: 5, 
  },
  paw: {
    position: 'absolute',
    width: 150,
    height: 150,
    opacity: 0.5,
  },
  paw1: {
    top: -20,
    right: 15, 
    transform: [{ rotate: '15deg' }],
  },
  paw2: {
    top: 50, 
    right: -1, 
    transform: [{ rotate: '-20deg' }],
  },

  btnCadastrar: { backgroundColor: "#5DA9F6", paddingVertical: 10, borderRadius: 20, alignItems: "center", width: 150 },
  btnCadastrarText: { color: "#fff", fontWeight: "700" },
  section: { marginTop: 15, paddingHorizontal: 15 },
  sectionHeader: { backgroundColor: "#BFD6F5", padding: 10, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#2D68A6" },
  sectionSubtitle: { backgroundColor: "#DCE9FA", padding: 8, fontSize: 14, fontWeight: "600", color: "#2D68A6" },
  sectionContent: { backgroundColor: "#fff", padding: 10, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  animalCard: { backgroundColor: "#E7F1FC", borderRadius: 12, padding: 10, marginBottom: 10, flexDirection: "row", gap: 10 },
  petImage: { width: 80, height: 80, borderRadius: 12 },
  animalName: { fontSize: 16, fontWeight: "700", color: "#333" },
  animalRace: { fontSize: 13, marginTop: 2, color: "#666" },
  animalStatus: { marginTop: 5, fontSize: 13, color: "#666" },
  verMaisBtn: { alignSelf: "flex-end", marginTop: 5 },
  verMaisText: { color: "#2D68A6", fontWeight: "600" },

  campanhasContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  campanhasTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D68A6",
    marginBottom: 10,
  },
  campanhasRow: {
    flexDirection: "row",
    alignItems: "flex-end", 
  },
  campanhasLeftCol: {
    flex: 1, 
    paddingRight: 5, 
    justifyContent: 'space-between' 
  },
  campanhasRightCol: {
    width: 140,
    alignItems: "center",
  },
  campanhasText: {
    color: "#2D68A6",
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'left',
  },
  gatoImage: {
    width: 135,
    height: 145,
    marginBottom: -8,
  },
  btnNovaCampanha: {
    backgroundColor: "#BFD6F5",
    borderRadius: 20,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 1,
  },
  btnCampanhasAnteriores: {
    backgroundColor: "#BFD6F5",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  btnTextBlue: {
    color: "#2D68A6",
    fontWeight: "bold",
    fontSize: 13,
  },
});