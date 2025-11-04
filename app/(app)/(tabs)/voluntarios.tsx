import React, { useState } from 'react';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import Swiper from 'react-native-swiper';
import { DenuncieModal } from '../../../components/DenuncieModal';
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';


//a
export default function VoluntariosScreen() {
  const router = useRouter();

  // --- LÓGICA DO MODAL DE DENÚNCIA ---
  const [modalVisible, setModalVisible] = useState(false);
  const handleDenunciePress = () => setModalVisible(true);
  // --- FIM DA LÓGICA DO MODAL ---

  // Navega para o NOVO formulário de voluntários
  const handleFormPress = () => {
    // Este é o novo formulário que você precisa criar
    router.push('/formulario-voluntarios');
  };

  const voluntarioSlides = [
    {
      key: 'interesse',
      title: 'Formulário de interesse',
      description:
        'Faça o formulário de inscrição que disponibilizamos aqui que a ONG entrará em contato com você em até 48h.',
      iconName: 'clipboard-list',
      iconLib: FontAwesome5,
    },
    {
      key: 'avaliacao',
      title: 'Avaliação de formulário',
      description:
        'A ONG irá fazer a análise do cadastro e perfil do voluntário. Preenchendo os requisitos, você recebe a aprovação por telefone/email.',
      iconName: 'chart-line', 
      iconLib: FontAwesome5,
    },
    {
      key: 'aprovado',
      title: 'Formulário aprovado',
      description:
        'Caso seja aprovado espere o contato e a aprovação. Com tudo certo, você busca o pet no dia combinado com a ONG.',
      iconName: 'user-check', 
      iconLib: FontAwesome5,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- SEU HEADER CUSTOMIZADO --- */}
      <View style={styles.headerContainer}>
        <CustomHeaderLeft onDenunciePress={handleDenunciePress} />
        <Text style={styles.headerTitle}>Veja a diferença que você pode fazer!</Text>
        <CustomHeaderRight />
      </View>

      {/* --- SEU MODAL (renderizado mas invisível) --- */}
      <DenuncieModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* --- O que é Lar Temporário --- */}
        <Text style={styles.sectionTitle}>O que é um Lar Temporário?</Text>
        <Text style={styles.paragraph}>
          É um lar humano acolhedor que abriga temporariamente animais resgatados em situação de
          vulnerabilidade... (etc)
        </Text>

        {/* --- Imagem Principal --- */}
        <Image
          source={require('../../../assets/images/ui/gatoVoluntario.png')}
          style={styles.mainImage}
        />

        {/* --- Texto Explicativo --- */}
        <Text style={styles.paragraph}>
          Este gesto transforma vidas, permitindo que os animais recebam tratamento adequado... (etc)
        </Text>

        {/* --- Carrossel de VOLUNTÁRIO --- */}
        <View style={styles.swiperContainer}>
          <Swiper
            style={styles.swiper}
            showsButtons={true}
            showsPagination={false}
            loop={false}
            buttonWrapperStyle={styles.swiperButtonWrapper}
            nextButton={<Feather name="chevron-right" size={30} color="#005A9C" />}
            prevButton={<Feather name="chevron-left" size={30} color="#005A9C" />}
          >
            {voluntarioSlides.map((slide) => {
              const IconComponent = slide.iconLib;
              return (
                <TouchableOpacity
                  key={slide.key}
                  style={styles.slide}
                  onPress={slide.key === 'interesse' ? handleFormPress : () => {}}
                  activeOpacity={slide.key === 'interesse' ? 0.8 : 1.0}
                >
                  <View style={styles.slideIconContainer}>
                    <IconComponent name={slide.iconName as any} size={50} color="#FFFFFF" />
                  </View>
                  <Text style={styles.slideTitle}>{slide.title}</Text>
                  <Text style={styles.slideDescription}>{slide.description}</Text>
                </TouchableOpacity>
              );
            })}
          </Swiper>
        </View>

        {/* --- Perguntas Frequentes --- */}
        <Text style={styles.faqHeader}>Perguntas frequentes:</Text>
        {/* ... (Seus <View style={styles.faqCard}> ... ) ... */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0, 
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005A9C',
    textAlign: 'center', 
    flex: 1, 
  },
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 10, 
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
  // Carrossel
  swiperContainer: {
    height: 320,
    marginTop: 10,
    marginBottom: 30,
  },
  swiperContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  swiper: {
  },
  swiperButtonWrapper: {
    paddingHorizontal: 0,
    width: '100%',
    position: 'absolute',
    top: 0,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginHorizontal: 40,
  },
  slideIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#005A9C',
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
  // FAQ
  faqHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005A9C',
    marginBottom: 15,
  },
  faqCard: {
    backgroundColor: '#F0F8FF',
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