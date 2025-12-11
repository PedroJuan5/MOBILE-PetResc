import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native";
import { DenuncieModal } from "../../../components/denuncieModal"; 

// API
import api from '@/lib/axios';

// Componentes
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';

// Interfaces para tipagem
interface Animal {
  id: number;
  nome: string;
  raca: string | null;
  status: string;
  photoURL: string | null;
}

// CORREÇÃO NA INTERFACE: O backend retorna 'account', não 'candidato'
interface Pedido {
  id: number;
  status: string;
  animal: {
    id: number;
    nome: string;
    raca: string | null;
    photoURL: string | null;
  };
  account: { // <--- CORRIGIDO AQUI
    nome: string;
  };
}

export default function HomeOngScreen(): React.ReactElement {
  const router = useRouter();
  const [denuncieVisible, setDenuncieVisible] = useState<boolean>(false);
  
  // Estados de Dados
  const [loading, setLoading] = useState(true);
  const [animaisRecentes, setAnimaisRecentes] = useState<Animal[]>([]);
  const [pedidosPendentes, setPedidosPendentes] = useState<Pedido[]>([]);

  // Carrega dados toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const fetchDashboardData = async () => {
    try {
      // 1. Buscar Animais da ONG
      const resAnimais = await api.get('/animais'); 
      setAnimaisRecentes(resAnimais.data);

      // 2. Buscar Pedidos de Adoção recebidos
      // Certifique-se que a rota no adocoes.js é '/gerenciar' e está acessível
      const resPedidos = await api.get('/pedidos-adocao/gerenciar');
      setPedidosPendentes(resPedidos.data);

    } catch (error) {
      console.log("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper para renderizar card
  const animalCard = (
    id: number, 
    title: string, 
    subtitle: string, 
    status: string, 
    photoURL: string | null,
    tipo: 'animal' | 'pedido'
  ): React.ReactElement => {
    
    // Tratamento de imagem com fallback
    const imageSource = photoURL 
      ? { uri: photoURL } 
      : require("../../../assets/images/pets/branquinho.png"); 

    return (
      <TouchableOpacity 
        key={`${tipo}-${id}`} 
        style={styles.animalCard}
        onPress={() => {
          if (tipo === 'animal') {
             // Vai para gerenciamento do PET específico
             router.push({
                pathname: '/(ong)/gerenciar-adocao-ong',
                params: { animalId: id } // Padronizado para animalId
             } as any);
          } else {
             // No caso de pedido, precisamos passar o ID do ANIMAL relacionado ao pedido
             // pois a tela 'gerenciar-adocao-ong' carrega com base no animal
             // Mas como seu card de pedido tem o ID do pedido, precisamos achar o animalId
             // A lógica ideal seria extrair o animalId aqui.
             
             // NOTA: Baseado no seu 'gerenciar-adocao-ong.tsx', ele espera 'animalId'.
             // Se clicamos num pedido, queremos ir ver os pedidos DAQUELE ANIMAL.
             
             // Vamos passar o animalId que está dentro do objeto pedido (se disponível na lógica de chamada)
             // *Ajustado na chamada abaixo*
          }
        }}
      >
        <Image
          source={imageSource}
          style={styles.petImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.animalName} numberOfLines={1}>{title}</Text>
          <Text style={styles.animalRace} numberOfLines={1}>{subtitle}</Text>
          <Text style={styles.animalStatus}>
            Status: <Text style={{ fontWeight: "600", color: getStatusColor(status) }}>{status}</Text>
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ alignSelf: 'center' }} />
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status: string) => {
    if (status === 'PENDENTE') return '#F59E0B'; 
    if (status === 'DISPONIVEL') return '#10B981'; 
    if (status === 'ADOTADO') return '#2D68A6'; 
    return '#666';
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2D68A6" />
      </View>
    );
  }

  const pedidosDisplay = pedidosPendentes.filter(p => p.status === 'PENDENTE').slice(0, 3); 
  const animaisDisplay = animaisRecentes.slice(0, 3);

  return (
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>

        {/* TOP HEADER */}
        <View style={styles.headerContainer}>
          
          <View style={styles.headerIcons}>
            <CustomHeaderLeft onDenunciePress={() => setDenuncieVisible(true)} />
            <CustomHeaderRight 
                onNotificationPress={() => router.push('/(ong)/notificacoes-ong' as any)} 
            />
          </View>

          {/* TÍTULO COM AS PATINHAS */}
          <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>Conheça seu novo{"\n"}melhor amigo!</Text>

            <Image 
              source={require("../../../assets/images/ui/pata.png")} 
              style={[styles.paw, styles.paw1]} 
              resizeMode="contain"
            />
            <Image 
              source={require("../../../assets/images/ui/pata.png")} 
              style={[styles.paw, styles.paw2]} 
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity style={styles.btnCadastrar} onPress={() => router.push('/(ong)/(tabs)/registroAnimal-ong' as any)}>
            <Text style={styles.btnCadastrarText}>Cadastrar animal</Text>
          </TouchableOpacity>
        </View>

        {/* SEÇÃO 1: PEDIDOS DE ADOÇÃO */}
        <Section 
            title="Pedidos de Adoção" 
            subtitle={`Pedidos pendentes: ${pedidosPendentes.filter(p => p.status === 'PENDENTE').length}`}
        >
          {pedidosDisplay.length > 0 ? (
            pedidosDisplay.map(pedido => (
                // Aqui ajustamos o onPress para passar o animalId corretamente
                <TouchableOpacity 
                    key={`pedido-${pedido.id}`} 
                    style={styles.animalCard}
                    onPress={() => {
                         router.push({
                            pathname: '/(ong)/gerenciar-adocao-ong',
                            params: { animalId: pedido.animal.id } // Passa o ID do Animal para gerenciar
                         } as any);
                    }}
                >
                    <Image
                      source={pedido.animal.photoURL ? { uri: pedido.animal.photoURL } : require("../../../assets/images/pets/branquinho.png")}
                      style={styles.petImage}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.animalName} numberOfLines={1}>{pedido.animal.nome}</Text>
                      {/* CORREÇÃO AQUI: pedido.account.nome em vez de pedido.candidato.nome */}
                      <Text style={styles.animalRace} numberOfLines={1}>Candidato: {pedido.account?.nome || "Nome não disp."}</Text>
                      <Text style={styles.animalStatus}>
                        Status: <Text style={{ fontWeight: "600", color: getStatusColor(pedido.status) }}>{pedido.status}</Text>
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ alignSelf: 'center' }} />
                </TouchableOpacity>
            ))
          ) : (
             <Text style={styles.emptyText}>Nenhum pedido pendente no momento.</Text>
          )}
          
          <TouchableOpacity style={styles.verMaisBtn} onPress={() => router.push('/(ong)/pedidos-lista' as any)}>
            <Text style={styles.verMaisText}>Ver todos os pedidos</Text>
          </TouchableOpacity>
        </Section>


        {/* SEÇÃO 2: ANIMAIS REGISTRADOS */}
        <Section 
            title="Animais registrados recentemente" 
            subtitle={`Total de animais: ${animaisRecentes.length}`}
        >
          {animaisDisplay.length > 0 ? (
            animaisDisplay.map(animal => (
                animalCard(
                    animal.id,
                    animal.nome,
                    animal.raca || "SRD",
                    animal.status,
                    animal.photoURL,
                    'animal'
                )
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhum animal cadastrado.</Text>
          )}

          <TouchableOpacity style={styles.verMaisBtn} onPress={() => router.push('/(ong)/(tabs)/meusAnimais-ong' as any)}>
            <Text style={styles.verMaisText}>Gerenciar meus animais</Text>
          </TouchableOpacity>
        </Section>

        {/* ÁREA DE CAMPANHAS */}
        <View style={styles.campanhasContainer}>
          <Text style={styles.campanhasTitle}>Minhas campanhas</Text>

          <View style={styles.campanhasRow}>
            {/* Coluna da Esquerda */}
            <View style={styles.campanhasLeftCol}>
              <Text style={styles.campanhasText}>
                Crie novas campanhas para arrecadar doações e ajude a transformar a vida de mais animais.
                {"\n\n"}
                Aqui você também encontra todas as suas campanhas anteriores.
              </Text>
            </View>

            {/* Coluna da Direita */}
            <View style={styles.campanhasRightCol}>
              <Image 
                source={require("../../../assets/images/ui/gatoHome.png")} 
                style={styles.gatoImage} 
                resizeMode="contain" 
              />
              <TouchableOpacity style={styles.btnNovaCampanha} onPress={() => router.push('/(ong)/(tabs)/doacoes' as any)}>
                <Text style={styles.btnTextBlue}>Nova campanha</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>
      <DenuncieModal visible={denuncieVisible} onClose={() => setDenuncieVisible(false)} />
    </View>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }): React.ReactElement {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F2F5" },
  headerContainer: { paddingTop: 40, paddingHorizontal: 20, paddingBottom: 15 },
  headerIcons: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 20, 
    alignItems: 'center' 
  },
  titleContainer: { position: 'relative', marginBottom: 30, marginTop: 10 },
  
  pageTitle: { 
    fontSize: 32, 
    fontWeight: "800", 
    color: "#2D68A6", 
    width: "80%", 
    marginTop: 5,
    fontFamily: 'MoreSugar',
    lineHeight: 40,
  },
  paw: { position: 'absolute', width: 110, height: 110, opacity: 0.5 },
  paw1: { top: -40, right: 40, transform: [{ rotate: '15deg' }] },
  paw2: { top: 70, right: 10, transform: [{ rotate: '-20deg' }] },

  btnCadastrar: { backgroundColor: "#5DA9F6", paddingVertical: 10, borderRadius: 20, alignItems: "center", width: 150 },
  btnCadastrarText: { color: "#fff", fontWeight: "700" },
  section: { marginTop: 15, paddingHorizontal: 15 },
  sectionHeader: { backgroundColor: "#BFD6F5", padding: 10, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#2D68A6" },
  sectionSubtitle: { backgroundColor: "#DCE9FA", padding: 8, fontSize: 14, fontWeight: "600", color: "#2D68A6" },
  sectionContent: { backgroundColor: "#fff", padding: 10, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  animalCard: { backgroundColor: "#E7F1FC", borderRadius: 12, padding: 10, marginBottom: 10, flexDirection: "row", gap: 10, alignItems: 'center' },
  petImage: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#ddd' },
  animalName: { fontSize: 16, fontWeight: "700", color: "#333" },
  animalRace: { fontSize: 13, marginTop: 2, color: "#666" },
  animalStatus: { marginTop: 2, fontSize: 12, color: "#666" },
  verMaisBtn: { alignSelf: "center", marginTop: 10, padding: 5 },
  verMaisText: { color: "#2D68A6", fontWeight: "600", fontSize: 14 },
  emptyText: { color: "#999", fontStyle: "italic", textAlign: "center", marginVertical: 10 },
  
  campanhasContainer: { marginTop: 20, paddingHorizontal: 20, paddingBottom: 10 },
  campanhasTitle: { fontSize: 22, fontWeight: "bold", color: "#2D68A6", marginBottom: 15 },
  campanhasRow: { flexDirection: "row", alignItems: "flex-end" },
  campanhasLeftCol: { flex: 1, paddingRight: 5, justifyContent: 'space-between' },
  campanhasRightCol: { width: 140, alignItems: "center" },
  campanhasText: { color: "#2D68A6", fontSize: 19, lineHeight: 22, textAlign: 'left' },
  gatoImage: { width: 135, height: 145, marginBottom: -8 },
  btnNovaCampanha: { backgroundColor: "#BFD6F5", borderRadius: 20, paddingVertical: 10, width: '100%', alignItems: 'center', marginTop: 1 },
  btnCampanhasAnteriores: { backgroundColor: "#BFD6F5", borderRadius: 20, paddingVertical: 10, paddingHorizontal: 15, alignSelf: 'flex-start', marginTop: 10 },
  btnTextBlue: { color: "#2D68A6", fontWeight: "bold", fontSize: 14 },
});