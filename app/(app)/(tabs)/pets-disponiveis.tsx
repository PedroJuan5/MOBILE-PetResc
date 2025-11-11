// app/(app)/(tabs)/pets-disponiveis.tsx

import React, { useState, useMemo } from "react";
import {
  SafeAreaView, // <<< 1. ADICIONADO
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageSourcePropType,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// <<< 2. REMOVIDO useNavigation, MANTIDO useRouter
import { useRouter } from "expo-router"; 
import { FiltrosModal } from "../../../components/adocao/FiltrosModal";

// <<< 3. IMPORTAR OS COMPONENTES DE HEADER E MODAL
import { DenuncieModal } from '../../../components/denuncieModal';
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';

// ... (Sua interface Pet e Filtros aqui) ...
interface Pet {
  id: string; nome: string; raca: string; genero: string; especie: string; idade: string; tamanho: string; imagem: ImageSourcePropType;
}
interface Filtros {
  nome?: string; isGato?: boolean; isCao?: boolean; isMacho?: boolean; isFemea?: boolean; porte?: string; raca?: string; idade?: string;
}

// ... (Seus dados PETS_COMPLETOS aqui, com os caminhos de imagem corrigidos) ...
const PETS_COMPLETOS: Pet[] = [
  { id: "1", nome: "Branquinho", raca: "SRD", genero: "Macho", especie: "Gato", idade: "Adulto", tamanho: "Pequeno", imagem: require("../../../assets/images/pets/branquinho.png") },
  { id: "2", nome: "Frajola",   raca: "SRD", genero: "Fêmea", especie: "Gato", idade: "Filhote", tamanho: "Pequeno", imagem: require("../../../assets/images/pets/frajola.png") },
  { id: "3", nome: "Zeus",     raca: "Pitbull", genero: "Macho", especie: "Cachorro", idade: "Adulto", tamanho: "Grande", imagem: require("../../../assets/images/pets/zeus.png") },
  { id: "4" , nome: "Paçoca",   raca: "SRD", genero: "Macho", especie: "Cachorro", idade: "Idoso", tamanho: "Medio", imagem: require("../../../assets/images/pets/paçoca.png") },
  { id: "5", nome: "Neguinho",  raca: "SRD", genero: "Macho", especie: "Cachorro", idade: "Filhote", tamanho: "Pequeno", imagem: require("../../../assets/images/pets/neguinho.png") },
  { id: "6", nome: "Caramelo",  raca: "SRD", genero: "Macho", especie: "Cachorro", idade: "Adulto", tamanho: "Medio", imagem: require("../../../assets/images/pets/caramelo.png") },
];

export default function TelaPetsDisponiveis() {
  const [filtroVisivel, setFiltroVisivel] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState<Filtros>({});
  
  // <<< 4. ADICIONAR LÓGICA DO MODAL
  const [modalVisible, setModalVisible] = useState(false);
  const handleDenunciePress = () => setModalVisible(true);

  const router = useRouter(); 

  const aplicarFiltros = (f: Filtros) => {
    setFiltrosAplicados(f);
  };

  const petsFiltrados = useMemo(() => {
    // ... (Sua lógica de filtro, está correta) ...
    if (Object.keys(filtrosAplicados).length === 0) return PETS_COMPLETOS;
    return PETS_COMPLETOS.filter((pet) => {
      const f = filtrosAplicados;
      if (f.nome && !pet.nome.toLowerCase().includes(f.nome.toLowerCase())) return false;
      if (f.isGato === false && pet.especie === "Gato") return false;
      if (f.isCao === false && pet.especie === "Cachorro") return false;
      if (f.isMacho === false && pet.genero === "Macho") return false;
      if (f.isFemea === false && pet.genero === "Fêmea") return false;
      if (f.porte && pet.tamanho.toLowerCase() !== f.porte.toLowerCase()) return false;
      if (f.raca && !pet.raca.toLowerCase().includes(f.raca.toLowerCase())) return false;
      if (f.idade && pet.idade.toLowerCase() !== f.idade.toLowerCase()) return false;
      return true;
    });
  }, [filtrosAplicados]);

  // <<< 5. REMOVIDO o useLayoutEffect

  const handlePetPress = (petId: string) => {
    // Esta navegação para a tela de detalhes (que cobre as abas) está correta
    router.push(`/pet/${petId}`);
  };

  return (
    // <<< 6. ADICIONADO O SAFEAREADVIEW
    <SafeAreaView style={styles.safeArea}>
      
      {/* <<< 7. ADICIONADO O HEADER FIXO (igual ao da home) */}
      <View style={styles.headerContainer}>
        <CustomHeaderLeft onDenunciePress={handleDenunciePress} />
        {/* Você pode mudar este título */}
        <Text style={styles.headerTitle}>Pets Disponíveis</Text>
        <CustomHeaderRight />
      </View>
      
      {/* <<< 8. ADICIONADO O MODAL DE DENÚNCIA */}
      <DenuncieModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      {/* modal de filtros: recebe visibilidade e callback de aplicação */}
      <FiltrosModal
        visible={filtroVisivel}
        onClose={() => setFiltroVisivel(false)}
        onApplyFilters={aplicarFiltros}
      />

      {/* O Container do Conteúdo */}
      <View style={styles.container}>
        <View style={styles.subCabecalho}>
          <Text style={styles.titulo}>Animais em destaque</Text>
          {/* Botão de Filtro (Menu) - agora dentro da página */}
          <TouchableOpacity 
            accessibilityLabel="Abrir filtros" 
            onPress={() => setFiltroVisivel(true)}
          >
            <Ionicons name="menu" size={28} color="#2D68A6" />
          </TouchableOpacity>
        </View>

        {/* A Lista de Pets (FlatList) */}
        <FlatList
          data={petsFiltrados}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.petCard} 
              onPress={() => handlePetPress(item.id)}
            >
              <Image source={item.imagem} style={styles.petCardImage} />
              <View style={styles.petCardInfo}>
                <Text style={styles.petCardNome}>{item.nome}</Text>
                <Text style={styles.petCardDetalhe}>{item.raca}</Text>
                <Text style={styles.petCardDetalhe}>{item.genero}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.textoVazio}>Nenhum animal encontrado.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // <<< 9. ADICIONADO O ESTILO DO SAFEAREADVIEW
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  
  // <<< 10. ADICIONADO O ESTILO DO HEADER FIXO
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0, 
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE', 
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700', 
    color: '#2D68A6', 
    textAlign: 'center',
    flex: 1, 
  },
  // --- FIM DOS ESTILOS ADICIONADOS ---

  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  subCabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    marginTop: 10,
    marginBottom: 5,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3A5C7A",
  },
  textoVazio: {
    textAlign: "center",
    marginTop: 50,
    color: "#3A5C7A",
  },
  // ... (O resto dos seus estilos de Card continuam iguais) ...
  petCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  petCardImage: {
    width: '100%',
    height: 140, 
    resizeMode: 'cover',
  },
  petCardInfo: {
    padding: 12,
  },
  petCardNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005A9C',
    marginBottom: 4,
  },
  petCardDetalhe: {
    fontSize: 14,
    color: '#333',
  },
});