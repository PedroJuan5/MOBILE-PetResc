import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, 
  Image, Dimensions, TextInput, Alert, 
  ActivityIndicator, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

// --- IMPORTAÇÃO DA API ---
import api from '@/lib/axios'; 

import { DenuncieModal } from "../../../components/denuncieModal"; 
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2D68A6',    
  secondary: '#94B9D8',  
  lightBox: '#B4CDE3',   
  textDark: '#2D68A6',
  white: '#FFFFFF',
  grayBg: '#F0F4F8'      
};

interface Campanha {
  id: number;
  titulo: string;
  metaFinanceira: number | string;
  dataLimite: string;
  imagemUrl: string | null;
  descricao: string;
}

export default function DoacoesOngScreen() {
  const router = useRouter();
  
  // ESTADOS DE CONTROLE
  const [step, setStep] = useState(1);
  const [denunciaVisivel, setDenunciaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  // DADOS DA API
  const [minhasCampanhas, setMinhasCampanhas] = useState<Campanha[]>([]);

  // ESTADOS DA NOVA CAMPANHA
  const [campanhaNome, setCampanhaNome] = useState('');
  const [campanhaData, setCampanhaData] = useState('');
  const [campanhaMeta, setCampanhaMeta] = useState('');
  const [campanhaDesc, setCampanhaDesc] = useState('');
  const [campanhaImagem, setCampanhaImagem] = useState<string | null>(null);

  // --- 1. BUSCAR CAMPANHAS ---
  const fetchCampanhas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/campanha/minhas');
      setMinhasCampanhas(response.data);
    } catch (error: any) {
      console.error("Erro ao buscar campanhas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampanhas();
  }, []);

  // --- HANDLERS ---
  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setCampanhaData(formatted);
  };

  const pickImageCampanha = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7, 
    });
    if (!result.canceled) setCampanhaImagem(result.assets[0].uri);
  };

  // --- 2. CRIAR CAMPANHA (LÓGICA IDÊNTICA AO REGISTRO DE ANIMAL) ---
  const handleCriarCampanha = async () => {
    if (!campanhaNome || !campanhaMeta || !campanhaData || !campanhaImagem) {
        Alert.alert("Atenção", "Preencha todos os campos e adicione uma imagem.");
        return;
    }
    
    const [dia, mes, ano] = campanhaData.split('/');
    if (!dia || !mes || !ano || ano.length !== 4) {
       Alert.alert("Erro", "Data inválida. Use DD/MM/AAAA");
       return;
    }
    
    const dataFormatadaISO = `${ano}-${mes}-${dia}`;
    const metaLimpa = campanhaMeta.replace(/\./g, '').replace(',', '.');

    setLoading(true);
    try {
        const formData = new FormData();
        
        // Campos de Texto
        formData.append('titulo', campanhaNome);
        formData.append('descricao', campanhaDesc);
        formData.append('meta_financeira', metaLimpa);
        formData.append('data_limite', dataFormatadaISO);
        formData.append('itens_descricao', JSON.stringify([])); 

        // --- TRATAMENTO DE IMAGEM (IGUAL AO REGISTRO DE ANIMAL) ---
        const uri = campanhaImagem; // Use a URI direta primeiro para verificar Web
        
        if (Platform.OS === 'web') {
            const res = await fetch(uri);
            const blob = await res.blob();
            formData.append('imagem', blob, 'campanha.jpg');
        } else {
            // Lógica Mobile (Android/iOS)
            const filename = uri.split('/').pop() || 'campanha.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            // @ts-ignore
            formData.append('imagem', { 
                uri: uri, // Mantém a URI original (file:// ou content://)
                name: filename, 
                type 
            });
        }

        console.log("Enviando campanha...", formData);

        // --- ENVIO COM CABEÇALHO EXPLÍCITO (Igual ao que funciona no seu projeto) ---
        await api.post('/campanha', formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
            },
        });

        Alert.alert("Sucesso", "Campanha criada com sucesso!");
        
        // Limpa campos
        setCampanhaNome('');
        setCampanhaData('');
        setCampanhaMeta('');
        setCampanhaDesc('');
        setCampanhaImagem(null);
        
        setStep(1);
        fetchCampanhas();

    } catch (error: any) {
        console.error("Erro detalhado:", error.response?.data || error.message);
        const errorMsg = error.response?.data?.message || error.response?.data?.error || "Erro ao conectar com o servidor.";
        Alert.alert("Erro", errorMsg);
    } finally {
        setLoading(false);
    }
  };

  const formatCurrency = (value: number | string | undefined) => {
    const numero = Number(value);
    if (isNaN(numero)) return "0,00";
    return numero.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getImageSource = (url: string | null) => {
      if (!url) return null;
      if (url.startsWith('http')) {
          return { uri: url };
      }
      return { uri: `https://petresc.onrender.com/${url.replace(/\\/g, '/')}` };
  };

  const renderCampanhaCard = (item: Campanha) => (
    <View key={item.id} style={styles.campanhaCard}>
        {item.imagemUrl ? (
            <Image 
                source={getImageSource(item.imagemUrl) as any} 
                style={styles.campanhaCardImage} 
                resizeMode="cover"
            />
        ) : (
            <View style={[styles.campanhaCardImage, {backgroundColor:'#ddd', justifyContent:'center', alignItems:'center'}]}>
                <Ionicons name="image-outline" size={30} color="#999"/>
            </View>
        )}
        <View style={styles.campanhaCardContent}>
            <Text style={styles.campanhaTitle} numberOfLines={1}>{item.titulo}</Text>
            <Text style={styles.campanhaMeta}>Meta: R$ {formatCurrency(item.metaFinanceira)}</Text>
            <Text style={styles.campanhaDesc} numberOfLines={2}>{item.descricao}</Text>
        </View>
    </View>
  );

  // RENDER: DASHBOARD
  const renderDashboardContent = () => (
    <View style={{ paddingBottom: 100 }}>
      <View style={styles.introSection}>
        <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Painel da ONG</Text>
        </View>
        <Text style={styles.introText}>Gerencie suas campanhas e visualize o impacto gerado.</Text>
        <TouchableOpacity style={styles.mainButton} onPress={() => setStep(2)}>
            <Text style={styles.mainButtonText}>NOVA CAMPANHA</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
            <View style={styles.gridBox}>
                <Text style={styles.gridNumber}>{minhasCampanhas.length}</Text>
                <Text style={styles.gridLabel}>Campanhas</Text><Text style={styles.gridLabel}>Criadas</Text>
            </View>
            <Image source={require('../../../assets/images/pets/shanti.png')} style={styles.gridImage} />
        </View>
      </View>

      {/* LISTA DE CAMPANHAS */}
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <Text style={styles.listSectionTitle}>Minhas Campanhas Ativas</Text>
        {loading ? (
             <ActivityIndicator color={COLORS.primary} size="large" style={{marginTop: 20}} />
        ) : minhasCampanhas.length === 0 ? (
             <Text style={styles.emptyText}>Nenhuma campanha criada ainda.</Text>
        ) : (
             minhasCampanhas.map(campanha => renderCampanhaCard(campanha))
        )}
      </View>
    </View>
  );

  const renderNewCampaignContent = () => (
    <View style={{ padding: 25, paddingBottom: 100 }}>
        <Text style={styles.ncIntroText}>Preencha os dados abaixo para criar uma nova campanha.</Text>
        <View style={styles.ncInputGroup}>
            <Text style={styles.ncLabel}>Nome da campanha:</Text>
            <TextInput style={styles.ncInput} placeholder="Ex. Resgate de animais" placeholderTextColor="#A0B4CC" value={campanhaNome} onChangeText={setCampanhaNome}/>
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
            <TextInput style={styles.ncInput} placeholder="Ex. 20000,00" placeholderTextColor="#A0B4CC" keyboardType="numeric" value={campanhaMeta} onChangeText={setCampanhaMeta}/>
        </View>
        <View style={styles.ncInputGroup}>
            <Text style={styles.ncLabel}>Descrição da campanha:</Text>
            <TextInput style={[styles.ncInput, {height: 120, textAlignVertical: 'top', paddingTop: 15}]} placeholder="Ex. Propósito..." placeholderTextColor="#A0B4CC" multiline={true} value={campanhaDesc} onChangeText={setCampanhaDesc}/>
        </View>
        <View style={styles.ncInputGroup}>
            <Text style={styles.ncLabel}>Capa/Imagem da campanha:</Text>
            <TouchableOpacity style={styles.ncUploadBox} onPress={pickImageCampanha}>
                {campanhaImagem ? (
                    <Image source={{ uri: campanhaImagem }} style={styles.ncUploadedImage} />
                ) : (
                    <>
                        <Ionicons name="image-outline" size={45} color="#A0B4CC" />
                        <Text style={styles.ncUploadText}>Clique para selecionar.</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.ncSubmitButton} onPress={handleCriarCampanha} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.primary} /> : <Text style={styles.ncSubmitText}>CRIAR CAMPANHA</Text>}
        </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, step === 2 && { backgroundColor: COLORS.primary }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={step === 2 ? "light-content" : "dark-content"} backgroundColor={step === 2 ? COLORS.primary : "#FFF"} />
      <DenuncieModal visible={denunciaVisivel} onClose={() => setDenunciaVisivel(false)} />

      {step === 1 && (
        <View style={styles.headerBlock}>
            <CustomHeaderLeft onDenunciePress={() => setDenunciaVisivel(true)} />
            <CustomHeaderRight onNotificationPress={() => router.push('/(ong)/notificacao-ong' as any)} />
        </View>
      )}

      {step === 2 && (
        <View style={styles.ncHeaderBlock}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <TouchableOpacity onPress={() => setStep(1)} style={{paddingRight: 10}}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <View>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.primary} style={{marginRight:5}}/>
                        <Text style={styles.ncTitle}>Nova Campanha</Text>
                    </View>
                    <Text style={{color: COLORS.primary, fontSize: 12}}>Preencha os dados abaixo</Text>
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

  introSection: { padding: 25 },
  titleRow: { flexDirection: 'row', marginBottom: 20, width: '100%', justifyContent: 'center' },
  pageTitle: { fontSize: 28, color: COLORS.primary, textAlign: 'center', fontFamily: 'MoreSugar', width: '90%', alignSelf: 'center', fontWeight:'bold' },
  introText: { fontSize: 15, color: COLORS.primary, textAlign: 'center', marginBottom: 15, lineHeight: 22 },
  mainButton: { backgroundColor: '#2D68A6', paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 10, width: '80%', alignSelf: 'center', elevation: 3 },
  mainButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },
  
  gridContainer: { width: '100%', paddingHorizontal: 15, marginTop: 10 },
  gridRow: { flexDirection: 'row', height: 140, justifyContent: 'space-between', marginBottom: 15 },
  gridImage: { width: '48%', height: '100%', resizeMode: 'cover', borderRadius: 12 },
  gridBox: { width: '48%', height: '100%', backgroundColor: COLORS.lightBox, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  gridNumber: { fontSize: 36, fontWeight: 'bold', color: '#6A8CA8', marginBottom: 5 },
  gridLabel: { fontSize: 16, color: '#6A8CA8' },
  
  ncIntroText: { color: '#FFF', fontSize: 16, textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  ncInputGroup: { marginBottom: 20 },
  ncLabel: { color: '#FFF', fontSize: 16, marginBottom: 8 },
  ncInput: { backgroundColor: '#FFF', borderRadius: 10, height: 50, paddingHorizontal: 15, fontSize: 16, color: '#333' },
  ncUploadBox: { backgroundColor: '#FFF', borderRadius: 10, height: 140, justifyContent: 'center', alignItems: 'center', padding: 20 },
  ncUploadText: { color: '#A0B4CC', textAlign: 'center', marginTop: 10 },
  ncUploadedImage: { width: '100%', height: '100%', borderRadius: 10, resizeMode: 'cover' },
  ncSubmitButton: { backgroundColor: '#FFF', paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  ncSubmitText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 },

  listSectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15 },
  emptyText: { textAlign: 'center', color: '#999', marginVertical: 20 },
  campanhaCard: { flexDirection: 'row', backgroundColor: '#F9F9F9', borderRadius: 12, padding: 10, marginBottom: 15, elevation: 2, alignItems: 'center' },
  campanhaCardImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  campanhaCardContent: { flex: 1 },
  campanhaTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  campanhaMeta: { fontSize: 14, color: COLORS.textDark, fontWeight: 'bold', marginTop: 4 },
  campanhaDesc: { fontSize: 12, color: '#666', marginTop: 4 },
});