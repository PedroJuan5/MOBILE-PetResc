import React from "react";
import {SafeAreaView,ScrollView,View,Text, StyleSheet,Dimensions,TouchableOpacity,StatusBar,} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

//dimensoes da tela e escalas de responsividade
const { width, height } = Dimensions.get("window");
const LARGURA_BASE = 375;
const ALTURA_BASE = 812;

const escalaHorizontal = (t: number) => (width / LARGURA_BASE) * t;
const escalaVertical = (t: number) => (height / ALTURA_BASE) * t;
const escalaModerada = (t: number, f = 0.5) =>
  t + (escalaHorizontal(t) - t) * f;

//paleta de cores da home
const CORES = {
  primaria: "#2D68A6",
  azulClaro: "#E6F0FA",
  fundoCard: "#F6FBFF",
  textoNeutro: "#3A5C7A",
  bordaClaro: "#D6EAF7",
  pataClaro: "#BFE1F7",
  pataMaisClaro: "#CFE8FB",
};

//dados para os cards de funcionalidades e estatísticas
const funcionalidades = [
  {
    icone: "hand-holding-heart",
    titulo: "Faça sua doação",
    descricao:
      "Contribua com suprimentos ou recursos e ajude a transformar a vida de animais resgatados.",
    textoBotao: "Saiba mais",
  },
  {
    icone: "paw",
    titulo: "Adoções",
    descricao:
      "Veja perfis de animais prontos para adoção e agende uma visita.",
    textoBotao: "Ver animais",
  },
];

const estatisticas = [
  { numero: 63, rotulo: "Animais adotados" },
  { numero: 12, rotulo: "ONGs parceiras" },
  { numero: 8, rotulo: "Campanhas realizadas" },
];

