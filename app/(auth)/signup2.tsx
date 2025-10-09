import { AntDesign } from "@expo/vector-icons"; // ícones do expo/vector-icons
import { useRouter } from 'expo-router';
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";



export default function CadastroScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/signup')}>
        <AntDesign name="arrow-left" size={24} color="#1c5b8f" />
      </TouchableOpacity>
      <Text style={styles.title}>Cadastre-se</Text>
      <Text style={styles.subtitle}>Crie sua conta e ajude a transformar vidas.</Text>
      <TextInput style={styles.input} placeholder="Telefone" />
      <TextInput style={styles.input} placeholder="Senha" />
      <TextInput style={styles.input} placeholder="Confirmar Senha" />
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>ou</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.socialContainer}>
        
      </View>
      <View style={styles.bottomCard}>
        <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/login')}>
          <Text style={styles.nextButtonText}>Finalizar cadastro</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Já tem conta? <Text style={styles.loginLink}>Loginm</Text>
        </Text>
        <View style={styles.indicatorContainer}>
          <View style={[styles.indicator, { backgroundColor: '#2563eb' }]} />
          <View style={styles.indicator} />
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
    backgroundColor: '#1c5b8f',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
    
  },
  nextButtonText: {
    color: '#fff',
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

