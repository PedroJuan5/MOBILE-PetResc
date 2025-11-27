import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function DetalhesPetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Dados Mockados
  const pet = {
    nome: "Branquinho",
    info: "Macho • Adulto • SRD",
    status: "Lar temporário",
    comentario: '"Resgatei de uma vizinha que já tinha muitos animais, tem todas as vacinas em dia, sempre foi muito bem cuidado, só come ração e pratica malhado."', 
    imagem: require('../../assets/images/pets/branquinho.png'),
    
    raca: "Sem Raça Definida (SRD)",
    idade: "Adulto",
    porte: "Não informado",
    cor: "Branca",
    olhos: "Azuis",

    veterinario: ["Vacinado", "Castrado", "Vermifugado"],
    temperamento: ["Dócil", "Brincalhão", "Sociável", "Carente", "Independente"],
    adaptabilidade: ["Vive bem em apartamento"],
    sociabilidade: ["Sociável com crianças", "Sociável com gatos", "Sociável com cães", "Sociável com estranhos"]
  };

  const TagGroup = ({ items }: { items: string[] }) => (
    <View style={styles.tagContainer}>
      {items.map((tag, index) => (
        <View key={index} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- TOPO AZUL (CARD) --- */}
        <View style={styles.headerBackground}>
          
          {/* BOTÃO VOLTAR CORRIGIDO */}
          <TouchableOpacity 
            style={styles.backButton}
            // AQUI ESTÁ A CORREÇÃO: Aponta direto para a aba de PETS
            onPress={() => router.navigate('/(ong)/(tabs)/pets' as any)} 
          >
            <Ionicons name="arrow-back" size={28} color="#2D68A6" />
          </TouchableOpacity>

          <View style={styles.topContentRow}>
            
            {/* Coluna Esquerda: Foto + Botão Status */}
            <View style={styles.leftColumn}>
              <Image source={pet.imagem} style={styles.petAvatar} />
              
              <View style={styles.adoptionStatusBtn}>
                 <Text style={styles.adoptionStatusText}>Para adoção</Text>
              </View>
            </View>

            {/* Coluna Direita: Informações */}
            <View style={styles.rightColumn}>
              <Text style={styles.petName}>{pet.nome}</Text>
              <Text style={styles.petSubInfo}>{pet.info}</Text>
              
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Text style={{color: '#E8B931', fontSize: 20, lineHeight: 20}}>• </Text>
                <Text style={styles.petStatus}>{pet.status}</Text>
              </View>
              
              <Text style={styles.commentLabel}>Comentário do Anunciante</Text>
              <Text style={styles.commentText}>{pet.comentario}</Text>
            </View>

          </View>
        </View>

        {/* --- CONTEÚDO BRANCO --- */}
        <View style={styles.contentContainer}>
          
          <Text style={styles.sectionTitle}>Características</Text>
          <View style={styles.divider} />

          <View style={styles.charRow}>
            <Text style={styles.charLabel}>RAÇA</Text>
            <Text style={styles.charValue}>{pet.raca}</Text>
          </View>
          <View style={styles.charRow}>
            <Text style={styles.charLabel}>IDADE</Text>
            <Text style={styles.charValue}>{pet.idade}</Text>
          </View>
          <View style={styles.charRow}>
            <Text style={styles.charLabel}>PORTE</Text>
            <Text style={styles.charValue}>{pet.porte}</Text>
          </View>
          <View style={styles.charRow}>
            <Text style={styles.charLabel}>COR PREDOMINANTE</Text>
            <Text style={styles.charValue}>{pet.cor}</Text>
          </View>
          <View style={styles.charRow}>
            <Text style={styles.charLabel}>COR DOS OLHOS</Text>
            <Text style={styles.charValue}>{pet.olhos}</Text>
          </View>

          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>MOSTRAR CONTATO</Text>
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // --- HEADER ESTILO CARD AZUL ---
  headerBackground: {
    backgroundColor: '#DCE9F5', // Azul bem clarinho do fundo
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 15,
    alignSelf: 'flex-start',
    padding: 5, // Aumenta área de toque
  },
  topContentRow: {
    flexDirection: 'row',
  },
  leftColumn: {
    marginRight: 15,
    alignItems: 'center',
  },
  rightColumn: {
    flex: 1,
    paddingTop: 5,
  },
  petAvatar: {
    width: 130, 
    height: 130,
    borderRadius: 20,
    marginBottom: 8,
  },
  adoptionStatusBtn: {
    backgroundColor: '#2D68A6',
    width: 130, 
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  adoptionStatusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  
  // Textos do Topo
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D68A6',
    marginBottom: 2,
  },
  petSubInfo: {
    fontSize: 13,
    color: '#2D68A6',
    fontWeight: '500',
    marginBottom: 2,
  },
  petStatus: {
    fontSize: 14,
    color: '#2D68A6', 
    fontWeight: '600',
  },
  commentLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D68A6',
    marginTop: 8,
    marginBottom: 2,
  },
  commentText: {
    fontSize: 10,
    color: '#555',
    lineHeight: 14,
    fontStyle: 'italic',
  },

  // --- CONTEÚDO ---
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D68A6',
  },
  divider: {
    height: 1,
    backgroundColor: '#DCE9F5',
    marginVertical: 10,
  },
  charRow: {
    marginBottom: 12,
  },
  charLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D68A6',
    textTransform: 'uppercase',
  },
  charValue: {
    fontSize: 15,
    color: '#2D68A6',
    marginTop: 2,
  },
  contactButton: {
    backgroundColor: '#94B9D8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: 180,
  },
  contactButtonText: {
    color: '#2D68A6',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Tags
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#94B9D8',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  tagText: {
    color: '#2D68A6',
    fontWeight: 'bold',
    fontSize: 12,
  },
});