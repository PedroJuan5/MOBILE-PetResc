import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, Stack } from "expo-router";
import React, { useState, useCallback } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert, Linking } from "react-native";
import api from '@/lib/axios';

const { width } = Dimensions.get('window');

// --- TIPOS ATUALIZADOS ---
interface ProfileData {
  nomeDisplay: string;
  email: string;
  telefone: string;
  local: string;
}

interface VoluntarioLar {
  id: number;
  nomeCompleto: string;
  telefone: string;
  
  // Endereço
  endereco: {
    cidade?: string;
    estado?: string;
    bairro?: string;
  };

  // Detalhes da Casa
  tipoMoradia: string;
  quintal: boolean;
  
  // Preferências (Novos Campos)
  tipoAnimal?: string; // Cão, Gato, Ambos
  porteAnimal?: string; // Pequeno, Médio, Grande
  
  // Detalhes Extras (Novos Campos)
  outrosAnimais?: boolean;
  administraMedicamentos?: boolean;
  periodoDisponibilidade?: string;
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

      // 1. CABEÇALHO
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

      // 2. FEED
      try {
          const resLares = await api.get('/lares-Temporarios/feed');
          setVoluntarios(resLares.data);
      } catch (err: any) {
          console.log("Erro rota feed, tentando alternativa...");
      }

    } catch (error) {
      console.error("Erro geral:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleWhatsApp = (telefone: string, nome: string) => {
    if (!telefone) {
        Alert.alert("Erro", "Telefone não disponível.");
        return;
    }
    let cleanPhone = telefone.replace(/[^0-9]/g, '');
    if (cleanPhone.length <= 11) cleanPhone = `55${cleanPhone}`;
    const mensagem = `Olá ${nome}, somos da ONG ${perfil.nomeDisplay}. Vimos seu perfil de Lar Temporário e temos interesse!`;
    const url = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(mensagem)}`;
    Linking.openURL(url).catch(() => Alert.alert("Erro", "WhatsApp não instalado."));
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
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(ong)/adotados-lista" as any)}>
                <Text style={styles.btnText}>Adotados</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(ong)/registrados" as any)}>
                <Text style={styles.btnText}>Registrados</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnActive]} onPress={() => {}}>
                <Text style={[styles.btnText, styles.btnTextActive]}>Lar Temp.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(ong)/doacoes-ong" as any)}>
                <Text style={styles.btnText}>Doações</Text>
            </TouchableOpacity>
        </ScrollView>

        <View style={styles.volunteersIconContainer}>
          <TouchableOpacity onPress={() => router.push('/(ong)/voluntarios-lar-temporario' as any)}>
              <Ionicons name="people" size={28} color="#1A3C6E" />
          </TouchableOpacity>
        </View>
              
        {/* --- FEED DETALHADO --- */}
        <View style={{paddingHorizontal: 20}}>
            <Text style={styles.feedTitle}>Lares Disponíveis ({voluntarios.length})</Text>
            <Text style={styles.feedSubtitle}>Detalhes completos para facilitar a escolha.</Text>
            
            {voluntarios.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum lar temporário disponível no momento.</Text>
                </View>
            ) : (
                voluntarios.map((lar) => (
                    <View key={lar.id} style={styles.feedCard}>
                        
                        {/* Header do Card: Nome e Local */}
                        <View style={styles.feedHeader}>
                            <View style={styles.feedIconBox}>
                                <Ionicons name="person" size={20} color="#FFF" />
                            </View>
                            <View style={{flex:1}}>
                                <Text style={styles.feedName}>{lar.nomeCompleto}</Text>
                                <Text style={styles.feedLocation}>
                                    <Ionicons name="location-outline" size={12} color="#666" /> 
                                    {lar.endereco?.cidade || "Cidade N/A"} - {lar.endereco?.estado || "UF"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.dividerSmall} />

                        {/* Informações Principais em Grid */}
                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Moradia</Text>
                                <Text style={styles.infoValue}>{lar.tipoMoradia} {lar.quintal ? "(C/ Quintal)" : "(S/ Quintal)"}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Aceita</Text>
                                <Text style={styles.infoValue}>{lar.tipoAnimal || "Todos"} - {lar.porteAnimal || "Qualquer"}</Text>
                            </View>
                        </View>

                        {/* Detalhes Adicionais (Tags) */}
                        <View style={styles.tagsContainer}>
                            {lar.administraMedicamentos && (
                                <View style={[styles.tag, {backgroundColor: '#E8F5E9'}]}>
                                    <Ionicons name="medkit-outline" size={12} color="green" style={{marginRight:4}}/>
                                    <Text style={[styles.tagText, {color:'green'}]}>Dá Remédios</Text>
                                </View>
                            )}
                            {lar.outrosAnimais ? (
                                <View style={[styles.tag, {backgroundColor: '#FFF3E0'}]}>
                                    <Ionicons name="paw-outline" size={12} color="#E67E22" style={{marginRight:4}}/>
                                    <Text style={[styles.tagText, {color:'#E67E22'}]}>Tem Animais</Text>
                                </View>
                            ) : (
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>Sem Animais</Text>
                                </View>
                            )}
                        </View>

                        {/* Disponibilidade */}
                        {lar.periodoDisponibilidade && (
                            <Text style={styles.availabilityText}>
                                <Ionicons name="calendar-outline" size={12} color="#666"/> Disponibilidade: {lar.periodoDisponibilidade}
                            </Text>
                        )}

                        <View style={{height: 10}}/>

                        {/* Botão WhatsApp */}
                        <TouchableOpacity 
                            style={styles.contactBtn}
                            onPress={() => handleWhatsApp(lar.telefone, lar.nomeCompleto)}
                        >
                            <Text style={styles.contactBtnText}>Entrar em contato</Text>
                            <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                        </TouchableOpacity>
                    </View>
                ))
            )}
        </View>

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

  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1A3C6E", marginLeft: 20, marginBottom: 10, marginTop: 5 },
  buttonsScrollView: { marginBottom: 15 },
  btn: { minWidth: 140, backgroundColor: "#CCE1FF", paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, alignItems: "center", marginRight: 10 },
  btnText: { color: "#1A3C6E", fontWeight: "600", fontSize: 14 },
  btnActive: { backgroundColor: "#1A3C6E" },
  btnTextActive: { color: "#FFFFFF" },
  volunteersIconContainer: { alignItems: 'flex-start', marginBottom: 15, marginLeft: 20 },

  // --- CARD ESTILO EXPANDIDO ---
  feedTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  feedSubtitle: { fontSize: 13, color: '#666', marginBottom: 15 },
  feedCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0', elevation: 2 },
  feedHeader: { flexDirection: 'row', alignItems: 'center' },
  feedIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1A3C6E', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  feedName: { fontSize: 16, fontWeight: 'bold', color: '#1A3C6E' },
  feedLocation: { fontSize: 13, color: '#666', marginTop: 2 },
  dividerSmall: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },
  
  // GRID DE INFORMAÇÕES
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  infoItem: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#999', textTransform: 'uppercase', marginBottom: 2 },
  infoValue: { fontSize: 13, color: '#333', fontWeight: '600' },

  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  tag: { flexDirection:'row', alignItems:'center', backgroundColor: '#E7F1FC', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  tagText: { color: '#2D68A6', fontSize: 11, fontWeight: '600' },
  availabilityText: { fontSize: 12, color: '#555', fontStyle:'italic' },

  contactBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#25D366' },
  contactBtnText: { color: '#2E7D32', fontWeight: 'bold', fontSize: 14 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 14, textAlign: 'center' }
});