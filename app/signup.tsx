import { View, Text, TextInput, StyleSheet, Pressable, Image, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";


const { width } = Dimensions.get("window");

const PRIMARY = "#2D68A6";
const BG = "#1E4C7A";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* BOTÃO VOLTAR */}
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>

            {/* TÍTULO */}
            <Text style={styles.title}>Cadastra-se!</Text>
            <Text style={styles.subtitle}>
              Crie sua conta e ajude a tranformar vidas.
            </Text>

            {/* FORMULÁRIO */}
            <View style={styles.form}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Maria Silva"
                placeholderTextColor="#8CA6C1"
              />

              <Text style={styles.label}>CPF</Text>
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                placeholderTextColor="#8CA6C1"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="exemplo@email.com"
                placeholderTextColor="#8CA6C1"
                keyboardType="email-address"
              />
            </View>

            {/* DIVISOR */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.or}>ou</Text>
              <View style={styles.divider} />
            </View>

            {/* LOGIN SOCIAL */}
            <View style={styles.socialRow}>
              <Pressable style={styles.socialButton}>
                <Image
                  source={require("../assets/google.png")}
                  style={styles.socialIcon}
                />
              </Pressable>
              <Pressable style={styles.socialButton}>
                <Image
                  source={require("../assets/apple.png")}
                  style={styles.socialIcon}
                />
              </Pressable>
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Pressable style={styles.cta} onPress={() => router.push("/(tabs)")}>
              <Text style={styles.ctaText}>Próximo</Text>
            </Pressable>
            <Text style={styles.loginText}>
              Já tem uma conta?{" "}
              <Link href="/login" style={styles.loginLink}>
                Entrar
              </Link>
            </Text>

            {/* INDICADOR DE PÁGINA */}
            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  backArrow: {
    color: "#fff",
    fontSize: 26,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#D0E2F2",
    marginBottom: 28,
    lineHeight: 20,
  },
  form: {
    gap: 14,
  },
  label: {
    color: "#fff",
    marginBottom: 4,
    marginTop: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#E2EBF3",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#BFD0E5",
  },
  or: {
    marginHorizontal: 10,
    color: "#fff",
    fontSize: 13,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 22,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  footer: {
    backgroundColor: "#fff",
    paddingTop: 22,
    paddingBottom: 40,
    alignItems: "center",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  cta: {
    width: "92%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY,
    paddingVertical: 15,
    borderRadius: 14,
  },
  ctaText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loginText: {
    marginTop: 14,
    color: "#7A8DA8",
    fontSize: 14,
  },
  loginLink: {
    color: PRIMARY,
    fontWeight: "600",
  },
  dots: {
    flexDirection: "row",
    marginTop: 18,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0E2F2",
  },
  dotActive: {
    backgroundColor: PRIMARY,
  },
});
