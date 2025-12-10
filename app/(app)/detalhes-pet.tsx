import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, 
<<<<<<< HEAD
  ActivityIndicator, Alert, Share, Platform, StatusBar 
=======
  ActivityIndicator, Alert, Share, Dimensions, Modal 
>>>>>>> 2f09d3452f70bebcd49ec47d2599d8800dbef6ba
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '@/lib/axios';

interface AnimalDetalhado {
  id: number;
  nome: string;
  especie: string;
  raca: string | null;
  idade: number | null;
  sexo: string | null;
  porte: string | null;
  descricao: string | null;
  photoURL: string | null;
  corPredominante: string | null;
  status: string;
  vacinado: boolean;
  vermifugado: boolean;
  castrado: boolean;
  sociabilidade?: string | null;
  ficha?: { temperamento?: string; saude?: string; };
  account: { nome: string; ong?: { nome?: string; cidade?: string; estado?: string }; } | null;
}

export default function DetalhesPetUsuarioScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  
  const [pet, setPet] = useState<AnimalDetalhado | null>(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [sending, setSending] = useState(false);
  const [pedidoConcluido, setPedidoConcluido] = useState(false);
  
  // NOVO STATE: Controla se é favorito
  const [isFavorito, setIsFavorito] = useState(false);
=======
  
  // Estado para controlar a visibilidade do Modal
  const [modalVisible, setModalVisible] = useState(false);
>>>>>>> 2f09d3452f70bebcd49ec47d2599d8800dbef6ba

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        // 1. Busca dados do Animal
        const responsePet = await api.get(`/animais/${id}`);
        setPet(responsePet.data);

        // 2. Busca se já é favorito
        try {
            const responseFavs = await api.get('/favoritar/meus');
            const meusFavoritos = responseFavs.data;
            const estaNaLista = meusFavoritos.some((fav: any) => fav.animalId === Number(id));
            setIsFavorito(estaNaLista);
        } catch (e) {
            console.log("Erro ao checar favoritos", e);
        }

        // 3. BUSCA SE JÁ EXISTE PEDIDO DE ADOÇÃO (A Correção é Aqui)
        try {
            // Nota: Confirme se a rota é '/pedidos-adocao/meus-pedidos' ou '/usuarios/me/pedidos'
            // Baseado no seu Web app, usei a rota abaixo:
            const responsePedidos = await api.get('/pedidos-adocao/meus-pedidos');
            
            // O backend retorna um array de pedidos, cada um contendo um objeto 'animal' com 'id'
            const jaPediu = responsePedidos.data.some((pedido: any) => pedido.animal.id === Number(id));
            
            if (jaPediu) {
                setPedidoConcluido(true);
            }
        } catch (e) {
            console.log("Erro ao checar pedidos existentes", e);
        }

      } catch (error) {
<<<<<<< HEAD
        console.log("Erro ao carregar dados principais:", error);
        // Alert.alert("Erro", "Não foi possível carregar o animal."); 
=======
        console.log("Erro fetch pet:", error);
        Alert.alert("Atenção", "Não foi possível carregar os dados.");
        router.back();
>>>>>>> 2f09d3452f70bebcd49ec47d2599d8800dbef6ba
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

<<<<<<< HEAD
  // --- LÓGICA DE FAVORITAR ---
  const handleToggleFavorite = async () => {
    if (!pet) return;

    const estadoAnterior = isFavorito;
    setIsFavorito(!estadoAnterior);

    try {
        if (estadoAnterior) {
            await api.delete(`/favoritar/${pet.id}`);
        } else {
            await api.post(`/favoritar/${pet.id}`);
        }
    } catch (error) {
        console.error("Erro ao favoritar:", error);
        setIsFavorito(estadoAnterior); 
        Alert.alert("Erro", "Não foi possível alterar o favorito.");
    }
  };

  // --- LÓGICA DO BOTÃO "TENHO INTERESSE" ---
  const handleInterest = async () => {
    if (!pet) return;
    setSending(true);

    try {
        const { data: user } = await api.get('/usuarios/me', { timeout: 5000 });

        if (Platform.OS === 'web') {
            const confirmacao = window.confirm(`Enviar pedido para ${pet.nome}?`);
            if (confirmacao) {
                await enviarPedidoDireto(user);
            } else {
                setSending(false);
            }
        } else {
            Alert.alert(
                "Confirmar",
                `Enviar pedido para ${pet.nome}?`,
                [
                    { text: "Cancelar", onPress: () => setSending(false) },
                    { text: "Enviar", onPress: () => enviarPedidoDireto(user) }
                ]
            );
        }
    } catch (error: any) {
        console.error("ERRO AO BUSCAR USUÁRIO:", error);
        Alert.alert("Erro", "Falha ao verificar perfil.");
        setSending(false);
    }
  };

  const enviarPedidoDireto = async (user: any) => {
    try {
        const payload = {
            animalId: pet!.id,
            respostasFormulario: {
                tipoMoradia: user.tipoMoradia || "Não informado",
                pessoasNaCasa: user.pessoasNaCasa ? String(user.pessoasNaCasa) : "1",
                alergias: user.alergias || "nao",
                possuiOutrosAnimais: "nao", 
                historicoAnimais: "{}", 
                quintalTelado: "nao",
                janelasTeladas: "nao",
                moradiaPropria: "nao",
                todosConcordam: "sim",
                criancasEmCasa: "nao",
                horasSozinho: "0",
                rotinaPasseios: "A combinar",
                quemCuidara: "Eu mesmo",
                teveAnimaisAntes: "nao",
                temVeterinario: "nao",
                cienteCustos: "sim",
                motivoAdocao: "Mobile App",
                observacoes: `Tel: ${user.telefone}`,
                portesAceitos: "[]",
                animaisAceitos: "[]",
                tipoPetInteresse: "[]",
                preferenciaSexo: "Indiferente",
                idAnimalInteresse: pet!.id
            }
        };

        await api.post('/pedidos-adocao', payload, { timeout: 10000 });
        setPedidoConcluido(true); 
        Alert.alert("Sucesso! 🎉", "O seu pedido foi enviado ao doador.");

    } catch (error: any) {
        // Se o erro for "já existe", a gente marca como concluído também
        if (error.response?.data?.message?.includes('já existe') || error.response?.status === 400) {
             setPedidoConcluido(true);
             Alert.alert("Aviso", "Você já enviou um pedido para este pet.");
        } else {
            console.error("ERRO NO ENVIO:", error?.response?.data || error.message);
            Alert.alert("Erro", "Falha ao enviar o pedido.");
        }
    } finally {
        setSending(false);
    }
=======
  // 2. FUNÇÃO PARA ABRIR O MODAL
  const handleInterest = () => {
    if (!pet) return;
    setModalVisible(true);
  };

  // 3. FUNÇÃO PARA IR PARA O FORMULÁRIO (CORRIGIDA)
  const handleConfirmInterest = () => {
    setModalVisible(false);
    
    // Redireciona para o formulário na raiz de 'app/'
    router.push({
        pathname: '/formulario-interesse', // <--- CAMINHO CORRIGIDO
        params: { animalId: pet?.id }
    } as any);
>>>>>>> 2f09d3452f70bebcd49ec47d2599d8800dbef6ba
  };

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#2D68A6" /></View>;
  if (!pet) return null;

  const visualData = {
    info: `${pet.sexo === 'MACHO' ? 'Macho' : 'Fêmea'} • ${pet.idade === null ? "Idade N/A" : pet.idade <= 1 ? "Filhote" : "Adulto"} • ${pet.raca || "SRD"}`,
    idade: pet.idade === null ? "N/A" : pet.idade <= 1 ? "Filhote" : "Adulto",
    porte: pet.porte || "Médio",
    cor: pet.corPredominante || "Várias"
  };

  const imagemSource = pet.photoURL ? { uri: pet.photoURL } : require('../../assets/images/pets/branquinho.png');
  const nomeDono = pet.account?.ong?.nome || pet.account?.nome || "ONG Parceira";
<<<<<<< HEAD
=======
  const localizacao = pet.account?.ong?.cidade ? `${pet.account.ong.cidade} - ${pet.account.ong.estado}` : "Local não informado";
  
  const imagemSource = pet.photoURL 
    ? { uri: pet.photoURL } 
    : { uri: 'https://placehold.co/400x400/png?text=Sem+Foto&font=roboto' }; 
>>>>>>> 2f09d3452f70bebcd49ec47d2599d8800dbef6ba

  const tagsSaude: string[] = [];
  if (pet.vacinado) tagsSaude.push("Vacinado");
  if (pet.vermifugado) tagsSaude.push("Vermifugado");
  if (pet.castrado) tagsSaude.push("Castrado");
  if (tagsSaude.length === 0) tagsSaude.push("Sem info veterinária");

  return (
<<<<<<< HEAD
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerBackground}>
          
          <View style={styles.topNavigation}>
            <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="#2D68A6" />
            </TouchableOpacity>
=======
    <View style={styles.container}>
      
      {/* --- MODAL DE CONFIRMAÇÃO --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
                <Ionicons name="paw" size={40} color="#2D68A6" />
            </View>
            <Text style={styles.modalTitle}>Oba! Vamos adotar?</Text>
            <Text style={styles.modalText}>
              Você será redirecionado para um breve formulário de interesse para adotar o(a) <Text style={{fontWeight: 'bold'}}>{pet.nome}</Text>.
            </Text>
            
            <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleConfirmInterest}>
              <Text style={styles.modalButtonText}>Preencher Formulário</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* --------------------------- */}

      <View style={styles.imageContainer}>
        <Image source={imagemSource} style={styles.petImage} resizeMode="cover" />
        <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}><Ionicons name="arrow-back" size={24} color="#2D68A6" /></TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.iconButton}><Ionicons name="share-social-outline" size={24} color="#2D68A6" /></TouchableOpacity>
        </View>
      </View>
