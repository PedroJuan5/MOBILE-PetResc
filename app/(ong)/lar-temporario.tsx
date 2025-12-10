import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, Stack } from "expo-router";
import React, { useState, useCallback } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from "react-native";
import api from '@/lib/axios';

const { width } = Dimensions.get('window');

// --- TIPOS ---
interface ProfileData {
  nomeDisplay: string;
  email: string;
  telefone: string;
  local: string;
}

// Dados do Voluntário (Feed)
interface VoluntarioLar {
  id: number;
  nomeCompleto: string;
  telefone: string;
  tipoMoradia: string;
  quintal: boolean;
  endereco: {
    cidade?: string;
    estado?: string;
    bairro?: string;
  };
  // Outros campos úteis para o Feed
  animaisAceitos?: string; 
}

export default function LarTemporarioScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [perfil, setPerfil] = useState<ProfileData>({
    nomeDisplay: "", email: "", telefone: "", local: ""
  });

  const [voluntarios, setVoluntarios] = useState<VoluntarioLar[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const fetchData = async () => {
    try {
      if (!refreshing) setLoading(true);

      // 1. CABEÇALHO (PADRÃO)
      const resUser = await api.get('/usuarios/me');
      const user = resUser.data;
      const nomeReal = user.ong?.nome || user.nome || "ONG Sem Nome";
      const telefoneReal = user.telefone || user.ong?.telefone || "Não informado";
      const cidade = user.ong?.cidade || user.cidade;
      const estado = user.ong?.estado || user.estado;
      const localReal = (cidade && estado) ? `${cidade} - ${estado}` : "Local não inf.";

      setPerfil({
        nomeDisplay: nomeReal,
        email: user.email,
        telefone: telefoneReal,
        local: localReal
      });

      // 2. FEED DE LARES TEMPORÁRIOS
      // Busca todos os lares disponíveis na rede
      const resLares = await api.get('/larTemporario/feed');
      setVoluntarios(resLares.data);

    } catch (error) {
      console.error("Erro ao carregar feed:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading && !refreshing) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1A3C6E" />
        </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1A3C6E']} />}
        contentContainerStyle={styles.scrollContent}
      >

        {/* --- CABEÇALHO PADRÃO --- */}
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.push('/(ong)/home-ong' as any)} style={styles.headerBtn}>
            <Ionicons name="home-outline" size={28} color="#1A3C6E" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(ong)/notificacoes-ong' as any)} style={styles.headerBtn}>
            <Ionicons name="notifications-outline" size={28} color="#1A3C6E" />
          </TouchableOpacity>
        </View>

        <View style={styles.perfilHeader}>
          <View style={styles.banner} />
          <View style={styles.avatarContainer}>
             <Text style={{color:'#fff', fontSize: 36, fontWeight:'bold'}}>
                {perfil.nomeDisplay.charAt(0).toUpperCase()}
             </Text>
          </View>
          <Text style={styles.username}>{perfil.nomeDisplay}</Text>
        </View>

        <View style={styles.infoSection}>
            <View style={styles.infoColumn}>
                <Text style={styles.infoTitle}>Contato</Text>
                <Text style={styles.infoText} numberOfLines={1}>{perfil.email}</Text>
                <Text style={styles.infoText}>{perfil.telefone}</Text>
            </View>
            <View style={styles.infoColumnDireita}>
                <Text style={styles.infoTitle}>Localização</Text>
                <Text style={styles.infoText}>{perfil.local}</Text>
            </View>
        </View>
        
        <View style={styles.divider} />
          
        {/* --- BOTÕES DE NAVEGAÇÃO --- */}
        <Text style={styles.sectionTitle}>Gerenciamento</Text>
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.buttonsScrollView}
            contentContainerStyle={{ paddingHorizontal: 20 }}
        >
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(ong)/perfil-ong" as any)}>
                <Text style={styles.btnText}>Adotados</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(ong)/registrados" as any)}>
                <Text style={styles.btnText}>Registrados</Text>
            </TouchableOpacity>

            {/* Botão ATIVO (Azul Escuro) */}
            <TouchableOpacity style={[styles.btn, styles.btnActive]} onPress={() => {}}>
                <Text style={[styles.btnText, styles.btnTextActive]}>Lar Temp.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(ong)/doacoes-ong" as any)}>
                <Text style={styles.btnText}>Doações</Text>
            </TouchableOpacity>
        </ScrollView>

        {/* --- ÍCONE DE VOLUNTÁRIOS --- */}
        <View style={styles.volunteersIconContainer}>
          <TouchableOpacity onPress={() => router.push('/(ong)/lar-temporario' as any)}>
              <Ionicons name="people" size={28} color="#1A3C6E" />
          </TouchableOpacity>
        </View>
              
        {/* --- FEED DE LARES TEMPORÁRIOS DISPONÍVEIS --- */}
        <View style={{paddingHorizontal: 20}}>
            <Text style={styles.feedTitle}>Lares Disponíveis na Rede ({voluntarios.length})</Text>
            <Text style={styles.feedSubtitle}>Encontre voluntários cadastrados em todo o sistema.</Text>
            
            {voluntarios.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum lar temporário disponível no momento.</Text>
                </View>
            ) : (
                voluntarios.map((lar) => (
                    <View key={lar.id} style={styles.feedCard}>
                        {/* Header do Card */}
                        <View style={styles.feedHeader}>
                            <View style={styles.feedIconBox}>
                                <Ionicons name="home" size={20} color="#FFF" />
                            </View>
                            <View style={{flex:1}}>
                                <Text style={styles.feedName}>{lar.nomeCompleto}</Text>
                                <Text style={styles.feedLocation}>
                                    <Ionicons name="location-outline" size={12} color="#666" /> 
                                    {lar.endereco?.cidade || "Cidade não inf."} - {lar.endereco?.estado || "UF"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.dividerSmall} />

                        {/* Detalhes Rápidos */}
                        <View style={styles.tagsContainer}>
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>{lar.tipoMoradia}</Text>
                            </View>
                            {lar.quintal && (
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>Possui Quintal</Text>
                                </View>
                            )}
                        </View>

                        {/* Botão de Ação */}
                        <TouchableOpacity 
                            style={styles.contactBtn}
                            onPress={() => {
                                // Aqui você pode abrir um modal com detalhes completos (telefone, etc)
                                console.log("Ver contato de:", lar.nomeCompleto);
                                // router.push(`/detalhes-lar/${lar.id}`);
                            }}
                        >
                            <Text style={styles.contactBtnText}>Ver Detalhes de Contato</Text>
                            <Ionicons name="arrow-forward" size={16} color="#1A3C6E" />
                        </TouchableOpacity>
                    </View>
                ))
            )}
        </View>

        {/* FOOTER */}
        <View style={{ alignItems: "flex-end", marginTop: 20, marginBottom: 60, marginRight: 20 }}>
          <TouchableOpacity onPress={() => router.push("/(ong)/menuconfiguracoes-ong" as any)}>
            <Ionicons name="settings-outline" size={28} color="#1A3C6E" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 20 },
  container: { flex: 1 },

  // HEADER
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, marginBottom: 5 },
  headerBtn: { padding: 5 },
  perfilHeader: { alignItems: 'center', marginBottom: 20 },
  banner: { width: '90%', height: 120, backgroundColor: '#CCE1FF', borderRadius: 20, marginTop: 10 },
  avatarContainer: { marginTop: -50, width: 100, height: 100, borderRadius: 50, backgroundColor: '#1A3C6E', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#FFFFFF', overflow: 'hidden' },
  username: { fontSize: 22, fontWeight: 'bold', color: '#1A3C6E', marginTop: 10, textAlign: 'center', paddingHorizontal: 20 },
  infoSection: { flexDirection: 'row', paddingHorizontal: 30, justifyContent: 'space-between', marginBottom: 20 },
  infoColumn: { flex: 1.5 },
  infoColumnDireita: { flex: 1, alignItems: 'flex-end' },
  infoTitle: { fontSize: 14, color: '#1A3C6E', marginBottom: 4, fontWeight: 'bold', textTransform: 'uppercase' },
  infoText: { fontSize: 14, color: '#555', marginBottom: 2 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginHorizontal: 20, marginBottom: 20 },

  // BOTÕES
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1A3C6E", marginLeft: 20, marginBottom: 10, marginTop: 5 },
  buttonsScrollView: { marginBottom: 15 },
  btn: { minWidth: 140, backgroundColor: "#CCE1FF", paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, alignItems: "center", marginRight: 10 },
  btnText: { color: "#1A3C6E", fontWeight: "600", fontSize: 14 },
  btnActive: { backgroundColor: "#1A3C6E" },
  btnTextActive: { color: "#FFFFFF" },

  volunteersIconContainer: { alignItems: 'flex-start', marginBottom: 15, marginLeft: 20 },

  // --- ESTILO DO FEED (NOVO) ---
  feedTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  feedSubtitle: { fontSize: 13, color: '#666', marginBottom: 15 },
  
  feedCard: {
      backgroundColor: '#FFF',
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
  },
  feedHeader: { flexDirection: 'row', alignItems: 'center' },
  feedIconBox: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: '#1A3C6E',
      justifyContent: 'center', alignItems: 'center',
      marginRight: 12
  },
  feedName: { fontSize: 16, fontWeight: 'bold', color: '#1A3C6E' },
  feedLocation: { fontSize: 13, color: '#666', marginTop: 2 },
  
  dividerSmall: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tag: {
      backgroundColor: '#E7F1FC',
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 6
  },
  tagText: { color: '#2D68A6', fontSize: 12, fontWeight: '600' },
  
  contactBtn: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#F7F9FC',
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#CCE1FF'
  },
  contactBtnText: { color: '#1A3C6E', fontWeight: 'bold', fontSize: 13 },

  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 14, textAlign: 'center' }
});