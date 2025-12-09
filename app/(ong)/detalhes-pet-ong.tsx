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
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// --- BANCO DE DADOS FAKE ---
const BANCO_DE_DADOS: any = {
  '1': {
    nome: "Branquinho",
    info: "Macho • Adulto • SRD",
    status: "Disponível",
    comentario: '"Resgatei de uma vizinha que já tinha muitos animais, tem todas as vacinas em dia, sempre foi muito bem cuidado."', 
    imagem: require('../../assets/images/pets/branquinho.png'),
    raca: "Sem Raça Definida (SRD)", idade: "Adulto", porte: "Pequeno", cor: "Branca", olhos: "Azuis",
    veterinario: ["Vacinado", "Castrado", "Vermifugado"],
    temperamento: ["Dócil", "Brincalhão"],
    adaptabilidade: ["Vive bem em apartamento"],
    sociabilidade: ["Sociável com crianças", "Sociável com gatos"]
  },
  '2': {
    nome: "Frajola",
    info: "Macho • Adulto • SRD",
    status: "Disponível",
    comentario: '"Gato muito tranquilo e carinhoso."', 
    imagem: require('../../assets/images/ui/gatoHome.png'),
    raca: "SRD", idade: "Adulto", porte: "Pequeno", cor: "Preto e Branco", olhos: "Verdes",
    veterinario: ["Vacinado"], temperamento: ["Calmo"], adaptabilidade: ["Casa ou Apartamento"], sociabilidade: ["Sociável"]
  },
  '3': {
    nome: "Zeus",
    info: "Macho • Adulto • Pitbull",
    status: "Disponível",
    comentario: '"Um gigante gentil que adora brincar."', 
    imagem: require('../../assets/images/pets/mel.png'),
    raca: "Pitbull", idade: "Adulto", porte: "Grande", cor: "Marrom", olhos: "Castanhos",
    veterinario: ["Vacinado", "Castrado"], temperamento: ["Protetor", "Fiel"], adaptabilidade: ["Casa com quintal"], sociabilidade: ["Seletivo"]
  },
  '4': {
    nome: "Paçoca",
    info: "Macho • Jovem • SRD",
    status: "Disponível",
    comentario: '"Muito energético e feliz."', 
    imagem: require('../../assets/images/pets/caramelo.png'),
    raca: "SRD", idade: "Jovem", porte: "Médio", cor: "Caramelo", olhos: "Pretos",
    veterinario: ["Vacinado"], temperamento: ["Agitado"], adaptabilidade: ["Casa com quintal"], sociabilidade: ["Sociável"]
  },
  '5': {
    nome: "Negão",
    info: "Macho • Adulto • SRD",
    status: "Disponível",
    comentario: '"Cão de guarda excelente e companheiro."', 
    imagem: require('../../assets/images/pets/jimjim.png'),
    raca: "SRD", idade: "Adulto", porte: "Grande", cor: "Preto", olhos: "Castanhos",
    veterinario: ["Castrado"], temperamento: ["Alerta"], adaptabilidade: ["Sítio ou Casa"], sociabilidade: ["Dominante"]
  },
  '6': {
    nome: "Caramelo",
    info: "Macho • Adulto • SRD",
    status: "Disponível",
    comentario: '"O clássico vira-lata caramelo brasileiro."', 
    imagem: require('../../assets/images/pets/caramelo.png'),
    raca: "SRD", idade: "Adulto", porte: "Médio", cor: "Caramelo", olhos: "Castanhos",
    veterinario: ["Vacinado"], temperamento: ["Dócil"], adaptabilidade: ["Qualquer lugar"], sociabilidade: ["Sociável"]
  },
};

