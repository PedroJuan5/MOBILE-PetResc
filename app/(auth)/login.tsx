import { AntDesign } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// 1. Importe o nosso hook 'useAuth'
import { useAuth } from "../../context/AuthContext"; // Verifique se o caminho ../../ está correto

export default function CadastroScreen() {
  const router = useRouter();
  
  // 2. Pegue a função 'signIn' do nosso contexto
  const { signIn } = useAuth();

  const handleLogin = () => {
    // No futuro, você pode adicionar a lógica de validação aqui
    console.log("Botão de login pressionado, chamando o signIn...");
    signIn(); // Chama a função que troca o usuário para o estado "logado"
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrow-left" size={24} color="#1c5b8f" />
      </TouchableOpacity>
      <Text style={styles.title}>Bem-Vindo de volta</Text>
      <Text style={styles.subtitle}>Faça o login para continuar</Text>
       <TextInput style={styles.input} placeholder="Nome de usuário" />
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry />
      <TouchableOpacity onPress={() => (router as any).push('/forgot-password')} style={{ alignSelf: 'flex-end', marginRight: 20, marginTop: 6 }}>
        <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
      </TouchableOpacity>
      {/* Removi o campo "Nome completo" pois não é comum em telas de login */}
      
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Ou</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Text>G</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text></Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.bottomCard}>
        {/* 3. Chame a função 'handleLogin' no 'onPress' do botão de Login */}
        <TouchableOpacity style={styles.nextButton} onPress={handleLogin}>
          <Text style={styles.nextButtonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Não tem conta? <Text style={styles.loginLink} onPress={() => router.push('/signup')}>Cadastre-se</Text>
        </Text>
      </View>
    </View>
  );
}

// Seus estilos continuam aqui...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    paddingTop: 15,
  },
  // ... (resto dos seus estilos)
  backButton: {
    marginLeft: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  title: {
    color: '#1c5b8f',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    color: '#1c5b8f',
    fontSize: 14,
    marginBottom: 50,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1c5b8f', // Cor de fundo mais suave para contraste
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    marginHorizontal: 20,
    color: "#333", // Cor do texto digitado
    gap: 130,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
    
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  orText: {
    marginHorizontal: 10,
    color: '#1c5b8f',
    fontSize: 14,
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomCard: {
    backgroundColor: '#ffffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    justifyContent: 'flex-start',
    marginTop: 20,
   
  },
  nextButton: {
    backgroundColor: '#94B9D8',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
  },
  nextButtonText: {
    color: '#1c5b8f',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    color: '#1c5b8f',
    fontWeight: 'bold',
  }
  ,
  forgotPasswordText: {
    color: '#1c5b8f',
    fontSize: 14,
    fontWeight: '600',
  }
});