import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {Image,ImageSourcePropType,ScrollView,StyleSheet,Text,TouchableOpacity,View,} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeaderLeft from '../../../components/elementosEsquerda';
import CustomHeaderRight from '../../../components/elementosDireita';
import { DenuncieModal } from '../../../components/denuncieModal';

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

const CartaoOng = ({ ong }: CartaoOngProps) => (
  <View style={styles.cartaoOng}>
    <Image source={ong.imagem} style={styles.imagemOng} />
    <View style={styles.infoOng}>
      <Text style={styles.nomeOng}>{ong.nome}</Text>
      <Text style={styles.enderecoOng}>{ong.endereco}</Text>
      <TouchableOpacity style={styles.botaoMaps}>
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

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const handleDenunciePress = () => setModalVisible(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* --- 4. SEU NOVO HEADER CUSTOMIZADO --- */}
      <View style={styles.headerContainer}>
        <CustomHeaderLeft onDenunciePress={handleDenunciePress} />
        {/* Mantive o mesmo texto do seu título antigo */}
        <Text style={styles.headerTitle}>Conheça seu novo melhor amigo!</Text>
        <CustomHeaderRight />
      </View>

      {/* --- 5. SEU MODAL (renderizado mas invisível) --- */}
      <DenuncieModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          
          {/* --- O CABEÇALHO ANTIGO FOI REMOVIDO DAQUI --- */}

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
    fontSize: 22,
    fontWeight: '700', 
    color: '#2D68A6', 
    textAlign: 'center',
    flex: 1, 
  },

  container: { padding: 20, paddingTop: 10 }, 


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