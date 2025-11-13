import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AccountScreen() {
  const router = useRouter();
  const [name, setName] = useState("Username");
  const [username, setUsername] = useState("User00");
  const [email, setEmail] = useState("username@gmail.com");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const handleSave = () => {
    alert("Alterações salvas com sucesso!");
  };

  const pickAvatar = async () => {
    // pedir permissão
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos para alterar a foto de perfil.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      // compatibilidade com diferentes versões do expo-image-picker
      const wasCancelled = (result as any).cancelled ?? (result as any).canceled ?? false;
      if (!wasCancelled) {
        const uri = (result as any).assets?.[0]?.uri ?? (result as any).uri;
        if (uri) {
          setAvatarUri(uri);
          // aqui você pode chamar uma função para enviar a imagem ao servidor
        }
      }
    } catch (err) {
      console.warn('Erro ao selecionar imagem:', err);
    }
  };

  const pickFromCamera = async () => {
    // pedir permissão de câmera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar a foto.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      const wasCancelled = (result as any).cancelled ?? (result as any).canceled ?? false;
      if (!wasCancelled) {
        const uri = (result as any).assets?.[0]?.uri ?? (result as any).uri;
        if (uri) {
          setAvatarUri(uri);
        }
      }
    } catch (err) {
      console.warn('Erro ao tirar foto:', err);
    }
  };

  const pickAvatarMenu = () => {
    Alert.alert('Alterar foto', 'Escolha a fonte da imagem', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Galeria', onPress: () => pickAvatar() },
      { text: 'Câmera', onPress: () => pickFromCamera() },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={26} color="#2D68A6" />
        </TouchableOpacity>
        <Text style={styles.title}>Conta</Text>
        <View style={{ width: 26 }} />
      </View>

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
            <TouchableOpacity style={styles.editIconAvatar} onPress={pickAvatarMenu} accessibilityRole="button" accessibilityLabel="Alterar foto de perfil">
              <Ionicons name="create-outline" size={18} color="#2D68A6" />
            </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.userName}>{name}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Username"
        />

        <Text style={styles.label}>Nome de usuário</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="User00"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="username@gmail.com"
        />
      </View>
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Salvar alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    width:"100%",
    height: "100%",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2D68A6",
  },
  coverContainer: {
    width: "100%",
    alignItems: "center",
  },
  cover: {
    width: "100%",
    height: 100,
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
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#e3edf8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  editIconAvatar: {
    position: "absolute",
    bottom: 0,
    right: -10,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 20,
    elevation: 2,
  },
  userName: {
    marginTop: 50,
    fontSize: 18,
    fontWeight: "600",
    color: "#2D68A6",
  },
  form: {
    width: "100%",
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: "#2D68A6",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#a0bcd5",
    borderRadius: 10,
    padding: 20,
    marginBottom: 25,
  },
  saveButton: {
    backgroundColor: "#2D68A6",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
