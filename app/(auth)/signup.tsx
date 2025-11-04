import { AntDesign } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaskInput from "react-native-mask-input";

export default function CadastroScreen() {
  const router = useRouter();

  const [nome, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [cpfUnmasked, setCpfUnmasked] = useState('');
  const [email, setEmail] = useState('');

  const handleNext = () => {
    if (!nome.trim() || !email.trim() || !cpf.trim()) {
      Alert.alert("Erro", "Nome, CPF e Email são obrigatórios.");
      return;
    }
    if (cpfUnmasked.length !== 11) {
      Alert.alert("Erro", "O CPF deve ter 11 dígitos.");
      return;
    }

    console.log("Prosseguir cadastro 1 -> signup2", { nome, cpf: cpfUnmasked, email });
    router.push({
      pathname: '/(auth)/signup2',
      params: { nome, cpf: cpfUnmasked, email }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => { console.log('Voltar do signup1'); router.back(); }}>
        <AntDesign name="arrow-left" size={24} color="#1c5b8f" />
      </TouchableOpacity>

      <Text style={styles.title}>Cadastre-se</Text>
      <Text style={styles.subtitle}>Crie sua conta e ajude a transformar vidas.</Text>

      <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setName} maxLength={100} />

      <MaskInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={(masked, unmasked) => { setCpf(masked); setCpfUnmasked(unmasked); }}
        mask={[
          /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.',
          /\d/, /\d/, /\d/, '-', /\d/, /\d/
        ]}
        keyboardType="numeric"
      />

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" maxLength={100} />

      <View style={styles.bottomCard}>
        <TouchableOpacity style={styles.nextButton} onPress={() => { console.log('Prosseguir pressionado'); handleNext(); }}>
          <Text style={styles.nextButtonText}>Prosseguir</Text>
        </TouchableOpacity>
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
    color: "#cac9c9ff",
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
});
