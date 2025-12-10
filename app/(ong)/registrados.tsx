import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, Stack } from "expo-router";
import React, { useState, useCallback } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import api from '@/lib/axios';

const { width } = Dimensions.get('window');
const screenWidth = width - 40;

// --- TIPOS ---
interface ProfileData {
  nomeDisplay: string;
  email: string;
  telefone: string;
  local: string;
}

interface Animal {
  id: number;
  nome: string;
  raca: string | null;
  status: string;
  photoURL: string | null;
  idade: string | null;
  // Adicione outros campos se necessário
}

export default function RegistradosScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estado do Perfil (Cabeçalho)
  const [perfil, setPerfil] = useState<ProfileData>({
    nomeDisplay: "", email: "", telefone: "", local: ""
  });

  // Estado da Lista de Animais
  const [animais, setAnimais] = useState<Animal[]>([]);

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

      // 1. DADOS DO PERFIL (Para o Cabeçalho)
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

      // 2. LISTA DE ANIMAIS (Do Backend)
      // Rota correta baseada no seu animais.js: router.get('/gerenciar/lista', ...)
      const resAnimais = await api.get('/animais/gerenciar/lista');
      setAnimais(resAnimais.data);

    } catch (error) {
      console.error("Erro ao carregar registrados:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper para cor do status
  const getStatusColor = (status: string) => {
      if (status === 'DISPONIVEL') return '#27AE60'; // Verde
      if (status === 'ADOTADO') return '#2D68A6';    // Azul
      if (status === 'INDISPONIVEL') return '#E74C3C'; // Vermelho
      return '#666';
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
        {/* --- CABEÇALHO PADRÃO (IGUAL AO PERFIL) --- */}
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
          {/* BANNER */}
          <View style={styles.banner} />
          {/* FOTO PERFIL SOBREPOSTA */}
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
        {/* --- BOTÕES DE NAVEGAÇÃO --- */}
        {/* ============================================================ */}
          
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

        {/* ÍCONE DE VOLUNTÁRIOS */}
        <View style={styles.volunteersIconContainer}>
          <TouchableOpacity onPress={() => router.push('/(ong)/voluntarios-lar-temporario' as any)}>
              <Ionicons name="people" size={28} color="#1A3C6E" />
          </TouchableOpacity>
        </View>
              
        {/* ============================================================ */}
        {/* --- LISTA DE ANIMAIS (DINÂMICA) --- */}
        {/* ============================================================ */}
        
        {animais.length === 0 ? (
            <View style={{padding: 20, alignItems: 'center'}}>
                <Text style={{color: '#999'}}>Nenhum animal registrado ainda.</Text>
            </View>
        ) : (
            animais.map((pet) => (
                <View key={pet.id} style={styles.petCard}>
                  {/* Foto do Pet (com fallback) */}
                  <Image
                    source={pet.photoURL ? { uri: pet.photoURL } : require("../../assets/images/pets/branquinho.png")}
                    style={styles.petImg}
                  />

                  <View style={styles.petInfo}>
                      <Text style={styles.petName}>{pet.nome}</Text>
                      <Text style={styles.petSub}>{pet.raca || "SRD"}</Text>
                      <Text style={styles.petDetails}>
                        Status: <Text style={{fontWeight:'bold', color: getStatusColor(pet.status)}}>{pet.status}</Text>
                      </Text>
            
                      {/* Botão leva para o Gerenciamento deste Pet */}
                      <TouchableOpacity 
                        style={styles.infoButton} 
                        onPress={() => router.push({
                            pathname: "/(ong)/gerenciar-adocao-ong",
                            params: { animalId: pet.id }
                        } as any)}
                      >
                        <Text style={styles.infoButtonText}>Ver informações</Text>
                      </TouchableOpacity>
                  </View>
                </View>
            ))
        )}

        {/* --- GRÁFICOS (MANTIDOS ESTATICOS COMO PEDIDO) --- */}
        <Text style={styles.graphTitle}>Entradas de animais (6 meses)</Text>
        <View style={styles.chartCard}>
          <BarChart
            data={{
              labels: ["Mai", "Jun", "Jul", "Ago", "Set", "Out"],
              datasets: [{ data: [12, 18, 22, 15, 25, 10] }]
            }}
            width={screenWidth}
            height={220}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfigStyle}
            style={{ borderRadius: 12 }}
          />
        </View>

        <Text style={styles.graphTitle}>Entradas (1 semana)</Text>
        <View style={styles.chartCard}>
          <LineChart
            data={{
              labels: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
              datasets: [{ data: [1, 2, 1, 3, 2, 2, 1] }]
            }}
            width={screenWidth}
            height={220}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            bezier
            chartConfig={chartConfigStyle}
            style={{ borderRadius: 12 }}
          />
        </View>

        {/* SAÍDAS 6 MESES */}
        <Text style={styles.graphTitle}>Saída de animais (6 meses)</Text>
        <View style={styles.chartCard}>
          <BarChart
            data={{
              labels: ["Mai", "Jun", "Jul", "Ago", "Set", "Out"],
              datasets: [{ data: [10, 14, 20, 18, 22, 9] }]
            }}
            width={screenWidth}
            height={220}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfigStyle}
            style={{ borderRadius: 12 }}
          />
        </View>

        {/* SAÍDAS 1 SEMANA */}
        <Text style={styles.graphTitle}>Saída (1 semana)</Text>
        <View style={styles.chartCard}>
          <LineChart
            data={{
              labels: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
              datasets: [{ data: [1, 1, 2, 2, 3, 1, 1] }]
            }}
            width={screenWidth}
            height={220}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            bezier
            chartConfig={chartConfigStyle}
            style={{ borderRadius: 12 }}
          />
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

const chartConfigStyle = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: () => "#1A3C6E",
  labelColor: () => "#1A3C6E",
  barPercentage: 0.55,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#1A3C6E"
  },
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 20 },
  container: { flex: 1 }, 

  // --- HEADER (IDÊNTICO AO PERFIL) ---
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

  // --- BOTÕES (PADRONIZADOS) ---
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

  // --- CARD DO PET ---
  petCard: {
    flexDirection: "row",
    backgroundColor: "#F7F9FC", // Cor clara padrão do card
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 25,
    elevation: 2,
  },
  petImg: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#ddd' },
  petInfo: { flex: 1, justifyContent: 'space-between', marginLeft: 15 },
  petName: { fontSize: 16, fontWeight: "bold", color: "#1A3C6E" },
  petSub: { fontSize: 14, color: "#1A3C6E", marginTop: 2 },
  petDetails: { fontSize: 13, color: "#1A3C6E", marginTop: 5 },
  
  infoButton: {
     paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6,
     alignSelf: "flex-end", marginTop: 8, backgroundColor: '#CCE1FF'
  },
  infoButtonText: { color: "#1A3C6E", fontWeight: "bold", fontSize: 12 },

  // --- GRÁFICOS ---
  graphTitle: {
    fontSize: 16, fontWeight: "bold", color: "#1A3C6E",
    marginBottom: 10, marginTop: 10, marginLeft: 20
  },
  chartCard: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 25,
    marginHorizontal: 20,
    elevation: 2,
    alignItems: "center",
  },
});