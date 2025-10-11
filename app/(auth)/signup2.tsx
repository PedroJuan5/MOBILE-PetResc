import { AntDesign } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const API_URL = 'http://192.168.1.113 172.17.0.1 :3000'; 

export default function CadastroScreen2() { 
  const router = useRouter();
  
  const { name, cpf, email } = useLocalSearchParams();

  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleFinalizeCadastro = async () => {

    if (!password || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha a senha e a confirmação.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          role: 'PUBLICO', 
        }),
      });

      const responseData = await response.json();

      if (response.ok) { 
        Alert.alert(
          "Cadastro Realizado!",
          "Sua conta foi criada com sucesso. Agora você pode fazer o login.",
          [{ text: "OK", onPress: () => router.push('/login') }] 
        );
      } else {
        Alert.alert("Erro no Cadastro", responseData.error || "Ocorreu um problema ao criar sua conta.");
      }
    } catch (error) {
      console.error("Falha na requisição:", error);
      Alert.alert("Erro de Conexão", "Não foi possível se comunicar com o servidor. Verifique sua conexão e o endereço da API.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/signup')}>
        <AntDesign name="arrow-left" size={24} color="#1c5b8f" />
      </TouchableOpacity>
      <Text style={styles.title}>Cadastre-se</Text>
      <Text style={styles.subtitle}>Crie sua conta e ajude a transformar vidas.</Text>

      {/* 6. Conecte os inputs aos seus respectivos estados */}
      <TextInput 
        style={styles.input} 
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      {/* O resto do seu código visual... */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>ou</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.socialContainer}></View>
      <View style={styles.bottomCard}>
        {/* 7. Chame a função 'handleFinalizeCadastro' no botão de finalizar */}
        <TouchableOpacity style={styles.nextButton} onPress={handleFinalizeCadastro}>
          <Text style={styles.nextButtonText}>Finalizar cadastro</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Já tem conta? <Text style={styles.loginLink} onPress={() => router.push('/login')}>Login</Text>
        </Text>
        <View style={styles.indicatorContainer}>
          <View style={styles.indicator} />
          <View style={[styles.indicator, { backgroundColor: '#2563eb' }]} />
          <View style={styles.indicator} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
   backgroundColor: '#ffffffff',
    paddingTop:15,
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
    color: "#cac9c9ff",
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor: '#ffffffff',
    color: '#1c5b8f',
  },
  line: {
    flex: 1,
    height: 2,
   backgroundColor: '#b3bac0ff',
   marginBottom: 10,
  },
  orText: {
    marginHorizontal: 10,
    color: '#1c5b8f',
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    backgroundColor: "#ffffffff",
  },
  socialButton: {
    backgroundColor: '#94B9D8',
    borderRadius: 25,
    padding: 15,
    color: '#1c5b8f',
    marginHorizontal: 5,
  },
  bottomCard: {
    backgroundColor: '#ffffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    justifyContent: 'flex-start',
    marginTop: 20,
    height: '40%',
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
    marginBottom: 30,
  },
  loginLink: {
    color: '#1c5b8f',
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    gap: 5,
  },
  indicator: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#c4c2c2ff',
    marginHorizontal: 2,
  },
});