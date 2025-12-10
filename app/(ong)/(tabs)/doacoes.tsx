import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Image,
  ImageBackground,
  Dimensions,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { DenuncieModal } from "../../../components/denuncieModal"; 
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';
import api from '@/lib/axios'; // Seu axios configurado

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2D68A6',    
  secondary: '#94B9D8',  
  lightBox: '#B4CDE3',   
  textDark: '#2D68A6',
  white: '#FFFFFF',
  grayBg: '#F0F4F8'      
};

export default function DoacoesOngScreen() {
  const router = useRouter();
  
  // ESTADOS DE CONTROLE
  const [step, setStep] = useState(1);
  const [denunciaVisivel, setDenunciaVisivel] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Novo estado de loading

  // ESTADOS DA NOVA CAMPANHA
  const [campanhaNome, setCampanhaNome] = useState('');
  const [campanhaData, setCampanhaData] = useState('');
  const [campanhaMeta, setCampanhaMeta] = useState('');
  const [campanhaDesc, setCampanhaDesc] = useState('');
  const [campanhaImagem, setCampanhaImagem] = useState<string | null>(null);

  // Estados Simulados da Dashboard (Visualização)
  const [totalArrecadado, setTotalArrecadado] = useState(7813);

  // --- HELPERS DE FORMATAÇÃO ---
  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setCampanhaData(formatted);
  };

  const convertDateToISO = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 10) return null;
    const [dia, mes, ano] = dateStr.split('/');
    return `${ano}-${mes}-${dia}`; // Formato YYYY-MM-DD
  };

  const pickImageCampanha = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8, // Qualidade reduzida para upload mais rápido
    });
    if (!result.canceled) setCampanhaImagem(result.assets[0].uri);
  };

  // --- INTEGRAÇÃO COM BACKEND: CRIAR CAMPANHA ---
  const handleCriarCampanha = async () => {
    // 1. Validação Básica
    if (!campanhaNome || !campanhaMeta || !campanhaData) {
        Alert.alert("Atenção", "Preencha Nome, Data Limite e Meta Financeira.");
        return;
    }

    setIsLoading(true);

    try {
        const formData = new FormData();

        // 2. Mapeamento de Campos (Frontend -> Backend)
        formData.append('titulo', campanhaNome);
        formData.append('descricao', campanhaDesc);
        
        // Converte "1.000,00" para "1000.00"
        const metaLimpa = campanhaMeta.replace(/\./g, '').replace(',', '.');
        formData.append('meta_financeira', metaLimpa);

        // Converte DD/MM/AAAA para YYYY-MM-DD
        const dataIso = convertDateToISO(campanhaData);
        if (!dataIso) {
            Alert.alert("Erro", "Data inválida. Use DD/MM/AAAA");
            setIsLoading(false);
            return;
        }
        formData.append('data_limite', dataIso);

        // Array vazio para itens (Opcional no seu back, mas bom enviar)
        formData.append('itens_descricao', '[]');

        // 3. Tratamento de Imagem
        if (campanhaImagem) {
            if (Platform.OS === 'web') {
                const res = await fetch(campanhaImagem);
                const blob = await res.blob();
                formData.append('imagem', blob, 'campanha.jpg');
            } else {
                const filename = campanhaImagem.split('/').pop() || 'campanha.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;
                // @ts-ignore
                formData.append('imagem', { uri: campanhaImagem, name: filename, type });
            }
        }

        // 4. Envio para API
        // Assumindo que a rota base para campanhas é '/campanhas'
        await api.post('/campanha', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Sucesso
        setIsLoading(false);
        setStep(1); // Volta para dashboard
        // Limpa campos
        setCampanhaNome('');
        setCampanhaMeta('');
        setCampanhaData('');
        setCampanhaDesc('');
        setCampanhaImagem(null);
        
        Alert.alert("Sucesso! 🎉", "Sua campanha foi criada e já está disponível.");

    } catch (error: any) {
        setIsLoading(false);
        console.error("Erro criar campanha:", error.response?.data || error);
        Alert.alert("Erro", error.response?.data?.message || "Não foi possível criar a campanha.");
    }
  };

  // --- RENDERIZADORES ---

  const renderDashboardContent = () => (
    <View style={{ paddingBottom: 100 }}>
      <View style={styles.introSection}>
        <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Gerencie suas Campanhas de Arrecadação</Text>
        </View>
        <Text style={styles.introText}>Crie campanhas para arrecadar fundos para ração, medicamentos ou cirurgias.</Text>
        
        <TouchableOpacity style={styles.mainButton} onPress={() => setStep(2)}>
            <Text style={styles.mainButtonText}>CRIAR NOVA CAMPANHA</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
            {/* Imagens estáticas ou vindas de uma lista de campanhas ativas (GET /campanhas/minhas) */}
            <Image source={require('../../../assets/images/pets/shanti.png')} style={styles.gridImage} />
            <View style={styles.gridBox}>
                <Text style={styles.gridNumber}>3</Text>
                <Text style={styles.gridLabel}>Campanhas</Text><Text style={styles.gridLabel}>Ativas</Text>
            </View>
        </View>
      </View>

      <View style={styles.spacer} />
      <ImageBackground source={require('../../../assets/images/pets/branquinho.png')} style={styles.financialBanner}>
        <View style={styles.overlay} />
        <Text style={styles.moneyText}>R$ {totalArrecadado.toFixed(2).replace('.', ',')}</Text>
        <Text style={styles.moneyLabel}>Total Arrecadado (Geral)</Text>
      </ImageBackground>
    </View>
  );

  const renderNewCampaignContent = () => (
    <View style={{ padding: 25, paddingBottom: 100 }}>
        <Text style={styles.ncIntroText}>Preencha os dados para lançar sua campanha.</Text>
        
        <View style={styles.ncInputGroup}>
            <Text style={styles.ncLabel}>Título da campanha:</Text>
            <TextInput 
                style={styles.ncInput} 
                placeholder="Ex. Cirurgia do Rex" 
                placeholderTextColor="#A0B4CC" 
                value={campanhaNome} 
                onChangeText={setCampanhaNome}
            />
        </View>
        
        <View style={styles.ncInputGroup}>
            <Text style={styles.ncLabel}>Data limite:</Text>
            <TextInput 
                style={styles.ncInput} 
                placeholder="DD/MM/AAAA" 
                placeholderTextColor="#A0B4CC" 
                value={campanhaData} 
                onChangeText={handleDateChange} 
                keyboardType="numeric"
                maxLength={10}
            />
        </View>

        <View style={styles.ncInputGroup}>
            <Text style={styles.ncLabel}>Meta financeira (R$):</Text>
            <TextInput 
                style={styles.ncInput} 
                placeholder="Ex. 1500,00" 
                placeholderTextColor="#A0B4CC" 
                keyboardType="numeric" 
                value={campanhaMeta} 
                onChangeText={setCampanhaMeta}
            />
        </View>

        <View style={styles.ncInputGroup}>
            <Text style={styles.ncLabel}>Descrição detalhada:</Text>
            <TextInput 
                style={[styles.ncInput, {height: 120, textAlignVertical: 'top', paddingTop: 15}]} 
                placeholder="Explique o motivo da arrecadação..." 
                placeholderTextColor="#A0B4CC" 
                multiline={true} 
                value={campanhaDesc} 
                onChangeText={setCampanhaDesc}
            />
        </View>

        <View style={styles.ncInputGroup}>
            <Text style={styles.ncLabel}>Capa da campanha:</Text>
            <TouchableOpacity style={styles.ncUploadBox} onPress={pickImageCampanha}>
                {campanhaImagem ? (
                    <Image source={{ uri: campanhaImagem }} style={styles.ncUploadedImage} />
                ) : (
                    <>
                        <Ionicons name="image-outline" size={45} color="#A0B4CC" />
                        <Text style={styles.ncUploadText}>Selecionar imagem</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>

        <TouchableOpacity 
            style={[styles.ncSubmitButton, isLoading && { opacity: 0.7 }]} 
            onPress={handleCriarCampanha}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator color={COLORS.primary} />
            ) : (
                <Text style={styles.ncSubmitText}>PUBLICAR CAMPANHA</Text>
            )}
        </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, step === 2 && { backgroundColor: COLORS.primary }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={step === 2 ? "light-content" : "dark-content"} backgroundColor={step === 2 ? COLORS.primary : "#FFF"} />
      <DenuncieModal visible={denunciaVisivel} onClose={() => setDenunciaVisivel(false)} />

      {/* HEADER DASHBOARD */}
      {step === 1 && (
        <View style={styles.headerBlock}>
            <CustomHeaderLeft onDenunciePress={() => setDenunciaVisivel(true)} />
            <CustomHeaderRight onNotificationPress={() => router.push('/(ong)/notificacoes-ong' as any)} />
        </View>
      )}

      {/* HEADER NOVA CAMPANHA */}
      {step === 2 && (
        <View style={styles.ncHeaderBlock}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <TouchableOpacity onPress={() => setStep(1)} style={{paddingRight: 10}}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <View>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Ionicons name="megaphone-outline" size={20} color={COLORS.primary} style={{marginRight:5}}/>
                        <Text style={styles.ncTitle}>Nova Campanha</Text>
                    </View>
                </View>
            </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        {step === 1 && renderDashboardContent()}
        {step === 2 && renderNewCampaignContent()}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  
  //HEADERS
  headerBlock: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#FFF', 
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  ncHeaderBlock: { 
    backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomRightRadius: 30, 
  },
  ncTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },

  //DASHBOARD
  introSection: { padding: 25 },
  titleRow: { flexDirection: 'row', marginBottom: 20, width: '100%', justifyContent: 'center' },
  
  // --- TÍTULO PRINCIPAL ATUALIZADO ---
  pageTitle: { 
    fontSize: 32, // Aumentado
    // fontWeight: 'bold', // Removido para funcionar a fonte
    color: COLORS.primary, 
    textAlign: 'center', 
    lineHeight: 40,
    fontFamily: 'MoreSugar', // Fonte aplicada
    width: '90%',
    alignSelf: 'center'
  },
  
  // --- TEXTO DE INTRODUÇÃO AUMENTADO ---
  introText: { 
    fontSize: 18, // Aumentado de 15 para 18
    color: COLORS.primary, 
    textAlign: 'center', 
    marginBottom: 20, 
    lineHeight: 26 // Aumentado
  },
  
  mainButton: { backgroundColor: '#2D68A6', paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 10, width: '80%', alignSelf: 'center', elevation: 3 },
  mainButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },
  gridContainer: { width: '100%', paddingHorizontal: 15, marginTop: 10 },
  gridRow: { flexDirection: 'row', height: 160, justifyContent: 'space-between', marginBottom: 15 },
  gridImage: { width: '48%', height: '100%', resizeMode: 'cover', borderRadius: 12 },
  gridBox: { width: '48%', height: '100%', backgroundColor: COLORS.lightBox, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  gridNumber: { fontSize: 36, fontWeight: 'bold', color: '#6A8CA8', marginBottom: 5 },
  gridLabel: { fontSize: 16, color: '#6A8CA8' },
  spacer: { height: 20 },
  financialBanner: { width: '100%', height: 180, justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(45, 104, 166, 0.5)' },
  moneyText: { fontSize: 36, fontWeight: 'bold', color: '#FFF', zIndex: 1 }, // Aumentado um pouco
  moneyLabel: { fontSize: 16, color: '#E0E0E0', zIndex: 1, marginTop: 5 },
  donateSection: { padding: 30, alignItems: 'center' },
  
  // --- TEXTO DO RODAPÉ AUMENTADO ---
  footerText: { 
    fontSize: 20, // Aumentado
    color: COLORS.primary, 
    textAlign: 'center', 
    marginTop: 20, 
    lineHeight: 24 
  },

  //NOVA CAMPANHA 
  ncIntroText: { color: '#FFF', fontSize: 16, textAlign: 'center', marginBottom: 25 },
  ncInputGroup: { marginBottom: 20 },
  ncLabel: { color: '#FFF', fontSize: 16, marginBottom: 8 },
  ncInput: { backgroundColor: '#FFF', borderRadius: 10, height: 50, paddingHorizontal: 15, fontSize: 16, color: '#333' },
  ncUploadBox: { backgroundColor: '#FFF', borderRadius: 10, height: 140, justifyContent: 'center', alignItems: 'center', padding: 20 },
  ncUploadText: { color: '#A0B4CC', textAlign: 'center', marginTop: 10 },
  ncUploadedImage: { width: '100%', height: '100%', borderRadius: 10, resizeMode: 'cover' },
  ncSubmitButton: { backgroundColor: '#FFF', paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  ncSubmitText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 },
});