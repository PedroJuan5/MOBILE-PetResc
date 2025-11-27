import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Switch,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  ImageSourcePropType
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- TIPOS ---
interface Animal {
  id: string;
  nome: string;
  imagem: ImageSourcePropType;
  raca: string;
  status: string;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

// --- DADOS MOCKADOS ---
const ANIMAIS_ONG: Animal[] = [
  { id: '1', nome: 'Branquinho', imagem: require('../../../assets/images/pets/branquinho.png'), raca: 'Sem raça definida (SRD)', status: 'AD.' },
  { id: '2', nome: 'Frajola', imagem: require('../../../assets/images/ui/gatoHome.png'), raca: 'Sem raça definida (SRD)', status: 'FI.' },
  { id: '3', nome: 'Zeus', imagem: require('../../../assets/images/pets/mel.png'), raca: 'Pitbull', status: 'FI.' },
  { id: '4', nome: 'Paçoca', imagem: require('../../../assets/images/pets/caramelo.png'), raca: 'Não informado', status: 'AD.' },
  { id: '5', nome: 'Negão', imagem: require('../../../assets/images/pets/jimjim.png'), raca: 'Sem raça definida (SRD)', status: 'AD.' },
  { id: '6', nome: 'Caramelo', imagem: require('../../../assets/images/pets/caramelo.png'), raca: 'Sem raça definida (SRD)', status: 'FI.' },
];

// --- CARD DO ANIMAL (COM NAVEGAÇÃO) ---
const AnimalGridCard = ({ item }: { item: Animal }) => {
  const router = useRouter(); // Hook para navegação

  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      activeOpacity={0.9}
      // Ao clicar, vai para a tela de detalhes enviando o ID do animal
      onPress={() => router.push({
        pathname: '/(ong)/detalhes-pet',
        params: { id: item.id }
      } as any)}
    >
      <Image source={item.imagem} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.nome}</Text>
        <Text style={styles.cardDetails}>
          {item.raca} <Text style={styles.cardStatus}>{item.status}</Text>
        </Text>
        <View style={styles.verMaisLink}>
          <Text style={styles.verMaisText}>Ver mais</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- MODAL DE FILTRO ---
const FilterModal = ({ visible, onClose }: FilterModalProps) => {
    const router = useRouter();
    
    // Estados do Filtro
    const [isGato, setIsGato] = useState(true);
    const [isCaes, setIsCaes] = useState(false);
    const [isTodos, setIsTodos] = useState(false);
    const [isMacho, setIsMacho] = useState(false);
    const [isFemea, setIsFemea] = useState(false);
    
    const [porteSelecionado, setPorteSelecionado] = useState<string>('');
    const [idadeSelecionada, setIdadeSelecionada] = useState<string>('');
    const [racaText, setRacaText] = useState('');

    const togglePorte = (valor: string) => setPorteSelecionado(prev => prev === valor ? '' : valor);
    const toggleIdade = (valor: string) => setIdadeSelecionada(prev => prev === valor ? '' : valor);

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          {/* BARRA LATERAL BRANCA */}
          <View style={styles.filterSidebar}>
            
            <View style={styles.filterHeader}>
                <Text style={styles.filterTitle}>Filtros</Text>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
                
                <Text style={styles.filterLabel}>Nome ou id</Text>
                <TextInput style={styles.filterInput} />

                {/* Espécie */}
                <Text style={styles.filterLabel}>Espécie</Text>
                <View style={styles.switchContainer}>
                    <View style={styles.switchRow}>
                        <Switch trackColor={{ false: "#D1D5DB", true: "#2D68A6" }} thumbColor={"#fff"} onValueChange={setIsGato} value={isGato} />
                        <Text style={styles.switchLabel}>Gato</Text>
                    </View>
                    <View style={styles.switchRow}>
                        <Switch trackColor={{ false: "#D1D5DB", true: "#2D68A6" }} thumbColor={"#fff"} onValueChange={setIsCaes} value={isCaes} />
                        <Text style={styles.switchLabel}>Cães</Text>
                    </View>
                    <View style={styles.switchRow}>
                        <Switch trackColor={{ false: "#D1D5DB", true: "#2D68A6" }} thumbColor={"#fff"} onValueChange={setIsTodos} value={isTodos} />
                        <Text style={styles.switchLabel}>Todos</Text>
                    </View>
                </View>

                {/* Gênero */}
                <Text style={styles.filterLabel}>Gênero</Text>
                <View style={styles.switchContainer}>
                    <View style={styles.switchRow}>
                        <Switch trackColor={{ false: "#D1D5DB", true: "#2D68A6" }} thumbColor={"#fff"} onValueChange={setIsMacho} value={isMacho} />
                        <Text style={styles.switchLabel}>Macho</Text>
                    </View>
                    <View style={styles.switchRow}>
                        <Switch trackColor={{ false: "#D1D5DB", true: "#2D68A6" }} thumbColor={"#fff"} onValueChange={setIsFemea} value={isFemea} />
                        <Text style={styles.switchLabel}>Fêmea</Text>
                    </View>
                </View>

                {/* Porte */}
                <Text style={styles.filterLabel}>Porte</Text>
                <View style={styles.optionsContainer}>
                    {['Pequeno', 'Médio', 'Grande'].map(opcao => (
                        <TouchableOpacity key={opcao} style={[styles.optionBtn, porteSelecionado === opcao && styles.optionBtnSelected]} onPress={() => togglePorte(opcao)}>
                            <Text style={[styles.optionText, porteSelecionado === opcao && styles.optionTextSelected]}>{opcao}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Raça */}
                <Text style={styles.filterLabel}>Raça</Text>
                <TextInput style={styles.filterInput} placeholder="Digite a raça" value={racaText} onChangeText={setRacaText} />

                {/* Idade */}
                <Text style={styles.filterLabel}>Idade</Text>
                <View style={styles.optionsContainer}>
                    {['Filhote', 'Adulto', 'Idoso'].map(opcao => (
                        <TouchableOpacity key={opcao} style={[styles.optionBtn, idadeSelecionada === opcao && styles.optionBtnSelected]} onPress={() => toggleIdade(opcao)}>
                            <Text style={[styles.optionText, idadeSelecionada === opcao && styles.optionTextSelected]}>{opcao}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* LINK PERDIDOS E ACHADOS */}
                <TouchableOpacity 
                    style={styles.lostFoundButton}
                    onPress={() => {
                        onClose(); 
                        router.push('/(ong)/perdidos-achados' as any); 
                    }}
                >
                    <Text style={styles.lostFoundText}>PERDIDOS E ACHADOS</Text>
                </TouchableOpacity>

            </ScrollView>
          </View>
          <TouchableOpacity style={styles.modalCloserArea} onPress={onClose} activeOpacity={1} />
        </View>
      </Modal>
    );
};

// --- TELA PRINCIPAL ---
export default function PetsOngScreen() {
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* ELEMENTO DECORATIVO DE FUNDO */}
      <View style={styles.bgShapeRight} />

      <View style={styles.container}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <Ionicons name="menu-outline" size={32} color="#2D68A6" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Animais da ONG</Text>
          
          <TouchableOpacity onPress={() => router.push('/(ong)/notificacoes' as any)}>
            <Ionicons name="notifications-outline" size={28} color="#2D68A6" />
          </TouchableOpacity>
        </View>

        {/* SUB-CABEÇALHO */}
        <View style={styles.subHeaderContainer}>
            <Text style={styles.subHeaderTitle}>Disponíveis para Adoção</Text>
        </View>

        {/* GRADE DE PETS */}
        <FlatList
          data={ANIMAIS_ONG}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AnimalGridCard item={item} />}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

        {/* MODAL DE FILTRO */}
        <FilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#fff", 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1 },

  // Fundo Decorativo
  bgShapeRight: {
    position: 'absolute',
    top: 150,
    right: -50,
    width: 300,
    height: 550,
    backgroundColor: '#94B9D8',
    borderTopLeftRadius: 200,
    borderBottomLeftRadius: 200,
    opacity: 0.6,
    zIndex: -1,
  },

  // Header
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 30, 
    paddingBottom: 10 
  },
  headerTitle: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#2D68A6',
    marginBottom: -5 
  },

