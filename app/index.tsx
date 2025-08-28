import { Image, Pressable, StyleSheet, Text, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";

const PRIMARY = "#2D68A6"; // azul do print
const TEXT_MUTED = "#3A5C7A"; // tom mais frio para o subtítulo

const { width, height } = Dimensions.get("window"); // pega dimensões da tela

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* BLOCO CENTRAL (logo + textos centralizados) */}
        <View style={styles.centerBlock}>
          <Image
            source={require("../assets/LogoHome.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.subtitle}>Bem-vindo ao</Text>
        </View>

        {/* BOTÃO FIXO NA PARTE INFERIOR */}
        <View style={styles.footer}>
          <Link href="/(tabs)/index" asChild>
            <Pressable style={styles.cta} android_ripple={{ foreground: true }}>
              <Text style={styles.ctaText}>Comece já</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  centerBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -height * 0.1 }], // sobe 10% da altura da tela
  },
  logo: {
    width: width * 0.7, // 70% da largura da tela
    height: width * 0.7, // mantém proporção quadrada
    marginBottom: height * -0.1, // distancia logo e subtítulo proporcional
  },
  subtitle: {
    fontSize: width * 0.05, // tamanho de fonte proporcional à tela
    color: TEXT_MUTED,
    marginBottom: 3,
  },
  footer: {
    paddingBottom: 28,
    alignItems: "center",
  },
  cta: {
    width: "88%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 14,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
