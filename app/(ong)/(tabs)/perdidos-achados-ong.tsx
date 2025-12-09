import React, { useState, useLayoutEffect, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageSourcePropType,
  Image,
  Dimensions,
  Modal,
  Switch,
  TextInput,
  ScrollView,
  StatusBar,
  Platform
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { DenuncieModal } from "../../../components/denuncieModal"; 

// --- TIPOS ---
interface Pet {
  id: string;
  nome: string;
  raca: string;
  genero: string;
  especie: string;
  imagem: ImageSourcePropType;
  status: 'Perdido' | 'Achado';
  local: string;
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

// --- DADOS MOCKADOS ---
const PETS_PERDIDOS: Pet[] = [
  { 
    id: "1", 
    nome: "Tobby", 
    raca: "Sem raça definida (SRD)", 
    genero: "Macho", 
    especie: "Cachorro", 
    imagem: require("../../../assets/images/pets/caramelo.png"), 
    status: 'Perdido', 
    local: "Centro" 
  },
  { 
    id: "2", 
    nome: "Hero", 
    raca: "Labrador Retriever", 
    genero: "Macho", 
    especie: "Cachorro", 
    imagem: require("../../../assets/images/pets/shanti.png"), 
    status: 'Perdido', 
    local: "Jd. Flores" 
  },
  { 
    id: "3", 
    nome: "Bob", 
    raca: "Dálmata", 
    genero: "Macho", 
    especie: "Cachorro", 
    imagem: require("../../../assets/images/pets/branquinho.png"), 
    status: 'Perdido', 
    local: "Zona Sul" 
  },
  { 
    id: "4", 
    nome: "Tico", 
    raca: "Sem raça definida (SRD)", 
    genero: "Macho", 
    especie: "Gato", 
    imagem: require("../../../assets/images/ui/gatoHome.png"), 
    status: 'Achado', 
    local: "Praça Central" 
  },
  { 
    id: "5", 
    nome: "Chaves", 
    raca: "SRD", 
    genero: "Macho", 
    especie: "Gato", 
    imagem: require("../../../assets/images/pets/neguinho.png"), 
    status: 'Perdido', 
    local: "Vila Nova" 
  },
  { 
    id: "6", 
    nome: "Luna", 
    raca: "Angorá", 
    genero: "Fêmea", 
    especie: "Gato", 
    imagem: require("../../../assets/images/pets/branquinho.png"), 
    status: 'Achado', 
    local: "Parque" 
  },
];

// --- MODAL DE FILTRO ---
const FilterModal = ({ visible, onClose, onApply }: { visible: boolean; onClose: () => void; onApply: (f: Filtros) => void }) => {
    const router = useRouter();
    
    // Estados do Filtro
    const [isGato, setIsGato] = useState(true);
    const [isCaes, setIsCaes] = useState(true);
    const [isTodos, setIsTodos] = useState(true);
    const [isMacho, setIsMacho] = useState(true);
    const [isFemea, setIsFemea] = useState(true);

    const [porteSelecionado, setPorteSelecionado] = useState<string>('');
    const [idadeSelecionada, setIdadeSelecionada] = useState<string>('');
    const [racaDigitada, setRacaDigitada] = useState('');
    const [nomeDigitado, setNomeDigitado] = useState('');

    const toggleSelection = (currentValue: string, newValue: string, setter: (val: string) => void) => {
        setter(currentValue === newValue ? '' : newValue);
    };

    const SwitchRow = ({ label, value, onValueChange }: any) => (
        <View style={styles.switchRow}>
            <Switch trackColor={{ false: "#A0B4CC", true: "#5C8BB8" }} thumbColor={value ? "#2D68A6" : "#f4f3f4"} onValueChange={onValueChange} value={value} style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }} />
            <Text style={styles.switchLabel}>{label}</Text>
        </View>
    );

    const FilterChip = ({ label, selected, onPress }: any) => (
        <TouchableOpacity style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
        </TouchableOpacity>
    );

    const handleApply = () => {
        onApply({ nome: nomeDigitado, isGato, isCao: isCaes, isMacho, isFemea, porte: porteSelecionado, raca: racaDigitada, idade: idadeSelecionada });
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

                <Text style={styles.filterLabel}>Porte</Text>
                <View style={styles.chipsContainer}>
                    {['Pequeno', 'Médio', 'Grande'].map((porte) => (
                        <FilterChip key={porte} label={porte} selected={porteSelecionado === porte} onPress={() => toggleSelection(porteSelecionado, porte, setPorteSelecionado)} />
                    ))}
                </View>

                <Text style={styles.filterLabel}>Raça</Text>
                <TextInput style={styles.filterInput} placeholder="Digite a raça" value={racaDigitada} onChangeText={setRacaDigitada} />

                <Text style={styles.filterLabel}>Idade</Text>
                <View style={styles.chipsContainer}>
                    {['Filhote', 'Adulto', 'Idoso'].map((idade) => (
                        <FilterChip key={idade} label={idade} selected={idadeSelecionada === idade} onPress={() => toggleSelection(idadeSelecionada, idade, setIdadeSelecionada)} />
                    ))}
                </View>

                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                    <Text style={styles.applyButtonText}>APLICAR FILTROS</Text>
                </TouchableOpacity>

                {/* --- BOTÃO VOLTA PARA ADOÇÃO (ONG) --- */}
                <TouchableOpacity 
                    style={styles.lostFoundButton}
                    onPress={() => {
                        onClose(); 
                        // Volta para a aba de pets da ONG
                        router.navigate('/(ong)/(tabs)/pets' as any); 
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

// --- TELA PRINCIPAL PERDIDOS E ACHADOS (ONG) ---
export default function PerdidosAchadosOngScreen() {
  const [filtroVisivel, setFiltroVisivel] = useState(false);
  const [denunciaVisivel, setDenunciaVisivel] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState<Filtros>({});
  
  const navigation = useNavigation();
  const router = useRouter();

  const petsFiltrados = useMemo(() => {
    if (Object.keys(filtrosAplicados).length === 0) return PETS_PERDIDOS;
    return PETS_PERDIDOS.filter((pet) => {
      const f = filtrosAplicados;
      if (f.nome && !pet.nome.toLowerCase().includes(f.nome.toLowerCase())) return false;
      if (f.isGato === false && pet.especie === "Gato") return false;
      if (f.isCao === false && pet.especie === "Cachorro") return false;
      if (f.isMacho === false && pet.genero === "Macho") return false;
      if (f.isFemea === false && pet.genero === "Fêmea") return false;
      if (f.raca && !pet.raca.toLowerCase().includes(f.raca.toLowerCase())) return false;
      return true;
    });
  }, [filtrosAplicados]);

  useLayoutEffect(() => { navigation.setOptions({ headerShown: false }); }, [navigation]);

  return (
    <SafeAreaView style={styles.areaSegura}>
      <View style={styles.bgShapeRight} />

      <FilterModal visible={filtroVisivel} onClose={() => setFiltroVisivel(false)} onApply={setFiltrosAplicados} />
      <DenuncieModal visible={denunciaVisivel} onClose={() => setDenunciaVisivel(false)} />

      <View style={styles.container}>
        
        {/* --- CABEÇALHO --- */}
        <View style={styles.customHeader}>
          {/* Esquerda: Denúncia */}
          <TouchableOpacity onPress={() => setDenunciaVisivel(true)}>
            <Ionicons name="alert-circle-outline" size={28} color="#2D68A6" />
          </TouchableOpacity>

          {/* Centro: Título */}
          <Text style={styles.headerTitle}>Perdidos e Achados</Text>

          {/* Direita: Notificação */}
          <TouchableOpacity onPress={() => router.push('/(ong)/notificacoes' as any)}>
            <Ionicons name="notifications-outline" size={28} color="#2D68A6" /> 
          </TouchableOpacity>
        </View>

        {/* --- SUB-CABEÇALHO --- */}
        <View style={styles.subCabecalho}>
          <TouchableOpacity onPress={() => setFiltroVisivel(true)}>
            <Ionicons name="menu" size={32} color="#2D68A6" />
          </TouchableOpacity>
          
          {/* Título Centralizado */}
          <Text style={styles.tituloSecundario}>Animais em destaque</Text>
          
          {/* Caixa Vazia para equilibrar */}
          <View style={{ width: 32 }} />
        </View>

        <FlatList
          data={petsFiltrados}
          renderItem={({ item }) => (
            <TouchableOpacity 
                style={styles.petCard} 
                activeOpacity={0.9}
                // NAVEGAÇÃO: Vai para detalhes de perdido ONG
                onPress={() => router.push({ 
                    pathname: '/(ong)/detalhes-perdido-ong', 
                    params: { id: item.id } 
                } as any)}
            >
              <Image source={item.imagem} style={styles.petCardImage} />
              
              <View style={styles.petCardOverlay}>
                <Text style={styles.petCardNome}>{item.nome}</Text>
                <Text style={styles.petCardRaca}>{item.raca}</Text>
                
                <View style={styles.statusContainer}>
                    <Text style={[
                        styles.statusText, 
                        item.status === 'Perdido' ? { color: '#FF3B30' } : { color: '#34C759' }
                    ]}>
                        {item.status === 'Perdido' ? 'PERDIDO' : 'ACHADO'}
                    </Text> 
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.textoVazio}>Nenhum animal encontrado.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  areaSegura: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1, paddingHorizontal: 10 },
  
  // Header
  customHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 10, paddingHorizontal: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2D68A6' },
  
  // Sub-header Centralizado
  subCabecalho: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10, marginTop: 10, marginBottom: 15 },
  tituloSecundario: { fontSize: 18, fontWeight: "600", color: "#3A5C7A", flex: 1, textAlign: 'center' },
  
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

  // Fundo Mancha
  bgShapeRight: { position: 'absolute', top: 180, right: -50, width: 300, height: 600, backgroundColor: '#94B9D8', borderTopLeftRadius: 200, borderBottomLeftRadius: 200, opacity: 0.6, zIndex: -1 },

  // --- FILTRO STYLES ---
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