import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AlterarSenhaScreen() {
  const router = useRouter();

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  function handleAlterarSenha() {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    Alert.alert('Sucesso', 'Senha alterada com sucesso!');
    router.back();
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true }} />

      <SafeAreaView style={styles.container}>
        {/*CABEÇALHO COM GOBACK FUNCIONAL */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#225d9bff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Alterar senha</Text>

          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <TextInput
            placeholder="Senha atual"
            secureTextEntry
            style={styles.input}
            value={senhaAtual}
            onChangeText={setSenhaAtual}
          />

          <TextInput
            placeholder="Nova senha"
            secureTextEntry
            style={styles.input}
            value={novaSenha}
            onChangeText={setNovaSenha}
          />

          <TextInput
            placeholder="Confirmar nova senha"
            secureTextEntry
            style={styles.input}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleAlterarSenha}>
            <Text style={styles.buttonText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

/* ================= ESTILOS ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#225d9bff',
  },

  content: {
    padding: 20,
    paddingTop: 40,
    flex: 1,
  },

  input: {
    color: '#000',
    borderWidth: 1.4,
    borderColor: '#3A5C7A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },

  footer: {
    padding: 20,
  },

  button: {
    backgroundColor: '#225d9bff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
