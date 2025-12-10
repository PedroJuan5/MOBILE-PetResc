import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, 
  ActivityIndicator, Alert, Share, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '@/lib/axios';

// Interface do Animal
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
  ficha?: { temperamento?: string; sociabilidade?: string; };
  account: { nome: string; ong?: { nome?: string; cidade?: string; estado?: string; } } | null;
}

export default function DetalhesPetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  
  const [pet, setPet] = useState<AnimalDetalhado | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // 1. BUSCA OS DETALHES
  useEffect(() => {
    async function fetchPet() {
      if (!id) return;
      try {
        const response = await api.get(`/animais/${id}`);
        setPet(response.data);
      } catch (error) {
        // Se der erro, volta silenciosamente ou avisa
        console.log("Erro fetch pet:", error);
        Alert.alert("Atenção", "Não foi possível carregar os dados.");
        router.back();
      } finally {
        setLoading(false);
      }
    }
    fetchPet();
  }, [id]);

  // 2. LÓGICA INTELIGENTE DO BOTÃO "TENHO INTERESSE"
  const handleInterest = async () => {
    if (!pet) return;
    setSending(true);

    try {
        const userRes = await api.get('/usuarios/me');
        const user = userRes.data;

        if (!user.tipoMoradia || !user.pessoasNaCasa) {
            setSending(false);
            router.push({
                pathname: '/(app)/formulario-interesse',
                params: { animalId: pet.id }
            } as any);
            return;
        }

        Alert.alert(
            "Confirmar Interesse",
            `Você já possui um perfil preenchido. Deseja usar seus dados atuais para solicitar a adoção de ${pet.nome}?`,
            [
                { 
                    text: "Revisar dados", 
                    style: "cancel", 
                    onPress: () => {
                        setSending(false);
                        router.push({
                            pathname: '/(app)/formulario-interesse',
                            params: { animalId: pet.id }
                        } as any);
                    }
                },
                { 
                    text: "Sim, enviar pedido", 
                    onPress: () => enviarPedidoDireto(user) 
                }
            ]
        );

    } catch (error) {
        console.error(error);
        setSending(false);
        // Se der erro ao buscar usuário, manda pro form por segurança
        router.push({
            pathname: '/(app)/formulario-interesse',
            params: { animalId: pet.id }
        } as any);
    }
  };

  const enviarPedidoDireto = async (user: any) => {
    try {
        const payload = {
            animalId: pet!.id,
            respostasFormulario: {
                tipoMoradia: user.tipoMoradia,
                pessoasNaCasa: user.pessoasNaCasa,
                alergias: user.alergias || "nao",
                possuiOutrosAnimais: "nao", 
                historicoAnimais: "{}",
                quintalTelado: "Não informado",
                janelasTeladas: "Não informado",
                moradiaPropria: "Não informado",
                todosConcordam: "Sim",
                criancasEmCasa: "Não informado",
                horasSozinho: "0",
                rotinaPasseios: "Não informado",
                quemCuidara: "Eu mesmo",
                teveAnimaisAntes: "Não informado",
                temVeterinario: "Não informado",
                cienteCustos: "Sim",
                motivoAdocao: "Interesse via botão rápido",
                observacoes: "",
                portesAceitos: "[]",
                animaisAceitos: "[]",
                tipoPetInteresse: "[]",
                preferenciaSexo: "Indiferente",
                idAnimalInteresse: pet!.id
            }
        };

        await api.post('/pedidos-adocao', payload);
        
        Alert.alert("Sucesso!", "Sua solicitação foi enviada!", [
            { text: "OK", onPress: () => router.back() }
        ]);

    } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível enviar a solicitação.");
    } finally {
        setSending(false);
    }
  };

  const handleShare = async () => {
    try {
        await Share.share({ message: `Olha esse pet: ${pet?.nome} no PetResc!` });
    } catch (error) {}
  };

  if (loading) return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><ActivityIndicator size="large" color="#2D68A6"/></View>;
  if (!pet) return null;

  const nomeDono = pet.account?.ong?.nome || pet.account?.nome || "ONG Parceira";
  const localizacao = pet.account?.ong?.cidade ? `${pet.account.ong.cidade} - ${pet.account.ong.estado}` : "Local não informado";
  
  // --- CORREÇÃO DO ERRO AQUI ---
  // Se tiver fotoURL, usa ela. Se não, usa uma imagem genérica da web para não quebrar.
  const imagemSource = pet.photoURL 
    ? { uri: pet.photoURL } 
    : { uri: 'https://placehold.co/400x400/png?text=Sem+Foto&font=roboto' }; 

  const idadeTexto = pet.idade === null ? "Não inf." : pet.idade <= 1 ? "Filhote" : "Adulto";

  const tagsSaude = [];
  if (pet.vacinado) tagsSaude.push("Vacinado");
  if (pet.vermifugado) tagsSaude.push("Vermifugado");
  if (pet.castrado) tagsSaude.push("Castrado");
  if (tagsSaude.length === 0) tagsSaude.push("Sem info veterinária");

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={imagemSource} style={styles.petImage} resizeMode="cover" />
        <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}><Ionicons name="arrow-back" size={24} color="#2D68A6" /></TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.iconButton}><Ionicons name="share-social-outline" size={24} color="#2D68A6" /></TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerInfo}>
            <View style={{flex: 1}}>
                <Text style={styles.petName}>{pet.nome}</Text>
                <Text style={styles.petBreed}>{pet.raca || "SRD"} • {pet.porte || "Médio"}</Text>
            </View>
            <View style={styles.genderIcon}>
                <Ionicons name={pet.sexo === 'MACHO' ? 'male' : 'female'} size={24} color={pet.sexo === 'MACHO' ? '#2D68A6' : '#E91E63'} />
            </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.statsContainer}>
            <View style={styles.statItem}><Text style={styles.statLabel}>Idade</Text><Text style={styles.statValue}>{idadeTexto}</Text></View>
            <View style={styles.statItem}><Text style={styles.statLabel}>Cor</Text><Text style={styles.statValue}>{pet.corPredominante || "Várias"}</Text></View>
            <View style={styles.statItem}><Text style={styles.statLabel}>Peso</Text><Text style={styles.statValue}>N/A</Text></View>
        </View>
        <View style={styles.divider} />
        <View style={styles.ownerContainer}>
            <View style={styles.ownerAvatar}><Ionicons name="business" size={24} color="#FFF" /></View>
            <View style={styles.ownerInfo}>
                <Text style={styles.ownerName}>{nomeDono}</Text>
                <Text style={styles.ownerLocation}><Ionicons name="location-outline" size={12} /> {localizacao}</Text>
            </View>
        </View>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Sobre {pet.nome}</Text>
        <Text style={styles.descriptionText}>{pet.descricao || "Sem descrição detalhada."}</Text>
        <Text style={[styles.sectionTitle, {marginTop: 20}]}>Saúde</Text>
        <View style={styles.tagContainer}>{tagsSaude.map((t, i) => (<View key={i} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>))}</View>
        <View style={{height: 100}} /> 
      </ScrollView>

      {/* BOTÃO FIXO */}
      <View style={styles.footerAction}>
        <TouchableOpacity 
            style={[styles.adoptButton, sending && {backgroundColor: '#ccc'}]} 
            onPress={handleInterest}
            disabled={sending}
        >
            {sending ? (
                <ActivityIndicator color="#FFF" />
            ) : (
                <>
                    <Text style={styles.adoptButtonText}>TENHO INTERESSE</Text>
                    <Ionicons name="paw" size={20} color="#FFF" style={{marginLeft: 10}} />
                </>
            )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  imageContainer: { height: 350, width: '100%', position: 'relative' },
  petImage: { width: '100%', height: '100%' },
  headerButtons: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  contentContainer: { flex: 1, marginTop: -40, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 25, paddingTop: 30 },
  headerInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petName: { fontSize: 28, fontWeight: 'bold', color: '#2D68A6' },
  petBreed: { fontSize: 16, color: '#666', marginTop: 4 },
  genderIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F0F6FA', justifyContent: 'center', alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', backgroundColor: '#F8F9FA', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, minWidth: 90 },
  statLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  ownerContainer: { flexDirection: 'row', alignItems: 'center' },
  ownerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#2D68A6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  ownerInfo: { flex: 1 },
  ownerName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  ownerLocation: { fontSize: 12, color: '#666', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  descriptionText: { fontSize: 15, color: '#666', lineHeight: 24, textAlign: 'justify' },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#E3F2FD', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  tagText: { color: '#2D68A6', fontWeight: 'bold', fontSize: 12 },
  footerAction: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', paddingHorizontal: 25, paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
  adoptButton: { backgroundColor: '#2D68A6', borderRadius: 15, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  adoptButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});