>>>>>>> 2f09d3452f70bebcd49ec47d2599d8800dbef6ba

            <TouchableOpacity style={styles.navButton} onPress={handleToggleFavorite}>
                <Ionicons 
                    name={isFavorito ? "heart" : "heart-outline"} 
                    size={30} 
                    color={isFavorito ? "#FF3B30" : "#2D68A6"} 
                />
            </TouchableOpacity>
          </View>

<<<<<<< HEAD
          <View style={styles.topContentRow}>
            <View style={styles.leftColumn}>
              <Image source={imagemSource} style={styles.petAvatar} />
              <View style={styles.adoptionStatusBtn}><Text style={styles.adoptionStatusText}>Para adoção</Text></View>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.petName}>{pet.nome}</Text>
              <Text style={styles.petSubInfo}>{visualData.info}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ color: '#34C759', fontSize: 20, lineHeight: 20 }}>• </Text>
                <Text style={styles.petStatus}>{pet.status}</Text>
              </View>
              <Text style={styles.commentLabel}>Sobre o pet</Text>
              <Text style={styles.commentText}>{pet.descricao || "Sem descrição disponível."}</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Características</Text>
          <View style={styles.divider} />
          <View style={styles.charRow}><Text style={styles.charLabel}>RAÇA</Text><Text style={styles.charValue}>{pet.raca || "SRD"}</Text></View>
          <View style={styles.charRow}><Text style={styles.charLabel}>IDADE</Text><Text style={styles.charValue}>{visualData.idade}</Text></View>
          <View style={styles.charRow}><Text style={styles.charLabel}>PORTE</Text><Text style={styles.charValue}>{visualData.porte}</Text></View>
          <View style={styles.charRow}><Text style={styles.charLabel}>COR</Text><Text style={styles.charValue}>{visualData.cor}</Text></View>

          {/* BOTÃO ATUALIZADO */}
          <TouchableOpacity
            style={[
                styles.contactButton,
                sending && { backgroundColor: "#A0A0A0" },
                pedidoConcluido && { backgroundColor: "#34C759" }
            ]}
            onPress={handleInterest}
            disabled={sending || pedidoConcluido}
          >
            {sending ? (
                <ActivityIndicator color="#fff" size="small" />
            ) : pedidoConcluido ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.contactButtonText}>PEDIDO FEITO</Text>
                </View>
            ) : (
                <Text style={styles.contactButtonText}>TENHO INTERESSE</Text>
            )}
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Cuidados veterinários</Text>
          <View style={styles.divider} />
          <View style={styles.tagContainer}>
            {tagsSaude.map((t, i) => <View key={i} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>)}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Temperamento</Text>
          <View style={styles.divider} />
          <View style={styles.tagContainer}>
            {pet.ficha?.temperamento ? pet.ficha.temperamento.split(',').map((t, i) => (
              <View key={i} style={styles.tag}><Text style={styles.tagText}>{t.trim()}</Text></View>
            )) : <View style={styles.tag}><Text style={styles.tagText}>Dócil</Text></View>}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Doador</Text>
          <View style={styles.divider} />
          <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>{nomeDono}</Text>
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
=======
      {/* BOTÃO FIXO */}
      <View style={styles.footerAction}>
        <TouchableOpacity 
            style={styles.adoptButton} 
            onPress={handleInterest}
        >
            <Text style={styles.adoptButtonText}>TENHO INTERESSE</Text>
            <Ionicons name="paw" size={20} color="#FFF" style={{marginLeft: 10}} />
        </TouchableOpacity>
      </View>
