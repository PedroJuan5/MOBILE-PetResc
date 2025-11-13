import { Ionicons } from '@expo/vector-icons'; // Trocado de AntDesign para Ionicons
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView, // Adicionado
  Platform, // Adicionado
  SafeAreaView,
  ScrollView, // Adicionado
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function TelaLogin() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  
  // --- MUDANÇA: Adicionado estado para o "olho" da senha ---
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
      // Sua lógica de login (está ótima)
      await signIn({ email: email, password: senha });
      console.log("Login bem sucedido, navegando para home...");
      router.replace('/(app)/(tabs)/home');
    } catch (err: any) {
      console.warn("signIn falhou:", err?.message || err);
      Alert.alert("Erro no Login", err?.message || "Erro desconhecido");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      {/* --- MUDANÇA: Adicionado o cabeçalho do Stack (como na imagem) --- */}
      <Stack.Screen
        options={{
          title: '', // A imagem não tem título
          headerShown: true,
          headerBackTitle: '', // Esconde o texto "Voltar" no iOS
          headerShadowVisible: false,
          headerTransparent: true, // Deixa o cabeçalho flutuar
        }}
      />
      
      <SafeAreaView style={styles.container}>
        {/* --- MUDANÇA: Adicionado KeyboardAvoidingView e ScrollView --- */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer} 
            keyboardShouldPersistTaps="handled"
          >
            {/* --- MUDANÇA: Removido o botão de voltar customizado --- */}
            {/* <TouchableOpacity style={styles.botaoVoltar} ... /> */}

            <Text style={styles.titulo}>Bem-vindo de volta</Text>
            {/* --- MUDANÇA: Texto do subtítulo atualizado --- */}
            <Text style={styles.subtitulo}>Faça login para continuar</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="user@email.com" // Placeholder da imagem
              placeholderTextColor="#FFFFFF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!carregando}
              maxLength={100}
            />

            {/* --- MUDANÇA: Campo de senha com ícone de "olho" --- */}
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite sua senha"
                placeholderTextColor="#FFFFFF"
                secureTextEntry={!isPasswordVisible} // Controlado pelo estado
                value={senha}
                onChangeText={setSenha}
                editable={!carregando}
                maxLength={50}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Ionicons 
                  name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
            </View>

            {/* --- MUDANÇA: Adicionado o link "Esqueci a senha" --- */}
            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={() => router.push('/esqueci-senha')}
            >
              <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
            </TouchableOpacity>

            <View style={styles.divisor}>
              <View style={styles.linha} />
              <Text style={styles.ou}>OU</Text>
              <View style={styles.linha} />
            </View>

            <View style={styles.sociais}>
              {/* --- MUDANÇA: Ícones de Logo --- */}
              <TouchableOpacity style={styles.botaoSocial} onPress={() => console.log('Login Google')}>
                <Ionicons name="logo-google" size={24} color="#005A9C" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoSocial} onPress={() => console.log('Login Apple')}>
                <Ionicons name="logo-apple" size={24} color="#005A9C" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.botaoEntrar, carregando && { opacity: 0.7 }]}
              onPress={entrar} // Simplificado
              disabled={carregando}
              accessibilityLabel="Login" // Atualizado
            >
              {carregando ? (
                <ActivityIndicator color="#1c5b8f" />
              ) : (
                <Text style={styles.textoBotao}>Login</Text> // Atualizado
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
            
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  // --- MUDANÇA: 'scrollContainer' substitui 'conteudo' e 'rodape' ---
  scrollContainer: {
    flexGrow: 1, // Garante que o container cresça
    paddingHorizontal: 24,
    paddingTop: 100, // Espaço para o header transparente
    paddingBottom: 30, // Espaço no final
    justifyContent: 'center', // Centraliza o conteúdo se a tela for grande
  },
  // --- MUDANÇA: Removido 'botaoVoltar' ---
  titulo: {
    color: "#1c5b8f",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitulo: {
    color: "#666", // Cor da imagem
    fontSize: 16, // Tamanho da imagem
    marginBottom: 30, // Reduzido
    textAlign: "center",
  },
  // --- MUDANÇA: Adicionado 'label' ---
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#1c5b8f", // Seu estilo de input (correto)
    borderRadius: 8,
    padding: 15,
    marginBottom: 10, // Reduzido
    fontSize: 16,
    color: "#fff",
  },
  // --- MUDANÇA: Estilos para o input de senha com "olho" ---
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c5b8f',
    borderRadius: 8,
    paddingHorizontal: 15, // Padding horizontal
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15, // Padding vertical
    fontSize: 16,
    color: '#fff',
  },
  // --- MUDANÇA: Estilo para "Esqueci a senha" ---
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  forgotPasswordText: {
    color: '#1c5b8f',
    fontSize: 14,
    fontWeight: '600',
  },
  divisor: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30, // Aumentado
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
    fontWeight: '600', // Como na imagem
  },
  sociais: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 30, // Aumentado
  },
  botaoSocial: {
    // --- MUDANÇA: Botões sociais redondos como na imagem ---
    backgroundColor: '#F0F8FF', // Fundo azul claro
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
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