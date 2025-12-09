import React, { useState, useEffect } from 'react';
import {   View, Text, StyleSheet, TouchableOpacity, ScrollView, Image,  TextInput, Modal, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';
import api from '@/lib/axios';
import { DenuncieModal } from '../../../components/denuncieModal';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2D68A6',    
  secondary: '#94B9D8',  
  lightBox: '#B4CDE3',   
  white: '#FFFFFF',
  grayBg: '#F0F6FA'      
};


interface Campanha {
  id: number;
  titulo: string;
  descricao: string;
  metaFinanceira: number | string; 
  metaValor?: number | string;   
  valorArrecadado: number | string; 
  imagemUrl: string | null;        
  usuarioCriador: {
    nome: string;
    ong?: {
      nome?: string;
      cidade?: string;
      estado?: string;
    }
  }
}

export default function DoarUsuarioScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const handleDenunciePress = () => setModalVisible(true);

  const [step, setStep] = useState(1); 
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);
  const [campanhaSelecionada, setCampanhaSelecionada] = useState<Campanha | null>(null);

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingDoacao, setLoadingDoacao] = useState(false);

  // --- 1. CARREGAR LISTA ---
  useEffect(() => {
    async function fetchCampanhas() {
      try {
        console.log("Buscando campanhas em /campanha ..."); 
        const response = await api.get('/campanha'); 
        
        if (Array.isArray(response.data)) {
            setCampanhas(response.data);
        } else {
            setCampanhas([]);
        }
      } catch (error) {
        console.error("Erro ao buscar lista de campanhas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCampanhas();
  }, []);

  //BUSCAR DETALHES
  const iniciarDoacao = async (idCampanha: number) => {
    setLoadingDetalhes(true); 
    try {
        const response = await api.get(`/campanha/${idCampanha}`);
        setCampanhaSelecionada(response.data);
        setStep(3);
    } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
        Alert.alert("Erro", "Não foi possível carregar os detalhes desta campanha.");
    } finally {
        setLoadingDetalhes(false);
    }
  };

  const handleFinalizarDoacao = async () => {
    let valorDoado = 0;
    if (selectedValue === 'custom') {
        valorDoado = parseFloat(customValue.replace(',', '.'));
    } else if (selectedValue) {
        valorDoado = parseFloat(selectedValue);
    }

    if (!valorDoado || isNaN(valorDoado) || valorDoado <= 0) {
        Alert.alert("Atenção", "Digite um valor válido para doar.");
        return;
    }
    if (!paymentMethod) {
        Alert.alert("Atenção", "Selecione uma forma de pagamento.");
        return;
    }
    if (!campanhaSelecionada) return;

    setLoadingDoacao(true);

    try {
        await api.post('/doacoes', {
            campanhaId: campanhaSelecionada.id,
            valor: valorDoado,
            metodoPagamento: paymentMethod
        });

        // Conversão segura para soma
        const valorAtualNum = Number(campanhaSelecionada.valorArrecadado) || 0;
        const novoTotal = valorAtualNum + valorDoado;
        
        setCampanhaSelecionada(prev => prev ? {...prev, valorArrecadado: novoTotal} : null);
        setCampanhas(prev => prev.map(c => 
            c.id === campanhaSelecionada.id ? {...c, valorArrecadado: novoTotal} : c
        ));

        setShowSuccessModal(true);

    } catch (error) {
        console.error("Erro doação:", error);
        Alert.alert("Erro", "Não foi possível concluir a doação.");
    } finally {
        setLoadingDoacao(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setStep(1); 
    setSelectedValue(null);
    setCustomValue('');
    setPaymentMethod(null);
    setCampanhaSelecionada(null);
  };

  //HELPERS 
  const formatCurrency = (value: number | string | undefined | null) => {
    const num = Number(value); 
    if (isNaN(num)) return "0";
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getMeta = (c: Campanha) => {

    // Verifica qual campo tem valor.
    return Number(c.metaFinanceira || c.metaValor || 1);
  };

  const getPercentage = (atual: number | string | null, campanha: Campanha) => {
    const vAtual = Number(atual) || 0;
    const vMeta = getMeta(campanha); 
    const percent = (vAtual / vMeta) * 100;
    return Math.min(percent, 100).toFixed(0) + '%';
  };

  const getPercentageWidth = (atual: number | string | null, campanha: Campanha) => {
    const vAtual = Number(atual) || 0;
    const vMeta = getMeta(campanha);
    const percent = (vAtual / vMeta) * 100;
    return `${Math.min(percent, 100)}%`;
  };

  const getOngInfo = (c: Campanha) => {
      const nome = c.usuarioCriador?.ong?.nome || c.usuarioCriador?.nome || "ONG Parceira";
      const cidade = c.usuarioCriador?.ong?.cidade || "";
      const estado = c.usuarioCriador?.ong?.estado || "";
      const endereco = cidade && estado ? `${cidade} - ${estado}` : "Local não informado";
      return { nome, endereco };
  };

  const RadioOption = ({ label, selected, onPress, hasInput, inputValue, onInputChange }: any) => (
    <TouchableOpacity style={styles.radioContainer} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.radioCircle, selected && styles.radioCircleSelected]} />
      {hasInput ? (
        <View style={styles.radioInputRow}>
            <Text style={styles.radioLabel}>Outro valor: </Text>
            <TextInput style={styles.inlineInput} placeholder="0,00" placeholderTextColor="#999" value={inputValue} onChangeText={onInputChange} keyboardType="numeric"/>
        </View>
      ) : (
        <Text style={styles.radioLabel}>{label}</Text>
      )}
    </TouchableOpacity>
  );

  //1.DASHBOARD
  const renderDashboard = () => (
    <View style={{ paddingBottom: 100, paddingHorizontal: 20 }}>
        <Text style={styles.tituloDePagina}>Veja a diferença que você pode fazer!</Text>
        <Text style={styles.paragraph}>
          No PetResc, você apoia campanhas reais. Cada contribuição ajuda a oferecer alimentação e cuidados.
        </Text>

        <View style={styles.cartao}>
          <Image source={require('../../../assets/images/ui/gato-preto-branco.png')} style={styles.imagemCima} />
          <View style={styles.caixaTexto}>
            <Text style={styles.numero}>{campanhas.length}</Text>
            <Text style={styles.texto}>Campanhas{"\n"}Ativas</Text>
          </View>
        </View>

        <View style={{ marginTop: 25 }}>
          <Text style={{ color: '#2D68A6', fontSize: 16, fontWeight: '600', marginBottom: 16 }}>Campanhas Disponíveis</Text>

          {loading ? (
             <ActivityIndicator size="large" color="#2D68A6" style={{marginTop: 20}} />
          ) : campanhas.length === 0 ? (
             <Text style={{color: '#666', fontStyle: 'italic', marginTop: 10}}>Nenhuma campanha disponível no momento.</Text>
          ) : (
             campanhas.map((campanha) => {
                const info = getOngInfo(campanha);
                const meta = getMeta(campanha);

                // --- ALTERAÇÃO 2: Usar imagemUrl ---
                // Se campanha.imagemUrl existir, usa ela. Senão, usa o placeholder.
                const imageSource = campanha.imagemUrl 
                    ? { uri: campanha.imagemUrl } 
                    : require('../../../assets/images/ui/institutoCaramelo.png');

                return (
                    <TouchableOpacity 
                        key={campanha.id} 
                        style={styles.cardOng} 
                        activeOpacity={0.9} 
                        onPress={() => iniciarDoacao(campanha.id)}
                        disabled={loadingDetalhes}
                    >
                        <Image source={imageSource} style={styles.cardOngImage} resizeMode="cover" />
                        <Text style={styles.cardOngTitle}>{campanha.titulo}</Text>
                        
                        <View style={{flexDirection:'row', marginTop:3}}>
                            <Ionicons name="business-outline" size={14} color="#444" style={{marginRight:4, marginTop:2}}/>
                            <Text style={[styles.cardOngAddress, {fontWeight:'bold'}]}>{info.nome}</Text>
                        </View>
                        <View style={{flexDirection:'row', marginTop:3}}>
                            <Ionicons name="location-outline" size={14} color="#444" style={{marginRight:4, marginTop:2}}/>
                            <Text style={styles.cardOngAddress}>{info.endereco}</Text>
                        </View>

                        <View style={{ marginTop: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, height: 6, backgroundColor: '#E5ECF3', borderRadius: 4 }}>
                                <View style={{ width: getPercentageWidth(campanha.valorArrecadado, campanha) as any, height: 6, backgroundColor: '#2D68A6', borderRadius: 4 }} />
                                </View>
                                <Text style={{ fontSize: 11, color: '#666', marginLeft: 6 }}>{getPercentage(campanha.valorArrecadado, campanha)}</Text>
                            </View>
                            <Text style={{ fontSize: 12, color: '#444', marginTop: 6 }}>
                                Arrecadado: <Text style={{ fontWeight: '600' }}>R$ {formatCurrency(campanha.valorArrecadado)}</Text> / R$ {formatCurrency(meta)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
             })
          )}
        </View>
    </View>
  );

  // --- RENDER FORMULÁRIO (DETALHES) ---
  const renderDonationForm = () => {
    if (!campanhaSelecionada) return null;
    const info = getOngInfo(campanhaSelecionada);
    const meta = getMeta(campanhaSelecionada);

    // --- ALTERAÇÃO 2 (Detalhes): Usar imagemUrl ---
    const imageSource = campanhaSelecionada.imagemUrl 
        ? { uri: campanhaSelecionada.imagemUrl } 
        : require('../../../assets/images/ui/institutoCaramelo.png');

    return (
        <View style={{ paddingBottom: 40 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 }}>
                <TouchableOpacity onPress={() => setStep(1)} style={{ padding: 5 }}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.formContent}>
                <Image source={imageSource} style={styles.ongHeaderImage} resizeMode="cover" />
                <Text style={styles.ongHeaderTitle}>{campanhaSelecionada.titulo}</Text>
                <View style={styles.ongHeaderLocation}>
                    <Ionicons name="business" size={16} color="#666" style={{marginRight: 5}}/>
                    <Text style={[styles.ongHeaderAddress, {fontWeight:'bold'}]}>{info.nome}</Text>
                </View>
                <View style={styles.divider} />
                <Text style={styles.bodyText}>
                    {campanhaSelecionada.descricao || "Sem descrição informada."}
                </Text>
                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Escolha um valor:</Text>
                <RadioOption label="R$ 20 - Ajuda Simples" selected={selectedValue === '20'} onPress={() => setSelectedValue('20')} />
                <RadioOption label="R$ 50 - Vacina essencial" selected={selectedValue === '50'} onPress={() => setSelectedValue('50')} />
                <RadioOption label="R$ 100 - Veterinário" selected={selectedValue === '100'} onPress={() => setSelectedValue('100')} />
                <RadioOption label="R$ 200 - 1 mês de cuidados" selected={selectedValue === '200'} onPress={() => setSelectedValue('200')} />
                <RadioOption label="Outro valor" hasInput={true} selected={selectedValue === 'custom'} onPress={() => setSelectedValue('custom')} inputValue={customValue} onInputChange={setCustomValue} />

                <View style={[styles.divider, { marginTop: 20 }]} />

                <Text style={styles.sectionTitle}>Formas de pagamento:</Text>
                <RadioOption label="Cartão de Crédito" selected={paymentMethod === 'credito'} onPress={() => setPaymentMethod('credito')} />
                <RadioOption label="PIX" selected={paymentMethod === 'pix'} onPress={() => setPaymentMethod('pix')} />
                <RadioOption label="Boleto" selected={paymentMethod === 'boleto'} onPress={() => setPaymentMethod('boleto')} />

                <TouchableOpacity style={styles.botaoFinalizar} onPress={handleFinalizarDoacao} disabled={loadingDoacao}>
                    {loadingDoacao ? <ActivityIndicator color="#FFF" /> : <Text style={styles.textoBotaoFinalizar}>Finalizar Doação</Text>}
                </TouchableOpacity>
            </View>

            <View style={styles.footerInfoBox}>
                <View style={styles.footerContentRow}>
                    <View style={styles.chartContainer}>
                        <View style={styles.chartCircle} /><View style={styles.chartCircleFill} />
                        <View style={styles.chartInnerCircle}>
                            <Text style={styles.chartPercentage}>{getPercentage(campanhaSelecionada.valorArrecadado, campanhaSelecionada).replace('%','')}%</Text>
                        </View>
                    </View>
                    <View style={styles.footerTexts}>
                        <Text style={styles.footerLabelBold}>Progresso</Text>
                        <Text style={styles.footerValues}>
                            <Text style={{fontWeight:'bold', color:'#333'}}>R$ {formatCurrency(campanhaSelecionada.valorArrecadado)}</Text> 
                            <Text style={{color:'#999'}}> / R$ {formatCurrency(meta)}</Text>
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <DenuncieModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      {step === 1 && (
        <View style={styles.iconHeaderContainer}>
            <CustomHeaderLeft onDenunciePress={handleDenunciePress} />
            <CustomHeaderRight />
        </View>
      )}

      {/*modal de sucesso*/}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Doação recebida! 🎉</Text>
                <Text style={styles.modalText}>Sua contribuição foi registrada.</Text>
                <TouchableOpacity onPress={handleCloseSuccess} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        {step === 1 && renderDashboard()}
        {step === 3 && renderDonationForm()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  

  tituloDePagina: { fontSize: 26, fontWeight: "700", color: "#2D68A6", width: "80%", marginBottom: 20, marginTop: 10 },
  paragraph: { fontSize: 18, lineHeight: 28, color: '#333', textAlign: 'left', marginBottom: 20 },
  cartao: { flexDirection: 'row', backgroundColor: '#fff', marginVertical: 10 },
  imagemCima: { width: '50%', height: 180, resizeMode: 'cover' }, // <--- Ajuste aqui se a imagem ficar cortada
  caixaTexto: { width: '50%', backgroundColor: '#bcd0e8', alignItems: 'center', justifyContent: 'center', padding: 10 },
  numero: { fontSize: 40, fontWeight: 'bold', color: '#4a6a8a' },
  texto: { fontSize: 18, textAlign: 'center', color: '#4a6a8a' },
  overlayText: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(45,104,166,0.65)', justifyContent: 'center', alignItems: 'center' },


  cardOng: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 35, borderWidth: 1, borderColor: '#E5ECF3', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  cardOngImage: { width: '100%', height: 150, borderRadius: 10, backgroundColor: '#eee' }, // Adicionado bg color
  cardOngTitle: { fontSize: 15, fontWeight: '600', marginTop: 8, color: '#000' },
  cardOngAddress: { fontSize: 12, color: '#444', flex: 1 },

  
  formContent: { paddingHorizontal: 20 },
  
  ongHeaderImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 12, 
    marginBottom: 15,
    marginTop: 20 
  },
   iconHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, 
    paddingTop: 10,        
    paddingBottom: 10,     
  },
  
  ongHeaderTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 5 },
  ongHeaderLocation: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  ongHeaderAddress: { fontSize: 13, color: '#666', marginLeft: 5, flex: 1 },
  divider: { height: 1, backgroundColor: '#A0B4CC', marginVertical: 15, width: '100%' },
  bodyText: { fontSize: 15, color: '#333', lineHeight: 22, textAlign: 'justify' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginTop: 10, marginBottom: 15 },
  radioContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  radioCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#E0E0E0', marginRight: 12 },
  radioCircleSelected: { backgroundColor: COLORS.secondary },
  radioLabel: { fontSize: 14, color: '#333', fontWeight: '500', flex: 1 },
  radioInputRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  inlineInput: { borderBottomWidth: 1, borderBottomColor: '#999', width: 100, padding: 0, height: 20, fontSize: 14 },
  botaoFinalizar: { backgroundColor: '#2D68A6', width: 180, paddingVertical: 15, borderRadius: 30, alignItems: 'center', alignSelf: 'center', marginTop: 30 },
  textoBotaoFinalizar: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },
  footerInfoBox: { backgroundColor: '#F0F6FA', padding: 20, marginTop: 20, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  footerContentRow: { flexDirection: 'row', alignItems: 'center' },
  footerTexts: { flex: 1, marginLeft: 15 },
  footerLabelBold: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  footerValues: { fontSize: 16, marginBottom: 5 },
  footerDesc: { fontSize: 12, color: COLORS.primary, fontWeight: 'bold', marginTop: 5 },
  chartContainer: { width: 60, height: 60, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  chartCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 6, borderColor: '#E0E0E0', position: 'absolute' },
  chartCircleFill: { width: 60, height: 60, borderRadius: 30, borderWidth: 6, borderColor: COLORS.secondary, borderRightColor: 'transparent', borderBottomColor: 'transparent', position: 'absolute', transform: [{rotate: '-45deg'}] },
  chartInnerCircle: { justifyContent: 'center', alignItems: 'center' },
  chartPercentage: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 25, width: '90%', alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#003366', marginBottom: 15 },
  modalText: { fontSize: 16, color: '#2D68A6', textAlign: 'center', marginBottom: 10, lineHeight: 24 },
  modalDivider: { height: 1, width: '100%', backgroundColor: '#A0B4CC', marginVertical: 15 },
  modalButton: { paddingVertical: 10, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, color: '#2D68A6', fontWeight: 'bold' },
  
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 999
  },
  loadingText: {
    marginTop: 10, color: '#2D68A6', fontWeight: 'bold', fontSize: 16
  }
});