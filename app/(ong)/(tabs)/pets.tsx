import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '@/lib/axios';

// TIPOS
interface Animal {
  id: number;
  nome: string;
  photoURL: string | null;
  raca: string | null;
  status: string; // "DISPONIVEL", "ADOTADO", "INDISPONIVEL"
  especie: string;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filtroAtual: string;
  setFiltro: (filtro: string) => void;
}

// --- CARD DO ANIMAL ---
const AnimalGridCard = ({ item }: { item: Animal }) => {
  const router = useRouter(); 
  const BASE_URL = "https://petresc.onrender.com"; 

  let imageSource;
  if (item.photoURL) {
      const uri = item.photoURL.startsWith('http') 
          ? item.photoURL 
          : `${BASE_URL}/${item.photoURL.replace(/\\/g, '/')}`;
      imageSource = { uri };
  } else {
      imageSource = require('../../../assets/images/ui/gatoHome.png'); 
  }

  const statusFormatado = item.status.charAt(0) + item.status.slice(1).toLowerCase();
  const statusColor = item.status === 'DISPONIVEL' ? '#27AE60' : (item.status === 'ADOTADO' ? '#2D68A6' : '#E67E22');

  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      activeOpacity={0.9}
      onPress={() => router.push({ 
          pathname: '/(ong)/gerenciar-adocao-ong', 
          params: { petId: item.id } 
      } as any)}
    >
      <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.cardDetails} numberOfLines={1}>{item.raca || "SRD"}</Text>
        <Text style={[styles.cardStatus, { color: statusColor }]}>{statusFormatado}</Text>
        <View style={styles.verMaisLink}><Text style={styles.verMaisText}>Ver mais</Text></View>
      </View>
    </TouchableOpacity>
  );
};

// --- COMPONENTE DE FILTRO (SIDEBAR) ---
const FilterModal = ({ visible, onClose, filtroAtual, setFiltro }: FilterModalProps) => {
    // Opções de Filtro baseadas no Status do Backend
    const opcoes = [
        { label: "Todos", valor: "Todos" },
        { label: "Disponíveis", valor: "DISPONIVEL" },
        { label: "Adotados", valor: "ADOTADO" },
        { label: "Indisponíveis", valor: "INDISPONIVEL" },
        { label: "Em Processo", valor: "PENDENTE" } // Se tiver esse status no animal
    ];

    return (
      <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          
          {/* SIDEBAR */}
          <View style={styles.filterSidebar}>
            
            <View style={styles.filterHeader}>
                <TouchableOpacity onPress={onClose} style={{position:'absolute', left: 0}}>
                    <Ionicons name="close" size={24} color="#2D68A6"/>
                </TouchableOpacity>
                <Text style={styles.filterTitle}>Filtros</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.filterSectionTitle}>Status do Animal</Text>
                
                {opcoes.map((opcao) => (
                    <TouchableOpacity 
                        key={opcao.valor}
                        style={[
                            styles.filterOption, 
                            filtroAtual === opcao.valor && styles.filterOptionActive
                        ]}
                        onPress={() => {
                            setFiltro(opcao.valor);
                            onClose(); // Fecha ao selecionar
                        }}
                    >
                        <Text style={[
                            styles.filterOptionText,
                            filtroAtual === opcao.valor && styles.filterOptionTextActive
                        ]}>
                            {opcao.label}
                        </Text>
                        {filtroAtual === opcao.valor && (
                            <Ionicons name="checkmark" size={20} color="#FFF" />
                        )}
                    </TouchableOpacity>
                ))}

            </ScrollView>
          </View>
          
          {/* ÁREA TRANSPARENTE PARA FECHAR */}
          <TouchableOpacity style={styles.modalCloserArea} onPress={onClose} activeOpacity={1} />
        </View>
      </Modal>
    );
};

