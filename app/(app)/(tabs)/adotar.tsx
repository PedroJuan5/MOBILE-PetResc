import React, { useState, useLayoutEffect } from "react";import {SafeAreaView,View,Text,StyleSheet,FlatList,TouchableOpacity,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { PetCard } from "../../../components/adocao/PetCard";
import { FiltrosModal } from "../../../components/adocao/FiltrosModal";

/*
  dados de exemplo
  substitua por chamada a API quando der kaique
*/
const PETS = [
  { id: "1", name: "Branquinho", breed: "SRD", gender: "AD.", image: require("../../../assets/Amarula.png") },
  { id: "2", name: "Frajola",   breed: "SRD", gender: "FI.", image: require("../../../assets/caramelo.png") },
  { id: "3", name: "Zeus",      breed: "Pitbull", gender: "FI.", image: require("../../../assets/django.png") },
  { id: "4", name: "Paçoca",    breed: "Não informado", gender: "AD.", image: require("../../../assets/jimjim.png") },
  { id: "5", name: "Neauinho",  breed: "SRD", gender: "AD.", image: require("../../../assets/mel.png") },
  { id: "6", name: "Caramelo",  breed: "SRD", gender: "FI.", image: require("../../../assets/pingo.png") },
];

export default function Adotar() {
  //controla visibilidade do modal de filtros
  const [filtroVisivel, setFiltroVisivel] = useState(false);

  //hook de navegação do expo-router usamos para configurar o header desta tela
  const navigation = useNavigation();

  /*
    useLayoutEffect é usado para ajustar opções do cabeçalho de forma síncrona
    antes do paint da tela. isso evita um "pulo" visual quando o header é atualizado.
    Aqui definimos título e um botão à esquerda que abre o modal de filtros.
  */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Pets para adoção",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => setFiltroVisivel(true)}
          style={{ marginLeft: 15 }}
          accessibilityLabel="Abrir filtros"
        >
          <Ionicons name="menu" size={28} color="#2D68A6" />
        </TouchableOpacity>
      ),
    });
    // dependencia navigation garante que as opções sejam reaplicadas se o objeto navigation mudar
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Modal de filtros; passamos visibilidade e callback para fechar */}
      <FiltrosModal visible={filtroVisivel} onClose={() => setFiltroVisivel(false)} />

      <View style={styles.container}>
        {/* Subcabeçalho: título da seção e botão de ordenar/trocar */}
        <View style={styles.subHeader}>
          <Text style={styles.subtitle}>Animais em destaque</Text>
          <TouchableOpacity
            onPress={() => {
            }}
            accessibilityLabel="Ordenar animais"
          >
            <Ionicons name="swap-horizontal" size={24} color="#2D68A6" />
          </TouchableOpacity>
        </View>

        {/* Lista em grid usando FlatList com 2 colunas */}
        <FlatList
          data={PETS}
          renderItem={({ item }) => <PetCard pet={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          //performance tip: se a lista crescer, adicionar getItemLayout, initialNumToRender, etc.
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, paddingHorizontal: 12 },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: { fontSize: 18, fontWeight: "600", color: "#3A5C7A" },
});
