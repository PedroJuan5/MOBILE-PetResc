import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageSourcePropType
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Tipagem dos dados
interface Pet {
  id: string;
  nome: string;
  descricao: string;
  status: 'AD.' | 'FI.'; // AD = Adoção, FI = Finalizado/Indisponível (Exemplo)
  imagem: ImageSourcePropType;
}

// Dados simulados (Certifique-se que as imagens existem na pasta assets)
// Se der erro de imagem, troque por uma URL externa temporária para testar
const PETS_ONG: Pet[] = [
  { id: '1', nome: 'Branquinho', descricao: 'Sem raça definida (SRD)', status: 'AD.', imagem: require('../../../assets/images/pets/branquinho.png') },
  { id: '2', nome: 'Frajola',    descricao: 'Sem raça definida (SRD)', status: 'FI.', imagem: require('../../../assets/images/pets/zeus.png') }, 
  { id: '3', nome: 'Zeus',       descricao: 'Pitbull',                 status: 'FI.', imagem: require('../../../assets/images/pets/zeus.png') },
  { id: '4', nome: 'Paçoca',     descricao: 'Não informado',           status: 'AD.', imagem: require('../../../assets/images/pets/paçoca.png') },
  { id: '5', nome: 'Neguinho',   descricao: 'SRD',                     status: 'AD.', imagem: require('../../../assets/images/pets/neguinho.png') },
  { id: '6', nome: 'Caramelo',   descricao: 'SRD',                     status: 'AD.', imagem: require('../../../assets/images/pets/caramelo.png') },
];

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 2; // Largura para 2 colunas com margem

export default function PetsOngScreen() {
  const router = useRouter();

  const renderCard = ({ item }: { item: Pet }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      {/* Imagem do Pet */}
      <Image source={item.imagem} style={styles.cardImage} resizeMode="cover" />
      
      {/* Informações */}
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.nome}</Text>
        
        <Text style={styles.cardDescription} numberOfLines={1}>
          {item.descricao} <Text style={styles.cardStatus}>{item.status}</Text>
        </Text>

        <Text style={styles.verMais}>Ver mais</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Elemento decorativo de fundo (Mancha Azul) */}
      <View style={styles.bgShapeRight} />

      <View style={styles.container}>
        
        {/* Cabeçalho: Menu e Notificação */}
        <View style={styles.headerTop}>
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={30} color="#2D68A6" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={26} color="#2D68A6" /> 
          </TouchableOpacity>
        </View>

        {/* Título Principal */}
        <Text style={styles.mainTitle}>Animais da ONG</Text>

        {/* Subtítulo e Filtro */}
        <View style={styles.subHeader}>
          <Text style={styles.subTitle}>Disponíveis para Adoção</Text>
          <TouchableOpacity>
            <Ionicons name="swap-vertical-outline" size={24} color="#2D68A6" />
          </TouchableOpacity>
        </View>

        {/* Grid de Pets */}
        <FlatList
          data={PETS_ONG}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  
  // Header
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1c5b8f',
    textAlign: 'center',
    marginBottom: 20,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 18,
    color: '#1c5b8f',
    fontWeight: '500',
  },

  // Grid
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  // Card
  card: {
    width: cardWidth - 5,
    backgroundColor: '#F5F8FA', // Fundo azulzinho claro
    borderRadius: 12,
    overflow: 'hidden',
    // Sombra
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: {
    width: '100%',
    height: 120, // Altura da foto
  },
  cardContent: {
    padding: 10,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c5b8f',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 11,
    color: '#5C7A94',
    marginBottom: 5,
  },
  cardStatus: {
    fontWeight: 'bold',
    color: '#1c5b8f',
  },
  verMais: {
    fontSize: 10,
    color: '#1c5b8f',
    textAlign: 'right',
    marginTop: 5,
    fontWeight: '600',
  },

  // Fundo Decorativo
  bgShapeRight: {
    position: 'absolute',
    top: 150,
    right: -80,
    width: 300,
    height: 500,
    backgroundColor: '#94B9D8', // Azul claro da mancha
    borderRadius: 150,
    opacity: 0.5,
    transform: [{ rotate: '-20deg' }],
    zIndex: -1,
  },
});