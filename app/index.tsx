import { Image, Pressable, StyleSheet, Text, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

const PRIMARY = "#2D68A6";
const TEXT_MUTED = "#3A5C7A";

// Função util para limitar tamanhos
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* BLOCO CENTRAL */}
        <View style={styles.centerBlock}>
          <Image
            source={require("../assets/LogoHome.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.subtitle}>Bem-vindo ao</Text>
          <Text style={styles.title}>PetCo</Text>
        </View>

        {/* BOTÃO */}
        <View style={styles.footer}>
          <Link href="/(tabs)" asChild>
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
    paddingHorizontal: "6%",
    justifyContent: "space-between",
  },
  centerBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: clamp(width * 1.8, 140, 300), // logo responsivo com limites
    height: clamp(width * 0., 140, 260),
    marginBottom: 12,
  },
  subtitle: {
    fontSize: clamp(width * 0.04, 14, 18), // entre 14 e 18
    color: TEXT_MUTED,
    marginTop: 4,
  },
  title: {
    fontSize: clamp(width * 0.09, 28, 40), // entre 28 e 40
    fontWeight: "800",
    color: PRIMARY,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  footer: {
    paddingBottom: "8%",
    alignItems: "center",
  },
  cta: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY,
    paddingVertical: clamp(width * 0.035, 12, 18), // entre 12 e 18
    borderRadius: 14,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: clamp(width * 0.045, 16, 20), // entre 16 e 20
    fontWeight: "600",
  },
});
