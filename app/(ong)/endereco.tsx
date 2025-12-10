import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '@/lib/axios';

// --- IMPORTANTE: Imports de Armazenamento ---
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Função Helper para pegar o Token (Compatível Web/Mobile)
const getToken = async () => {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem('token');
  } else {
    return await SecureStore.getItemAsync('token');
  }
};

export default function EnderecoOngScreen() {
  const router = useRouter();
  
  const [userId, setUserId] = useState<number | null>(null);
  
  const [form, setForm] = useState({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  // 1. Carregar dados da ONG ao abrir
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoadingData(true);
        
        // Debug: Verificar Token com a função compatível
        const token = await getToken();
        console.log("Token atual:", token ? "Presente" : "Ausente");

        if (!token) {
            Alert.alert("Sessão Expirada", "Faça login novamente.");
            // Redireciona para o login correto (ajuste a rota se necessário)
            router.replace('/(auth)/login-ong');
            return;
        }

        // Busca dados
        const response = await api.get('/usuarios/me');
        const user = response.data;
        
        console.log("Dados recebidos da ONG:", user); 

        setUserId(user.id);
        
        // Lógica de Prioridade
        const cep = user.ong?.cep || user.cep || '';
        const rua = user.ong?.rua || user.rua || '';
        const numero = user.ong?.numero || user.numero || '';
        const complemento = user.ong?.complemento || user.complemento || '';
        const bairro = user.ong?.bairro || user.bairro || '';
        const cidade = user.ong?.cidade || user.cidade || '';
        const estado = user.ong?.estado || user.estado || '';

        setForm({
          cep: cep,
          rua: rua,
          numero: numero ? String(numero) : '',
          complemento: complemento,
          bairro: bairro,
          cidade: cidade,
          estado: estado
        });

      } catch (error: any) {
        console.error("Erro no fetchUserData:", error.message);
        
        if (error.response?.status === 401) {
            Alert.alert("Sessão Inválida", "Por favor, faça login novamente.");
            router.replace('/(auth)/login-ong');
        } else {
            // Alert.alert("Erro", "Não foi possível carregar os dados.");
        }
      } finally {
        setLoadingData(false);
      }
    }
    fetchUserData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBlurCep = async () => {
    const cepLimpo = form.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    setLoadingCep(true);
    Keyboard.dismiss();
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setForm(prev => ({
          ...prev,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        }));
      } else {
        Alert.alert("Aviso", "CEP não encontrado.");
      }
    } catch (error) {
      console.log("Erro CEP:", error);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSalvar = async () => {
    if (!userId) return;
    setSaving(true);

    try {
      await api.put(`/usuarios/${userId}`, {
        cep: form.cep,
        rua: form.rua,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado
      });

      Alert.alert("Sucesso", "Endereço atualizado!", [
        { text: "OK", onPress: () => router.back() }
      ]);

    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Falha ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2D68A6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#2D68A6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Endereço da ONG</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          <Text style={styles.subtitle}>Alterar localização</Text>

          <Text style={styles.label}>CEP</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="00000-000"
              placeholderTextColor="#999"
              value={form.cep}
              onChangeText={(t) => handleChange('cep', t)}
              keyboardType="numeric"
              maxLength={9}
              onBlur={handleBlurCep}
            />
            {loadingCep && <ActivityIndicator size="small" color="#2D68A6" style={{ marginLeft: 10 }} />}
          </View>

          <Text style={styles.label}>Rua</Text>
          <TextInput
            style={styles.input}
            placeholder="Logradouro"
            placeholderTextColor="#999"
            value={form.rua}
            onChangeText={(t) => handleChange('rua', t)}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Número</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor="#999"
                value={form.numero}
                onChangeText={(t) => handleChange('numero', t)}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Comp.</Text>
              <TextInput
                style={styles.input}
                placeholder="Opcional"
                placeholderTextColor="#999"
                value={form.complemento}
                onChangeText={(t) => handleChange('complemento', t)}
              />
            </View>
          </View>

          <Text style={styles.label}>Bairro</Text>
          <TextInput
            style={styles.input}
            placeholder="Bairro"
            placeholderTextColor="#999"
            value={form.bairro}
            onChangeText={(t) => handleChange('bairro', t)}
          />

          <View style={styles.row}>
            <View style={{ flex: 2, marginRight: 10 }}>
              <Text style={styles.label}>Cidade</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#F0F0F0' }]} 
                value={form.cidade}
                onChangeText={(t) => handleChange('cidade', t)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>UF</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#F0F0F0' }]}
                value={form.estado}
                onChangeText={(t) => handleChange('estado', t)}
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, saving && { backgroundColor: '#A0A0A0' }]} 
            onPress={handleSalvar}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar alterações</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 20,
  },
  backBtn: {
    padding: 5,
    marginRight: 5
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D68A6',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D68A6',
    marginBottom: 20,
    marginTop: 10
  },
  label: {
    fontSize: 14,
    color: '#2D68A6',
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DCE9F5',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    color: '#333'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#2D68A6',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});