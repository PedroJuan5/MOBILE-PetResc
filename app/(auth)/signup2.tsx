import { AntDesign, Ionicons } from "@expo/vector-icons";
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
  const [showPassword, setShowPassword] = useState(false); 

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botão de voltar fixo no topo */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrow-left" size={24} color="#1c5b8f" />
      </TouchableOpacity>
      
      {/* Conteúdo centralizado */}
      <View style={styles.contentCenter}>
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

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha (mínimo 6 caracteres)" 
            placeholderTextColor="#cac9c9ff"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            maxLength={50} 
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={24} 
              color="#cac9c9ff" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirmar Senha"
            placeholderTextColor="#cac9c9ff"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            maxLength={50} 
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons 
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
              size={24} 
              color="#cac9c9ff" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomCard}>
          <TouchableOpacity
            style={[styles.nextButton, isLoading && { opacity: 0.7 }]}
            onPress={() => handleFinalizeCadastro()}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#1c5b8f" />
            ) : (
              <Text style={styles.nextButtonText}>Finalizar cadastro</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.loginText}>
            Já tem conta? <Text style={styles.loginLink} onPress={() => router.replace('/(auth)/login')}>Login</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  backButton: {
    position: 'absolute', 
    top: 60,              
    left: 20,             
    zIndex: 10,           
    padding: 10,         
  },
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 0,    
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
    marginBottom: 30,
    backgroundColor: '#ffffffff',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1c5b8f',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    marginHorizontal: 20,
    color: "#ffffff",
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c5b8f',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  passwordInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    paddingVertical: 15,
  },
  bottomCard: {
    backgroundColor: '#ffffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    justifyContent: 'flex-start',
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