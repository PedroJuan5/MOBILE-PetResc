import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// Adiciona FontAwesome5 para os novos ícones
import { Feather, FontAwesome5 } from '@expo/vector-icons';

export default function VoluntariosScreen() {
  const router = useRouter();

  // Função para navegar para a tela de formulário
  const handleFormPress = () => {
    // Crie uma tela para o formulário e coloque o caminho aqui
    // Exemplo: router.push('/(tabs)/formulario-interesse');
    console.log('Navegar para o formulário de interesse');
  };

  // Dados para os slides do carrossel
  const formularioSlides = [
    {
      key: 'interesse',
      title: 'Formulário de interesse',
      description:
        'Faça o formulário de inscrição que disponibilizamos aqui que a ONG entrará em contato com você em até 48h.',
      iconName: 'clipboard-list', // Ícone do FontAwesome5
    },
    {
      key: 'avaliacao',
      title: 'Avaliação de formulário',
      description:
        'A ONG irá fazer a análise do cadastro e perfil do voluntário. Preenchendo os requisitos, você recebe a aprovação por telefone/email.',
      iconName: 'chart-line', // Ícone do FontAwesome5
    },
    {
      key: 'aprovado',
      title: 'Formulário aprovado',
      description:
        'Caso seja aprovado espere o contato e a aprovação. Com tudo certo, você busca o pet no dia combinado com a ONG.',
      iconName: 'user-check', // Ícone do FontAwesome5
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* --- Seção Header --- */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Veja a diferença que você pode fazer!</Text>
          {/* Ícones de patinha - ajuste o caminho da imagem */}
          <Image
            source={require('../../../assets/images/ui/patinhas.png')} // Mude para seu ícone de patinha
            style={[styles.pawIcon, styles.pawIcon1]}
          />
          <Image
            source={require('../../../assets/images/ui/patinhas.png')} // Mude para seu ícone de patinha
            style={[styles.pawIcon, styles.pawIcon2]}
          />
          <Image
            source={require('../../../assets/images/ui/patinhas.png')} // Mude para seu ícone de patinha
            style={[styles.pawIcon, styles.pawIcon3]}
          />
          <Feather name="bell" size={24} color="#555" style={styles.bellIcon} />
        </View>

        {/* --- O que é Lar Temporário --- */}
        <Text style={styles.sectionTitle}>O que é um Lar Temporário?</Text>
        <Text style={styles.paragraph}>
          É um lar humano acolhedor que abriga temporariamente animais resgatados em situação de
          vulnerabilidade, oferecendo-lhes um ambiente seguro, carinho e cuidados até que encontrem
          um lar definitivo ou um cuidador permanente.
        </Text>

        {/* --- Imagem Principal --- */}
        <Image
          source={require('../../../assets/images/ui/gatoVoluntario.png')}
          style={styles.mainImage}
        />

        {/* --- Texto Explicativo --- */}
        <Text style={styles.paragraph}>
          Este gesto transforma vidas, permitindo que os animais recebam tratamento adequado, evitem o
          isolamento em abrigos e aprendam a confiar novamente, enquanto as famílias que acolhem se
          sentem gratificadas por fazer a diferença.
        </Text>

        {/* --- Seção Formulário (Carrossel) --- */}
        <View style={styles.swiperContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.swiperContent}
          >
            {formularioSlides.map((slide) => (
              <TouchableOpacity
                key={slide.key}
                style={styles.slide}
                onPress={handleFormPress}
                activeOpacity={0.8}
              >
                <View style={styles.slideIconContainer}>
                  <FontAwesome5 name={slide.iconName} size={50} color="#FFFFFF" />
                </View>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideDescription}>{slide.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- Perguntas Frequentes --- */}
        <Text style={styles.faqHeader}>Perguntas frequentes:</Text>

        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>Por quanto tempo devo cuidar do animal?</Text>
          <Text style={styles.faqAnswer}>
            O período varia conforme a necessidade do animal, geralmente de algumas semanas a meses.
          </Text>
        </View>

        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>Preciso ter experiência com animais?</Text>
          <Text style={styles.faqAnswer}>
            Não. Fornecemos orientação e acompanhamento completo durante toda a estadia.
          </Text>
        </View>

        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>Há custos envolvidos?</Text>
          <Text style={styles.faqAnswer}>
            Algumas despesas podem ser cobertas pelo programa, mas cada lar deve fornecer
            alimentação e cuidados básicos.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#005A9C', // Cor principal (azul)
    width: '80%', // Para dar espaço para os ícones
  },
  bellIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  pawIcon: {
    position: 'absolute',
    width: 20,
    height: 20,
    opacity: 0.5,
  },
  pawIcon1: {
    right: 10,
    top: 10,
    transform: [{ rotate: '15deg' }],
  },
  pawIcon2: {
    right: 50,
    top: 10,
    transform: [{ rotate: '-10deg' }],
  },
  pawIcon3: {
    right: 30,
    top: 60,
    transform: [{ rotate: '25deg' }],
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#005A9C',
    marginLeft: 40,
    marginTop: 20,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 17,
    lineHeight: 32,
    color: '#333',
    justifyContent: 'center',
    marginBottom: 25,
    marginLeft: 20,
  },
  mainImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },

  // --- Estilos do Carrossel (Swiper) ---
  swiperContainer: {
    height: 320, // Altura fixa para o carrossel
    marginTop: 10,
    marginBottom: 30,
  },
  swiperContent: {
    // Ensure slides align horizontally and take full width for paging
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  swiper: {
    // O Swiper em si
  },
  swiperButtonWrapper: {
    paddingHorizontal: 0, // Remover padding padrão
    width: '100%',
    position: 'absolute',
    top: 0,
    height: '100%',
    justifyContent: 'space-between', // Coloca as setas nas extremidades
    alignItems: 'center', // Centraliza verticalmente
    flexDirection: 'row',
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F0F8FF', 
    borderRadius: 10,
    paddingTop: 30, 
    paddingBottom: 20,
    paddingHorizontal: 20,

    // Make slide width roughly equal to screen minus padding
    width: 300,
    marginHorizontal: 10,
  },
  slideIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#005A9C', // Círculo azul escuro
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  slideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005A9C',
    textAlign: 'center',
    marginBottom: 10,
  },
  slideDescription: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },

  // --- Estilos do FAQ (os seus, mantidos) ---
  faqHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005A9C',
    marginBottom: 15,
  },
  faqCard: {
    backgroundColor: '#F0F8FF', // Azul bem claro
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005A9C',
  },
  faqAnswer: {
    fontSize: 15,
    color: '#333',
    marginTop: 10,
  },
});