import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useCallback } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking, Alert, ActivityIndicator } from "react-native";
import { DenuncieModal } from '../../../components/denuncieModal';
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '@/lib/axios'; 
import { SafeAreaView } from "react-native";


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
  photoURL: string | null; // URL do banco
  especie: string;
  sexo: string | null;
  status: string;
  //larTemporario não vem por padrão no listagem simples, adapte se necessário
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
  // Lógica da imagem: Se tiver URL, usa URI. Se não, usa imagem local.
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
          {/* Campo estático ou vindo do banco se tiver */}
          Abrigo / Lar
        </Text>
        <Text style={[styles.detalheAnimal, { fontWeight: "700", color: "#2D68A6" }]}>
          Status: {animal.status}
        </Text>
      </View>
    </View>
  );
};

const CartaoOng = ({ ong }: { ong: Ong }) => {
  // Formata endereço
  const dadosOng = ong.ong || {};
  const enderecoCompleto = dadosOng.rua 
    ? `${dadosOng.rua}, ${dadosOng.numero || ''} - ${dadosOng.bairro || ''}, ${dadosOng.cidade || ''} - ${dadosOng.estado || ''}`
    : "Endereço não informado";
  
  const nomeExibicao = dadosOng.nome || ong.nome;

  return (
    <View style={styles.cartaoOng}>
      <Image source={require("../../../assets/images/ui/maps1.png")} style={styles.imagemOng} />
      <View style={styles.infoOng}>
        <Text style={styles.nomeOng}>{nomeExibicao}</Text>
        <Text style={styles.enderecoOng} numberOfLines={2}>{enderecoCompleto}</Text>
        
        <TouchableOpacity 
          style={styles.botaoMaps}
          onPress={() => handleOpenMaps(enderecoCompleto)} 
        >
          <Text style={styles.textoBotaoMaps}>Abrir no MAPS</Text>
          <Ionicons name="location" size={16} color="#2D68A6" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
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
  const [ongs, setOngs] = useState<Ong[]>([]);
  const [loading, setLoading] = useState(true);

  // Função de Busca
  const fetchDados = async () => {
    try {
      // 1. Busca Meus Animais (Rota específica do usuário logado)
      // Ajuste a rota '/usuarios/meus-animais' conforme seu arquivo de rotas
     const resAnimais = await api.get('/usuarios/me/animais');      

      setMeusAnimais(resAnimais.data);
    } catch (error) {
      console.error("Erro ao buscar dados da home:", error);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect recarrega os dados toda vez que a tela ganha foco (útil se você acabou de adicionar um pet)
  useFocusEffect(
    useCallback(() => {
      fetchDados();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <DenuncieModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          
          <View style={styles.iconHeaderContainer}>
            <CustomHeaderLeft onDenunciePress={handleDenunciePress} />
            <CustomHeaderRight />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.tituloDePagina}>Conheça seu novo melhor amigo!</Text>
            <Image source={require("../../../assets/images/ui/pata.png")} style={[styles.paw, styles.paw1]} resizeMode="contain"/>
            <Image source={require("../../../assets/images/ui/pata.png")} style={[styles.paw, styles.paw2]} resizeMode="contain"/>
          </View>        

          {/* SESSÃO: MEUS ANIMAIS (Listar apenas animais do usuário) */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 15}}>
             <Text style={styles.subTituloSemMargem}>Meus animais</Text>
             {/* Botão opcional para adicionar pet rapidamente */}
             <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/registro-animal')}>
                <Text style={{color: '#2D68A6', fontWeight: '600'}}>+ Adicionar</Text>
             </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color="#2D68A6" />
          ) : meusAnimais.length === 0 ? (
            <View style={{padding: 20, backgroundColor: '#f0f4f8', borderRadius: 10, alignItems: 'center'}}>
                <Text style={{color: '#666', marginBottom: 5}}>Você ainda não cadastrou animais.</Text>
                <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/registro-animal')}>
                    <Text style={{color: '#2D68A6', fontWeight: 'bold'}}>Cadastrar agora</Text>
                </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingBottom: 10}}>
              {meusAnimais.map((a) => (
                <CartaoAnimal key={a.id} animal={a} />
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
  container: { padding: 20, paddingTop: 10 }, 
  iconHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  }, 
  titleContainer: {
    position: 'relative',
    marginBottom: 20,
    marginTop: 10,
  },
  tituloDePagina: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2D68A6",
    width: "70%",
  },
  paw: {
    position: 'absolute',
    width: 100,
    height: 100,
    opacity: 0.5,
  },
  paw1: { top: -30, right: 50, transform: [{ rotate: '15deg' }] },
  paw2: { top: 60, right: 20, transform: [{ rotate: '-20deg' }] },
  
  subTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3A5C7A",
    marginBottom: 20,
    marginTop: 15,
  },
  subTituloSemMargem: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3A5C7A",
  },
  cartaoAnimal: {
    width: 280, // Ajustado para não quebrar layout
    height: 110,
    backgroundColor: "#E6F0FA",
    borderRadius: 15,
    flexDirection: "row",
    marginRight: 15,
    overflow: "hidden",
  },
  imagemAnimal: { width: 100, height: "100%", resizeMode: "cover" },
  infoAnimal: { flex: 1, padding: 10, justifyContent: "center" },
  nomeAnimal: { fontSize: 16, fontWeight: "700", color: "#2D68A6", marginBottom: 2 },
  detalheAnimal: { fontSize: 13, color: "#3A5C7A", marginTop: 2},
  boxContribuicao: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  textoContribuicao: { flex: 1, marginRight: 10 },
  paragrafoContribuicao: {
    fontSize: 14,
    color: "#3A5C7A",
    lineHeight: 20,
    marginBottom: 20,
  },
  botaoDoar: {
    backgroundColor: "#BFE1F7",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  textoBotaoDoar: { color: "#2D68A6", fontWeight: "700" },
  imagemContribuicao: { width: 130, height: 180, resizeMode: "contain" },
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
    backgroundColor: '#ccc' // Placeholder color
  },
  infoOng: { flex: 1 },
  nomeOng: { fontSize: 16, fontWeight: "700", color: "#2D68A6" },
  enderecoOng: { fontSize: 12, color: "#3A5C7A", marginVertical: 6 },
  botaoMaps: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start" },
  textoBotaoMaps: { color: "#2D68A6", fontWeight: "700" },
});