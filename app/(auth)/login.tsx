import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function TelaLogin() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const entrar = async () => {
    if (!email.trim() || !senha) {
      Alert.alert("Atenção", "Por favor, preencha email e senha");
      return;
    }
    if (typeof signIn !== "function") {
      Alert.alert("Erro", "Serviço de autenticação indisponível");
      return;
    }
    setCarregando(true);
    try {
      await signIn({ email: email, password: senha });
      console.log("Login bem sucedido, navegando para home...");
      router.replace('/(tabs)/home');
    } catch (err: any) {
      console.warn("signIn falhou:", err?.message || err);
      Alert.alert("Erro no Login", err?.message || "Erro desconhecido");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => {
          console.log("Voltar pressionado");
          router.back();
        }}
        accessibilityLabel="Voltar"
      >
        <AntDesign name={"arrowleft" as any} size={24} color="#1c5b8f" />
      </TouchableOpacity>

      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Bem-vindo de volta</Text>
        <Text style={styles.subtitulo}>Entre com seu email e senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#cac9c9ff"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!carregando}
          maxLength={100}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#cac9c9ff"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          editable={!carregando}
          maxLength={50}
        />

        <View style={styles.divisor}>
          <View style={styles.linha} />
          <Text style={styles.ou}>Ou</Text>
          <View style={styles.linha} />
        </View>

        <View style={styles.sociais}>
          <TouchableOpacity style={styles.botaoSocial} onPress={() => console.log('Social 1')}>
            <Text>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoSocial} onPress={() => console.log('Social 2')}>
            <Text>Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.rodape}>
        <TouchableOpacity
          style={[styles.botaoEntrar, carregando && { opacity: 0.7 }]}
          onPress={() => {
            console.log("Entrar pressionado");
            entrar();
          }}
          disabled={carregando}
          accessibilityLabel="Entrar"
        >
          {carregando ? (
            <ActivityIndicator color="#1c5b8f" />
          ) : (
            <Text style={styles.textoBotao}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            console.log("Ir para signup");
            router.push('/(auth)/signup');
          }}
        >
          <Text style={styles.textoCadastro}>
            Não tem conta? <Text style={styles.linkCadastro}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  botaoVoltar: {
    marginLeft: 20,
    marginTop: 20,
    alignSelf: "flex-start",
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  titulo: {
    color: "#1c5b8f",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitulo: {
    color: "#1c5b8f",
    fontSize: 14,
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1c5b8f",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    color: "#fff",
  },
  divisor: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  linha: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  ou: {
    marginHorizontal: 10,
    color: "#aaa",
    fontSize: 14,
  },
  sociais: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
  },
  botaoSocial: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 30,
    width: 100,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  rodape: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  botaoEntrar: {
    backgroundColor: "#94B9D8",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 25,
  },
  textoBotao: {
    color: "#1c5b8f",
    fontSize: 18,
    fontWeight: "700",
  },
  textoCadastro: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
  linkCadastro: {
    color: "#1c5b8f",
    fontWeight: "700",
  },
});