  // Subtítulo
  subHeaderContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    marginTop: 20, 
    marginBottom: 20 
  },
  subHeaderTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#2D68A6' 
  },

  // Grid
  listContent: { paddingHorizontal: 15, paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  cardContainer: { backgroundColor: '#fff', borderRadius: 12, width: '48%', overflow: 'hidden', shadowColor: "#2D68A6", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: '#f0f0f0' },
  cardImage: { width: '100%', height: 130 },
  cardInfo: { padding: 10 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#2D68A6', marginBottom: 4 },
  cardDetails: { fontSize: 11, color: '#555' },
  cardStatus: { fontWeight: 'bold', color: '#333' },
  verMaisLink: { alignSelf: 'flex-end', marginTop: 8 },
  verMaisText: { fontSize: 10, color: '#8FA7B8', fontWeight: 'bold' },

  // Modal Filtro
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
  filterSidebar: { width: '75%', backgroundColor: '#fff', padding: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20 },
  modalCloserArea: { width: '25%' },
  
  filterHeader: { alignItems: 'center', marginBottom: 25, marginTop: 40 }, 
  filterTitle: { fontSize: 26, fontWeight: 'bold', color: '#2D68A6' },
  
  filterLabel: { fontSize: 16, fontWeight: '500', color: '#2D68A6', marginTop: 15, marginBottom: 8 },
  filterInput: { borderWidth: 1, borderColor: '#A0B4CC', borderRadius: 6, paddingVertical: 4, paddingHorizontal: 10, height: 35 },
  
  switchContainer: { paddingLeft: 5 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  switchLabel: { fontSize: 16, color: '#2D68A6' },

  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn: { borderWidth: 1, borderColor: '#A0B4CC', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#fff', marginBottom: 5 },
  optionBtnSelected: { backgroundColor: '#2D68A6', borderColor: '#2D68A6' },
  optionText: { color: '#2D68A6', fontSize: 14, fontWeight: '500' },
  optionTextSelected: { color: '#fff', fontWeight: 'bold' },

  lostFoundButton: { marginTop: 40, marginBottom: 20 },
  lostFoundText: { color: '#2D68A6', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase' }
});