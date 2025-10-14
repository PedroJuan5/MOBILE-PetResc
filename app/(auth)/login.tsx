import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert,} from "react-native";
import { useAuth } from "../../context/AuthContext";


export default function TelaLogin() {
  const router = useRouter();
  const { signIn } = useAuth(); //função do AuthContext que realiza o login

  //estados do formulário com nomes claros
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  //função acionada ao tocar em "Entrar"
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
      //tentamos enviar credenciais num objeto (forma mais comum)
      await (signIn as any)({ email, password: senha });
      return;
    } catch (err) {
      //se falhar, tentamos chamar sem argumentos — alguns contextos leem campos internos
      try {
        await (signIn as any)();
        return;
      } catch (err2) {
        console.warn("signIn falhou:", err2);
        Alert.alert("Erro", "Não foi possível entrar. Tente novamente mais tarde.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*botao de voltar */}
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => router.back()}
        accessibilityLabel="Voltar"
      >
        {/*AntDesign usa "arrowleft"; fazemos cast para evitar erro de tipagem temporário */}
        <AntDesign name={"arrowleft" as any} size={24} color="#1c5b8f" />
      </TouchableOpacity>

      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Bem-vindo de volta</Text>
        <Text style={styles.subtitulo}>Entre com seu email e senha</Text>

        {/*campo de email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#cac9c9ff"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!carregando}
        />

        {/*campo de senha */}
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#cac9c9ff"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          editable={!carregando}
        />

        {/*divisor com "Ou" */}
        <View style={styles.divisor}>
          <View style={styles.linha} />
          <Text style={styles.ou}>Ou</Text>
          <View style={styles.linha} />
        </View>
      
        <View style={styles.sociais}>
          <TouchableOpacity
            style={styles.botaoSocial}
            accessibilityLabel="Entrar com Google"
            onPress={() => Alert.alert("Google", "Login social não implementado")}
            disabled={carregando}
          >
            <Text>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoSocial}
            accessibilityLabel="Entrar com Apple"
            onPress={() => Alert.alert("Apple", "Login social não implementado")}
            disabled={carregando}
          >
            <Text>Apple</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Rodape com ação principal e link para cadastro */}
      <View style={styles.rodape}>
        <TouchableOpacity
          style={[styles.botaoEntrar, carregando && { opacity: 0.6 }]}
          onPress={entrar}
          disabled={carregando}
        >
          <Text style={styles.textoBotao}>{carregando ? "Entrando..." : "Entrar"}</Text>
        </TouchableOpacity>

        <Text style={styles.textoCadastro}>
          Sem conta?{" "}
          <Text style={styles.linkCadastro} onPress={() => router.push('/signup')}>
            Criar conta
          </Text>
        </Text>
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
