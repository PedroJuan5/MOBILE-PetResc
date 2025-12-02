import React, { useState, useLayoutEffect, useMemo, useEffect, useCallback } from "react";
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
  ActivityIndicator,
  RefreshControl,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { DenuncieModal } from "../../../components/denuncieModal"; 
import api from "../../../lib/axios"; 

// Tipos
interface Pet {
  id: number;
  nome: string;
  raca: string;
  genero: string;
  especie: string;
  idade: string; // Mapeado de número para texto (Filhote, Adulto...)
  tamanho: string; // Mapeado de 'porte'
  photoURL: string | null;
  status: string;
}

interface Filtros {
  nome?: string;
  isGato?: boolean;
  isCao?: boolean;
  isMacho?: boolean;
  isFemea?: boolean;
  porte?: string;
  raca?: string;
  idade?: string;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 20 * 3) / 2;

// --- MODAL DE FILTRO (VISUAL ONG) ---
const FilterModal = ({ visible, onClose, onApply }: { visible: boolean; onClose: () => void; onApply: (f: Filtros) => void }) => {
    const router = useRouter();
    
    //estados do Filtro
    const [isGato, setIsGato] = useState(true);
    const [isCaes, setIsCaes] = useState(true);
    const [isTodos, setIsTodos] = useState(true);
    
    const [isMacho, setIsMacho] = useState(true);
    const [isFemea, setIsFemea] = useState(true);

    const [porteSelecionado, setPorteSelecionado] = useState<string>('');
    const [idadeSelecionada, setIdadeSelecionada] = useState<string>('');
    const [racaDigitada, setRacaDigitada] = useState('');
    const [nomeDigitado, setNomeDigitado] = useState('');

    //toggle Seleção Única (Porte/Idade)
    const toggleSelection = (currentValue: string, newValue: string, setter: (val: string) => void) => {
        setter(currentValue === newValue ? '' : newValue);
    };

    //linha com Switch
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

    //botão Chip
    const FilterChip = ({ label, selected, onPress }: any) => (
        <TouchableOpacity style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
        </TouchableOpacity>
    );

    const handleApply = () => {
        onApply({
            nome: nomeDigitado, isGato, isCao: isCaes, isMacho, isFemea,
            porte: porteSelecionado, raca: racaDigitada, idade: idadeSelecionada
        });
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
                
                <Text style={styles.filterLabel}>Nome ou id</Text>
                <TextInput style={styles.filterInput} value={nomeDigitado} onChangeText={setNomeDigitado} placeholder="Busque por nome..."/>

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

                <Text style={styles.filterLabel}>Porte</Text>
                <View style={styles.chipsContainer}>
                    {['Pequeno', 'Médio', 'Grande'].map((porte) => (
                        <FilterChip key={porte} label={porte} selected={porteSelecionado === porte} onPress={() => toggleSelection(porteSelecionado, porte, setPorteSelecionado)} />
                    ))}
                </View>

                <Text style={styles.filterLabel}>Raça</Text>
                <TextInput style={styles.filterInput} placeholder="Digite a raça (Ex: Poodle)" value={racaDigitada} onChangeText={setRacaDigitada} />

                <Text style={styles.filterLabel}>Idade</Text>
                <View style={styles.chipsContainer}>
                    {['Filhote', 'Adulto', 'Idoso'].map((idade) => (
                        <FilterChip key={idade} label={idade} selected={idadeSelecionada === idade} onPress={() => toggleSelection(idadeSelecionada, idade, setIdadeSelecionada)} />
                    ))}
                </View>

              
                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                    <Text style={styles.applyButtonText}>APLICAR FILTROS</Text>
                </TouchableOpacity>

                {/*botão perdidos e achados*/}
             <TouchableOpacity 
                    style={styles.lostFoundButton}
                    onPress={() => {
                        onClose(); 
                        router.push('/(app)/(tabs)/perdidos-achados' as any); 
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

//tela principal
export default function TelaAdotar() {
  const [filtroVisivel, setFiltroVisivel] = useState(false);
  const [denunciaVisivel, setDenunciaVisivel] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState<Filtros>({});
  
  // Estados para dados da API
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const router = useRouter();

  // Função auxiliar para categorizar a idade (Número -> Texto)
  const formatarIdade = (idadeNum: number | null): string => {
      if (idadeNum === null) return "Adulto";
      if (idadeNum <= 1) return "Filhote";
      if (idadeNum >= 8) return "Idoso";
      return "Adulto";
  };

  // BUSCA DADOS DA API
  const fetchPets = useCallback(async () => {
    try {
        const response = await api.get('/animais');
        const todosAnimais = response.data;

        // Filtra apenas disponíveis e mapeia para o formato visual
        const disponiveis = todosAnimais
            .filter((p: any) => p.status === 'DISPONIVEL')
            .map((p: any) => ({
                id: p.id,
                nome: p.nome,
                raca: p.raca || "SRD",
                genero: p.sexo === 'MACHO' ? 'Macho' : 'Fêmea',
                especie: p.especie, // "Cachorro" ou "Gato" (conforme salvo no banco)
                idade: formatarIdade(p.idade), // Converte int para string
                tamanho: p.porte || "Médio", // Mapeia 'porte' para 'tamanho'
                photoURL: p.photoURL,
                status: 'disponivel' // Para controle de cor do bolinha
            }));

        setPets(disponiveis);
    } catch (error) {
        console.error("Erro ao buscar pets:", error);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const onRefresh = () => {
      setRefreshing(true);
      fetchPets();
  };

  // Filtragem no Client-Side
  const petsFiltrados = useMemo(() => {
    if (Object.keys(filtrosAplicados).length === 0) return pets;
    
    return pets.filter((pet) => {
      const f = filtrosAplicados;
      
      if (f.nome && !pet.nome.toLowerCase().includes(f.nome.toLowerCase())) return false;
      
      // Ajuste para bater com o que vem do banco (Cachorro/Gato vs Gato/Cães)
      if (f.isGato === false && pet.especie === "Gato") return false;
      if (f.isCao === false && (pet.especie === "Cachorro" || pet.especie === "Cães")) return false;
      
      if (f.isMacho === false && pet.genero === "Macho") return false;
      if (f.isFemea === false && pet.genero === "Fêmea") return false;
      
      if (f.porte && pet.tamanho.toLowerCase() !== f.porte.toLowerCase()) return false;
      if (f.raca && !pet.raca.toLowerCase().includes(f.raca.toLowerCase())) return false;
      if (f.idade && pet.idade.toLowerCase() !== f.idade.toLowerCase()) return false;
      
      return true;
    });
  }, [filtrosAplicados, pets]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handlePetPress = (petId: number) => {
    // Rota para detalhes (passando ID numérico)
    router.push({
      pathname: '/(app)/detalhes-pet',
      params: { id: petId }
    } as any);
  };

  return (
    <SafeAreaView style={styles.areaSegura}>
      
      {/*mancha azul de fundo*/}
      <View style={styles.bgShapeRight} />

      <FilterModal visible={filtroVisivel} onClose={() => setFiltroVisivel(false)} onApply={setFiltrosAplicados} />
      <DenuncieModal visible={denunciaVisivel} onClose={() => setDenunciaVisivel(false)} />

      <View style={styles.container}>
        
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => setDenunciaVisivel(true)}>
            <Ionicons name="alert-circle-outline" size={28} color="#2D68A6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nossos pets</Text>
          <TouchableOpacity onPress={() => router.push('/notificacoes')}>
            <Ionicons name="notifications-outline" size={28} color="#2D68A6" />
          </TouchableOpacity>
        </View>

        <View style={styles.subCabecalho}>
          <TouchableOpacity onPress={() => setFiltroVisivel(true)}>
            <Ionicons name="menu" size={32} color="#2D68A6" />
          </TouchableOpacity>
          <Text style={styles.tituloSecundario}>Animais em destaque</Text>
          <View style={{ width: 28 }} /> 
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#2D68A6" style={{marginTop: 50}} />
        ) : (
            <FlatList
            data={petsFiltrados}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.petCard} onPress={() => handlePetPress(item.id)}>
                {/* LÓGICA DE IMAGEM: Usa a URL do backend ou Placeholder local */}
                <Image 
                    source={item.photoURL ? { uri: item.photoURL } : require("../../../assets/images/pets/branquinho.png")} 
                    style={styles.petCardImage} 
                />
                
                <View style={styles.petCardOverlay}>
                    <Text style={styles.petCardNome}>{item.nome}</Text>
                    <View style={styles.petCardStatus}>
                    <Text style={styles.petCardDetalhe}>
                        {item.raca} {item.genero === 'Macho' ? 'M' : 'F'}.
                    </Text>
                    <View style={[styles.statusCircle, styles.statusDisponivel]} />
                    </View>
                </View>
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()} // Garante que o ID seja string para a lista
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            // Pull to Refresh
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2D68A6']} />
            }
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
  
  // Header
  customHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 10, paddingHorizontal: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2D68A6' },
  subCabecalho: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10, marginTop: 10, marginBottom: 15 },
  tituloSecundario: { fontSize: 18, fontWeight: "600", color: "#3A5C7A" },
  
  // Lista
  textoVazio: { textAlign: "center", marginTop: 50, color: "#3A5C7A" },
  row: { justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 5 },
  petCard: { width: cardWidth, height: cardWidth * 1.2, borderRadius: 12, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3.84, backgroundColor: '#fff', marginHorizontal: 5, marginBottom: 10 },
  petCardImage: { width: '100%', height: '100%', resizeMode: 'cover', position: 'absolute' },
  petCardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.85)', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, paddingVertical: 8, paddingHorizontal: 10 },
  petCardNome: { fontSize: 16, fontWeight: 'bold', color: '#3A5C7A', marginBottom: 2 },
  petCardStatus: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petCardDetalhe: { fontSize: 12, color: '#6A8CA6' },
  statusCircle: { width: 10, height: 10, borderRadius: 5 },
  statusDisponivel: { backgroundColor: '#34C759' },
  statusAdotado: { backgroundColor: '#FF9500' },
  statusPerdido: { backgroundColor: '#FF3B30' },
  
  // fundo mancha (Visual ONG)
  bgShapeRight: { position: 'absolute', top: 150, right: -50, width: 300, height: 550, backgroundColor: '#94B9D8', borderTopLeftRadius: 200, borderBottomLeftRadius: 200, opacity: 0.6, zIndex: -1 },

  //estilos do Modal de Filtros
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

  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { borderWidth: 1, borderColor: '#A0B4CC', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#fff' },
  chipSelected: { backgroundColor: '#2D68A6', borderColor: '#2D68A6' },
  chipText: { color: '#2D68A6', fontSize: 14, fontWeight: '600' },
  chipTextSelected: { color: '#fff' },

  applyButton: { backgroundColor: '#2D68A6', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 30, marginBottom: 10 },
  applyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  lostFoundButton: { marginTop: 10, marginBottom: 20, alignItems: 'center' },
  lostFoundText: { color: '#2D68A6', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase' }
});