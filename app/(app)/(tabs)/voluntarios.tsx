import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-swiper';
import { DenuncieModal } from '../../../components/denuncieModal';
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';


if (!global.setImmediate) {
  global.setImmediate = ((callback: (...args: any[]) => void) => setTimeout(callback, 0)) as any;
}

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
    pergunta: 'Por quanto tempo devo cuidar do animal?',
    resposta: 'O período varia conforme a necessidade do animal, geralmente de algumas semanas a meses.',
  },
  {
    pergunta: 'Preciso ter experiência com animais?',
    resposta: 'Não. Fornecemos orientação e acompanhamento completo durante toda a estadia.',
  },
  {
    pergunta: 'Há custos envolvidos?',
    resposta: 'Algumas despesas podem ser cobertas pelo programa, mas cada lar deve fornecer alimentação e cuidados básicos.',
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
    <SafeAreaView style={styles.containerSafe}>
      <DenuncieModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <ScrollView contentContainerStyle={styles.contentWrapper}>
        <View style={styles.headerRow}>
          <CustomHeaderLeft onDenunciePress={handleDenunciePress} />
          <CustomHeaderRight />
        </View>

        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>O que é um Lar Temporário?</Text>

          <Image
            source={require('../../../assets/images/ui/pata.png')}
            style={[styles.decorativePaw, styles.decorativePawTopRight]}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.bodyText}>
          É um lar humano acolhedor que abriga temporariamente animais resgatados em situação de vulnerabilidade, oferecendo-lhes um ambiente seguro, carinho e cuidados até que encontrem um lar definitivo ou um cuidador permanente.
        </Text>

        <Image source={require('../../../assets/images/ui/gatoVoluntario.png')} style={styles.heroImage} />

        <Text style={styles.bodyText}>
          Este gesto transforma vidas, permitindo que os animais recebam tratamento adequado, evitem o isolamento em abrigos e aprendam a confiar novamente, enquanto as famílias que acolhem se sentem gratificadas por fazer a diferença.
        </Text>

        <View style={styles.carouselWrapper}>
          <Swiper
            style={styles.carousel}
            showsButtons={true}
            showsPagination={false}
            loop={false}
            buttonWrapperStyle={styles.carouselControls}
            nextButton={<Feather name="chevron-right" size={30} color="#005A9C" />}
            prevButton={<Feather name="chevron-left" size={30} color="#005A9C" />}
          >
            {voluntarioSlides.map((slide) => {
              const IconComponent = slide.iconLib;
              return (
                <TouchableOpacity
                  key={slide.key}
                  style={styles.featureCard}
                  onPress={slide.key === 'interesse' ? handleFormPress : undefined}
                  activeOpacity={slide.key === 'interesse' ? 0.8 : 1.0}
                >
                  <View style={styles.featureIconWrapper}>
                    <IconComponent name={slide.iconName} size={50} color="#FFFFFF" />
                  </View>
                  <Text style={styles.featureTitle}>{slide.title}</Text>
                  <Text style={styles.featureText}>{slide.description}</Text>
                </TouchableOpacity>
              );
            })}
          </Swiper>
        </View>

        <Text style={styles.faqTitle}>Perguntas frequentes:</Text>

        {faqData.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.faqQuestionText}>{faq.pergunta}</Text>
            <Text style={styles.faqAnswerText}>{faq.resposta}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerSafe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  contentWrapper: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
  },
  headerTitleWrapper: {
    position: 'relative',
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 40,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#005A9C',
    width: '95%',
  },
  decorativePaw: {
    position: 'absolute',
    width: 100,
    height: 100,
    opacity: 0.5,
  },
  decorativePawTopRight: {
    top: -30,
    right: 50,
    transform: [{ rotate: '15deg' }],
  },
  bodyText: {
    fontSize: 17,
    lineHeight: 32,
    color: '#333',
    justifyContent: 'center',
    marginBottom: 25,
    marginLeft: 20,
  },
  heroImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  carouselWrapper: {
    height: 320,
    marginTop: 10,
    marginBottom: 30,
  },
  carouselControls: {
    paddingHorizontal: 0,
    width: '100%',
    position: 'absolute',
    top: 0,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  carousel: {},
  featureCard: {
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
  featureIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#005A9C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005A9C',
    textAlign: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005A9C',
    marginBottom: 15,
    textAlign: 'center',
  },
  faqItem: {
    backgroundColor: '#E6F0FA',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005A9C',
    textAlign: 'center',
    marginBottom: 10,
  },
  faqAnswerText: {
    fontSize: 15,
    color: '#3A5C7A',
    textAlign: 'center',
    lineHeight: 22,
  },
});