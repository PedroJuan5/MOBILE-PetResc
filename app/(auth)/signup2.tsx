import { AntDesign } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";

const API_URL = 'http://192.168.56.1:3000'; 

export default function CadastroScreen2() { 
  const router = useRouter();
  
  const { name, cpf, email } = useLocalSearchParams();

  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFinalizeCadastro = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          cpf: cpf, 
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
      Alert.alert("Erro de Conexão", "Não foi possível se comunicar com o servidor.");
    } finally {
      setIsLoading(false);
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
      
      <View style={styles.bottomCard}>
        <TouchableOpacity style={styles.nextButton} onPress={handleFinalizeCadastro} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#1c5b8f" />
          ) : (
            <Text style={styles.nextButtonText}>Finalizar cadastro</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Já tem conta? <Text style={styles.loginLink} onPress={() => router.push('/login')}>Login</Text>
        </Text>
      </View>
    </View>
  );
}

// ... Cole seus estilos aqui ...
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
        color: "#cac9c9ff",
    },
    bottomCard: {
        backgroundColor: '#ffffffff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        justifyContent: 'flex-start',
        marginTop: 'auto', // Empurra para o final
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