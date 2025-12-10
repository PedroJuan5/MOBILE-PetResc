import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '@/lib/axios'; // Certifique-se que o caminho do seu axios está certo

export default function EnderecoScreen() {
  const router = useRouter();
  
  // Estado para armazenar o ID do usuário (necessário para o PUT no controller)
  const [userId, setUserId] = useState<number | null>(null);
  
  // Estado do formulário
  const [form, setForm] = useState({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  const [loadingData, setLoadingData] = useState(true); // Carregando dados iniciais
  const [saving, setSaving] = useState(false); // Salvando alterações
  const [loadingCep, setLoadingCep] = useState(false); // Buscando CEP

  // 1. Carregar dados do usuário ao abrir a tela
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await api.get('/usuarios/me');
        const user = response.data;
        
        setUserId(user.id);
        
        // Preenche o form com o que já existe (ou vazio se não tiver)
        setForm({
          cep: user.cep || '',
          rua: user.rua || '',
          numero: user.numero || '',
          complemento: user.complemento || '',
          bairro: user.bairro || '',
          cidade: user.cidade || '',
          estado: user.estado || ''
        });
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar seus dados.");
        router.back();
      } finally {
        setLoadingData(false);
      }
    }
    fetchUserData();
  }, []);

  // 2. Função para atualizar o state de forma dinâmica
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // 3. Buscar CEP automaticamente (ViaCEP)
  const handleBlurCep = async () => {
    const cepLimpo = form.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    setLoadingCep(true);
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
      console.log("Erro ao buscar CEP", error);
    } finally {
      setLoadingCep(false);
    }
  };

  // 4. Salvar Alterações
  const handleSalvar = async () => {
    if (!userId) return;
    setSaving(true);

    try {
      // O seu controller espera PUT em /usuarios/:id
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

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao salvar endereço.");
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
      {/* Header Fixo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#2D68A6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Endereço</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          <Text style={styles.sectionTitle}>Localização</Text>

          {/* CEP */}
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
              onBlur={handleBlurCep} // Busca ao sair do campo
            />
            {loadingCep && <ActivityIndicator size="small" color="#2D68A6" style={{ marginLeft: 10 }} />}
          </View>

          {/* RUA */}
          <Text style={styles.label}>Rua</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da rua"
            placeholderTextColor="#999"
            value={form.rua}
            onChangeText={(t) => handleChange('rua', t)}
          />

          {/* LINHA: NÚMERO E COMPLEMENTO */}
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Número</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor="#999"
                value={form.numero}
                onChangeText={(t) => handleChange('numero', t)}
                keyboardType="numeric" // Teclado numérico no celular
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Comp. (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Apto 101"
                placeholderTextColor="#999"
                value={form.complemento}
                onChangeText={(t) => handleChange('complemento', t)}
              />
            </View>
          </View>

          {/* BAIRRO */}
          <Text style={styles.label}>Bairro</Text>
          <TextInput
            style={styles.input}
            placeholder="Bairro"
            placeholderTextColor="#999"
            value={form.bairro}
            onChangeText={(t) => handleChange('bairro', t)}
          />

          {/* LINHA: CIDADE E ESTADO */}
          <View style={styles.row}>
            <View style={{ flex: 2, marginRight: 10 }}>
              <Text style={styles.label}>Cidade</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#F0F0F0' }]} // Visual de "leitura" pois vem do CEP
                value={form.cidade}
                onChangeText={(t) => handleChange('cidade', t)}
                editable={true} // Pode editar se quiser
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

          {/* BOTÃO DE SALVAR */}
          <TouchableOpacity 
            style={[styles.button, saving && { backgroundColor: '#A0A0A0' }]} 
            onPress={handleSalvar}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar Alterações</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D68A6',
    marginBottom: 15,
    marginTop: 5
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
    paddingVertical: 12, // Altura confortável para o dedo
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