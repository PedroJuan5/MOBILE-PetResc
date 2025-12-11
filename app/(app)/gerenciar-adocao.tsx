import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Alert,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import api from '@/lib/axios';

const { width } = Dimensions.get('window');

interface PetData {
  id: number;
  nome: string;
  status: string;
  photoURL: string | null;
  dataAtualizacao?: string; 
}

interface Candidato {
  id: number; 
  status: string;
  dataPedido: string;
  animalId: number;
  candidatoId: number;
  account: {
    nome: string;
    email: string;
    telefone: string;
    cpf?: string;
    cep?: string;
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
  formulario: {
    tipoMoradia: string;
    possuiOutrosAnimais: boolean;
    pessoasNaCasa: number;
    historicoAnimais?: string;
  };
}

export default function GerenciarAdocaoUsuarioScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idDoAnimal = params.animalId || params.petId || params.id;

  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState<PetData | null>(null);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false); 

  const fetchData = async () => {
    if (!idDoAnimal) return;
    setLoading(true);
    try {
      const resPet = await api.get(`/animais/${idDoAnimal}`);
      setPet(resPet.data);

      const resPedidos = await api.get(`/pedidos-adocao/animal/${idDoAnimal}`);
      const listaCandidatos = resPedidos.data;
      
      setCandidatos(listaCandidatos);

      if (listaCandidatos.length > 0 && (!selectedPedidoId || !listaCandidatos.find((c:any) => c.id === selectedPedidoId))) {
        setSelectedPedidoId(listaCandidatos[0].id);
      }
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      if (error.response?.status === 401) {
          Alert.alert("Sessão Expirada", "Faça login novamente.");
          router.replace('/(auth)/login-ong' as any);
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [idDoAnimal])
  );

  const handleUpdateStatus = async (novoStatus: 'APROVADO' | 'RECUSADO') => {
    if (!selectedPedidoId) return;
    setUpdating(true);

    try {
        await api.patch(`/pedidos-adocao/${selectedPedidoId}/status`, { status: novoStatus });
        
        Alert.alert(
            "Sucesso",
            `Pedido ${novoStatus === 'APROVADO' ? 'aprovado' : 'recusado'} com sucesso!`,
            [{ text: "OK", onPress: () => fetchData() }]
        );

    } catch (error: any) {
        const msg = error.response?.data?.error || "Erro ao atualizar status.";
        Alert.alert("Erro", msg);
    } finally {
        setUpdating(false);
    }
  };

  const candidatoSelecionado = candidatos.find(c => c.id === selectedPedidoId);

  const formatDate = (dateString: string) => {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Helper para verificar status (Ignora maiúsculas/minúsculas)
  const isPendente = (status: string) => status.toUpperCase() === 'PENDENTE';

  if (loading) {
      return (
          <View style={[styles.container, {justifyContent:'center', alignItems:'center'}]}>
              <ActivityIndicator size="large" color="#1A3C6E" />
          </View>
      );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1A3C6E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gerenciar Adoção</Text>
          <View style={{width: 24}}/>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
        
        {pet && (
            <View style={styles.petSection}>
                <Image 
                    source={{ uri: pet.photoURL || 'https://placehold.co/400x400/png?text=Sem+Foto' }} 
                    style={styles.petImage} 
                />
                <View style={styles.petInfo}>
                    <Text style={styles.petName}>{pet.nome}</Text>
                    <View style={{flexDirection:'row', alignItems:'center', marginTop: 5}}>
                        <Text style={styles.labelStatus}>Status atual: </Text>
                        <Text style={[styles.valueStatus, { color: pet.status === 'ADOTADO' ? 'green' : '#2D68A6' }]}>
                            {pet.status}
                        </Text>
                    </View>
                    <Text style={styles.petId}>Cod: #{pet.id}</Text>
                </View>
            </View>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Candidatos ({candidatos.length})</Text>

        {candidatos.length === 0 ? (
            <View style={{padding: 20, alignItems:'center'}}>
                <Text style={{color: '#999'}}>Nenhum pedido de adoção recebido ainda.</Text>
            </View>
        ) : (
            <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.candidatesScroll}>
                    {candidatos.map((cand) => (
                        <TouchableOpacity 
                            key={cand.id} 
                            style={[styles.candidateTab, selectedPedidoId === cand.id && styles.candidateTabActive]}
                            onPress={() => setSelectedPedidoId(cand.id)}
                        >
                            <Text style={[styles.candidateNameTab, selectedPedidoId === cand.id && styles.candidateNameTabActive]}>
                                {cand.account.nome.split(' ')[0]} 
                            </Text>
                            <Text style={[styles.candidateStatusTab, { color: cand.status === 'APROVADO' ? 'green' : cand.status === 'RECUSADO' ? 'red' : '#666'}]}>
                                {cand.status}
                            </Text>
                            <Text style={{fontSize: 9, color:'#999'}}>{formatDate(cand.dataPedido)}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {candidatoSelecionado && (
                    <View style={styles.detailsContainer}>
                        
                        {!isPendente(candidatoSelecionado.status) && (
                            <View style={[styles.statusBanner, { backgroundColor: candidatoSelecionado.status === 'APROVADO' ? '#E8F5E9' : '#FFEBEE' }]}>
                                <Text style={{color: candidatoSelecionado.status === 'APROVADO' ? 'green' : 'red', fontWeight: 'bold'}}>
                                    PEDIDO {candidatoSelecionado.status}
                                </Text>
                            </View>
                        )}

                        <Text style={styles.groupTitle}>Contato</Text>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.fieldLabel}>NOME</Text>
                                <Text style={styles.fieldValue}>{candidatoSelecionado.account.nome}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.fieldLabel}>TELEFONE</Text>
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <Text style={styles.fieldValue}>{candidatoSelecionado.account.telefone}</Text>
                                    <Ionicons name="logo-whatsapp" size={16} color="green" style={{marginLeft:5}}/>
                                </View>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.fieldLabel}>E-MAIL</Text>
                                <Text style={styles.fieldValue}>{candidatoSelecionado.account.email}</Text>
                            </View>
                        </View>

                        <Text style={[styles.groupTitle, {marginTop: 20}]}>Localização</Text>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.fieldLabel}>LOCALIZAÇÃO</Text>
                                <Text style={styles.fieldValue}>
                                    {candidatoSelecionado.account.cidade} - {candidatoSelecionado.account.estado}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.fieldLabel}>ENDEREÇO</Text>
                                <Text style={styles.fieldValue}>
                                    {candidatoSelecionado.account.rua}, {candidatoSelecionado.account.numero}
                                    {candidatoSelecionado.account.complemento ? ` - ${candidatoSelecionado.account.complemento}` : ''}
                                </Text>
                                <Text style={{fontSize:12, color:'#777'}}>{candidatoSelecionado.account.bairro}</Text>
                            </View>
                        </View>

                        <Text style={[styles.groupTitle, {marginTop: 20}]}>Respostas do Formulário</Text>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.fieldLabel}>TIPO DE IMÓVEL</Text>
                                <Text style={styles.fieldValue}>{candidatoSelecionado.formulario.tipoMoradia}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.fieldLabel}>OUTROS ANIMAIS</Text>
                                <Text style={styles.fieldValue}>
                                    {candidatoSelecionado.formulario.possuiOutrosAnimais ? 'Sim' : 'Não'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.fieldLabel}>PESSOAS NA CASA</Text>
                                <Text style={styles.fieldValue}>{candidatoSelecionado.formulario.pessoasNaCasa}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.fieldLabel}>HISTÓRICO / OBS</Text>
                                <Text style={styles.fieldValue}>
                                    {String(candidatoSelecionado.formulario.historicoAnimais || "-").replace(/[{}"\\]/g, ' ')}
                                </Text>
                            </View>
                        </View>

                    </View>
                )}
            </>
        )}
      </ScrollView>

      {/* FOOTER BOTOES */}
      {candidatoSelecionado && isPendente(candidatoSelecionado.status) && (
          <View style={styles.footerActions}>
             <TouchableOpacity 
                style={[styles.btnReprovar, updating && {opacity:0.6}]} 
                disabled={updating}
                onPress={() => Alert.alert("Confirmar", "Reprovar candidato?", [{text:"Não"}, {text:"Sim", onPress:()=>handleUpdateStatus('RECUSADO')}])}
             >
                {updating ? <ActivityIndicator color="#FFF"/> : <Text style={styles.btnText}>Reprovar</Text>}
             </TouchableOpacity>
             
             <TouchableOpacity 
                style={[styles.btnAprovar, updating && {opacity:0.6}]} 
                disabled={updating}
                onPress={() => Alert.alert("Confirmar", "Aprovar adoção?", [{text:"Não"}, {text:"Sim", onPress:()=>handleUpdateStatus('APROVADO')}])}
             >
                {updating ? <ActivityIndicator color="#FFF"/> : <Text style={styles.btnText}>Aprovar Adoção</Text>}
             </TouchableOpacity>
          </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerSafe: { backgroundColor: '#FFF', borderBottomWidth:1, borderBottomColor:'#EEE' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, paddingTop: 10 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A3C6E' },
  petSection: { flexDirection: 'row', padding: 20, backgroundColor: '#F9FCFF', margin: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E6F0FA' },
  petImage: { width: 100, height: 100, borderRadius: 10, marginRight: 15, backgroundColor: '#CCC' },
  petInfo: { flex: 1, justifyContent: 'center' },
  petName: { fontSize: 20, fontWeight: 'bold', color: '#2D68A6' },
  labelStatus: { fontSize: 12, color: '#666', fontWeight: 'bold' },
  valueStatus: { fontSize: 12, fontWeight: 'bold' },
  petId: { fontSize: 10, color: '#CCC', marginTop: 8 },
  divider: { height: 1, backgroundColor: '#DDD', marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D68A6', marginLeft: 20, marginBottom: 15 },
  candidatesScroll: { paddingHorizontal: 20, marginBottom: 20 },
  candidateTab: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#2D68A6', marginRight: 10, backgroundColor: '#FFF', minWidth: 120 },
  candidateTabActive: { backgroundColor: '#E7F1FC', borderWidth: 2 },
  candidateNameTab: { fontSize: 14, fontWeight: 'bold', color: '#2D68A6' },
  candidateNameTabActive: { color: '#1A3C6E' },
  candidateStatusTab: { fontSize: 10, fontWeight:'bold', marginTop: 4 },
  detailsContainer: { paddingHorizontal: 25 },
  statusBanner: { padding: 10, alignItems: 'center', borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#EEE' },
  groupTitle: { fontSize: 14, color: '#2D68A6', fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 5 },
  row: { flexDirection: 'row', marginBottom: 12 },
  col: { flex: 1, paddingRight: 10 },
  fieldLabel: { fontSize: 10, color: '#1A3C6E', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
  fieldValue: { fontSize: 14, color: '#555' },
  footerActions: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: '#EEE', backgroundColor: '#FFF', gap: 15 },
  btnReprovar: { flex: 1, backgroundColor: '#E74C3C', paddingVertical: 12, borderRadius: 25, alignItems: 'center' },
  btnAprovar: { flex: 1, backgroundColor: '#27AE60', paddingVertical: 12, borderRadius: 25, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});