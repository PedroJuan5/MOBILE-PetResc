import { Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { DenuncieModal } from '../../../components/denuncieModal';
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';

export default function AdotarScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const handleDenunciePress = () => setModalVisible(true);

  const handleFormPress = () => {
    router.push('/formulario-interesse');
  };

  const handlePetsPress = () => {
    router.push('/pets-disponiveis');
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
      <DenuncieModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconHeaderContainer}>
          <CustomHeaderLeft onDenunciePress={handleDenunciePress} />
          <CustomHeaderRight />
        </View>

        <Text style={styles.tituloDePagina}>
          Veja a diferença que você pode fazer!
        </Text>

        <Text style={styles.paragraph}>
          No PetCo, você pode apoiar diretamente as ONGs cadastradas. Cada
          contribuição ajuda a oferecer alimentação, cuidados médicos e abrigo
          para animais em situação de vulnerabilidade. Escolha a ONG que mais
          toca seu coração e faça parte dessa rede de solidariedade.
        </Text>

        <View style={styles.cartao}>
          <Image
            source={require('../../../assets/images/ui/gato-preto-branco.png')}
            style={styles.imagemCima}
          />
          <View style={styles.caixaTexto}>
            <Text style={styles.numero}>85</Text>
            <Text style={styles.texto}>Campanhas{"\n"}Realizadas</Text>
          </View>
        </View>

        <View style={styles.cartao}>
          <View style={styles.caixaTexto}>
            <Text style={styles.numero}>157</Text>
            <Text style={styles.texto}>Doadores{"\n"}Ativos</Text>
          </View>
          <Image
            source={require('../../../assets/images/ui/doacao.png')}
            style={styles.imagemBaixo}
          />
        </View>

        <View style={[styles.cartao, { flexDirection: 'column', padding: 0 }]}>
          <Image
            source={require('../../../assets/images/ui/CaesAglomerados.png')}
            style={[styles.imagemCima, { width: '100%', height: 170, resizeMode: 'cover' }]}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(45,104,166,0.65)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={[styles.numero, { color: '#fff', fontSize: 30, fontWeight: '700', marginBottom: 6 }]}>
              R$ 78.446,96
            </Text>
            <Text style={[styles.texto, { color: '#fff', fontSize: 16 }]}>
              Valor Arrecadado
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 25, paddingHorizontal: 20 }}>
          <Text
            style={{
              color: '#2D68A6',
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 16,
            }}
          >
            Mais populares
          </Text>

          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 14,
              padding: 14,
              marginBottom: 18,
              borderWidth: 1,
              borderColor: '#E5ECF3',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Image
              source={require('../../../assets/images/ui/institutoCaramelo.png')}
              style={{
                width: '100%',
                height: 150,
                borderRadius: 10,
              }}
            />

            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                marginTop: 8,
                color: '#000',
              }}
            >
              Instituto caramelo
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
              
              <Text style={{ fontSize: 12, color: '#444', flex: 1 }}>
                Rua José Felix de Oliveira, 1234 – Granja Viana, Cotia – SP, 06709-400
              </Text>
            </View>

            <View style={{ marginTop: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    flex: 1,
                    height: 6,
                    backgroundColor: '#E5ECF3',
                    borderRadius: 4,
                  }}
                >
                  <View
                    style={{
                      width: '50%',
                      height: 6,
                      backgroundColor: '#2D68A6',
                      borderRadius: 4,
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 11,
                    color: '#666',
                    marginLeft: 6,
                    marginTop: 1,
                  }}
                >
                  50%
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 12,
                  color: '#444',
                  marginTop: 6,
                }}
              >
                Arrecadado até agora:{' '}
                <Text style={{ fontWeight: '600' }}>R$ 14.964</Text> / R$ 30.000
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: '#E5ECF3',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Image
              source={require('../../../assets/images/ui/suipa.png')}
              style={{
                width: '100%',
                height: 150,
                borderRadius: 10,
              }}
            />

            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                marginTop: 8,
                color: '#000',
              }}
            >
              SUIPA
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
              
              <Text style={{ fontSize: 12, color: '#444', flex: 1 }}>
                Av. Dom Hélder Câmara, 1801 – Benfica, Rio de Janeiro – RJ
              </Text>
            </View>

            <View style={{ marginTop: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    flex: 1,
                    height: 6,
                    backgroundColor: '#E5ECF3',
                    borderRadius: 4,
                  }}
                >
                  <View
                    style={{
                      width: '50%',
                      height: 6,
                      backgroundColor: '#2D68A6',
                      borderRadius: 4,
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 11,
                    color: '#666',
                    marginLeft: 6,
                    marginTop: 1,
                  }}
                >
                  50%
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 12,
                  color: '#444',
                  marginTop: 6,
                }}
              >
                Arrecadado até agora:{' '}
                <Text style={{ fontWeight: '600' }}>R$ 7.813</Text> / R$ 15.000
              </Text>
            </View>
          </View>

          <Text
            style={{
              textAlign: 'right',
              color: '#2D68A6',
              fontWeight: '600',
              fontSize: 13,
              marginTop: 14,
            }}
          >
            Ver Todas
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
    paddingBottom: 50,
  },
  iconHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  tituloDePagina: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2D68A6',
    width: '70%',
    marginBottom: 20,
    marginTop: 10,
  },
  mainImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
    textAlign: 'left',
    marginBottom: 20,
  },
  cartao: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  imagemCima: {
    width: '50%',
    height: 180,
  },
  imagemBaixo: {
    width: '50%',
    height: 180,
  },
  caixaTexto: {
    width: '50%',
    backgroundColor: '#bcd0e8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  numero: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4a6a8a',
  },
  texto: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4a6a8a',
  },
});
