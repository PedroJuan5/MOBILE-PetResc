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

// --- DADOS ---
const ANIMAIS_ONG: Animal[] = [
  { id: '1', nome: 'Branquinho', imagem: require('../../../assets/images/pets/branquinho.png'), raca: 'Sem raça definida (SRD)', status: 'AD.' },
  { id: '2', nome: 'Frajola', imagem: require('../../../assets/images/ui/gatoHome.png'), raca: 'Sem raça definida (SRD)', status: 'FI.' },
  { id: '3', nome: 'Zeus', imagem: require('../../../assets/images/pets/mel.png'), raca: 'Pitbull', status: 'FI.' },
  { id: '4', nome: 'Paçoca', imagem: require('../../../assets/images/pets/caramelo.png'), raca: 'Não informado', status: 'AD.' },
  { id: '5', nome: 'Negão', imagem: require('../../../assets/images/pets/jimjim.png'), raca: 'Sem raça definida (SRD)', status: 'AD.' },
  { id: '6', nome: 'Caramelo', imagem: require('../../../assets/images/pets/caramelo.png'), raca: 'Sem raça definida (SRD)', status: 'FI.' },
];

// --- CARD DO ANIMAL ---
const AnimalGridCard = ({ item }: { item: Animal }) => {
  const router = useRouter(); 
  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      activeOpacity={0.9}
   onPress={() => router.push({ pathname: '/(ong)/detalhes-pet-ong', params: { id: item.id } } as any)}
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

    // Novos Estados para Porte, Raça e Idade
    const [porteSelecionado, setPorteSelecionado] = useState<string>('');
    const [idadeSelecionada, setIdadeSelecionada] = useState<string>('');
    const [racaDigitada, setRacaDigitada] = useState('');

    const toggleSelection = (currentValue: string, newValue: string, setter: (val: string) => void) => {
        setter(currentValue === newValue ? '' : newValue);
    };

    const SwitchRow = ({ label, value, onValueChange }: any) => (
        <View style={styles.switchRow}>
            <Switch 
                trackColor={{ false: "#A0B4CC", true: "#5C8BB8" }} 
                thumbColor={value ? "#2D68A6" : "#f4f3f4"} 
                onValueChange={onValueChange} 
                value={value} 
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }} 
            />
            <Text style={styles.switchLabel}>{label}</Text>
        </View>
    );

    const FilterChip = ({ label, selected, onPress }: any) => (
        <TouchableOpacity 
            style={[styles.chip, selected && styles.chipSelected]} 
            onPress={onPress}
        >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterSidebar}>
            
            <View style={styles.filterHeader}>
                <Text style={styles.filterTitle}>Filtros</Text>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
                
                {/* Nome ou ID */}
                <Text style={styles.filterLabel}>Nome ou id</Text>
                <TextInput style={styles.filterInput} />

                {/* Espécie */}
                <Text style={styles.filterLabel}>Espécie</Text>
                <View style={styles.switchContainer}>
                    <SwitchRow label="Gato" value={isGato} onValueChange={setIsGato} />
                    <SwitchRow label="Cães" value={isCaes} onValueChange={setIsCaes} />
                    <SwitchRow label="Todos" value={isTodos} onValueChange={setIsTodos} />
                </View>

                {/* Gênero */}
                <Text style={styles.filterLabel}>Gênero</Text>
                <View style={styles.switchContainer}>
                    <SwitchRow label="Macho" value={isMacho} onValueChange={setIsMacho} />
                    <SwitchRow label="Fêmea" value={isFemea} onValueChange={setIsFemea} />
                </View>

                {/* Porte */}
                <Text style={styles.filterLabel}>Porte</Text>
                <View style={styles.chipsContainer}>
                    {['Pequeno', 'Médio', 'Grande'].map((porte) => (
                        <FilterChip 
                            key={porte} 
                            label={porte} 
                            selected={porteSelecionado === porte} 
                            onPress={() => toggleSelection(porteSelecionado, porte, setPorteSelecionado)} 
                        />
                    ))}
                </View>

                {/* Raça */}
                <Text style={styles.filterLabel}>Raça</Text>
                <TextInput 
                    style={styles.filterInput} 
                    placeholder="Digite a raça (ex: Poodle)" 
                    value={racaDigitada}
                    onChangeText={setRacaDigitada}
                />

                {/* Idade */}
                <Text style={styles.filterLabel}>Idade</Text>
                <View style={styles.chipsContainer}>
                    {['Filhote', 'Adulto', 'Idoso'].map((idade) => (
                        <FilterChip 
                            key={idade} 
                            label={idade} 
                            selected={idadeSelecionada === idade} 
                            onPress={() => toggleSelection(idadeSelecionada, idade, setIdadeSelecionada)} 
                        />
                    ))}
                </View>

                {/* BOTÃO APLICAR FILTROS */}
                <TouchableOpacity style={styles.applyButton} onPress={onClose}>
                    <Text style={styles.applyButtonText}>APLICAR FILTROS</Text>
                </TouchableOpacity>

                {/* LINK PERDIDOS E ACHADOS (ROTA CORRIGIDA) */}
             <TouchableOpacity 
    style={styles.lostFoundButton}
    onPress={() => {
        onClose(); 
        router.push('/(ong)/(tabs)/perdidos-achados-ong' as any); 
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
      <View style={styles.bgShapeRight} />

      <View style={styles.container}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <Ionicons name="menu-outline" size={32} color="#2D68A6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Animais da ONG</Text>
          <TouchableOpacity onPress={() => router.push('/(ong)/notificacoes' as any)}>
            <Ionicons name="notifications-outline" size={28} color="#2D68A6" />
          </TouchableOpacity>
        </View>

        <View style={styles.subHeaderContainer}>
            <Text style={styles.subHeaderTitle}>Disponíveis para Adoção</Text>
        </View>

        <FlatList
          data={ANIMAIS_ONG}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AnimalGridCard item={item} />}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

        <FilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff", paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1 },

  bgShapeRight: {
    position: 'absolute', top: 150, right: -50, width: 300, height: 550,
    backgroundColor: '#94B9D8', borderTopLeftRadius: 200, borderBottomLeftRadius: 200, opacity: 0.6, zIndex: -1,
  },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 30, paddingBottom: 10 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#2D68A6', marginBottom: -5 },
  subHeaderContainer: { paddingHorizontal: 20, marginTop: 20, marginBottom: 20 },
  subHeaderTitle: { fontSize: 18, fontWeight: '600', color: '#2D68A6' },

  listContent: { paddingHorizontal: 15, paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  cardContainer: { backgroundColor: '#fff', borderRadius: 12, width: '48%', overflow: 'hidden', elevation: 3, borderWidth: 1, borderColor: '#f0f0f0', shadowColor: "#2D68A6", shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: {width:0, height:2} },
  cardImage: { width: '100%', height: 130 },
  cardInfo: { padding: 10 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#2D68A6', marginBottom: 4 },
  cardDetails: { fontSize: 11, color: '#555' },
  cardStatus: { fontWeight: 'bold', color: '#333' },
  verMaisLink: { alignSelf: 'flex-end', marginTop: 8 },
  verMaisText: { fontSize: 10, color: '#8FA7B8', fontWeight: 'bold' },

  // --- FILTRO STYLES ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
  filterSidebar: { 
    width: '80%', 
    backgroundColor: '#fff', 
    padding: 20, 
    borderTopRightRadius: 30, 
    borderBottomRightRadius: 30 
  },
  modalCloserArea: { width: '20%' },
  
  filterHeader: { alignItems: 'center', marginBottom: 25, marginTop: 20 },
  filterTitle: { fontSize: 28, fontWeight: 'bold', color: '#2D68A6' },
  
  filterLabel: { fontSize: 18, fontWeight: '500', color: '#2D68A6', marginTop: 15, marginBottom: 8 },
  filterInput: { 
    borderWidth: 1, 
    borderColor: '#A0B4CC', 
    borderRadius: 8, 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    height: 40,
    fontSize: 16
  },
  
  switchContainer: { paddingLeft: 0 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  switchLabel: { fontSize: 18, color: '#2D68A6', marginLeft: 15 },

  chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
  },
  chip: {
      borderWidth: 1,
      borderColor: '#A0B4CC',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 15,
      backgroundColor: '#fff',
  },
  chipSelected: {
      backgroundColor: '#2D68A6',
      borderColor: '#2D68A6',
  },
  chipText: {
      color: '#2D68A6',
      fontSize: 14,
      fontWeight: '600',
  },
  chipTextSelected: {
      color: '#fff',
  },

  applyButton: {
      backgroundColor: '#2D68A6',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 10,
  },
  applyButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
  },

  lostFoundButton: { marginTop: 10, marginBottom: 20, alignItems: 'center' },
  lostFoundText: { color: '#2D68A6', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase' }
});