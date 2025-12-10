import React, { useState, useCallback } from 'react';
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
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

// Import da API configurada
import api from '@/lib/axios';

// --- TIPOS (Adaptados ao retorno do Backend) ---
interface Animal {
  id: number;
  nome: string;
  photoURL: string | null; // Agora vem do backend como string (URL)
  raca: string | null;
  status: string; // "DISPONIVEL", "ADOTADO", etc.
  especie: string;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

// --- CARD DO ANIMAL ---
const AnimalGridCard = ({ item }: { item: Animal }) => {
  const router = useRouter(); 

  // Define a imagem: Se tiver URL usa ela, senão usa placeholder
  const imageSource = item.photoURL 
    ? { uri: item.photoURL } 
    : require('../../../assets/images/ui/gatoHome.png'); // Imagem padrão se não tiver foto

  // Formata o status para ficar bonitinho
  const statusFormatado = item.status.charAt(0) + item.status.slice(1).toLowerCase();

  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      activeOpacity={0.9}
      // Passa o ID para a tela de detalhes
      onPress={() => router.push({ pathname: '/(ong)/detalhes-pet-ong', params: { id: item.id } } as any)}
    >
      <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.cardDetails} numberOfLines={1}>
          {item.raca || "SRD"}
        </Text>
        <Text style={[styles.cardStatus, { 
            color: item.status === 'DISPONIVEL' ? '#27AE60' : '#E67E22' 
        }]}>
            {statusFormatado}
        </Text>
        
        <View style={styles.verMaisLink}>
          <Text style={styles.verMaisText}>Ver mais</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- MODAL DE FILTRO (UI Mantida, Lógica futura) ---
const FilterModal = ({ visible, onClose }: FilterModalProps) => {
    const router = useRouter();
    const [isGato, setIsGato] = useState(false);
    // ... (Mantive o código visual do filtro igual para usarmos depois)
    
    return (
      <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.filterSidebar}>
            <View style={styles.filterHeader}>
                <Text style={styles.filterTitle}>Filtros</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={{textAlign:'center', color:'#999', marginTop: 20}}>
                    (Filtros serão implementados em breve)
                </Text>
                <TouchableOpacity style={styles.applyButton} onPress={onClose}>
                    <Text style={styles.applyButtonText}>FECHAR</Text>
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
  
  // Estados de Dados
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  // Função de Busca
  const fetchAnimais = async () => {
    try {
      setLoading(true);
      // Chama a rota de gerenciamento que retorna TUDO da ONG
      const response = await api.get('/animais/gerenciar/lista');
      setAnimais(response.data);
    } catch (error) {
      console.error("Erro ao buscar animais:", error);
      // Opcional: Alert.alert("Erro", "Não foi possível carregar os animais.");
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect: Roda toda vez que a tela ganha foco (ex: ao voltar do cadastro)
  useFocusEffect(
    useCallback(() => {
      fetchAnimais();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bgShapeRight} />

      <View style={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <Ionicons name="menu-outline" size={32} color="#2D68A6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Animais da ONG</Text>
          <TouchableOpacity onPress={() => router.push('/(ong)/notificacoes-ong' as any)}>
            <Ionicons name="notifications-outline" size={28} color="#2D68A6" />
          </TouchableOpacity>
        </View>

        <View style={styles.subHeaderContainer}>
            <Text style={styles.subHeaderTitle}>Gerenciamento de Pets</Text>
            <Text style={{color:'#666', fontSize: 12}}>Total: {animais.length}</Text>
        </View>

        {/* LISTAGEM */}
        {loading ? (
             <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size="large" color="#2D68A6" />
             </View>
        ) : (
            <FlatList
            data={animais}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <AnimalGridCard item={item} />}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
                <View style={{alignItems:'center', marginTop: 50}}>
                    <Ionicons name="paw-outline" size={50} color="#ccc" />
                    <Text style={{color:'#999', marginTop: 10}}>Nenhum animal cadastrado.</Text>
                </View>
            }
            />
        )}

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
  subHeaderContainer: { paddingHorizontal: 20, marginTop: 20, marginBottom: 20, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  subHeaderTitle: { fontSize: 18, fontWeight: '600', color: '#2D68A6' },

  listContent: { paddingHorizontal: 15, paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  
  // CARD STYLES
  cardContainer: { backgroundColor: '#fff', borderRadius: 12, width: '48%', overflow: 'hidden', elevation: 3, borderWidth: 1, borderColor: '#f0f0f0', shadowColor: "#2D68A6", shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: {width:0, height:2} },
  cardImage: { width: '100%', height: 130, backgroundColor: '#eee' }, // bg cinza enquanto carrega
  cardInfo: { padding: 10 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#2D68A6', marginBottom: 4 },
  cardDetails: { fontSize: 12, color: '#555', marginBottom: 2 },
  cardStatus: { fontWeight: 'bold', fontSize: 11, marginBottom: 5 },
  verMaisLink: { alignSelf: 'flex-end', marginTop: 4 },
  verMaisText: { fontSize: 10, color: '#8FA7B8', fontWeight: 'bold' },

  // --- FILTRO STYLES (Mantidos para não quebrar layout) ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
  filterSidebar: { width: '80%', backgroundColor: '#fff', padding: 20, borderTopRightRadius: 30, borderBottomRightRadius: 30 },
  modalCloserArea: { width: '20%' },
  filterHeader: { alignItems: 'center', marginBottom: 25, marginTop: 20 },
  filterTitle: { fontSize: 28, fontWeight: 'bold', color: '#2D68A6' },
  applyButton: { backgroundColor: '#2D68A6', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 30, marginBottom: 10 },
  applyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});