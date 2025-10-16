import React, { useLayoutEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Componentes Reutilizáveis (As "Peças de Lego" desta tela) ---

// "Pílula" de informação para características como Temperamento, Cuidados, etc.
const TagInformativa = ({ texto }: { texto: string }) => (
  <View style={styles.tagInformativa}>
    <Text style={styles.textoTagInformativa}>{texto}</Text>
  </View>
);

// Linha para a seção de Características (ex: "RAÇA: SRD")
const LinhaCaracteristica = ({ rotulo, valor }: { rotulo: string, valor: string }) => (
  <View style={styles.linhaCaracteristica}>
    <Text style={styles.rotuloCaracteristica}>{rotulo}</Text>
    <Text style={styles.valorCaracteristica}>{valor}</Text>
  </View>
);

// Componente genérico para uma seção com título e várias "pílulas"
const SecaoDeTags = ({ titulo, tags }: { titulo: string, tags: string[] }) => (
  <View style={styles.secao}>
    <Text style={styles.tituloSecao}>{titulo}</Text>
    <View style={styles.containerDeTags}>
      {tags.map(tag => <TagInformativa key={tag} texto={tag} />)}
    </View>
  </View>
);

// --- Dados de Exemplo (substitua pela sua API no futuro) ---
const DADOS_DO_PET = {
  id: '1',
  nome: 'branquinho',
  imagem: require('../../../../assets/images/pets/branquinho.png'),
  tags: ['Macho', 'Adulto', 'SRD'],
  larTemporario: true,
  comentario: 'Super tranquilo e dócil. Precisa apenas de um lar com muito amor para retribuir. Se dá bem com outros animais, mas tem medo de crianças. Ele come ração e petiscos molhados.',
  caracteristicas: [
    { rotulo: 'RAÇA', valor: 'Sem Raça Definida (SRD)' },
    { rotulo: 'IDADE', valor: 'Adulto' },
    { rotulo: 'PORTE', valor: 'Não informado' },
    { rotulo: 'COR PREDOMINANTE', valor: 'Branca' },
    { rotulo: 'COR DOS OLHOS', valor: 'Azuis' },
  ],
  cuidados: ['Vacinado', 'Castrado', 'Vermifugado'],
  temperamento: ['Dócil', 'Brincalhão', 'Sociável', 'Carente', 'Independente'],
  adaptabilidade: ['Vive bem em apartamento'],
  sociabilidade: ['Sociável com crianças', 'Sociável com gatos', 'Sociável com cães', 'Sociável com estranhos'],
};


// --- Componente Principal da Tela ---
export default function TelaDetalhePet() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  
  // No futuro, você usará o 'id' para buscar os dados do pet na sua API.
  const pet = DADOS_DO_PET;

  // Configura o cabeçalho transparente com botões de voltar e notificação
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoCabecalho}>
          <Ionicons name="arrow-back" size={24} color="#2D68A6" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity style={styles.botaoCabecalho}>
          <Ionicons name="notifications-outline" size={24} color="#2D68A6" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <Image source={pet.imagem} style={styles.imagemPrincipal} />
        <View style={styles.container}>
          
          {/* Seção de Informações Principais */}
          <Text style={styles.nomePet}>{pet.nome}</Text>
          <Text style={styles.tagsPet}>{pet.tags.join(' • ')}</Text>
          {pet.larTemporario && <Text style={styles.textoLarTemporario}>Lar temporário</Text>}
          <TouchableOpacity style={styles.botaoAdocao}>
            <Text style={styles.textoBotaoAdocao}>Para adoção</Text>
          </TouchableOpacity>
          <Text style={styles.comentario}>{pet.comentario}</Text>

          <View style={styles.divisor} />

          {/* Seção de Características */}
          <Text style={styles.tituloSecao}>Características</Text>
          {pet.caracteristicas.map(char => <LinhaCaracteristica key={char.rotulo} rotulo={char.rotulo} valor={char.valor} />)}
          
          <TouchableOpacity style={styles.botaoContato}>
            <Text style={styles.textoBotaoContato}>MOSTRAR CONTATO</Text>
          </TouchableOpacity>
          
          <View style={styles.divisor} />

          {/* Seções de Tags Informativas */}
          <SecaoDeTags titulo="Cuidados veterinários" tags={pet.cuidados} />
          <SecaoDeTags titulo="Temperamento" tags={pet.temperamento} />
          <SecaoDeTags titulo="Adaptabilidade" tags={pet.adaptabilidade} />
          <SecaoDeTags titulo="Sociabilidade" tags={pet.sociabilidade} />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos da Tela (Organizados e Humanizados) ---
const styles = StyleSheet.create({
  // Estrutura Geral
  safeArea: { flex: 1, backgroundColor: 'white' },
  container: { padding: 20 },
  divisor: { height: 1, backgroundColor: '#E6F0FA', marginVertical: 25 },
  secao: { marginBottom: 20 },
  tituloSecao: { fontSize: 20, fontWeight: 'bold', color: '#2D68A6', marginBottom: 15 },
  
  // Cabeçalho e Imagem Principal
  imagemPrincipal: { width: '100%', height: 350 },
  botaoCabecalho: {
    marginHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 6,
  },

  // Seção de Informações Principais
  nomePet: { fontSize: 32, fontWeight: 'bold', color: '#2D68A6' },
  tagsPet: { fontSize: 16, color: '#3A5C7A', marginTop: 4 },
  textoLarTemporario: { fontSize: 14, color: '#3A5C7A', fontWeight: '600', marginTop: 4 },
  botaoAdocao: { backgroundColor: '#2D68A6', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 25, alignSelf: 'flex-start', marginTop: 15 },
  textoBotaoAdocao: { color: 'white', fontWeight: 'bold' },
  comentario: { fontSize: 14, color: '#3A5C7A', lineHeight: 22, marginVertical: 20 },

  // Seção de Características
  linhaCaracteristica: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  rotuloCaracteristica: { color: '#3A5C7A', fontWeight: '600', fontSize: 14 },
  valorCaracteristica: { color: '#3A5C7A', fontSize: 14 },
  botaoContato: { backgroundColor: '#BFE1F7', borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginTop: 20 },
  textoBotaoContato: { color: '#2D68A6', fontWeight: 'bold', fontSize: 14 },

  // Seções de Tags (Cuidados, Temperamento, etc.)
  containerDeTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tagInformativa: { backgroundColor: '#E6F0FA', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15 },
  textoTagInformativa: { color: '#3A5C7A', fontWeight: '500' },
});