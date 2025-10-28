import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
    import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EnderecoScreen() {
  const router = useRouter();
  const [endereco, setEndereco] = useState('');
  const navigation = useNavigation();

  useLayoutEffect(() => {
    // Esconder o cabeçalho nativo para evitar o título "pets/endereco"
    try {
      (navigation as any).setOptions?.({ headerShown: false });
    } catch (e) {
      // ignore in environments where navigation isn't available
    }
  }, [navigation]);

  const handleSalvar = () => {
    // Aqui você pode adicionar a lógica para salvar o endereço
    console.log('Novo endereço salvo:', endereco);
    // Voltar para a tela anterior
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#2D68A6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Endereço</Text>
      </View>

      {/* Conteúdo */}
      <Text style={styles.subtitle}>Alterar endereço</Text>

      <Text style={styles.label}>Novo endereço</Text>
      <TextInput
        style={styles.input}
        placeholder="digite aqui ..."
        placeholderTextColor="#999"
        value={endereco}
        onChangeText={setEndereco}
      />

      {/* Botão */}
      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar alterações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2D68A6',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D68A6',
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#2D68A6',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2D68A6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2D68A6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

