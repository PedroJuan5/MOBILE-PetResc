import { AntDesign } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import api, { AxiosError } from '@/lib/axios';

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
      const userData = {
        name: name,
        email: email,
        cpf: cpf,
        telefone: telefone,
        password: password,
        role: 'PUBLICO',
      };

      await api.post('/auth/register', userData);
      
      console.log(" CADASTRO REALIZADO COM SUCESSO NO BACKEND!");
      console.log("Tentando exibir o alerta e navegar...");

      Alert.alert(
        "Cadastro Realizado!",
        "Sua conta foi criada com sucesso. Agora você pode fazer o login.",
        [{ 
            text: "OK", 
            onPress: () => {
                console.log("Botão OK do alerta foi pressionado. Navegando para /login");
                router.push('/login');
            }
        }] 
      );

    } catch (error) {
      let errorMessage = "Não foi possível realizar o cadastro. Verifique os dados e tente novamente.";

      if (error instanceof AxiosError) {
        console.error("Erro detalhado do Axios:", JSON.stringify(error.response?.data, null, 2));
        errorMessage = error.response?.data?.message || error.response?.data?.error || errorMessage;
      } else {
        console.error("Erro inesperado:", error);
      }
                         
      Alert.alert("Erro no Cadastro", errorMessage);

    } finally {
      setIsLoading(false);
    }
};
return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/login')}>
        <AntDesign name="arrow-left" size={24} color="#1c5b8f" />
      </TouchableOpacity>
      <Text style={styles.title}>Cadastre-se</Text>
      <Text style={styles.subtitle}>Crie sua conta e ajude a transformar vidas.</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Telefone"
        placeholderTextColor="#cac9c9ff"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Senha"
        placeholderTextColor="#cac9c9ff"
        value={password}
        onChangeText={setPassword}
        secureTextEntry 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Confirmar Senha"
        placeholderTextColor="#cac9c9ff"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <View style={styles.bottomCard}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleFinalizeCadastro} 
          disabled={isLoading}
        >
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
