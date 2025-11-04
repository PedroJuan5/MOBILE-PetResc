import { AntDesign } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import api, { AxiosError } from '@/lib/axios';
import MaskInput from "react-native-mask-input";

export default function CadastroScreen2() {
  const router = useRouter();
  const { nome, cpf, email } = useLocalSearchParams() as any;

  const [telefone, setTelefone] = useState('');
  const [telefoneUnmasked, setTelefoneUnmasked] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFinalizeCadastro = async () => {
    if (!telefone.trim() || !password || !confirmPassword) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
    if (telefoneUnmasked.length < 10 || telefoneUnmasked.length > 11) {
       Alert.alert("Erro", "O telefone deve ter 10 ou 11 dígitos (com DDD).");
       return;
    }
    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        nome: nome,
        email: email,
        cpf: cpf,
        telefone: telefoneUnmasked,
        password: password,
        role: 'PUBLICO',
      };

      await api.post('/auth/register', userData);
      
      console.log("CADASTRO REALIZADO COM SUCESSO!");
      Alert.alert("Sucesso", "Cadastro realizado! Por favor, faça o login."); 
      router.replace('/(auth)/login');

    } catch (error) {
      let errorMessage = "Não foi possível realizar o cadastro. Verifique os dados e tente novamente.";
      if (error instanceof AxiosError) {
        console.error("Erro detalhado do Axios:", JSON.stringify(error.response?.data, null, 2));
        errorMessage = error.response?.data?.message || error.response?.data?.error || errorMessage;
      } else {
        console.error("Erro inesperado:", error);
      }
      Alert.alert("Erro no Cadastro", errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => { console.log('Voltar do signup2'); router.back(); }}>
        <AntDesign name="arrow-left" size={24} color="#1c5b8f" />
      </TouchableOpacity>
      <Text style={styles.title}>Cadastre-se</Text>
      <Text style={styles.subtitle}>Crie sua conta e ajude a transformar vidas.</Text>

      <MaskInput
        style={styles.input}
        placeholder="Telefone"
        placeholderTextColor="#cac9c9ff"
        value={telefone}
        onChangeText={(masked, unmasked) => {
          setTelefone(masked);
          setTelefoneUnmasked(unmasked);
        }}
        mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha (mínimo 6 caracteres)" 
        placeholderTextColor="#cac9c9ff"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        maxLength={50} 
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        placeholderTextColor="#cac9c9ff"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        maxLength={50} 
      />

      <View style={styles.bottomCard}>
        <TouchableOpacity
          style={[styles.nextButton, isLoading && { opacity: 0.7 }]}
          onPress={() => { console.log('Finalizar cadastro'); handleFinalizeCadastro(); }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#1c5b8f" />
          ) : (
            <Text style={styles.nextButtonText}>Finalizar cadastro</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Já tem conta? <Text style={styles.loginLink} onPress={() => { console.log('Ir para login'); router.replace('/(auth)/login'); }}>Login</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    paddingTop: 15,
    color: '#1c5b8f',
  },
  backButton: {
    marginLeft: 20,
    marginBottom: 10,
  },
  title: {
    color: '#1c5b8f',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: '#ffffffff',
    padding: 5,
    borderRadius: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#1c5b8f',
    fontSize: 14,
    marginBottom: 50,
    backgroundColor: '#ffffffff',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1c5b8f',
    borderRadius: 8,
    padding: 15,
    marginBottom: 35,
    fontSize: 16,
    marginHorizontal: 20,
    color: "#ffffff",
  },
  bottomCard: {
    backgroundColor: '#ffffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    justifyContent: 'flex-start',
    marginTop: 'auto',
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
  },
});
