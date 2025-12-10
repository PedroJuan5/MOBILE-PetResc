import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, 
  Image, ImageBackground, Dimensions, TextInput, Modal, Alert, 
  ActivityIndicator, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

// --- IMPORTANTE: Ajuste o caminho para onde está seu arquivo Axios.ts ---
// Exemplo: se Axios.ts está em src/lib/Axios.ts
import api from '@/lib/axios'; 
// Ou caminho relativo: import api from '../../../lib/Axios';

import { DenuncieModal } from "../../../components/denuncieModal";
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';

const COLORS = {
  primary: '#2D68A6',    
  secondary: '#94B9D8',  
  lightBox: '#B4CDE3',  
  textDark: '#2D68A6',
  white: '#FFFFFF',
  grayBg: '#F0F4F8'      
};

// Interface baseada no retorno do seu Prisma/Controller
interface Campanha {
  id: number;
  titulo: string;
  metaFinanceira: number;
  dataLimite: string; // Vem como string ISO do banco
  imagemUrl: string | null;
  ong?: {
      nome: string;
      cidade: string;
      estado: string;
  };
}

export default function DoacoesOngScreen() {
  const router = useRouter();
  
  // ESTADOS DE CONTROLE
  const [step, setStep] = useState(1);
  const [denunciaVisivel, setDenunciaVisivel] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // DADOS
  const [minhasCampanhas, setMinhasCampanhas] = useState<Campanha[]>([]);

  // ESTADOS DO FORMULÁRIO DE DOAÇÃO (Simulação)
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [totalArrecadado, setTotalArrecadado] = useState(0); 

  // ESTADOS DA NOVA CAMPANHA
  const [campanhaNome, setCampanhaNome] = useState('');
  const [campanhaData, setCampanhaData] = useState('');
  const [campanhaMeta, setCampanhaMeta] = useState('');
  const [campanhaDesc, setCampanhaDesc] = useState('');
  const [campanhaImagem, setCampanhaImagem] = useState<string | null>(null);

  // --- 1. BUSCAR CAMPANHAS (GET) ---
  const fetchCampanhas = async () => {
    try {
      setLoading(true);
      // O Axios.ts já injeta o Token via interceptor
      const response = await api.get('/campanha/minhas');
      setMinhasCampanhas(response.data);
    } catch (error: any) {
      console.error("Erro ao buscar campanhas:", error);
      if (error.response?.status === 401) {
          Alert.alert("Sessão Expirada", "Faça login novamente.");
          // Aqui você poderia redirecionar para login
      } else {
          Alert.alert("Erro", "Não foi possível carregar as campanhas.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampanhas();
  }, []);

  // --- 2. PREPARAR IMAGEM ---
  const pickImageCampanha = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7, // Otimização
    });
    if (!result.canceled) setCampanhaImagem(result.assets[0].uri);
  };

  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setCampanhaData(formatted);
  };

  // --- 3. CRIAR CAMPANHA (POST com FormData) ---
  const handleCriarCampanha = async () => {
    if (!campanhaNome || !campanhaMeta || !campanhaData || !campanhaImagem) {
        Alert.alert("Campos incompletos", "Preencha todos os campos e adicione uma imagem.");
        return;
    }

    // Formatar Data: DD/MM/AAAA -> YYYY-MM-DD
    const [dia, mes, ano] = campanhaData.split('/');
    if (!dia || !mes || !ano || ano.length !== 4) {
       Alert.alert("Data inválida", "Use o formato DD/MM/AAAA");
       return;
    }
    const dataFormatadaISO = `${ano}-${mes}-${dia}`;

    // Formatar Moeda: Remover pontos de milhar, trocar virgula por ponto
    const metaClean = campanhaMeta.replace(/\./g, '').replace(',', '.');

    setLoading(true);

    try {
        const formData = new FormData();
        
        // Em React Native FormData, tudo deve ser string
        formData.append('titulo', campanhaNome);
        formData.append('descricao', campanhaDesc);
        formData.append('meta_financeira', metaClean);
        formData.append('data_limite', dataFormatadaISO);
        formData.append('itens_descricao', JSON.stringify([])); 

        // Preparar arquivo de imagem
        const filename = campanhaImagem.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        // @ts-ignore: O TypeScript reclama do objeto de arquivo no RN, mas é assim que funciona
        formData.append('imagem', {
            uri: Platform.OS === 'android' ? campanhaImagem : campanhaImagem.replace('file://', ''),
            name: filename || 'campanha.jpg',
            type
        });

        // Envio POST
        await api.post('/campanha', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        Alert.alert("Sucesso", "Campanha criada!");
        
        // Resetar estados
        setCampanhaNome('');
        setCampanhaData('');
        setCampanhaMeta('');
        setCampanhaDesc('');
        setCampanhaImagem(null);
        setStep(1); // Voltar para dashboard
        fetchCampanhas(); // Atualizar lista

    } catch (error: any) {
        console.error("Erro ao criar:", error);
        const msg = error.response?.data?.message || "Erro ao conectar com o servidor.";
        Alert.alert("Erro", msg);
    } finally {
        setLoading(false);
    }
  };

  // --- FORMATAÇÃO DE MOEDA VISUAL ---
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // --- RENDERIZADORES ---

  const renderCampanhaItem = (item: Campanha) => (
      <View key={item.id} style={styles.cardCampanha}>
          {item.imagemUrl && (
              <Image source={{ uri: item.imagemUrl }} style={styles.cardImg} />
          )}
          <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.titulo}</Text>
              <Text style={styles.cardMeta}>Meta: R$ {formatCurrency(item.metaFinanceira)}</Text>
              <Text style={styles.cardData}>
                  Vence: {new Date(item.dataLimite).toLocaleDateString('pt-BR')}
              </Text>
          </View>
      </View>
  );

  // RENDER: DASHBOARD (STEP 1)
  const renderDashboardContent = () => (
    <View style={{ paddingBottom: 100 }}>
      <View style={styles.introSection}>
        <Text style={styles.pageTitle}>Painel da ONG</Text>
        <Text style={styles.introText}>Gerencie suas campanhas ativas</Text>
        <TouchableOpacity style={styles.mainButton} onPress={() => setStep(2)}>
            <Text style={styles.mainButtonText}>NOVA CAMPANHA</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
            <View style={styles.gridBox}>
                <Text style={styles.gridNumber}>{minhasCampanhas.length}</Text>
                <Text style={styles.gridLabel}>Campanhas</Text>
            </View>
            <Image source={require('../../../assets/images/pets/shanti.png')} style={styles.gridImage} />
        </View>
      </View>

      <View style={styles.listaSection}>
          <Text style={styles.sectionTitle}>Minhas Campanhas</Text>
          {loading ? (
              <ActivityIndicator color={COLORS.primary} size="large" />
          ) : minhasCampanhas.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma campanha encontrada.</Text>
          ) : (
              minhasCampanhas.map(renderCampanhaItem)
          )}
      </View>
    </View>
  );

  // RENDER: NOVA CAMPANHA (STEP 2)
  const renderNewCampaignContent = () => (
    <View style={{ padding: 25, paddingBottom: 100 }}>
        <Text style={styles.ncIntroText}>Preencha os dados da campanha</Text>
        
        <View style={styles.ncInputGroup}>
            <Text style={styles.ncLabel}>Título:</Text>
            <TextInput style={styles.ncInput} placeholder="Título" placeholderTextColor="#aaa" value={campanhaNome} onChangeText={setCampanhaNome}/>
        </View>

        <View style={styles.ncInputGroup}>
            <Text style={styles.ncLabel}>Data Limite:</Text>
            <TextInput style={styles.ncInput} placeholder="DD/MM/AAAA" placeholderTextColor="#aaa" value={campanhaData} onChangeText={handleDateChange} keyboardType="numeric" maxLength={10}/>
        </View>

        <View style={styles.ncInputGroup}>
            <Text style={styles.ncLabel}>Meta (R$):</Text>
            <TextInput style={styles.ncInput} placeholder="0,00" placeholderTextColor="#aaa" keyboardType="numeric" value={campanhaMeta} onChangeText={setCampanhaMeta}/>
        </View>

        <View style={styles.ncInputGroup}>
            <Text style={styles.ncLabel}>Descrição:</Text>
            <TextInput style={[styles.ncInput, {height: 100, textAlignVertical: 'top', paddingTop: 10}]} multiline placeholder="Descrição..." placeholderTextColor="#aaa" value={campanhaDesc} onChangeText={setCampanhaDesc}/>
        </View>

        <View style={styles.ncInputGroup}>
             <Text style={styles.ncLabel}>Imagem:</Text>
             <TouchableOpacity style={styles.ncUploadBox} onPress={pickImageCampanha}>
                {campanhaImagem ? (
                    <Image source={{ uri: campanhaImagem }} style={styles.ncUploadedImage} />
                ) : (
                    <View style={{alignItems:'center'}}>
                        <Ionicons name="image-outline" size={40} color="#ccc" />
                        <Text style={styles.ncUploadText}>Selecionar Imagem</Text>
                    </View>
                )}
             </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.ncSubmitButton} onPress={handleCriarCampanha} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.primary}/> : <Text style={styles.ncSubmitText}>CRIAR CAMPANHA</Text>}
        </TouchableOpacity>
    </View>
  );

  // (STEP 3 - Doação - Mantido igual ao anterior, omitido aqui para brevidade se não for mudar a lógica)
  // ... Se precisar do código do Step 3 de volta, me avise, mas ele é apenas visual por enquanto.

  return (
    <SafeAreaView style={[styles.container, step === 2 && { backgroundColor: COLORS.primary }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={step === 2 ? "light-content" : "dark-content"} />
      <DenuncieModal visible={denunciaVisivel} onClose={() => setDenunciaVisivel(false)} />

      {step === 1 && (
        <View style={styles.headerBlock}>
            <CustomHeaderLeft onDenunciePress={() => setDenunciaVisivel(true)} />
            <CustomHeaderRight onNotificationPress={() => router.push('/(ong)/notificacao-ong' as any)} />
        </View>
      )}

      {step === 2 && (
        <View style={styles.ncHeaderBlock}>
            <TouchableOpacity onPress={() => setStep(1)}>
                <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.ncTitle}>Nova Campanha</Text>
            <View style={{width: 24}}/>
        </View>
      )}

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {step === 1 && renderDashboardContent()}
        {step === 2 && renderNewCampaignContent()}
        {/* {step === 3 && renderDonationFormContent()} */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerBlock: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  ncHeaderBlock: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFF', alignItems: 'center', borderBottomRightRadius: 20 },
  ncTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  
  introSection: { padding: 20, alignItems: 'center' },
  pageTitle: { fontSize: 24, color: COLORS.primary, fontWeight: 'bold' },
  introText: { color: COLORS.primary, marginBottom: 15 },
  mainButton: { backgroundColor: COLORS.primary, paddingHorizontal: 40, paddingVertical: 12, borderRadius: 25 },
  mainButtonText: { color: '#FFF', fontWeight: 'bold' },

  gridContainer: { paddingHorizontal: 20 },
  gridRow: { flexDirection: 'row', height: 120, justifyContent: 'space-between', marginBottom: 15 },
  gridImage: { width: '48%', height: '100%', borderRadius: 10 },
  gridBox: { width: '48%', height: '100%', backgroundColor: COLORS.lightBox, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  gridNumber: { fontSize: 30, fontWeight: 'bold', color: '#fff' },
  gridLabel: { color: '#fff' },

  listaSection: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
  
  cardCampanha: { flexDirection: 'row', backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10, marginBottom: 10, elevation: 2 },
  cardImg: { width: 70, height: 70, borderRadius: 8, marginRight: 10 },
  cardInfo: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  cardMeta: { fontSize: 14, color: '#666' },
  cardData: { fontSize: 12, color: '#999' },

  // Nova Campanha Styles
  ncIntroText: { color: '#FFF', textAlign: 'center', marginBottom: 20, fontSize: 16 },
  ncInputGroup: { marginBottom: 15 },
  ncLabel: { color: '#FFF', marginBottom: 5 },
  ncInput: { backgroundColor: '#FFF', borderRadius: 8, padding: 10, fontSize: 16 },
  ncUploadBox: { backgroundColor: '#FFF', height: 120, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  ncUploadedImage: { width: '100%', height: '100%', borderRadius: 8 },
  ncUploadText: { color: '#ccc', marginTop: 5 },
  ncSubmitButton: { backgroundColor: '#FFF', padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 20 },
  ncSubmitText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 }
});