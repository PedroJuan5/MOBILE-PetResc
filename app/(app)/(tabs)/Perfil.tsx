import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '@/lib/axios'; // Verifique se o caminho está correto
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; 

// Tipos
interface UserData {
  nome: string;
  email: string;
  telefone: string | null;
  cidade: string | null;
  estado: string | null;
  photoURL?: string | null; 
}

interface Pet {
  id: number;
  nome: string;
  raca: string | null;
  idade: string | null;
  photoURL: string | null;
}

export default function PerfilScreen() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState<'perfil' | 'salvos'>('perfil');
  
  // Estados
  const [user, setUser] = useState<UserData | null>(null);
  const [meusPets, setMeusPets] = useState<Pet[]>([]);
  const [petsSalvos, setPetsSalvos] = useState<Pet[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Helper de idade
  const formatIdade = (val: any) => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    return val <= 1 ? "Filhote" : (val >= 8 ? "Idoso" : "Adulto");
  };

  // BUSCAR DADOS
  const fetchDados = useCallback(async () => {
    try {
      // 1. Dados do Usuário
      // Rota no arquivo usuarios.js: router.get('/me', ...)
      const resUser = await api.get('/usuarios/me');
      setUser(resUser.data);

      // 2. Meus Pets (Cadastrados por mim)
      // Rota no arquivo usuarios.js: router.get('/me/animais', ...)
      const resMeus = await api.get('/usuarios/me/animais');
      
      const meusFormatados = resMeus.data.map((p: any) => ({
          id: p.id,
          nome: p.nome,
          raca: p.raca || "SRD",
          idade: formatIdade(p.idade),
          photoURL: p.photoURL || p.foto // Tenta os dois nomes por segurança
      }));
      setMeusPets(meusFormatados);

      // 3. Favoritos
      // Rota no arquivo usuarios.js: router.get('/me/favoritos', ...)
      try {
          const resSalvos = await api.get('/usuarios/me/favoritos');
          
          // Seu controller retorna a lista de animais direta (res.json(animaisFavoritos))
          const salvosFormatados = resSalvos.data.map((animal: any) => ({
              id: animal.id,
              nome: animal.nome,
              raca: animal.raca || "SRD",
              idade: formatIdade(animal.idade),
              photoURL: animal.photoURL || animal.foto
          }));
          setPetsSalvos(salvosFormatados);
      } catch (err) {
          console.log("Favoritos vazios ou erro na rota.");
          setPetsSalvos([]);
      }

    } catch (error) {
      console.error("Erro geral no perfil:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDados();
    }, [fetchDados])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDados();
  };

  const handlePetPress = (petId: number) => {
      // Ajuste aqui para a rota correta de detalhes do seu app
      router.push({ pathname: 'detalhes-pet', params: { screen: 'detalhes', id: petId } } as any);
  };

  const listaExibida = abaAtiva === 'perfil' ? meusPets : petsSalvos;

  if (loading && !refreshing) {
      return (
          <SafeAreaView style={[styles.safeArea, {justifyContent: 'center', alignItems: 'center'}]}>
              <ActivityIndicator size="large" color="#2D68A6" />
          </SafeAreaView>
      );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2D68A6']} />}
      >
        
        {/* Header (Notificações) */}
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.push('/notificacoes' as any)}>
            <Ionicons name="notifications-outline" size={28} color="#2D68A6" />
            <View style={styles.notificacaoDot} /> 
          </TouchableOpacity>
        </View>

        {/* Info do Usuário */}
        <View style={styles.perfilHeader}>
          <View style={styles.banner} />
          <View style={styles.avatarContainer}>
            {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={{width: 90, height: 90, borderRadius: 45}} />
            ) : (
                <Ionicons name="person" size={50} color="#FFF" />
            )}
          </View>
          <Text style={styles.username}>{user?.nome || "Usuário"}</Text>
        </View>

        {/* Botões de Aba */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, abaAtiva === 'perfil' && styles.toggleButtonAtivo]}
            onPress={() => setAbaAtiva('perfil')}
          >
            <Text style={[styles.toggleText, abaAtiva === 'perfil' && styles.toggleTextAtivo]}>
              Meu perfil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, abaAtiva === 'salvos' && styles.toggleButtonAtivo]}
            onPress={() => setAbaAtiva('salvos')}
          >
            <Text style={[styles.toggleText, abaAtiva === 'salvos' && styles.toggleTextAtivo]}>
              Salvos
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONTEÚDO DA ABA PERFIL: Detalhes do Usuário */}
        {abaAtiva === 'perfil' && (
            <View style={styles.infoSection}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoTitle}>Contato</Text>
                <Text style={styles.infoText} numberOfLines={1}>{user?.email}</Text>
                <Text style={styles.infoText}>{user?.telefone || "Sem telefone"}</Text>
              </View>
              <View style={styles.infoColumnDireita}>
                <Text style={styles.infoTitle}>Localização</Text>
                <Text style={styles.infoText}>
                    {user?.cidade ? `${user.cidade}, ${user.estado}` : "Local não inf."}
                </Text>
              </View>
            </View>
        )}

        {/* LISTA DE PETS (Meus ou Salvos) */}
        <View style={styles.petsSection}>
            <View style={styles.petsHeader}>
            <Text style={styles.petsTitle}>
                {abaAtiva === 'perfil' ? "Meus pets cadastrados" : "Meus Favoritos"}
            </Text>
            </View>

            {listaExibida.length === 0 ? (
                <View style={{padding: 20, alignItems: 'center'}}>
                    <Ionicons name="paw-outline" size={40} color="#CCC" />
                    <Text style={{textAlign: 'center', color: '#888', marginTop: 10}}>
                        {abaAtiva === 'perfil' 
                            ? "Você ainda não cadastrou nenhum pet." 
                            : "Você ainda não favoritou nenhum pet."}
                    </Text>
                </View>
            ) : (
            <View style={styles.petsGrid}>
                {listaExibida.map((pet) => {
                    const imageSource = pet.photoURL 
                        ? { uri: pet.photoURL } 
                        : require('../../../assets/images/ui/gato-preto-branco.png');

                    return (
                        <View key={pet.id} style={styles.petCard}>
                            <TouchableOpacity onPress={() => handlePetPress(pet.id)}>
                                <Image 
                                    source={imageSource} 
                                    style={styles.petImage} 
                                    resizeMode="cover" 
                                />
                            </TouchableOpacity>
                            
                            <View style={styles.petInfo}>
                                <View style={styles.petHeaderInfo}>
                                    <Text style={styles.petName} numberOfLines={1}>{pet.nome}</Text>
                                    <Text style={styles.petAge}>{pet.idade}</Text>
                                </View>
                                <View style={styles.petFooterInfo}>
                                    <Text style={styles.petBreed} numberOfLines={1}>{pet.raca}</Text>
                                    <Ionicons 
                                        name={abaAtiva === 'salvos' ? "heart" : "paw"} 
                                        size={16} 
                                        color={abaAtiva === 'salvos' ? "#FF3B30" : "#2D68A6"} 
                                    />
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
            )}
        </View>

      </ScrollView>

      {/* Botão Flutuante de Configurações */}
      <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/menu-configuracoes' as any)}>
        <Ionicons name="settings-outline" size={26} color="#2D68A6" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 80 },
  headerTop: { alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 40, marginBottom: 10 },
  notificacaoDot: { position: 'absolute', top: 2, right: 3, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B30', borderWidth: 1, borderColor: '#FFF' },
  perfilHeader: { alignItems: 'center', marginBottom: 20 },
  banner: { width: '90%', height: 120, backgroundColor: '#BFE1F7', borderRadius: 20, marginTop: 10 },
  avatarContainer: { marginTop: -50, width: 100, height: 100, borderRadius: 50, backgroundColor: '#2D68A6', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#FFFFFF', overflow: 'hidden' },
  username: { fontSize: 22, fontWeight: 'bold', color: '#2D68A6', marginTop: 10 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30, marginTop: 10 },
  toggleButton: { paddingVertical: 8, paddingHorizontal: 24, borderRadius: 25, marginHorizontal: 5, borderWidth: 1, borderColor: 'transparent' },
  toggleButtonAtivo: { backgroundColor: '#E6F0FA', borderColor: '#BFE1F7' },
  toggleText: { fontSize: 16, color: '#A0A0A0', fontWeight: '500' },
  toggleTextAtivo: { color: '#2D68A6', fontWeight: 'bold' },
  infoSection: { flexDirection: 'row', paddingHorizontal: 30, justifyContent: 'space-between', marginBottom: 30 },
  infoColumn: { flex: 2 },
  infoColumnDireita: { flex: 1, alignItems: 'flex-end' },
  infoTitle: { fontSize: 16, color: '#2D68A6', marginBottom: 6, fontWeight: 'bold' },
  infoText: { fontSize: 14, color: '#555', marginBottom: 2 },
  petsSection: { paddingHorizontal: 20 },
  petsHeader: { marginBottom: 15, paddingHorizontal: 5 },
  petsTitle: { fontSize: 18, color: '#2D68A6', fontWeight: 'bold' },
  petsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  petCard: { width: cardWidth, backgroundColor: '#F7F9FC', borderRadius: 15, marginBottom: 15, padding: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  petImage: { width: '100%', height: 110, borderRadius: 10, marginBottom: 8, backgroundColor: '#eee' },
  petInfo: { paddingHorizontal: 2 },
  petHeaderInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  petName: { fontSize: 15, fontWeight: 'bold', color: '#2D68A6', flex: 1 },
  petAge: { fontSize: 12, color: '#2D68A6', fontWeight: 'bold' },
  petFooterInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petBreed: { fontSize: 12, color: '#666', maxWidth: '80%' },
  settingsButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#FFFFFF', width: 55, height: 55, borderRadius: 27.5, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5 },
});