import { Image, Pressable, StyleSheet, Text, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

// 🎨 Cores padrão
const PRIMARY = "#2D68A6"; 
const TEXT_MUTED = "#3A5C7A"; 

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      
      <View style={styles.container}>
        {/* BLOCO CENTRAL */}
        <View style={styles.centerBlock}>
          {/* Logo */}
          <Image
            source={require("../assets/LogoHome.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Textos */}
          <Text style={styles.subtitle}>Bem-vindo ao</Text>
          <Text style={styles.title}>PetCo</Text>
        </View>

        {/* BOTÃO */}
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
    paddingHorizontal: width * 0.06, // padding proporcional
    justifyContent: "space-between",
  },
  centerBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -height * 0.05 }], // sobe 5% da tela
  },
  logo: {
    width: width * 1.9, // 55% da largura da tela
    height: width * 1.0,
    marginBottom: height * 0.02, // espaçamento proporcional
  },
  subtitle: {
    fontSize: width * 0.10, // responsivo
    color: TEXT_MUTED,
    marginBottom: height * 0.002,
  },
  title: {
    fontSize: width * 0.1, // responsivo
    fontWeight: "800",
    color: PRIMARY,
    letterSpacing: 1,
  },
  footer: {
    paddingBottom: height * 0.035, // proporcional
    alignItems: "center",
  },
  cta: {
    width: "88%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY,
    paddingVertical: height * 0.02,
    borderRadius: 14,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: width * 0.05, // responsivo
    fontWeight: "600",
  },
});
