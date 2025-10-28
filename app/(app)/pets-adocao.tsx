import React, { useState, useLayoutEffect, useMemo } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { FiltrosModal } from "../../components/adocao/FiltrosModal";

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

  /* Dados de exemplo (substitua pela API kaique quando der ) */
  const PETS_COMPLETOS: Pet[] = [
    { id: "1", nome: "Branquinho", raca: "SRD", genero: "Macho", especie: "Gato", idade: "Adulto", tamanho: "Pequeno", imagem: require("../../assets/images/pets/branquinho.png") },
    { id: "2", nome: "Frajola",   raca: "SRD", genero: "Fêmea", especie: "Gato", idade: "Filhote", tamanho: "Pequeno", imagem: require("../../assets/images/pets/frajola.png") },
    { id: "3", nome: "Zeus",      raca: "Pitbull", genero: "Macho", especie: "Cachorro", idade: "Adulto", tamanho: "Grande", imagem: require("../../assets/images/pets/zeus.png") },
    { id: "4", nome: "Paçoca",    raca: "SRD", genero: "Macho", especie: "Cachorro", idade: "Idoso", tamanho: "Medio", imagem: require("../../assets/images/pets/paçoca.png") },
    { id: "5", nome: "Neguinho",  raca: "SRD", genero: "Macho", especie: "Cachorro", idade: "Filhote", tamanho: "Pequeno", imagem: require("../../assets/images/pets/neguinho.png") },
    { id: "6", nome: "Caramelo",  raca: "SRD", genero: "Macho", especie: "Cachorro", idade: "Adulto", tamanho: "Medio", imagem: require("../../assets/images/pets/caramelo.png") },
  ];

  export default function TelaAdotar() {
    //controla visibilidade do modal de filtros
    const [filtroVisivel, setFiltroVisivel] = useState(false);

    // filtros que o usuário aplicou; começa vazio = sem filtros
    const [filtrosAplicados, setFiltrosAplicados] = useState<Filtros>({});

    const navigation = useNavigation();

    // função chamada pelo modal quando o usuario aplica filtros
    const aplicarFiltros = (f: Filtros) => {
      setFiltrosAplicados(f);
    };

    const petsFiltrados = useMemo(() => {
      if (Object.keys(filtrosAplicados).length === 0) return PETS_COMPLETOS;

      return PETS_COMPLETOS.filter((pet) => {
        const f = filtrosAplicados;

        // --- CORREÇÕES APLICADAS AQUI ---
        if (f.nome && !pet.nome.toLowerCase().includes(f.nome.toLowerCase())) return false; // Usando pet.nome
        if (f.isGato === false && pet.especie === "Gato") return false;
        if (f.isCao === false && pet.especie === "Cachorro") return false;
        if (f.isMacho === false && pet.genero === "Macho") return false;
        if (f.isFemea === false && pet.genero === "Fêmea") return false;
        if (f.porte && pet.tamanho.toLowerCase() !== f.porte.toLowerCase()) return false;
        if (f.raca && !pet.raca.toLowerCase().includes(f.raca.toLowerCase())) return false; // Usando pet.raca
        if (f.idade && pet.idade.toLowerCase() !== f.idade.toLowerCase()) return false; // Comparando pet.idade com f.idade

        return true;
      });
    }, [filtrosAplicados]);

    //configura o cabeçalho: título e botao que abre o modal de filtros
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

    return (
      <SafeAreaView style={styles.areaSegura}>
        {/* modal de filtros: recebe visibilidade e callback de aplicação */}
        <FiltrosModal
          visible={filtroVisivel}
          onClose={() => setFiltroVisivel(false)}
          onApplyFilters={aplicarFiltros}
        />

        <View style={styles.container}>
          <View style={styles.subCabecalho}>
            <Text style={styles.titulo}>Animais em destaque</Text>
            <TouchableOpacity accessibilityLabel="Trocar ordem" onPress={() => { /* aqui você pode abrir um menu de ordenação */ }}>
              <Ionicons name="swap-horizontal" size={24} color="#2D68A6" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={petsFiltrados}
            renderItem={({ item }) => <PetCard pet={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.textoVazio}>Nenhum animal encontrado.</Text>}
            //se a lista crescer vou colocar um getItemLayout e initialNumToRender
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
  });