//componente principal da Home 
export default function Home() {
  return (
    <SafeAreaView style={styles.areaSegura}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        /* titulo principal e decoracao */
        <View style={styles.boxTitulo}>
          <Text style={styles.tituloPrincipal}>
            Conheça seu novo{"\n"}melhor amigo!
          </Text>
          <View style={styles.decoracaoPatas}>
            <FontAwesome5
              name="paw"
              size={escalaModerada(18)}
              color={CORES.pataClaro}
            />
            <FontAwesome5
              name="paw"
              size={escalaModerada(12)}
              color={CORES.pataMaisClaro}
              style={{ marginLeft: escalaModerada(8), opacity: 0.6 }}
            />
          </View>
        </View>

        /*secao:nossa missao*/
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Nossa missão</Text>
          <View style={styles.caixaMissao}>
            <Text style={styles.textoMissao}>
              Nosso objetivo é otimizar a gestão das organizações, dar mais
              visibilidade aos animais em situação de vulnerabilidade e
              incentivar a participação social, ajudando a reduzir o abandono
              e promovendo a adoção responsável.
            </Text>
          </View>
        </View>

        /*seçao:funcionalidades em destaque*/
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Funcionalidades em destaque</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listaFuncionalidades}
          >
            {funcionalidades.map((item, idx) => (
              <CartaoFuncionalidade
                key={idx}
                icone={item.icone}
                titulo={item.titulo}
                descricao={item.descricao}
                textoBotao={item.textoBotao}
                ultimo={idx === funcionalidades.length - 1}
                onPress={() => console.log("Navegar para", item.titulo)}
              />
            ))}
          </ScrollView>
        </View>

        /* seçao:estatísticas */
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Nossos marcos</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listaEstatisticas}
          >
            {estatisticas.map((item, idx) => (
              <CartaoEstatistica
                key={idx}
                numero={item.numero}
                rotulo={item.rotulo}
                ultimo={idx === estatisticas.length - 1}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// componentes de cartão reutilizáveis 
interface CartaoFuncProps {
  icone: string;
  titulo: string;
  descricao: string;
  textoBotao: string;
  ultimo: boolean;
  onPress: () => void;
}
function CartaoFuncionalidade({
  icone,
  titulo,
  descricao,
  textoBotao,
  ultimo,
  onPress,
}: CartaoFuncProps) {
  return (
    <View
      style={[
        styles.cardFuncionalidade,
        { marginRight: ultimo ? 0 : escalaModerada(12) },
      ]}
    >
      <View style={styles.iconeCard}>
        <FontAwesome5
          name={icone}
          size={escalaModerada(18)}
          color={CORES.primaria}
        />
      </View>
      <Text style={styles.tituloCard}>{titulo}</Text>
      <Text style={styles.descricaoCard}>{descricao}</Text>
      <TouchableOpacity style={styles.botaoLink} onPress={onPress}>
        <Text style={styles.textoLink}>{textoBotao}</Text>
      </TouchableOpacity>
    </View>
  );
}

interface CartaoEstProps {
  numero: number;
  rotulo: string;
  ultimo: boolean;
}
function CartaoEstatistica({ numero, rotulo, ultimo }: CartaoEstProps) {
  return (
    <View
      style={[
        styles.cardEstatistica,
        { marginRight: ultimo ? 0 : escalaModerada(10) },
      ]}
    >
      <Text style={styles.numeroEstatistica}>{numero}</Text>
      <Text style={styles.rotuloEstatistica}>{rotulo}</Text>
    </View>
  );
}

// — Estilos da tela —
const styles = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: escalaModerada(18),
    paddingBottom: escalaVertical(40),
  },
  cabecalho: {
    marginTop: escalaVertical(3),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: escalaModerada(18),
  },
  botaoMenu: {
    padding: escalaModerada(6),
  },
  botaoPerfil: {
    padding: escalaModerada(6),
  },
  boxTitulo: {
    marginTop: escalaVertical(14),
    marginBottom: escalaVertical(8),
    position: "relative",
  },
  tituloPrincipal: {
    fontSize: escalaModerada(26),
    fontWeight: "700",
    color: CORES.primaria,
    lineHeight: escalaModerada(36),
  },
  decoracaoPatas: {
    position: "absolute",
    right: 0,
    top: 0,
    flexDirection: "row",
  },
  secao: {
    marginTop: escalaVertical(18),
  },
  tituloSecao: {
    fontSize: escalaModerada(14),
    fontWeight: "600",
    color: CORES.textoNeutro,
    marginBottom: escalaVertical(8),
  },
  caixaMissao: {
    backgroundColor: CORES.azulClaro,
    borderRadius: escalaModerada(12),
    padding: escalaModerada(14),
    borderWidth: 1,
    borderColor: CORES.bordaClaro,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  textoMissao: {
    fontSize: escalaModerada(13),
    lineHeight: escalaModerada(18),
    color: CORES.textoNeutro,
  },
  listaFuncionalidades: {
    paddingVertical: escalaVertical(6),
    paddingLeft: escalaModerada(10),
  },
  cardFuncionalidade: {
    width: Math.min(width * 0.8, escalaModerada(300)),
    backgroundColor: CORES.fundoCard,
    borderRadius: escalaModerada(12),
    padding: escalaModerada(14),
    borderWidth: 1,
    borderColor: CORES.bordaClaro,
  },
  iconeCard: {
    width: escalaModerada(36),
    height: escalaModerada(36),
    borderRadius: escalaModerada(10),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: escalaVertical(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  tituloCard: {
    fontSize: escalaModerada(16),
    fontWeight: "700",
    color: CORES.primaria,
    marginBottom: escalaVertical(6),
  },
  descricaoCard: {
    fontSize: escalaModerada(12),
    color: CORES.textoNeutro,
    marginBottom: escalaVertical(10),
  },
  botaoLink: {
    alignSelf: "flex-start",
    paddingVertical: escalaModerada(6),
  },
  textoLink: {
    fontSize: escalaModerada(13),
    color: CORES.primaria,
    fontWeight: "600",
  },
  listaEstatisticas: {
    paddingLeft: escalaModerada(10),
    paddingVertical: escalaVertical(6),
  },
  cardEstatistica: {
    width: Math.min(width * 0.4, escalaModerada(140)),
    backgroundColor: CORES.azulClaro,
    paddingVertical: escalaVertical(18),
    borderRadius: escalaModerada(12),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: CORES.bordaClaro,
  },
  numeroEstatistica: {
    fontSize: escalaModerada(34),
    fontWeight: "700",
    color: CORES.primaria,
  },
  rotuloEstatistica: {
    fontSize: escalaModerada(12),
    color: CORES.textoNeutro,
    marginTop: escalaVertical(6),
  },
});