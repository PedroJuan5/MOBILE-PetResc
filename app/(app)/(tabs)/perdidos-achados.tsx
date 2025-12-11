import React, { useState, useLayoutEffect, useMemo, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Switch,
  TextInput,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter, useFocusEffect } from "expo-router";
import { DenuncieModal } from "../../../components/denuncieModal"; 
import api from '@/lib/axios'; // Seu axios configurado

// --- TIPOS ---
interface Pet {
  id: number;
  nome: string;
  raca: string | null;
  sexo: string | null; // 'MACHO', 'FEMEA'
  especie: string; // 'CACHORRO', 'GATO'
  photoURL: string | null;
  status: string; // 'PERDIDO', 'ACHADO'
  local_cidade?: string; // Se vier do back
}

interface Filtros {
  nome?: string;
  isGato?: boolean;
  isCao?: boolean;
  isMacho?: boolean;
  isFemea?: boolean;
  raca?: string;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 20 * 3) / 2;

// --- COMPONENTE DE FILTRO (MODAL) ---
const FilterModal = ({ visible, onClose, onApply }: { visible: boolean; onClose: () => void; onApply: (f: Filtros) => void }) => {
    const router = useRouter();
    
    const [isGato, setIsGato] = useState(true);
    const [isCaes, setIsCaes] = useState(true);
    const [isTodos, setIsTodos] = useState(true);
    const [isMacho, setIsMacho] = useState(true);
    const [isFemea, setIsFemea] = useState(true);
    const [racaDigitada, setRacaDigitada] = useState('');
    const [nomeDigitado, setNomeDigitado] = useState('');

    const SwitchRow = ({ label, value, onValueChange }: any) => (
        <View style={styles.switchRow}>
            <Switch trackColor={{ false: "#A0B4CC", true: "#5C8BB8" }} thumbColor={value ? "#2D68A6" : "#f4f3f4"} onValueChange={onValueChange} value={value} style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }} />
            <Text style={styles.switchLabel}>{label}</Text>
        </View>
    );

    const handleApply = () => {
        onApply({ nome: nomeDigitado, isGato, isCao: isCaes, isMacho, isFemea, raca: racaDigitada });
        onClose();
    };

    return (
      <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.filterSidebar}>
            <View style={styles.filterHeader}>
                <Text style={styles.filterTitle}>Filtros</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
                <Text style={styles.filterLabel}>Nome ou ID</Text>
                <TextInput style={styles.filterInput} value={nomeDigitado} onChangeText={setNomeDigitado} placeholder="Nome do pet..."/>

                <Text style={styles.filterLabel}>Espécie</Text>
                <View style={styles.switchContainer}>
                    <SwitchRow label="Gato" value={isGato} onValueChange={setIsGato} />
                    <SwitchRow label="Cães" value={isCaes} onValueChange={setIsCaes} />
                    <SwitchRow label="Todos" value={isTodos} onValueChange={(val: boolean) => { setIsTodos(val); setIsGato(val); setIsCaes(val); }} />
                </View>

                <Text style={styles.filterLabel}>Gênero</Text>
                <View style={styles.switchContainer}>
                    <SwitchRow label="Macho" value={isMacho} onValueChange={setIsMacho} />
                    <SwitchRow label="Fêmea" value={isFemea} onValueChange={setIsFemea} />
                </View>

                <Text style={styles.filterLabel}>Raça</Text>
                <TextInput style={styles.filterInput} placeholder="Digite a raça" value={racaDigitada} onChangeText={setRacaDigitada} />

                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                    <Text style={styles.applyButtonText}>APLICAR FILTROS</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.lostFoundButton}
                    onPress={() => {
                        onClose(); 
                        router.navigate('/(app)/(tabs)/pets-disponiveis' as any); 
                    }}
                >
                    <Text style={styles.lostFoundText}>VER PETS PARA ADOÇÃO</Text>
                </TouchableOpacity>
            </ScrollView>
          </View>
          <TouchableOpacity style={styles.modalCloserArea} onPress={onClose} activeOpacity={1} />
        </View>
      </Modal>
    );
};

