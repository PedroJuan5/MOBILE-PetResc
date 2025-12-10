import api from '@/lib/axios';
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

// Cálculo da largura responsiva (Largura da tela - Padding horizontal total)
const { width } = Dimensions.get('window');
const screenWidth = width - 40; // 20px de margem em cada lado

// Tipos
interface ProfileData {
  nomeDisplay: string;
  email: string;
  telefone: string;
  local: string;
  photoURL?: string | null;
}

interface StatsData {
  adotados: number;
  processo: number;
  aguardando: number;
}

interface LastPet {
  nome: string;
  raca: string;
  status: string;
  data: string;
  foto: string | null;
}

export default function PerfilOngScreen(): React.ReactElement {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [perfil, setPerfil] = useState<ProfileData>({
    nomeDisplay: "",
    email: "",
    telefone: "",
    local: ""
  });

  const [stats, setStats] = useState<StatsData>({ adotados: 0, processo: 0, aguardando: 0 });
  const [lastPet, setLastPet] = useState<LastPet | null>(null);

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

      // 1. DADOS DO USUÁRIO
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
        local: localReal,
        photoURL: null 
      });

      // 2. DADOS DE ESTATÍSTICAS
      // We fetch ANIMALS (to count adopted/available) and REQUESTS (to count pending)
      const [resAnimais, resPedidos] = await Promise.all([
        api.get('/animais/gerenciar/lista'), // Correct route for ONG's animals
        api.get('/pedidos-adocao/gerenciar') // Correct route for Adoption Requests
      ]);

      const animais = resAnimais.data || [];
      const pedidos = resPedidos.data || [];

      // --- CÁLCULO DAS ESTATÍSTICAS (CORRIGIDO) ---
      setStats({
        // Count animals belonging to this ONG with status 'DISPONIVEL'
        aguardando: animais.filter((a: any) => a.status === 'DISPONIVEL').length,
        
        // Count animals belonging to this ONG with status 'ADOTADO'
        // Make sure your backend sets status to 'ADOTADO' upon approval
        adotados: animais.filter((a: any) => a.status === 'ADOTADO').length,
        
        // Count adoption requests that are still 'PENDENTE'
        processo: pedidos.filter((p: any) => p.status === 'PENDENTE').length
      });

      // Define o "Último Pet" com atividade
      if (pedidos.length > 0) {
        const p = pedidos[0];
        setLastPet({
            nome: p.animal?.nome || "Pet",
            raca: p.animal?.raca || "SRD",
            status: "Novo Pedido",
            data: p.dataPedido ? new Date(p.dataPedido).toLocaleDateString() : "Hoje",
            foto: p.animal?.photoURL
        });
      } else if (animais.length > 0) {
        const a = animais[0];
        setLastPet({
            nome: a.nome,
            raca: a.raca || "SRD",
            status: "Cadastrado",
            data: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "Recente",
            foto: a.photoURL
        });
      }

    } catch (error) {
      console.error("Erro perfil ONG:", error);
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1A3C6E']} />}
      >
        
        {/* HEADER / BANNER */}
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.push('/(ong)/home-ong' as any)} style={styles.headerBtn}>
            <Ionicons name="home-outline" size={28} color="#1A3C6E" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(ong)/notificacoes-ong' as any)} style={styles.headerBtn}>
            <Ionicons name="notifications-outline" size={28} color="#1A3C6E" />
            <View style={styles.notificacaoDot} /> 
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

        {/* INFORMAÇÕES DA CONTA */}
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

        {/* ESTATÍSTICAS REAIS */}
        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.adotados}</Text>
              <Text style={styles.statLabel}>Adotados</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.processo}</Text>
              <Text style={styles.statLabel}>Em processo</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.aguardando}</Text>
              <Text style={styles.statLabel}>Aguardando</Text>
            </View>
        </View>

        {/* BOTÕES DE AÇÃO RÁPIDA */}
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

            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(ong)/lar-temporario" as any)}>
                <Text style={styles.btnText}>Lar Temp.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(ong)/doacoes-ong" as any)}>
                <Text style={styles.btnText}>Doações</Text>
            </TouchableOpacity>
        </ScrollView>

        {/* GRÁFICO 1: BARRAS */}
        <Text style={[styles.sectionTitle, { marginLeft: 20, marginTop: 20 }]}>Visão Geral (6 Meses)</Text>
        <View style={styles.chartContainer}>
            <BarChart
                data={{
                labels: ["Mai", "Jun", "Jul", "Ago", "Set", "Out"],
                datasets: [{ data: [23, 12, 25, 16, 22, 7] }] 
                }}
                width={screenWidth} // Largura Responsiva
                height={220}
                yAxisLabel=""  
                yAxisSuffix="" 
                fromZero
                chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: () => "#1A3C6E",
                labelColor: () => "#1A3C6E",
                barPercentage: 0.55,
                }}
                style={{ borderRadius: 12 }}
            />
        </View>

        {/* GRÁFICO 2: LINHA */}
        <Text style={[styles.sectionTitle, { marginLeft: 20, marginTop: 20 }]}>Atividade Recente (Semana)</Text>
        <View style={styles.chartContainer}>
            <LineChart
                data={{
                labels: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
                datasets: [{ data: [1, 2, 1, 1, 2, 3, 2] }]
                }}
                width={screenWidth} // Largura Responsiva
                height={250}
                fromZero
                bezier
                chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: () => "#1A3C6E",
                labelColor: () => "#1A3C6E",
                propsForDots: {
                    r: "5",
                    strokeWidth: "2",
                    stroke: "#1A3C6E"
                },
                }}
                style={{ borderRadius: 12 }}
            />
        </View>

        <View style={{ height: 100 }} /> 
      </ScrollView>

      {/* Botão Flutuante de Configurações */}
      <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/(ong)/menuconfiguracoes-ong' as any)}>
        <Ionicons name="settings-outline" size={26} color="#1A3C6E" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 20 },
  
  headerTop: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingHorizontal: 20, 
      paddingTop: 40, 
      marginBottom: 5 
  },
  headerBtn: { padding: 5 },
  notificacaoDot: { position: 'absolute', top: 5, right: 5, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B30', borderWidth: 1, borderColor: '#FFF' },
  
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

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F7F9FC",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 25,
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 24, fontWeight: "bold", color: "#1A3C6E" },
  statLabel: { fontSize: 12, color: "#666", marginTop: 2 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A3C6E', marginLeft: 20, marginBottom: 10 },
  buttonsScrollView: { marginBottom: 10 },
  btn: {
    backgroundColor: "#CCE1FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
    minWidth: 100
  },
  btnText: { color: "#1A3C6E", fontWeight: "600", fontSize: 14 },

  chartContainer: {
      alignItems: 'center',
      marginHorizontal: 20,
      backgroundColor: '#fff',
      borderRadius: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      paddingVertical: 10
  },

  settingsButton: { 
      position: 'absolute', bottom: 20, right: 20, 
      backgroundColor: '#FFFFFF', width: 55, height: 55, borderRadius: 27.5, 
      justifyContent: 'center', alignItems: 'center', 
      elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5 
  }
});