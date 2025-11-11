import React, { useState, useLayoutEffect, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageSourcePropType,
  Image, // <<< 1. IMPORTAR O COMPONENTE DE IMAGEM
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router"; // Importe o useRouter
import { FiltrosModal } from "../../components/adocao/FiltrosModal"; // Corrigi o caminho

interface Pet {
  id: string;
  nome: string;
  raca: string;
  genero: string;
  especie: string;
  idade: string;
  tamanho: string;
  imagem: ImageSourcePropType;
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

/* Dados de exemplo */
const PETS_COMPLETOS: Pet[] = [
  // <<< 2. CORRIJA SEUS CAMINHOS DE IMAGEM AQUI SE NECESSÁRIO
  // O caminho '../../assets/...' funciona se:
  // app/assets/...
  // E este arquivo está em app/(app)/pets-disponiveis.tsx
  { id: "1", nome: "Branquinho", raca: "SRD", genero: "Macho", especie: "Gato", idade: "Adulto", tamanho: "Pequeno", imagem: require("../../assets/images/pets/branquinho.png") },
  { id: "2", nome: "Frajola",   raca: "SRD", genero: "Fêmea", especie: "Gato", idade: "Filhote", tamanho: "Pequeno", imagem: require("../../assets/images/pets/frajola.png") },
  { id: "3", nome: "Zeus",     raca: "Pitbull", genero: "Macho", especie: "Cachorro", idade: "Adulto", tamanho: "Grande", imagem: require("../../assets/images/pets/zeus.png") },
  { id: "4" , nome: "Paçoca",   raca: "SRD", genero: "Macho", especie: "Cachorro", idade: "Idoso", tamanho: "Medio", imagem: require("../../assets/images/pets/paçoca.png") },
  { id: "5", nome: "Neguinho",  raca: "SRD", genero: "Macho", especie: "Cachorro", idade: "Filhote", tamanho: "Pequeno", imagem: require("../../assets/images/pets/neguinho.png") },
  { id: "6", nome: "Caramelo",  raca: "SRD", genero: "Macho", especie: "Cachorro", idade: "Adulto", tamanho: "Medio", imagem: require("../../assets/images/pets/caramelo.png") },
];

export default function TelaAdotar() {
  const [filtroVisivel, setFiltroVisivel] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState<Filtros>({});
  const navigation = useNavigation();
  const router = useRouter(); // <<< 3. ADICIONAR O ROUTER

  const aplicarFiltros = (f: Filtros) => {
    setFiltrosAplicados(f);
  };

  // A sua lógica de 'petsFiltrados' (useMemo) está correta
  const petsFiltrados = useMemo(() => {
    // ... (lógica de filtro, sem mudanças)
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

  // A sua configuração de 'useLayoutEffect' (cabeçalho) está correta
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Pets para adoção",
      headerLeft: () => (
        <TouchableOpacity onPress={() => setFiltroVisivel(true)} style={{ marginLeft: 15 }} accessibilityLabel="Abrir filtros">
          <Ionicons name="menu" size={28} color="#ffffffff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // --- 4. FUNÇÃO PARA O CARD DO PET ---
  // Esta é a função que será chamada quando o usuário
  // clicar em um card de pet.
  const handlePetPress = (petId: string) => {
    // Navega para a tela de detalhes do pet
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
        <View style={styles.subCabecalho}>
          <Text style={styles.titulo}>Animais em destaque</Text>
          <TouchableOpacity accessibilityLabel="Trocar ordem" onPress={() => {}}>
            <Ionicons name="swap-horizontal" size={24} color="#2D68A6" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={petsFiltrados}
          
          // --- 5. RENDERITEM ATUALIZADO ---
          // Agora ele renderiza um card maior e com a imagem
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
          // --- FIM DA MUDANÇA ---

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
  areaSegura: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
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

  // --- 6. ESTILOS DOS CARDS ATUALIZADOS (MAIORES) ---
  petCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#F0F8FF', // Fundo azul claro
    borderRadius: 12,
    overflow: 'hidden', // Garante que a imagem não vaze
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  petCardImage: {
    width: '100%',
    height: 140, // Altura maior para a imagem
    resizeMode: 'cover',
  },
  petCardInfo: {
    padding: 12, // Mais padding
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
  // --- FIM DOS ESTILOS ATUALIZADOS ---
});