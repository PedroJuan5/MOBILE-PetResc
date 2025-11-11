import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
// <<< MUDANÇA 1/3: Importar Linking e Alert >>>
import {  Image,  ImageSourcePropType,  ScrollView,  StyleSheet,  Text,  TouchableOpacity,  View, Linking,  Alert  } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { DenuncieModal } from '../../../components/denuncieModal';
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';

/*
 Pega um endereço em string, formata para URL e tenta abrir no Maps
 */
const handleOpenMaps = async (endereco: string) => {
  // Codifica o endereço para ser usado em uma URL (troca espaços por %20)
  const encodedAddress = encodeURIComponent(endereco);
  const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  try {
    //tenta abrir a URL
    await Linking.openURL(url);
  } catch (err) {
    // Se falhar (ex: app do Maps não instalado), mostra um alerta
    Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapas.');
    console.error('Falha ao abrir o link do Maps:', err);
  }
};

//tipos para TypeScript
interface Animal {
  id: string;
  nome: string;
  imagem: ImageSourcePropType;
  raca: string;
  sexo: string;
  larTemporario: boolean;
  status: string;
}
interface Ong {
  id: string;
  nome: string;
  imagem: ImageSourcePropType;
  endereco: string;
}
interface CartaoAnimalProps {
  animal: Animal;
}
interface CartaoOngProps {
  ong: Ong;
}

const ANIMAIS: Animal[] = [
  {
    id: "1",
    nome: "Amendoim",
    imagem: require("../../../assets/images/pets/caramelo.png"),
    raca: "Sem raça definida (SRD)",
    sexo: "F",
    larTemporario: true,
    status: "Disponível",
  },
  {
    id: "2",
    nome: "Bigodes",
    imagem: require("../../../assets/images/ui/gatoHome.png"),
    raca: "Siamês",
    sexo: "M",
    larTemporario: false,
    status: "Em tratamento",
  },
];

const ONGS: Ong[] = [
  {
    id: "1",
    nome: "Abrigo do Bairro",
    imagem: require("../../../assets/images/pets/jimjim.png"),
    endereco:
      "Rua do Saber, 223 - Vila Santo Antônio, Cotia - SP, 06706-281",
  },
  {
    id: "2",
    nome: "Resgate Feliz",
    imagem: require("../../../assets/images/pets/mel.png"),
    endereco:
      "Avenida da Inovação, 1420 - Vila Santa Antônia, Cotia - SP, 06708-282",
  },
];

//componentes reutilizáveis
const CartaoAnimal = ({ animal }: CartaoAnimalProps) => (
  <View style={styles.cartaoAnimal}>
    <Image source={animal.imagem} style={styles.imagemAnimal} />
    <View style={styles.infoAnimal}>
      <Text style={styles.nomeAnimal}>{animal.nome}</Text>
      <Text style={styles.detalheAnimal}>
        {animal.raca}  {animal.sexo}
      </Text>
      <Text style={styles.detalheAnimal}>
        {animal.larTemporario ? "Lar temporário" : "Abrigo"}
      </Text>
      <Text style={[styles.detalheAnimal, { fontWeight: "700" }]}>
        Status: {animal.status}
      </Text>
    </View>
  </View>
);

// <<< MUDANÇA 3/3: Adicionar o onPress ao botão >>>
const CartaoOng = ({ ong }: CartaoOngProps) => (
  <View style={styles.cartaoOng}>
    <Image source={ong.imagem} style={styles.imagemOng} />
    <View style={styles.infoOng}>
      <Text style={styles.nomeOng}>{ong.nome}</Text>
      <Text style={styles.enderecoOng}>{ong.endereco}</Text>
      
      {/* Adicionamos a propriedade 'onPress' ao botão */}
      <TouchableOpacity 
        style={styles.botaoMaps}
        onPress={() => handleOpenMaps(ong.endereco)} // Chama a função com o endereço da ONG
      >
        <Text style={styles.textoBotaoMaps}>Abrir no MAPS</Text>
        <Ionicons
          name="location"
          size={16}
          color="#2D68A6"
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>
    </View>
  </View>
);
// --- FIM DA MUDANÇA ---


export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const handleDenunciePress = () => setModalVisible(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <DenuncieModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          
          <View style={styles.iconHeaderContainer}>
            <CustomHeaderLeft onDenunciePress={handleDenunciePress} />
            <CustomHeaderRight />
          </View>

          <Text style={styles.tituloDePagina}>Conheça seu novo melhor amigo!</Text>

          <Text style={styles.subTitulo}>Meus animais</Text>
          <ScrollView horizontal showsVerticalScrollIndicator={false}>
            {ANIMAIS.map((a) => (
              <CartaoAnimal key={a.id} animal={a} />
            ))}
          </ScrollView>

          <Text style={styles.subTitulo}>Sua contribuição salva vidas</Text>
          <View style={styles.boxContribuicao}>
            <View style={styles.textoContribuicao}>
              <Text style={styles.paragrafoContribuicao}>
                Com a sua ajuda garantimos comida, atendimento veterinário e
                um lar temporário seguro enquanto buscamos adoção responsável.
              </Text>
              <TouchableOpacity style={styles.botaoDoar}>
                <Text style={styles.textoBotaoDoar}>Doe agora</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require("../../../assets/images/ui/gatoHome.png")}
              style={styles.imagemContribuicao}
            />
          </View>

          <Text style={styles.subTitulo}>ONGs próximas a você</Text>
          {ONGS.map((o) => (
            <CartaoOng key={o.id} ong={o} />
          ))}
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
  tituloDePagina: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2D68A6",
    width: "70%",
    marginBottom: 20,
    marginTop: 10,
  },
  subTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3A5C7A",
    marginBottom: 20,
    marginTop: 15,
  },
  cartaoAnimal: {
    width: 300,
    height: 120,
    backgroundColor: "#E6F0FA",
    borderRadius: 15,
    flexDirection: "row",
    marginRight: 15,
    overflow: "hidden",
  },
  imagemAnimal: { width: 100, height: "100%", resizeMode: "cover" },
  infoAnimal: { flex: 1, padding: 10, justifyContent: "center" },
  nomeAnimal: { fontSize: 16, fontWeight: "700", color: "#2D68A6" },
  detalheAnimal: { fontSize: 13, color: "#3A5C7A", marginTop: 9},
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
    lineHeight: 22,
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
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: "cover",
  },
  infoOng: { flex: 1 },
  nomeOng: { fontSize: 16, fontWeight: "700", color: "#2D68A6" },
  enderecoOng: { fontSize: 12, color: "#3A5C7A", marginVertical: 6 },
  botaoMaps: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start" },
  textoBotaoMaps: { color: "#2D68A6", fontWeight: "700" },
});