export default function DetalhesPetOngScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento da API
    setTimeout(() => {
      const idString = Array.isArray(id) ? id[0] : id; 
      // Busca no banco fake, se não achar usa o 1 como padrão para não quebrar
      const dados = BANCO_DE_DADOS[idString || '1'] || BANCO_DE_DADOS['1'];
      setPet(dados);
      setLoading(false);
    }, 500);
  }, [id]);

  const TagGroup = ({ items }: { items: string[] }) => (
    <View style={styles.tagContainer}>
      {items?.map((tag, index) => (
        <View key={index} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2D68A6" />
      </View>
    );
  }

  if (!pet) return null;

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER AZUL --- */}
        <View style={styles.headerBackground}>
          
          {/* BOTÃO VOLTAR CORRIGIDO: Vai para a lista de PETS */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.navigate('/(ong)/(tabs)/pets' as any)} 
          >
            <Ionicons name="arrow-back" size={28} color="#2D68A6" />
          </TouchableOpacity>

          <View style={styles.topContentRow}>
            <View style={styles.leftColumn}>
              <Image source={pet.imagem} style={styles.petAvatar} />
              <View style={styles.adoptionStatusBtn}>
                 <Text style={styles.adoptionStatusText}>Para adoção</Text>
              </View>
            </View>

            <View style={styles.rightColumn}>
              <Text style={styles.petName}>{pet.nome}</Text>
              <Text style={styles.petSubInfo}>{pet.info}</Text>
              
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Text style={{color: '#34C759', fontSize: 20, lineHeight: 20}}>• </Text>
                <Text style={styles.petStatus}>{pet.status}</Text>
              </View>
              
              <Text style={styles.commentLabel}>Sobre o pet</Text>
              <Text style={styles.commentText}>{pet.comentario}</Text>
            </View>
          </View>
        </View>

        {/* --- CONTEÚDO BRANCO --- */}
        <View style={styles.contentContainer}>
          
          <Text style={styles.sectionTitle}>Características</Text>
          <View style={styles.divider} />

          <View style={styles.charRow}><Text style={styles.charLabel}>RAÇA</Text><Text style={styles.charValue}>{pet.raca}</Text></View>
          <View style={styles.charRow}><Text style={styles.charLabel}>IDADE</Text><Text style={styles.charValue}>{pet.idade}</Text></View>
          <View style={styles.charRow}><Text style={styles.charLabel}>PORTE</Text><Text style={styles.charValue}>{pet.porte}</Text></View>
          <View style={styles.charRow}><Text style={styles.charLabel}>COR</Text><Text style={styles.charValue}>{pet.cor}</Text></View>
          <View style={styles.charRow}><Text style={styles.charLabel}>OLHOS</Text><Text style={styles.charValue}>{pet.olhos}</Text></View>

          {/* Botão de Edição (Específico para ONG) */}
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => Alert.alert("Editar", "Funcionalidade de editar perfil será implementada.")}
          >
            <Text style={styles.editButtonText}>EDITAR PERFIL</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Cuidados veterinários</Text>
          <View style={styles.divider} />
          <TagGroup items={pet.veterinario} />

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Temperamento</Text>
          <View style={styles.divider} />
          <TagGroup items={pet.temperamento} />

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Adaptabilidade</Text>
          <View style={styles.divider} />
          <TagGroup items={pet.adaptabilidade} />

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Sociabilidade</Text>
          <View style={styles.divider} />
          <TagGroup items={pet.sociabilidade} />

          <View style={{height: 40}} /> 
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBackground: {
    backgroundColor: '#DCE9F5', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  backButton: { marginBottom: 15, alignSelf: 'flex-start', padding: 5 },
  topContentRow: { flexDirection: 'row' },
  leftColumn: { marginRight: 15, alignItems: 'center' },
  rightColumn: { flex: 1, paddingTop: 5 },
  petAvatar: { width: 130, height: 130, borderRadius: 20, marginBottom: 8 },
  adoptionStatusBtn: { backgroundColor: '#2D68A6', width: 130, paddingVertical: 6, borderRadius: 20, alignItems: 'center' },
  adoptionStatusText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  petName: { fontSize: 24, fontWeight: 'bold', color: '#2D68A6', marginBottom: 2 },
  petSubInfo: { fontSize: 13, color: '#2D68A6', fontWeight: '500', marginBottom: 2 },
  petStatus: { fontSize: 14, color: '#2D68A6', fontWeight: '600' },
  commentLabel: { fontSize: 12, fontWeight: 'bold', color: '#2D68A6', marginTop: 8, marginBottom: 2 },
  commentText: { fontSize: 10, color: '#555', lineHeight: 14, fontStyle: 'italic' },
  
  contentContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D68A6' },
  divider: { height: 1, backgroundColor: '#DCE9F5', marginVertical: 10 },
  charRow: { marginBottom: 12 },
  charLabel: { fontSize: 12, fontWeight: 'bold', color: '#2D68A6', textTransform: 'uppercase' },
  charValue: { fontSize: 15, color: '#2D68A6', marginTop: 2 },
  
  // Botão de Edição
  editButton: { backgroundColor: '#2D68A6', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 15, width: '100%', elevation: 2 },
  editButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#94B9D8', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  tagText: { color: '#2D68A6', fontWeight: 'bold', fontSize: 12 },
});