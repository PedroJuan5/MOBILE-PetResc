import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// --- DADOS FAKE (SIMULAÇÃO DO BANCO DE DADOS) ---
const BANCO_PERDIDOS: any = {
  '1': {
    nome: "Tobby",
    genero: "Macho",
    tipo: "Adulto",
    raca: "Sem raça definida (SRD)",
    status: "Perdido",
    dataDesaparecimento: "20/11/2025 • 2 dias atrás",
    local: "Próximo à Praça Central, Centro.",
    imagem: require('../../assets/images/pets/caramelo.png'),
    porte: "Médio",
    cor: "Caramelo",
    olhos: "Castanhos",
    recompensa: null
  },
  '2': {
    nome: "Hero",
    genero: "Macho",
    tipo: "Adulto",
    raca: "Labrador Retriever",
    status: "Perdido",
    dataDesaparecimento: "21/09/2025 • 2 dias atrás",
    local: "Próximo à escola Henrique Marechal Teixeira Lott, Parque Pirajussara, Embu das Artes",
    imagem: require('../../assets/images/pets/shanti.png'), // Usando imagem genérica
    porte: "Médio",
    cor: "Dourada/Caramelo",
    olhos: "Escuros",
    recompensa: "500,00"
  },
  '3': {
    nome: "Bob",
    genero: "Macho",
    tipo: "Idoso",
    raca: "Dálmata",
    status: "Perdido",
    dataDesaparecimento: "Ontem",
    local: "Zona Sul",
    imagem: require('../../assets/images/pets/branquinho.png'),
    porte: "Grande",
    cor: "Branco e Preto",
    olhos: "Pretos",
    recompensa: "200,00"
  }
};

export default function DetalhesPerdidoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula API
    setTimeout(() => {
      const idString = Array.isArray(id) ? id[0] : id; 
      const dados = BANCO_PERDIDOS[idString || '1']; 
      if (dados) setPet(dados);
      else setPet(BANCO_PERDIDOS['2']); // Fallback para o Hero (que é igual a imagem)
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D68A6" />
      </View>
    );
  }

  if (!pet) return null;

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER AZUL CLARO --- */}
        <View style={styles.headerBackground}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#2D68A6" />
          </TouchableOpacity>

          <View style={styles.topRow}>
            {/* Foto + Tag */}
            <View style={styles.imageColumn}>
                <Image source={pet.imagem} style={styles.petAvatar} />
                <View style={[
                    styles.statusTag, 
                    pet.status === 'Achado' ? {backgroundColor: '#34C759'} : {backgroundColor: '#EF4444'}
                ]}>
                    <Text style={styles.statusText}>{pet.status}</Text>
                </View>
            </View>

            {/* Informações Principais */}
            <View style={styles.infoColumn}>
                <Text style={styles.petName}>{pet.nome}</Text>
                <Text style={styles.petSubInfo}>{pet.genero} • {pet.tipo} • {pet.raca}</Text>
                
                <Text style={styles.labelBlue}>Data do Desaparecimento</Text>
                <Text style={styles.textGray}>{pet.dataDesaparecimento}</Text>

                <Text style={styles.labelBlue}>Local do desaparecimento</Text>
                <Text style={styles.textGray} numberOfLines={3}>{pet.local}</Text>
            </View>
          </View>
        </View>

        {/* --- CONTEÚDO BRANCO --- */}
        <View style={styles.contentContainer}>
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Características</Text>
            <TouchableOpacity>
                <Ionicons name="heart-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          {/* Lista de Características */}
          <View style={styles.charItem}>
            <Text style={styles.charLabel}>RAÇA</Text>
            <Text style={styles.charValue}>{pet.raca}</Text>
          </View>
          
          <View style={styles.charItem}>
            <Text style={styles.charLabel}>IDADE</Text>
            <Text style={styles.charValue}>{pet.tipo}</Text>
          </View>

          <View style={styles.charItem}>
            <Text style={styles.charLabel}>PORTE</Text>
            <Text style={styles.charValue}>{pet.porte}</Text>
          </View>

          <View style={styles.charItem}>
            <Text style={styles.charLabel}>COR PREDOMINANTE</Text>
            <Text style={styles.charValue}>{pet.cor}</Text>
          </View>

          <View style={styles.charItem}>
            <Text style={styles.charLabel}>COR DOS OLHOS</Text>
            <Text style={styles.charValue}>{pet.olhos}</Text>
          </View>

          {/* Botão Contato */}
          <TouchableOpacity style={styles.contactButton} onPress={() => Alert.alert("Contato", "Abrir WhatsApp do dono...")}>
            <Text style={styles.contactButtonText}>MOSTRAR CONTATO</Text>
          </TouchableOpacity>

          {/* Banner de Recompensa (Só mostra se tiver valor) */}
          {pet.recompensa && (
            <View style={styles.rewardBanner}>
                <View style={styles.coinCircle}><FontAwesome name="dollar" size={16} color="#15803D" /></View>
                <Text style={styles.rewardText}>RECOMPENSA:   R$ {pet.recompensa}</Text>
                <View style={styles.coinCircle}><FontAwesome name="dollar" size={16} color="#15803D" /></View>
            </View>
          )}

          <View style={{height: 40}} /> 
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Header Azul Claro
  headerBackground: {
    backgroundColor: '#DCE9F5', // Azul bem clarinho da imagem
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: { marginBottom: 20, alignSelf: 'flex-start' },
  topRow: { flexDirection: 'row' },
  
  // Coluna da Imagem
  imageColumn: { marginRight: 15, alignItems: 'center' },
  petAvatar: { width: 110, height: 110, borderRadius: 16 },
  statusTag: {
    marginTop: -12, // Sobe para ficar em cima da borda da foto
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 12,
    zIndex: 1,
  },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  // Coluna de Informações
  infoColumn: { flex: 1, paddingTop: 5 },
  petName: { fontSize: 26, fontWeight: 'bold', color: '#2D68A6', marginBottom: 2 },
  petSubInfo: { fontSize: 12, color: '#2D68A6', fontWeight: '600', marginBottom: 10 },
  labelBlue: { fontSize: 12, color: '#2D68A6', fontWeight: 'bold', marginTop: 6 },
  textGray: { fontSize: 11, color: '#555', lineHeight: 14 },

  // Conteúdo Branco
  contentContainer: { padding: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#2D68A6' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 15 },

  // Itens da Lista
  charItem: { marginBottom: 15 },
  charLabel: { fontSize: 13, fontWeight: 'bold', color: '#2D68A6', textTransform: 'uppercase' },
  charValue: { fontSize: 16, color: '#2D68A6', marginTop: 2 },

  // Botões
  contactButton: {
    backgroundColor: '#94B9D8', // Azul médio
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  contactButtonText: { color: '#2D68A6', fontWeight: 'bold', fontSize: 16 },

  // Banner Recompensa
  rewardBanner: {
    backgroundColor: '#C6EBC5', // Verde claro
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  rewardText: { color: '#15803D', fontWeight: 'bold', fontSize: 16 },
  coinCircle: { 
    width: 24, height: 24, borderRadius: 12, 
    borderWidth: 1, borderColor: '#15803D', 
    justifyContent: 'center', alignItems: 'center' 
  }
});