import { Feather, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { 
  Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, 
  ActivityIndicator, FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { DenuncieModal } from '../../../components/denuncieModal';
import CustomHeaderRight from '../../../components/elementosDireita'; 
import CustomHeaderLeft from '../../../components/elementosEsquerda'; 

// Import API
import api from '@/lib/axios';

// Interface do Animal
interface Animal {
  id: number;
  nome: string;
  raca: string | null;
  photoURL: string | null;
  status: string;
  local_cidade?: string;
}

export default function AdotarScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estado para os animais perdidos
  const [animaisPerdidos, setAnimaisPerdidos] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDenunciePress = () => setModalVisible(true);

  const handleFormPress = () => {
    router.push('/formulario-interesse');
  };
  
  const handlePetsPress = () => {
    router.push('/pets-disponiveis'); 
  };

  // --- BUSCA ANIMAIS PERDIDOS ---
  useFocusEffect(
    useCallback(() => {
      fetchAnimaisPerdidos();
    }, [])
  );

  const fetchAnimaisPerdidos = async () => {
    try {
      setLoading(true);
      console.log("Buscando animais perdidos...");
      
      // Chama a rota de listagem filtrando pelo status PERDIDO
      // A rota pode ser '/animais' ou '/feed', dependendo do seu server.js
      // Vou usar '/animais' pois é o padrão público de listagem
      const response = await api.get('/animais', {
          params: { status: 'PERDIDO' }
      });
      
      console.log("Animais encontrados:", response.data.length);
      setAnimaisPerdidos(response.data);
    } catch (error) {
      console.error("Erro ao buscar animais perdidos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper para imagem
  const getImageSource = (url: string | null) => {
      if (!url) return require("../../../assets/images/pets/branquinho.png");
      if (url.startsWith('http')) return { uri: url };
      return { uri: `https://petresc.onrender.com/${url.replace(/\\/g, '/')}` };
  };
  
  const adocaoSlides = [
    {
      key: 'interesse',
      title: 'Formulário de interesse',
      description: 'Faça o formulário de inscrição que disponibilizamos aqui que a ONG/protetor entrará em contato com você.',
      iconName: 'pencil-square-o',
      iconLib: FontAwesome,
    },
    {
      key: 'avaliacao',
      title: 'Avaliação de adoção',
      description: 'A ONG irá fazer a análise do cadastro e perfil do adotante e o pet escolhido. Você recebe a aprovação por telefone/email.',
      iconName: 'bar-chart',
      iconLib: FontAwesome,
    },
    {
      key: 'completa',
      title: 'Adoção completa',
      description: 'Caso seja aprovado, você busca seu pet no dia combinado com a ONG/protetor.',
      iconName: 'paw',
      iconLib: FontAwesome5,
    },
  ];

  // Componente de Card para o Animal Perdido
  const renderLostPet = ({ item }: { item: Animal }) => (
    <TouchableOpacity 
      style={styles.petCard}
      onPress={() => router.push({ pathname: '/detalhes-pet', params: { id: item.id } } as any)}
    >
        <Image 
            source={getImageSource(item.photoURL) as any} 
            style={styles.petImage}
        />
        <View style={styles.petOverlay}>
            <Text style={styles.petName} numberOfLines={1}>{item.nome}</Text>
            <View style={styles.petTag}>
                <Ionicons name="alert-circle" size={12} color="#FFF" />
                <Text style={styles.petTagText}>PERDIDO</Text>
            </View>
        </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <DenuncieModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.iconHeaderContainer}>
            <CustomHeaderLeft onDenunciePress={handleDenunciePress} />
            <CustomHeaderRight />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.tituloDePagina}>Conheça seu novo melhor amigo!</Text>
   
          <Image 
            source={require("../../../assets/images/ui/pata.png")} 
            style={[styles.paw, styles.paw1]} 
            resizeMode="contain"
          />
          <Image 
            source={require("../../../assets/images/ui/pata.png")} 
            style={[styles.paw, styles.paw2]} 
            resizeMode="contain"
          />
        </View>
        
        <Image
          source={require('../../../assets/images/ui/caoegato.png')} 
          style={styles.mainImage}
        />
        
        {/* --- NOVA SEÇÃO: ANIMAIS PERDIDOS --- */}
        <View style={styles.lostSection}>
            <View style={{flexDirection:'row', alignItems:'center', marginBottom: 10, paddingHorizontal: 5}}>
                <Ionicons name="megaphone" size={20} color="#E74C3C" style={{marginRight: 5}} />
                <Text style={styles.lostTitle}>Animais Perdidos - Ajude!</Text>
            </View>
            
            {loading ? (
                <ActivityIndicator color="#2D68A6" style={{height: 150}}/>
            ) : animaisPerdidos.length > 0 ? (
                <FlatList 
                    data={animaisPerdidos}
                    renderItem={renderLostPet}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingRight: 20}}
                    style={{ minHeight: 180 }} // Garante altura visível
                />
            ) : (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>Nenhum animal perdido reportado no momento.</Text>
                </View>
            )}
        </View>
        {/* ------------------------------------ */}

        <Text style={styles.paragraph}>
          Nosso sistema de adoção foi desenvolvido para conectar animais em situação de
          vulnerabilidade a pessoas responsáveis que desejam oferecer um lar.
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
  iconHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, 
    marginTop: 10,
  },
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingBottom: 40,
  },
  titleContainer: {
    position: 'relative', 
    marginBottom: 30, 
    marginTop: 10,
  },
  tituloDePagina: { 
    fontSize: 32,
    fontWeight: "800",
    color: "#2D68A6",
    width: "80%", 
    marginTop: 5,
    fontFamily: 'MoreSugar', 
    lineHeight: 40,
  },
  paw: {
    position: 'absolute',
    width: 110,
    height: 110, 
    opacity: 0.5,
  },
  paw1: { top: -40, right: 40, transform: [{ rotate: '15deg' }] },
  paw2: { top: 70, right: 10, transform: [{ rotate: '-20deg' }] },
  mainImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  
  // --- ESTILOS DO FEED DE PERDIDOS ---
  lostSection: {
      marginBottom: 25,
  },
  lostTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#E74C3C', // Vermelho para chamar atenção
  },
  petCard: {
      width: 140,
      height: 180,
      borderRadius: 12,
      marginRight: 15,
      overflow: 'hidden',
      backgroundColor: '#f0f0f0',
      elevation: 2,
      borderWidth: 1,
      borderColor: '#eee'
  },
  petImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
  },
  petOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      padding: 8,
  },
  petName: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 14,
      marginBottom: 4
  },
  petTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E74C3C',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      alignSelf: 'flex-start'
  },
  petTagText: {
      color: '#FFF',
      fontSize: 10,
      fontWeight: 'bold',
      marginLeft: 4
  },
  emptyBox: {
      padding: 20,
      backgroundColor: '#F9F9F9',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      height: 100
  },
  emptyText: {
      color: '#999',
      fontStyle: 'italic'
  },
  // -----------------------------------

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