>>>>>>> 2f09d3452f70bebcd49ec47d2599d8800dbef6ba
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBackground: { backgroundColor: '#DCE9F5', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 50, paddingBottom: 25, paddingHorizontal: 20 },
  topNavigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  navButton: { padding: 5 },
  topContentRow: { flexDirection: 'row' },
  leftColumn: { marginRight: 15, alignItems: 'center' },
  rightColumn: { flex: 1, paddingTop: 5 },
  petAvatar: { width: 130, height: 130, borderRadius: 20, marginBottom: 8 },
  adoptionStatusBtn: { backgroundColor: '#2D68A6', width: 130, paddingVertical: 6, borderRadius: 20, alignItems: 'center' },
  adoptionStatusText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  petName: { fontSize: 24, fontWeight: 'bold', color: '#2D68A6', marginBottom: 2 },
  petSubInfo: { fontSize: 13, color: '#2D68A6', fontWeight: '500', marginBottom: 2 },
  petStatus: { fontSize: 14, color: '#2D68A6', fontWeight: '600' },
  commentLabel: { fontSize: 12, fontWeight: 'bold', color: '#2D68A6', marginTop: 8, marginBottom: 2 },
  commentText: { fontSize: 10, color: '#555', lineHeight: 14, fontStyle: 'italic' },
  contentContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D68A6' },
  divider: { height: 1, backgroundColor: '#DCE9F5', marginVertical: 10 },
  charRow: { marginBottom: 12 },
  charLabel: { fontSize: 12, fontWeight: 'bold', color: '#2D68A6', textTransform: 'uppercase' },
  charValue: { fontSize: 15, color: '#2D68A6', marginTop: 2 },
  contactButton: { backgroundColor: '#2D68A6', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 15, width: '100%', elevation: 2 },
  contactButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#94B9D8', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  tagText: { color: '#2D68A6', fontWeight: 'bold', fontSize: 12 },
<<<<<<< HEAD
=======
  footerAction: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', paddingHorizontal: 25, paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
  adoptButton: { backgroundColor: '#2D68A6', borderRadius: 15, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  adoptButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  // --- ESTILOS DO MODAL ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    marginBottom: 15,
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 50,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D68A6',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButtonConfirm: {
    backgroundColor: '#2D68A6',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtonCancel: {
    paddingVertical: 10,
  },
  modalButtonCancelText: {
    color: '#999',
    fontSize: 16,
  },
>>>>>>> 2f09d3452f70bebcd49ec47d2599d8800dbef6ba
});