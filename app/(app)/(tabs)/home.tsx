import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useCallback } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking, Alert, ActivityIndicator } from "react-native";
import { DenuncieModal } from '../../../components/denuncieModal';
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '@/lib/axios'; 
import { SafeAreaView } from "react-native-safe-area-context"; // Importante usar do safe-area-context para controle fino


// --- Função Auxiliar Maps ---
const handleOpenMaps = async (endereco: string) => {
  const encodedAddress = encodeURIComponent(endereco);
  const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  try {
    await Linking.openURL(url);
  } catch (err) {
    Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapas.');
  }
};

//Tipagens
interface Animal {
  id: number;
  nome: string;
  photoURL: string | null; 
  especie: string;
  sexo: string | null;
  status: string;
}

interface Ong {
  id: number;
  nome: string;
  email: string;
  ong?: {
    nome?: string;
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  }
}

//Componentes 
const CartaoAnimal = ({ animal }: { animal: Animal }) => {
  const imageSource = animal.photoURL 
    ? { uri: animal.photoURL } 
    : require("../../../assets/images/pets/caramelo.png");

  return (
    <View style={styles.cartaoAnimal}>
      <Image source={imageSource} style={styles.imagemAnimal} />
      <View style={styles.infoAnimal}>
        <Text style={styles.nomeAnimal}>{animal.nome}</Text>
        <Text style={styles.detalheAnimal}>
          {animal.especie} {animal.sexo ? `• ${animal.sexo}` : ''}
        </Text>
        <Text style={styles.detalheAnimal}>
          Abrigo / Lar
        </Text>
        <Text style={[styles.detalheAnimal, { fontWeight: "700", color: "#2D68A6" }]}>
          Status: {animal.status}
        </Text>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const handleDenunciePress = () => setModalVisible(true);

  // Estados dos Dados
  const [meusAnimais, setMeusAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  // Função de Busca
  const fetchDados = async () => {
    try {
      const resAnimais = await api.get('/usuarios/me/animais');      
      setMeusAnimais(resAnimais.data);
    } catch (error) {
      console.error("Erro ao buscar dados da home:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDados();
    }, [])
  );

  return (
    // 'edges' remove o padding automático de baixo (bottom), tirando o espaço branco extra
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      
      <DenuncieModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} // Padding pequeno apenas para não cortar a sombra
      >
        <View style={styles.container}>
          
          <View style={styles.iconHeaderContainer}>
            <CustomHeaderLeft onDenunciePress={handleDenunciePress} />
            <CustomHeaderRight />
          </View>

          {/* TÍTULO DA PÁGINA */}
          <View style={styles.titleContainer}>
            <Text style={styles.tituloDePagina}>Conheça seu novo melhor amigo!</Text>
            <Image source={require("../../../assets/images/ui/pata.png")} style={[styles.paw, styles.paw1]} resizeMode="contain"/>
            <Image source={require("../../../assets/images/ui/pata.png")} style={[styles.paw, styles.paw2]} resizeMode="contain"/>
          </View>        

          {/* SESSÃO: MEUS ANIMAIS */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, marginBottom: 20}}>
             <Text style={styles.subTituloSemMargem}>Meus animais</Text>
             <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/registro-animal')}>
                <Text style={{color: '#2D68A6', fontWeight: '700', fontSize: 16}}>+ Adicionar</Text>
             </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color="#2D68A6" />
          ) : meusAnimais.length === 0 ? (
            <View style={{padding: 30, backgroundColor: '#f0f4f8', borderRadius: 15, alignItems: 'center', marginVertical: 10}}>
                <Text style={{color: '#666', marginBottom: 10, fontSize: 16}}>Você ainda não cadastrou animais.</Text>
                <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/registro-animal')}>
                    <Text style={{color: '#2D68A6', fontWeight: 'bold', fontSize: 16}}>Cadastrar agora</Text>
                </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingBottom: 15}}>
              {meusAnimais.map((a) => (
                <TouchableOpacity 
                    key={a.id} 
                    activeOpacity={0.9} 
                    onPress={() => router.push({
                        pathname: '/(app)/gerenciar-adocao',
                        params: { petId: a.id }
                    } as any)}
                >
                    <CartaoAnimal animal={a} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* SESSÃO: DOAÇÃO */}
          <Text style={styles.subTitulo}>Sua contribuição salva vidas</Text>
          <View style={styles.boxContribuicao}>
            <View style={styles.textoContribuicao}>
              <Text style={styles.paragrafoContribuicao}>
                Com a sua ajuda garantimos comida, atendimento veterinário e
                um lar temporário seguro enquanto buscamos adoção responsável.
              </Text>
              <TouchableOpacity 
                style={styles.botaoDoar}
                onPress={() => router.push('/doar')}
              >
                <Text style={styles.textoBotaoDoar}>Doe agora</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require("../../../assets/images/ui/gatoHome.png")}
              style={styles.imagemContribuicao}
            />
          </View>    

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  
  container: { 
    paddingHorizontal: 20, 
    paddingTop: 20,
    paddingBottom: 0 // Importante para remover espaço extra
  }, 
  
  iconHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, 
    marginTop: 10,
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
    lineHeight: 40, 
    fontFamily: 'MoreSugar',
  },
  
  paw: {
    position: 'absolute',
    width: 110,
    height: 110,
    opacity: 0.5,
  },
  paw1: { top: -40, right: 40, transform: [{ rotate: '15deg' }] },
  paw2: { top: 70, right: 10, transform: [{ rotate: '-20deg' }] },
  
  subTitulo: {
    fontSize: 22, 
    fontWeight: "700",
    color: "#3A5C7A",
    marginBottom: 25,
    marginTop: 35, 
  },
  subTituloSemMargem: {
    fontSize: 22, 
    fontWeight: "700",
    color: "#3A5C7A",
  },

  cartaoAnimal: {
    width: 300, 
    height: 120,
    backgroundColor: "#E6F0FA",
    borderRadius: 18,
    flexDirection: "row",
    marginRight: 20,
    overflow: "hidden",
  },
  imagemAnimal: { width: 110, height: "100%", resizeMode: "cover" },
  infoAnimal: { flex: 1, padding: 15, justifyContent: "center" },
  nomeAnimal: { fontSize: 18, fontWeight: "700", color: "#2D68A6", marginBottom: 4 },
  detalheAnimal: { fontSize: 14, color: "#3A5C7A", marginTop: 2},
  
  // Box de Doação Ajustado
  boxContribuicao: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5, // Reduzido drasticamente para remover espaço branco
  },
  textoContribuicao: { flex: 1, marginRight: 15 },
  
  paragrafoContribuicao: {
    fontSize: 22, 
    color: "#3A5C7A",
    lineHeight: 24, 
    marginBottom: 45,
  },
  
  botaoDoar: {
    backgroundColor: "#BFE1F7",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 30, 
    alignSelf: "flex-start",
  },
  textoBotaoDoar: { color: "#2D68A6", fontWeight: "700", fontSize: 16 },
  
  imagemContribuicao: { width: 150, height: 200, resizeMode: "contain" }, 
  
  cartaoOng: {
    backgroundColor: "#E6F0FA",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  imagemOng: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: "cover",
    backgroundColor: '#ccc' 
  },
  infoOng: { flex: 1 },
  nomeOng: { fontSize: 16, fontWeight: "700", color: "#2D68A6" },
  enderecoOng: { fontSize: 12, color: "#3A5C7A", marginVertical: 6 },
  botaoMaps: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start" },
  textoBotaoMaps: { color: "#2D68A6", fontWeight: "700" },
});