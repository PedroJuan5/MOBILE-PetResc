import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from "react";
// ADICIONADO 'Platform' AQUI NOS IMPORTS
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Platform } from "react-native";
import MaskInput from "react-native-mask-input";

import api from '../../lib/axios'; 
import { AxiosError } from 'axios'; 

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
    // Validações
    if (!telefone.trim() || !password || !confirmPassword) {
      if (Platform.OS === 'web') alert("Erro: Todos os campos são obrigatórios.");
      else Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
    // ... (Outras validações seguem a mesma lógica se quiser, mas o foco é o sucesso)

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

      console.log("Enviando dados:", userData);

      await api.post('/auth/register', userData);      
      
      console.log("CADASTRO REALIZADO COM SUCESSO!");
      
     
      if (Platform.OS === 'web') {
        // Na WEB: Usamos o alert nativo do navegador e navegamos em seguida
        // O setTimeout ajuda a garantir que o navegador processe a navegação após o alert
        setTimeout(() => {
            window.alert("Cadastro realizado! Por favor, faça o login.");
            router.replace('/(auth)/login'); 
        }, 100);
      } else {
        // NO CELULAR (Android/iOS): Mantemos o Alert.alert bonito
        Alert.alert(
            "Sucesso", 
            "Cadastro realizado! Por favor, faça o login.", 
            [
            { 
                text: "OK", 
                onPress: () => {
                    router.replace('/(auth)/login'); 
                } 
            }
            ],
            { cancelable: false }
        );
      }

    } catch (error) {
      let errorMessage = "Não foi possível realizar o cadastro.";
      
      if (error instanceof AxiosError) {
        console.error("Erro detalhado do Axios:", JSON.stringify(error.response?.data, null, 2));
        errorMessage = error.response?.data?.error || error.response?.data?.message || errorMessage;
      } else {
        console.error("Erro inesperado:", error);
      }
      
      if (Platform.OS === 'web') {
        alert(`Erro no Cadastro: ${errorMessage}`);
      } else {
        Alert.alert("Erro no Cadastro", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#1c5b8f" />
      </TouchableOpacity>
      
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