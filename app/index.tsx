import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";

const PRIMARY = "#2D68A6"; // azul do print
const TEXT_MUTED = "#3A5C7A"; // tom mais frio para o subtítulo

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
          <Text style={styles.title}>PetCo</Text>
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
    transform: [{ translateY: -80 }], // sobe todo o bloco central
  },
  logo: {
    width: 700, 
    height: 700,
    marginBottom: -210, 
    marginLeft: 30, // desloca a logo um pouco para a direita
  },
  subtitle: {
    fontSize: 18,
    color: TEXT_MUTED,
    marginBottom: 3,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: PRIMARY,
    letterSpacing: 1,
  },
  footer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  cta: {
    width: "88%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 15,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