// --- TELA PRINCIPAL ---
export default function PerdidosAchadosScreen() {
  const [filtroVisivel, setFiltroVisivel] = useState(false);
  const [denunciaVisivel, setDenunciaVisivel] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState<Filtros>({});
  
  // Estado para dados reais da API
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const router = useRouter();

  // Busca dados ao focar na tela
  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [])
  );

  const fetchPets = async () => {
    try {
      setLoading(true);
      // Busca todos e filtra no front (ou poderia filtrar na query da API se suportado)
      // Aqui assumo que o endpoint '/animais' retorna todos ou aceita filtro status
      // Se seu backend suporta OR no status via query, melhor. Senão, pegamos todos e filtramos.
      const response = await api.get('/animais'); 
      // Filtra apenas PERDIDO ou ACHADO (ENCONTRADO no seu prisma enum)
      const todosAnimais: Pet[] = response.data;
      const perdidosAchados = todosAnimais.filter(p => p.status === 'PERDIDO' || p.status === 'ENCONTRADO' || p.status === 'ACHADO');
      setPets(perdidosAchados);
    } catch (error) {
      console.error("Erro ao buscar perdidos/achados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtragem local baseada no modal
  const petsFiltrados = useMemo(() => {
    return pets.filter((pet) => {
      const f = filtrosAplicados;
      
      // Filtro de Nome
      if (f.nome && !pet.nome.toLowerCase().includes(f.nome.toLowerCase())) return false;
      
      // Filtro de Espécie (Backend retorna 'CACHORRO' ou 'GATO' geralmente em maiúsculo)
      const especiePet = pet.especie?.toUpperCase() || "";
      if (f.isGato === false && especiePet === "GATO") return false;
      if (f.isCao === false && especiePet === "CACHORRO") return false;
      
      // Filtro de Gênero
      const sexoPet = pet.sexo?.toUpperCase() || "";
      if (f.isMacho === false && (sexoPet === "MACHO" || sexoPet === "M")) return false;
      if (f.isFemea === false && (sexoPet === "FEMEA" || sexoPet === "F")) return false;
      
      // Filtro de Raça
      if (f.raca && pet.raca && !pet.raca.toLowerCase().includes(f.raca.toLowerCase())) return false;
      
      return true;
    });
  }, [pets, filtrosAplicados]);

  // Helper de imagem
  const getImageSource = (url: string | null) => {
      if (!url) return require("../../../assets/images/pets/branquinho.png");
      if (url.startsWith('http')) return { uri: url };
      return { uri: `https://petresc.onrender.com/${url.replace(/\\/g, '/')}` };
  };

  useLayoutEffect(() => { navigation.setOptions({ headerShown: false }); }, [navigation]);

  return (
    <SafeAreaView style={styles.areaSegura}>
      <View style={styles.bgShapeRight} />

      <FilterModal visible={filtroVisivel} onClose={() => setFiltroVisivel(false)} onApply={setFiltrosAplicados} />
      <DenuncieModal visible={denunciaVisivel} onClose={() => setDenunciaVisivel(false)} />

      <View style={styles.container}>
        
        {/* CABEÇALHO */}
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => setDenunciaVisivel(true)}>
            <Ionicons name="alert-circle-outline" size={28} color="#2D68A6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perdidos e Achados</Text>
          <TouchableOpacity onPress={() => router.push('/notificacoes' as any)}>
            <Ionicons name="notifications-outline" size={28} color="#2D68A6" /> 
          </TouchableOpacity>
        </View>

        {/* SUB CABEÇALHO */}
        <View style={styles.subCabecalho}>
          <TouchableOpacity onPress={() => setFiltroVisivel(true)}>
            <Ionicons name="menu" size={32} color="#2D68A6" />
          </TouchableOpacity>
          <Text style={styles.tituloSecundario}>Animais em destaque</Text>
        </View>

        {loading ? (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size="large" color="#2D68A6" />
            </View>
        ) : (
            <FlatList
              data={petsFiltrados}
              renderItem={({ item }) => (
                <TouchableOpacity 
                    style={styles.petCard} 
                    activeOpacity={0.9}
                    onPress={() => router.push({ 
                        pathname: '/(app)/detalhes-pet', // Usa detalhes-pet genérico
                        params: { id: item.id } 
                    } as any)}
                >
                  <Image 
                    source={getImageSource(item.photoURL) as any} 
                    style={styles.petCardImage} 
                  />
                  
                  <View style={styles.petCardOverlay}>
                    <Text style={styles.petCardNome} numberOfLines={1}>{item.nome}</Text>
                    <Text style={styles.petCardRaca} numberOfLines={1}>{item.raca || "SRD"}</Text>
                    
                    <View style={styles.statusContainer}>
                        <Text style={[
                            styles.statusText, 
                            (item.status === 'PERDIDO' || item.status === 'Perdido') 
                                ? { color: '#FF3B30' } 
                                : { color: '#34C759' }
                        ]}>
                            {(item.status === 'PERDIDO' || item.status === 'Perdido') ? 'PERDIDO' : 'ACHADO'}
                        </Text> 
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.row}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<Text style={styles.textoVazio}>Nenhum animal encontrado.</Text>}
            />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  areaSegura: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1, paddingHorizontal: 10 },
  
  customHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 10, paddingHorizontal: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2D68A6' },
  
  subCabecalho: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10, marginTop: 10, marginBottom: 15 },
  tituloSecundario: { fontSize: 18, fontWeight: "600", color: "#3A5C7A",flex: 1, textAlign: "center"},
  
  textoVazio: { textAlign: "center", marginTop: 50, color: "#3A5C7A" },
  row: { justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 5 },
  
  // Cards
  petCard: { width: cardWidth, height: cardWidth * 1.3, borderRadius: 12, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, backgroundColor: '#EAF6FF', marginHorizontal: 5, marginBottom: 10 }, 
  petCardImage: { width: '100%', height: '70%', resizeMode: 'cover' },
  petCardOverlay: { padding: 10, flex: 1, justifyContent: 'center' },
  petCardNome: { fontSize: 18, fontWeight: 'bold', color: '#2D68A6' },
  petCardRaca: { fontSize: 11, color: '#555', marginTop: 2 },
  statusContainer: { position: 'absolute', bottom: 10, right: 10 },
  statusText: { fontSize: 10, fontWeight: 'bold' },

  bgShapeRight: { position: 'absolute', top: 180, right: -50, width: 300, height: 600, backgroundColor: '#94B9D8', borderTopLeftRadius: 200, borderBottomLeftRadius: 200, opacity: 0.6, zIndex: -1 },

  // Filtro Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
  filterSidebar: { width: '80%', backgroundColor: '#fff', padding: 20, borderTopRightRadius: 30, borderBottomRightRadius: 30 },
  modalCloserArea: { width: '20%' },
  filterHeader: { alignItems: 'center', marginBottom: 25, marginTop: 20 },
  filterTitle: { fontSize: 28, fontWeight: 'bold', color: '#2D68A6' },
  filterLabel: { fontSize: 18, fontWeight: '500', color: '#2D68A6', marginTop: 15, marginBottom: 8 },
  filterInput: { borderWidth: 1, borderColor: '#A0B4CC', borderRadius: 8, paddingVertical: 5, paddingHorizontal: 10, height: 40, fontSize: 16 },
  switchContainer: { paddingLeft: 0 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  switchLabel: { fontSize: 18, color: '#2D68A6', marginLeft: 15 },
  applyButton: { backgroundColor: '#2D68A6', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 30, marginBottom: 10 },
  applyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  lostFoundButton: { marginTop: 10, marginBottom: 20, alignItems: 'center' },
  lostFoundText: { color: '#2D68A6', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase' }
});