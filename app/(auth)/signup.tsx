import { AntDesign } from "@expo/vector-icons"; // ícones do expo/vector-icons
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CadastroScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton}>
        <AntDesign className="arrowleft" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Cadastre-se</Text>
      <Text style={styles.subtitle}>Crie sua conta e ajude a transformar vidas.</Text>
      <TextInput style={styles.input} placeholder="Nome completo" />
      <TextInput style={styles.input} placeholder="CPF" />
      <TextInput style={styles.input} placeholder="Email" />
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>ou</Text>
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
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Próximo</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Já tem conta? <Text style={styles.loginLink}>Login</Text>
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
   backgroundColor: '#1c5b8f',
    paddingTop: 20,
  },
  backButton: {
    marginLeft: 20,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: '#1c5b8f',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#e5e5e5',
    fontSize: 14,
    marginBottom: 30,
    backgroundColor: '#1c5b8f',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#e8edf1ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    marginHorizontal: 20,
    color: "#fff"
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor: '#1c5b8f'
  },
  line: {
    flex: 1,
    height: 1,
   backgroundColor: '#1c5b8f'
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
    marginBottom: 30,
    backgroundColor: "#ffffffff"
  },
  socialButton: {
    backgroundColor: '#ffffffff',
    borderRadius: 25,
    padding: 12,
    elevation: 3,
    marginHorizontal: 5,
  },
  bottomCard: {
    backgroundColor: '#ffffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    justifyContent: 'flex-start',
    marginTop: 120,
  },
  nextButton: {
    backgroundColor: '#1c5b8f',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
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
    marginBottom: 10,
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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c4c2c2ff',
    marginHorizontal: 2,
  },
});
