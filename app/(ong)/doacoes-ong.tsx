import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, Stack } from "expo-router";
import React, { useState, useCallback } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from "react-native";
import api from '@/lib/axios';

const { width } = Dimensions.get('window');

// --- TIPOS ---
interface ProfileData {
  nomeDisplay: string;
  email: string;
  telefone: string;
  local: string;
}

export default function DoacoesOngScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estado do Cabeçalho
  const [perfil, setPerfil] = useState<ProfileData>({
    nomeDisplay: "", email: "", telefone: "", local: ""
  });

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

      // --- 1. CABEÇALHO (PADRÃO) ---
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

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
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

        {/* ============================================================ */}
        {/* --- CABEÇALHO PADRÃO (IGUAL ÀS OUTRAS TELAS) --- */}
        {/* ============================================================ */}
        
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.push('/(ong)/home-ong' as any)} style={styles.headerBtn}>
            <Ionicons name="home-outline" size={28} color="#1A3C6E" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push('/(ong)/notificacoes-ong' as any)} style={styles.headerBtn}>
            <Ionicons name="notifications-outline" size={28} color="#1A3C6E" />
          </TouchableOpacity>
        </View>

        <View style={styles.perfilHeader}>
          {/* BANNER + AVATAR */}
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
        
        {/* ============================================================ */}
        {/* --- FIM DO CABEÇALHO PADRÃO --- */}
        {/* ============================================================ */}
          
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
            
                        <TouchableOpacity style={styles.btn} onPress={() => router.push("/(ong)/lar-temporario" as any)}>
                            <Text style={styles.btnText}>Lar Temp.</Text>
                        </TouchableOpacity>
            
                        <TouchableOpacity style={styles.btn} onPress={() => router.push("/(ong)/doacoes-ong" as any)}>
                            <Text style={styles.btnText}>Doações</Text>
                        </TouchableOpacity>

            
        </ScrollView>

        {/* --- ÍCONE DE VOLUNTÁRIOS --- */}
        <View style={styles.volunteersIconContainer}>
          <TouchableOpacity onPress={() => router.push('/(ong)/voluntarios-lar-temporario' as any)}>
              <Ionicons name="people" size={28} color="#1A3C6E" />
          </TouchableOpacity>
        </View>

        {/* --- MENSAGEM INFORMATIVA (CONTEÚDO ESPECÍFICO) --- */}
        <View style={styles.infoContainer}>
            <Text style={styles.infoContainerText}>
              Todos os meses, nossa ONG resgata, cuida e alimenta dezenas de cães e gatos abandonados. Com sua ajuda, podemos salvar ainda mais vidas.
            </Text>
        </View>

        {/* FOOTER CONFIGURAÇÃO */}
        <View style={{ alignItems: "flex-end", marginTop: 20, marginBottom: 60, marginRight: 20 }}>
          <TouchableOpacity onPress={() => router.push("/(ong)/menuconfiguracoes-ong" as any)}>
            <Ionicons name="settings-outline" size={28} color="#1A3C6E" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

// --- ESTILOS PADRONIZADOS ---
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 20 },
  container: { padding: 15 },

  // --- HEADER (PADRÃO) ---
  headerTop: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingHorizontal: 20, 
      paddingTop: 40, 
      marginBottom: 5 
  },
  headerBtn: { padding: 5 },
  
  perfilHeader: { alignItems: 'center', marginBottom: 20 },
  banner: { width: '90%', height: 120, backgroundColor: '#CCE1FF', borderRadius: 20, marginTop: 10 },
  avatarContainer: { 
      marginTop: -50, width: 100, height: 100, borderRadius: 50, 
      backgroundColor: '#1A3C6E', justifyContent: 'center', alignItems: 'center', 
      borderWidth: 4, borderColor: '#FFFFFF', overflow: 'hidden' 
  },
  username: { fontSize: 22, fontWeight: 'bold', color: '#1A3C6E', marginTop: 10, textAlign: 'center', paddingHorizontal: 20 },

  infoSection: { flexDirection: 'row', paddingHorizontal: 30, justifyContent: 'space-between', marginBottom: 20 },
  infoColumn: { flex: 1.5 },
  infoColumnDireita: { flex: 1, alignItems: 'flex-end' },
  infoTitle: { fontSize: 14, color: '#1A3C6E', marginBottom: 4, fontWeight: 'bold', textTransform: 'uppercase' },
  infoText: { fontSize: 14, color: '#555', marginBottom: 2 },

  divider: { height: 1, backgroundColor: '#E0E0E0', marginHorizontal: 20, marginBottom: 20 },

  // --- BOTÕES E TÍTULOS ---
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A3C6E",
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 5,
  },
  buttonsScrollView: { marginBottom: 15 },
  btn: {
    minWidth: 140, // Largura padrão
    backgroundColor: "#CCE1FF", // Cor padrão (azul claro)
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  btnText: {
    color: "#1A3C6E",
    fontWeight: "600",
    fontSize: 14,
  },

  volunteersIconContainer: { alignItems: 'flex-start', marginBottom: 15, marginLeft: 20 },

  // --- CONTEÚDO ESPECÍFICO ---
  infoContainer: {
    backgroundColor: "#F0F0F0",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 20,
    elevation: 1,
  },
  infoContainerText: {
    color: "#333",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "left",
    fontWeight: "500",
  },
});