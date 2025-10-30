// app/formulario-voluntario.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import MaskInput from 'react-native-mask-input';

export default function FormularioVoluntarioScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');

  const handleSubmit = () => {
    if (!nome || !cpf || !telefone || !email || !cep) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }
    console.log({ nome, cpf, telefone, email, cep });
    Alert.alert('Formulário Enviado', 'Obrigado pelo seu interesse! A ONG entrará em contato.');
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerTitle: 'Formulário de Voluntário',
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Formulário de Interesse (Lar Temporário)</Text>
        <Text style={styles.paragraph}>
          Preencha seus dados para que a ONG possa te conhecer melhor e entrar em contato.
        </Text>

        <Text style={styles.inputLabel}>Nome completo</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.inputLabel}>CPF</Text>
        <MaskInput
          style={styles.input}
          value={cpf}
          onChangeText={(masked) => setCpf(masked)}
          mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
          keyboardType="numeric"
        />

        <Text style={styles.inputLabel}>Telefone</Text>
        <MaskInput
          style={styles.input}
          value={telefone}
          onChangeText={(masked) => setTelefone(masked)}
          mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
          keyboardType="numeric"
        />

        <Text style={styles.inputLabel}>E-mail</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.inputLabel}>CEP</Text>
        <MaskInput
          style={styles.input}
          value={cep}
          onChangeText={(masked) => setCep(masked)}
          mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enviar Interesse</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { padding: 25 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#005A9C', marginBottom: 10 },
  paragraph: { fontSize: 16, color: '#333', marginBottom: 20 },
  inputLabel: { fontSize: 16, color: '#555', marginBottom: 5, marginTop: 15 },
  input: {
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  submitButton: {
    backgroundColor: '#005A9C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});