import React, { useState } from 'react';
import {View, Text, ScrollView, Image, StyleSheet, TouchableOpacity,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Swiper from 'react-native-swiper';
import { Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';

import CustomHeaderLeft from '../../../components/elementosEsquerda'; 
import CustomHeaderRight from '../../../components/elementosDireita'; 
import {DenuncieModal }from '../../../components/denuncieModal';

export default function AdotarScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const handleDenunciePress = () => setModalVisible(true);
  const handleFormPress = () => {
    router.push('/formulario-interesse');
  };


 
  // Esta função é chamada quando o botão é pressionado
  const handlePetsPress = () => {
    router.push('/pets');
  };
 
  const adocaoSlides = [
    {
      key: 'interesse',
      title: 'Formulário de interesse',
      description:
        'Faça o formulário de inscrição que disponibilizamos aqui que a ONG/protetor entrará em contato com você.',
      iconName: 'pencil-square-o',
      iconLib: FontAwesome,
    },
    {
      key: 'avaliacao',
      title: 'Avaliação de adoção',
      description:
        'A ONG irá fazer a análise do cadastro e perfil do adotante e o pet escolhido. Você recebe a aprovação por telefone/email.',
      iconName: 'bar-chart',
      iconLib: FontAwesome,
    },
    {
      key: 'completa',
      title: 'Adoção completa',
      description:
        'Caso seja aprovado, você busca seu pet no dia combinado com a ONG/protetor.',
      iconName: 'paw',
      iconLib: FontAwesome5,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <CustomHeaderLeft onDenunciePress={handleDenunciePress} />
        <Text style={styles.headerTitle}>Conheça seu novo melhor amigo!</Text>
        <CustomHeaderRight />
      </View>

      <DenuncieModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../../../assets/images/ui/caoegato.png')} // Mude se o caminho estiver errado
          style={styles.mainImage}
        />
        <Text style={styles.paragraph}>
          Nosso sistema de adoção foi desenvolvido para conectar animais em situação de
          vulnerabilidade a pessoas responsáveis que desejam oferecer um lar. Ao preencher o
          formulário, você fornece informações importantes que ajudam a ONG a avaliar o perfil do
          adotante e garantir que o animal tenha um ambiente seguro e adequado.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleFormPress}>
            <Text style={styles.buttonText}>Formulário</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={handlePetsPress}
          >
            <Text style={[styles.buttonText, styles.buttonOutlineText]}>Pets disponíveis</Text>
          </TouchableOpacity>

        </View>
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
            {adocaoSlides.map((slide) => {
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
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
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
  mainImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'left',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#005A9C',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#005A9C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonOutlineText: {
    color: '#005A9C',
  },
  swiperContainer: {
    height: 320,
    marginBottom: 20,
  },
  swiper: {},
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
});