// --- TELA PRINCIPAL ---
export default function PetsOngScreen() {
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);
  
  // Estados
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("Todos"); // Estado do Filtro

  // Busca
  const fetchAnimais = async () => {
    try {
      setLoading(true);
      const response = await api.get('/animais/gerenciar/lista');
      setAnimais(response.data);
    } catch (error) {
      console.error("Erro ao buscar animais:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAnimais();
    }, [])
  );

  // Lógica de Filtragem (Frontend)
  const animaisFiltrados = useMemo(() => {
      if (filtroStatus === "Todos") return animais;
      // Filtra exatamente pelo status (ex: "DISPONIVEL")
      // Se quiser filtrar "Em processo" e o status for PENDENTE, mapeie aqui
      return animais.filter(animal => animal.status === filtroStatus);
  }, [animais, filtroStatus]);

  // Label para exibir no topo (Ex: "Exibindo: Adotados")
  const labelFiltro = filtroStatus === "Todos" 
    ? "Todos os Animais" 
    : filtroStatus.charAt(0) + filtroStatus.slice(1).toLowerCase() + "s"; 

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bgShapeRight} />

      <View style={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          {/* Botão de Menu abre o Filtro */}
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <Ionicons name="filter" size={28} color="#2D68A6" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Animais da ONG</Text>
          
          <TouchableOpacity onPress={() => router.push('/(ong)/notificacoes-ong' as any)}>
            <Ionicons name="notifications-outline" size={28} color="#2D68A6" />
          </TouchableOpacity>
        </View>

        <View style={styles.subHeaderContainer}>
            <Text style={styles.subHeaderTitle}>{labelFiltro}</Text>
            <Text style={{color:'#666', fontSize: 12}}>Total: {animaisFiltrados.length}</Text>
        </View>

        {/* LISTAGEM FILTRADA */}
        {loading ? (
             <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size="large" color="#2D68A6" />
             </View>
        ) : (
            <FlatList
                data={animaisFiltrados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <AnimalGridCard item={item} />}
                numColumns={2}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={{alignItems:'center', marginTop: 50}}>
                        <Ionicons name="paw-outline" size={50} color="#ccc" />
                        <Text style={{color:'#999', marginTop: 10}}>Nenhum animal encontrado neste filtro.</Text>
                    </View>
                }
            />
        )}

        {/* MODAL DE FILTRO */}
        <FilterModal 
            visible={filterVisible} 
            onClose={() => setFilterVisible(false)} 
            filtroAtual={filtroStatus}
            setFiltro={setFiltroStatus}
        />

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
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2D68A6' },
  subHeaderContainer: { paddingHorizontal: 20, marginTop: 10, marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  subHeaderTitle: { fontSize: 16, fontWeight: '600', color: '#2D68A6' },

  listContent: { paddingHorizontal: 15, paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  
  // CARD STYLES
  cardContainer: { backgroundColor: '#fff', borderRadius: 12, width: '48%', overflow: 'hidden', elevation: 3, borderWidth: 1, borderColor: '#f0f0f0', shadowColor: "#2D68A6", shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: {width:0, height:2} },
  cardImage: { width: '100%', height: 130, backgroundColor: '#eee' }, 
  cardInfo: { padding: 10 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#2D68A6', marginBottom: 4 },
  cardDetails: { fontSize: 12, color: '#555', marginBottom: 2 },
  cardStatus: { fontWeight: 'bold', fontSize: 11, marginBottom: 5 },
  verMaisLink: { alignSelf: 'flex-end', marginTop: 4 },
  verMaisText: { fontSize: 10, color: '#8FA7B8', fontWeight: 'bold' },

  // --- FILTRO SIDEBAR STYLES ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
  filterSidebar: { width: '75%', backgroundColor: '#fff', padding: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20 },
  modalCloserArea: { width: '25%' }, // Área transparente para fechar
  
  filterHeader: { flexDirection: 'row', alignItems: 'center', justifyContent:'center', marginBottom: 30, marginTop: 10, position: 'relative' },
  filterTitle: { fontSize: 22, fontWeight: 'bold', color: '#2D68A6' },
  
  filterSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#666', marginBottom: 15, marginTop: 10 },
  
  // Opção de Filtro (Botão)
  filterOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 10,
      marginBottom: 10,
      backgroundColor: '#F5F8FA', // Cor inativa
  },
  filterOptionActive: {
      backgroundColor: '#2D68A6', // Cor ativa (Azul)
  },
  filterOptionText: {
      fontSize: 16,
      color: '#2D68A6',
      fontWeight: '500'
  },
  filterOptionTextActive: {
      color: '#FFF',
      fontWeight: 'bold'
  }
});