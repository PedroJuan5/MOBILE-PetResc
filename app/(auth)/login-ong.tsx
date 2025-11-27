import { Ionicons } from '@expo/vector-icons'; //usando Ionicons para evitar erros de tipo
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext'; 

export default function LoginOngScreen() {
  const router = useRouter();
  const { signIn } = useAuth(); 

  const [cnpj, setCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!cnpj || !senha) {
      Alert.alert("Atenção", "Preencha CNPJ e senha.");
      return;
    }

    setIsLoading(true);
    try {
      const cnpjLimpo = cnpj.replace(/\D/g, '');
      
      // Ajuste conforme sua rota de login de ONG
      const response = await api.post('/auth/login-ong', { 
        cnpj: cnpjLimpo, 
        password: senha 
      });

      //se o login for bem sucedido:
      router.replace('/(app)/(tabs)/home');

    } catch (error: any) {
      const msg = error.response?.data?.error || "Erro ao fazer login.";
      Alert.alert("Erro", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#1c5b8f" />
            </TouchableOpacity>
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>CNPJ</Text>
            <MaskInput
              style={styles.input}
              placeholder="XX.XXX.XXX/0001-XX"
              placeholderTextColor="#a0c4df"
              value={cnpj}
              onChangeText={(masked, unmasked) => setCnpj(masked)}
              mask={Masks.BRL_CNPJ}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput 
                style={styles.passwordInput} 
                placeholder="Digite sua senha" 
                placeholderTextColor="#a0c4df"
                secureTextEntry={!showPassword}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Link Esqueci a Senha */}
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={() => router.push('/(auth)/esqueci-senha')}
            >
              <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#1c5b8f" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Não tem conta? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup-ong')}>
                <Text style={styles.signupLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { padding: 24, paddingBottom: 50, flexGrow: 1, justifyContent: 'center' },
  
  header: { marginBottom: 40 },
  backButton: { marginBottom: 20, alignSelf: 'flex-start' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1c5b8f', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#1c5b8f', fontWeight: '500' },
  
  formContainer: { marginBottom: 30 },
  label: { fontSize: 16, color: '#1c5b8f', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#1c5b8f',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c5b8f',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
  },
  
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#1c5b8f',
    fontSize: 14,
    fontWeight: '600',
  },
  
  footer: { marginTop: 20 },
  button: {
    backgroundColor: '#94B9D8',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#1c5b8f', fontSize: 18, fontWeight: 'bold' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center' },
  signupText: { color: '#1c5b8f', fontSize: 14 },
  signupLink: { color: '#1c5b8f', fontWeight: 'bold', fontSize: 14 },
});