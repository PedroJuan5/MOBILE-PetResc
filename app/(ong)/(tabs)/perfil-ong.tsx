import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import api from '@/lib/axios';

const screenWidth = Dimensions.get("window").width - 40;

// Tipos para o Estado
interface ProfileData {
  nomeDisplay: string;
  email: string;
  telefone: string;
  local: string;
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
  
  // Estado do Perfil (Inicia vazio)
  const [perfil, setPerfil] = useState<ProfileData>({
    nomeDisplay: "",
    email: "",
    telefone: "",
    local: ""
  });

  // Estado das Estatísticas (Calculado a partir das listas reais)
  const [stats, setStats] = useState<StatsData>({ adotados: 0, processo: 0, aguardando: 0 });
  
  // Estado do último pet (Card de atividade)
  const [lastPet, setLastPet] = useState<LastPet | null>(null);

  // Recarrega sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      setLoading(true);

      // --- 1. PUXAR DADOS DO PERFIL (IGUAL AO USUÁRIO COMUM) ---
      const resUser = await api.get('/usuarios/me');
      const user = resUser.data;

      // Lógica de prioridade: Tenta pegar dados específicos da ONG, senão usa da Conta
      const nomeReal = user.ong?.nome || user.nome || "ONG Sem Nome";
      const telefoneReal = user.telefone || user.ong?.telefone || "Não informado";
      
      const cidade = user.ong?.cidade || user.cidade;
      const estado = user.ong?.estado || user.estado;
      const localReal = (cidade && estado) ? `${cidade} - ${estado}` : "Localização não inf.";

      setPerfil({
        nomeDisplay: nomeReal,
        email: user.email,
        telefone: telefoneReal,
        local: localReal
      });

      // --- 2. PUXAR DADOS PARA ESTATÍSTICAS ---
      const [resAnimais, resPedidos] = await Promise.all([
        api.get('/animais/meus'),
        api.get('/pedidos-adocao/gerenciar')
      ]);

      const animais = resAnimais.data || [];
      const pedidos = resPedidos.data || [];

      // Cálculos Simples
      setStats({
        aguardando: animais.filter((a: any) => a.status === 'DISPONIVEL').length,
        adotados: animais.filter((a: any) => a.status === 'ADOTADO').length,
        processo: pedidos.filter((p: any) => p.status === 'PENDENTE').length
      });

