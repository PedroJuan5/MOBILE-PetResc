import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import api from "@/lib/axios"; // Importe seu axios configurado

export default function AccountScreen() {
  const router = useRouter();
  
  // Estados dos Campos
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  
  // Estados de UI
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. CARREGAR DADOS AO ABRIR
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await api.get('/usuarios/me'); // Rota que retorna o usuário logado
        const user = response.data;
        
        setUserId(user.id);
        setName(user.nome || "");
        setEmail(user.email || "");
        setTelefone(user.telefone || "");
        // Se tiver foto no banco, setar aqui: setAvatarUri(user.fotoUrl);

      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        Alert.alert("Erro", "Não foi possível carregar seus dados.");
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  // 2. SALVAR ALTERAÇÕES
  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);

    try {
      await api.put(`/usuarios/${userId}`, {
        nome: name,
        telefone: telefone
        // Email não é enviado pois não é editável
      });

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Falha ao atualizar o perfil.");
    } finally {
      setSaving(false);
    }
  };

  // --- LÓGICA DE IMAGEM (MANTIDA DO SEU CÓDIGO) ---
  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos.');
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled) {
        setAvatarUri(result.assets[0].uri);
        // Futuro: Implementar upload da foto aqui
      }
    } catch (err) { console.warn(err); }
  };

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera.');
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (err) { console.warn(err); }
  };

  const pickAvatarMenu = () => {
    Alert.alert('Alterar foto', 'Escolha a fonte da imagem', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Galeria', onPress: pickAvatar },
      { text: 'Câmera', onPress: pickFromCamera },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#2D68A6" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={26} color="#2D68A6" />
        </TouchableOpacity>
        <Text style={styles.title}>Minha Conta</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* CAPA E AVATAR */}
      <View style={styles.coverContainer}>
        <View style={styles.cover}>
          <TouchableOpacity style={styles.editIconCover}>
            <Ionicons name="create-outline" size={18} color="#2D68A6" />
          </TouchableOpacity>
        </View>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={{ width: 70, height: 70, borderRadius: 35 }} />
              ) : (
                <Ionicons name="person-outline" size={40} color="#a0bcd5" />
              )}
          </View>
            <TouchableOpacity style={styles.editIconAvatar} onPress={pickAvatarMenu}>
              <Ionicons name="create-outline" size={18} color="#2D68A6" />
            </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.userName}>{name || "Usuário"}</Text>

      {/* FORMULÁRIO DE EDIÇÃO */}
      <View style={styles.form}>
        
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          placeholderTextColor="#999"
        />

        {/* CAMPO NOVO: TELEFONE */}
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          placeholder="(00) 00000-0000"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />

        {/* EMAIL (NÃO EDITÁVEL) */}
        <Text style={styles.label}>E-mail (Não editável)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#F0F0F0', color: '#666' }]} // Estilo visual de disabled
          value={email}
          editable={false} // Bloqueado
        />

      </View>
      
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
           <ActivityIndicator color="#FFF" />
        ) : (
           <Text style={styles.saveText}>Salvar alterações</Text>
        )}
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    flexGrow: 1, // Garante scroll se precisar
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2D68A6",
  },
  coverContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40 // Espaço para o avatar não sobrepor o nome
  },
  cover: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    backgroundColor: "#d6e6f7",
    justifyContent: "center",
    alignItems: "center",
  },
  editIconCover: {
    position: "absolute",
    top: 8,
    right: 10,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 20,
    elevation: 2,
  },
  avatarContainer: {
    position: "absolute",
    bottom: -35,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e3edf8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  editIconAvatar: {
    position: "absolute",
    bottom: 0,
    right: -5,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee'
  },
  userName: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "700",
    color: "#2D68A6",
  },
  form: {
    width: "100%",
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: "#2D68A6",
    marginBottom: 8,
    fontWeight: '500'
  },
  input: {
    borderWidth: 1,
    borderColor: "#a0bcd5",
    borderRadius: 10,
    padding: 16, // Padding vertical ajustado
    marginBottom: 20,
    fontSize: 16,
    color: '#333'
  },
  saveButton: {
    backgroundColor: "#2D68A6",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 30,
    marginTop: 10,
    width: '100%',
    alignItems: 'center'
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});