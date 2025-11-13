import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import Swiper from 'react-native-swiper';
import { DenuncieModal } from '../../../components/denuncieModal';
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';

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

const faqData = [
  {
    pergunta: "Por quanto tempo devo cuidar do animal?",
    resposta: "O período varia conforme a necessidade do animal, geralmente de algumas semanas a meses.",
  },
  {
    pergunta: "Preciso ter experiência com animais?",
    resposta: "Não. Fornecemos orientação e acompanhamento completo durante toda a estadia.",
  },
  {
    pergunta: "Há custos envolvidos?",
    resposta: "Algumas despesas podem ser cobertas pelo programa, mas cada lar deve fornecer alimentação e cuidados básicos.",
  },
];

export default function VoluntariosScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const handleDenunciePress = () => setModalVisible(true);
  const handleFormPress = () => {
    router.push('/formulario-voluntarios');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    
      <DenuncieModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.iconHeaderContainer}>
            <CustomHeaderLeft onDenunciePress={handleDenunciePress} />
            <CustomHeaderRight />
        </View>

        <Text style={styles.sectionTitle}>O que é um Lar Temporário?</Text>
        <Text style={styles.paragraph}>
        É um lar humano acolhedor que abriga temporariamente animais resgatados em situação de vulnerabilidade, oferecendo-lhes um ambiente seguro, carinho e cuidados até que encontrem um lar definitivo ou um cuidador permanente.
        </Text>

        <Image
          source={require('../../../assets/images/ui/gatoVoluntario.png')}
          style={styles.mainImage}
        />
        <Text style={styles.paragraph}>
          Este gesto transforma vidas, permitindo que os animais recebam tratamento adequado, evitem o isolamento em abrigos e aprendam a confiar novamente, enquanto as famílias que acolhem se sentem gratificadas por fazer a diferença. 
        </Text>
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

        {/* Título do FAQ (agora centralizado) */}
        <Text style={styles.faqHeader}>Perguntas frequentes:</Text>

        {/* Cards do FAQ (com estilos corrigidos) */}
        {faqData.map((faq, index) => (
          <View key={index} style={styles.faqCard}>
            <Text style={styles.faqQuestion}>{faq.pergunta}</Text>
            <Text style={styles.faqAnswer}>{faq.resposta}</Text>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  iconHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
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

  // --- MUDANÇAS A PARTIR DAQUI ---
  faqHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005A9C',
    marginBottom: 15,
    textAlign: 'center', // 1. TÍTULO CENTRALIZADO
  },
  faqCard: {
    backgroundColor: '#E6F0FA', // 2. COR DE FUNDO (igual da imagem)
    paddingVertical: 25,     // 3. MAIS ESPAÇO INTERNO
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005A9C',
    textAlign: 'center', // 4. PERGUNTA CENTRALIZADA
    marginBottom: 10,      // 5. ESPAÇO ENTRE PERGUNTA E RESPOSTA
  },
  faqAnswer: {
    fontSize: 15,
    color: '#3A5C7A',     // 6. COR DO TEXTO (igual de outros parágrafos)
    textAlign: 'center', // 7. RESPOSTA CENTRALIZADA
    lineHeight: 22,      // 8. ESPAÇAMENTO ENTRE LINHAS
  },
});