      // Define o card de "Última Atividade"
      if (pedidos.length > 0) {
        const p = pedidos[0];
        setLastPet({
            nome: p.animal.nome,
            raca: p.animal.raca || "SRD",
            status: "Novo Pedido",
            data: new Date(p.dataPedido).toLocaleDateString(),
            foto: p.animal.photoURL
        });
      } else if (animais.length > 0) {
        const a = animais[0];
        setLastPet({
            nome: a.nome,
            raca: a.raca || "SRD",
            status: "Cadastrado",
            data: "Recente",
            foto: a.photoURL
        });
      }

    } catch (error) {
      console.error("Erro ao carregar perfil ONG:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#1A3C6E" />
        </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(ong)/home-ong' as any)}>
            <Ionicons name="home-outline" size={24} color="#1A3C6E" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(ong)/notificacoes-ong' as any)}>
            <Ionicons name="notifications-outline" size={24} color="#1A3C6E" />
        </TouchableOpacity>
      </View>

      {/* CARD PERFIL */}
      <View style={styles.cardOng}>
        <Image
          source={require("../../../assets/images/ui/institutoCaramelo.png")}
          style={styles.ongImage}
        />
        <View style={styles.ongProfileCircle}>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                 <Text style={{color:'#fff', fontSize: 32, fontWeight:'bold'}}>
                    {perfil.nomeDisplay.charAt(0).toUpperCase()}
                 </Text>
            </View>
        </View>
      </View>

      {/* NOME DA ONG */}
      <Text style={styles.ongName}>{perfil.nomeDisplay}</Text>

      {/* CONTATO E LOCAL */}
      <View style={styles.infoRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Contato</Text>
          <Text style={styles.infoText}>{perfil.email}</Text>
          <Text style={styles.infoText}>{perfil.telefone}</Text>
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={styles.label}>Localização</Text>
          <Text style={styles.infoText}>{perfil.local}</Text>
        </View>
      </View>

      {/* BOTÕES DE NAVEGAÇÃO */}
       <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.buttonsScrollView}
        >
          <TouchableOpacity style={styles.btn} onPress={() => router.push("/(ong)/adotados-lista" as any)}>
            <Text style={styles.btnText}>Adotados</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.btn} onPress={() => router.push("/(ong)/registrados" as any)}>
            <Text style={styles.btnText}>Registrados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={() => router.push("/(ong)/lar-temporario" as any)}>
            <Text style={styles.btnText}>Lar Temporário</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={() => router.push("/(ong)/doacoes-ong" as any)}>
            <Text style={styles.btnText}>Doações</Text>
          </TouchableOpacity>
        </ScrollView>
      
      {/* --- NOVO ÍCONE DE VOLUNTÁRIOS --- */}
      <View style={styles.volunteersIconContainer}>
        <TouchableOpacity onPress={() => router.push('/(ong)/voluntarios-lar-temporario' as any)}>
            <Ionicons name="people" size={28} color="#1A3C6E" />
        </TouchableOpacity>
      </View>

      {/* CARD PET (Dinâmico) */}
      {lastPet && (
        <View style={styles.petCard}>
            <Image
              source={lastPet.foto ? { uri: lastPet.foto } : require("../../../assets/images/pets/branquinho.png")}
              style={styles.petImg}
            />
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{lastPet.nome}</Text>
              <Text style={styles.petSub}>{lastPet.raca}</Text>
              <Text style={styles.petDetails}>
                  Data: {lastPet.data} {"\n"}
                  Status: <Text style={{fontWeight:'bold', color: '#2D68A6'}}>{lastPet.status}</Text>
              </Text>

              <TouchableOpacity style={styles.infoButton} onPress={() => router.push("/(ong)/pedidos-lista" as any)}>
                  <Text style={styles.infoButtonText}>Ver detalhes</Text>
              </TouchableOpacity>
            </View>
        </View>
      )}

      {/* --- GRÁFICOS --- */}
      
      <Text style={styles.graphTitle}>Processos de adoção (6 meses)</Text>
      <View style={styles.chartCard}>
        <BarChart
            data={{
              labels: ["Mai", "Jun", "Jul", "Ago", "Set", "Out"],
              datasets: [{ data: [23, 12, 25, 16, 22, 7] }] 
            }}
            width={screenWidth}
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

      <Text style={styles.graphTitle}>Atividade Recente (Semana)</Text>
      <View style={styles.chartCard}>
        <LineChart
            data={{
              labels: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
              datasets: [{ data: [1, 2, 1, 1, 2, 3, 2] }]
            }}
            width={screenWidth} 
            height={250}
            fromZero
            bezier
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: () => "#1A3C6E",
              labelColor: () => "#1A3C6E",
              propsForDots: { r: "5", strokeWidth: "2", stroke: "#1A3C6E" },
            }}
            style={{ borderRadius: 12 }}
        />
      </View>

      {/* --- ESTATÍSTICAS --- */}
      <Text style={styles.graphTitle}>Estatísticas Gerais</Text>
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

      <View style={{ alignItems: "flex-end", marginTop: 20, marginBottom: 40 }}>
        <TouchableOpacity onPress={() => router.push("/(ong)/menuconfiguracoes-ong" as any)}>
          <Ionicons name="settings-outline" size={28} color="#1A3C6E" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    marginTop: 10, 
  },
  cardOng: {
    width: "100%",
    height: 140,
    backgroundColor: "#CCE1FF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  ongImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    opacity: 0.5,
  },
  ongProfileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1A3C6E",
    position: "absolute",
    top: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff'
  },
  ongName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A3C6E",
    marginTop: 45,
    marginBottom: 15,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
    paddingHorizontal: 10
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A3C6E",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  buttonsScrollView: {
    marginBottom: 10, // Reduzido um pouco para aproximar o ícone
  },
  btn: {
    minWidth: 140,
    backgroundColor: "#87b0ceff",
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
  
  // --- ESTILO DO NOVO ÍCONE ---
  volunteersIconContainer: {
    alignItems: 'flex-start', 
    marginBottom: 10,
    marginTop: 5,
    marginLeft: 5
  },

  petCard: {
    flexDirection: "row",
    backgroundColor: "#87b0ceff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    gap: 15,
    elevation: 2,
  },
  petImg: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee'
  },
  petInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  petName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3C6E",
  },
  petSub: {
    fontSize: 14,
    color: "#1A3C6E",
    marginTop: 2,
    fontWeight: "600"
  },
  petDetails: {
    fontSize: 13,
    color: "#1A3C6E",
    marginTop: 5,
  },
  infoButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-end",
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.3)'
  },
  infoButtonText: {
    color: "#1A3C6E",
    fontWeight: "bold",
    fontSize: 12,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3C6E",
    marginBottom: 10,
    marginTop: 10,
  },
  chartCard: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 25,
    elevation: 2,
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A3C6E",
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
});