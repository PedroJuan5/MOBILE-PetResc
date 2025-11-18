import React, { useState, useLayoutEffect, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet, // A importação correta é aqui, dentro das chaves
  FlatList,
  TouchableOpacity,
  ImageSourcePropType,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { FiltrosModal } from "../../../components/adocao/FiltrosModal";

// Definição do objeto Pet
interface Pet {
  id: string;
  nome: string;
  raca: string;
  genero: string;
  especie: string;
  idade: string;
  tamanho: string;
  imagem: ImageSourcePropType;
  status: 'disponivel' | 'adotado' | 'perdido';
}

// Definição dos Filtros
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

// Cálculos de dimensão para o grid
const { width } = Dimensions.get('window');
const cardWidth = (width - 20 * 3) / 2; 

// Dados Mockados (Exemplo)
const PETS_COMPLETOS: Pet[] = [
  { id: "1", nome: "Branquinho", raca: "SRD", genero: "Macho", especie: "Gato", idade: "Adulto", tamanho: "Pequeno", imagem: require("../../../assets/images/pets/branquinho.png"), status: 'disponivel' },
  { id: "2", nome: "Shanti",     raca: "SRD", genero: "Fêmea", especie: "Cachorro", idade: "Filhote", tamanho: "Pequeno", imagem: require("../../../assets/images/pets/shanti.png"), status: 'disponivel' },
  { id: "3", nome: "Zeus",       raca: "Pitbull", genero: "Macho", especie: "Cachorro", idade: "Adulto", tamanho: "Grande", imagem: require("../../../assets/images/pets/zeus.png"), status: 'disponivel' },
  { id: "4" , nome: "Paçoca",    raca: "SRD", genero: "Macho", especie: "Cachorro", idade: "Idoso", tamanho: "Medio", imagem: require("../../../assets/images/pets/paçoca.png"), status: 'disponivel' },
  { id: "5", nome: "Neguinho",   raca: "SRD", genero: "Macho", especie: "Cachorro", idade: "Filhote", tamanho: "Pequeno", imagem: require("../../../assets/images/pets/neguinho.png"), status: 'disponivel' },
  { id: "6", nome: "Caramelo",   raca: "SRD", genero: "Macho", especie: "Cachorro", idade: "Adulto", tamanho: "Medio", imagem: require("../../../assets/images/pets/caramelo.png"), status: 'disponivel' },
];

export default function TelaAdotar() {
  const [filtroVisivel, setFiltroVisivel] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState<Filtros>({});
  const navigation = useNavigation();
  const router = useRouter();

  const aplicarFiltros = (f: Filtros) => {
    setFiltrosAplicados(f);
  };

  const petsFiltrados = useMemo(() => {
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

  // Configuração do Cabeçalho
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Nossos pets",
      headerTitleStyle: { color: '#2D68A6', fontWeight: 'bold' },
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 15 }} accessibilityLabel="Informações">
          <Ionicons name="information-circle-outline" size={28} color="#2D68A6" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 15 }} accessibilityLabel="Notificações">
          <Ionicons name="notifications-outline" size={28} color="#2D68A6" />
        </TouchableOpacity>
      ),
      headerShown: true, 
    });
  }, [navigation]);

  const handlePetPress = (petId: string) => {
    router.push(`/pet/${petId}`);
  };

  return (
    <SafeAreaView style={styles.areaSegura}>
      <FiltrosModal
        visible={filtroVisivel}
        onClose={() => setFiltroVisivel(false)}
        onApplyFilters={aplicarFiltros}
      />

      <View style={styles.container}>
        {/* Subcabeçalho com botão de filtro */}
        <View style={styles.subCabecalho}>
          <Text style={styles.tituloSecundario}>Animais em destaque</Text>
          <TouchableOpacity accessibilityLabel="Abrir filtros" onPress={() => setFiltroVisivel(true)}>
            <Ionicons name="swap-horizontal" size={24} color="#2D68A6" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={petsFiltrados}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.petCard} 
              onPress={() => handlePetPress(item.id)}
            >
              {/* Imagem de fundo */}
              <Image source={item.imagem} style={styles.petCardImage} />
              
              {/* Overlay com informações */}
              <View style={styles.petCardOverlay}>
                <Text style={styles.petCardNome}>{item.nome}</Text>
                <View style={styles.petCardStatus}>
                  <Text style={styles.petCardDetalhe}>{item.raca} {item.genero === 'Macho' ? 'M' : 'F'}.</Text>
                  {/* Bolinha de status */}
                  <View style={[
                      styles.statusCircle,
                      item.status === 'disponivel' && styles.statusDisponivel,
                      item.status === 'adotado' && styles.statusAdotado,
                      item.status === 'perdido' && styles.statusPerdido,
                    ]} 
                  />
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

      {/* Formas de fundo (azul claro) */}
      <View style={styles.fundoInferiorDireito} />
      <View style={styles.fundoSuperiorEsquerdo} />
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  subCabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  tituloSecundario: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3A5C7A",
  },
  textoVazio: {
    textAlign: "center",
    marginTop: 50,
    color: "#3A5C7A",
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },

  // --- Estilo do Card (Design Imagem 1) ---
  petCard: {
    width: cardWidth,
    height: cardWidth * 1.2,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  petCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute', // Imagem absoluta no fundo
  },
  petCardOverlay: {
    position: 'absolute', // Overlay absoluto na frente
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Fundo branco transparente
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  petCardNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A5C7A',
    marginBottom: 2,
  },
  petCardStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petCardDetalhe: {
    fontSize: 12,
    color: '#6A8CA6',
  },
  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusDisponivel: {
    backgroundColor: '#34C759', // Verde
  },
  statusAdotado: {
    backgroundColor: '#FF9500', // Laranja
  },
  statusPerdido: {
    backgroundColor: '#FF3B30', // Vermelho
  },

  // --- Elementos Decorativos de Fundo ---
  fundoInferiorDireito: {
    position: 'absolute',
    bottom: -150,
    right: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#BFE1F7',
    opacity: 0.7,
    zIndex: -1,
  },
  fundoSuperiorEsquerdo: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#BFE1F7',
    opacity: 0.5,
    zIndex: -1,
  },
});