import React, { useState } from 'react';
import {  View,  Text,  StyleSheet,  TouchableOpacity,  ScrollView,  Image,  TextInput,  Modal,  Alert,  Dimensions,  StatusBar 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DenuncieModal } from '../../../components/denuncieModal';
import CustomHeaderRight from '../../../components/elementosDireita';
import CustomHeaderLeft from '../../../components/elementosEsquerda';

const { width } = Dimensions.get('window');

// CORES DO DESIGN
const COLORS = {
  primary: '#2D68A6',    
  secondary: '#94B9D8',  
  lightBox: '#B4CDE3',   
  white: '#FFFFFF',
  grayBg: '#F0F6FA'      
};

export default function DoarUsuarioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const HEADER_HEIGHT = 80; 

  const [modalVisible, setModalVisible] = useState(false);
  const handleDenunciePress = () => setModalVisible(true);

  // --- CONTROLE DE ETAPAS ---
  const [step, setStep] = useState(1); 
  // 1 = Dashboard (Lista de ONGs)
  // 3 = Formulário de Doação

  // --- DADOS MOCKADOS (Valores) ---
  const [carameloArrecadado, setCarameloArrecadado] = useState(14964);
  const carameloMeta = 30000;

  const [suipaArrecadado, setSuipaArrecadado] = useState(7813);
  const suipaMeta = 15000;

  const [ongSelecionada, setOngSelecionada] = useState<'caramelo' | 'suipa' | null>(null);

  // ESTADOS DO FORMULÁRIO DE DOAÇÃO
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- LÓGICA ---
  const iniciarDoacao = (ong: 'caramelo' | 'suipa') => {
    setOngSelecionada(ong);
    setStep(3);
  };

  const handleFinalizarDoacao = () => {
    let valorDoado = 0;
    if (selectedValue === 'custom') {
        valorDoado = parseFloat(customValue.replace(',', '.'));
    } else if (selectedValue) {
        valorDoado = parseFloat(selectedValue);
    }

    if (!valorDoado || isNaN(valorDoado) || valorDoado <= 0) {
        Alert.alert("Erro", "Selecione um valor válido.");
        return;
    }
    if (!paymentMethod) {
        Alert.alert("Erro", "Selecione uma forma de pagamento.");
        return;
    }

    // ATUALIZA O VALOR DA ONG
    if (ongSelecionada === 'caramelo') {
        setCarameloArrecadado(prev => prev + valorDoado);
    } else if (ongSelecionada === 'suipa') {
        setSuipaArrecadado(prev => prev + valorDoado);
    }

    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setStep(1); 
    setSelectedValue(null);
    setCustomValue('');
    setPaymentMethod(null);
    setOngSelecionada(null);
  };

  // Helpers
  const formatCurrency = (value: number) => {
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getPercentage = (atual: number, meta: number) => {
    const percent = (atual / meta) * 100;
    return Math.min(percent, 100).toFixed(0) + '%';
  };

  const getPercentageWidth = (atual: number, meta: number) => {
    const percent = (atual / meta) * 100;
    return `${Math.min(percent, 100)}%`;
  };

  // --- COMPONENTE RADIO BUTTON ---
  const RadioOption = ({ label, selected, onPress, hasInput, inputValue, onInputChange }: any) => (
    <TouchableOpacity style={styles.radioContainer} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.radioCircle, selected && styles.radioCircleSelected]} />
      {hasInput ? (
        <View style={styles.radioInputRow}>
            <Text style={styles.radioLabel}>Outro valor: </Text>
            <TextInput style={styles.inlineInput} placeholder="[___________]" placeholderTextColor="#999" value={inputValue} onChangeText={onInputChange} keyboardType="numeric"/>
        </View>
      ) : (
        <Text style={styles.radioLabel}>{label}</Text>
      )}
    </TouchableOpacity>
  );

  // --- RENDERIZADORES ---

  // 1. DASHBOARD
  const renderDashboard = () => (
    <View style={{ paddingBottom: 100, paddingHorizontal: 20 }}>
        
        <Text style={styles.tituloDePagina}>Veja a diferença que você pode fazer!</Text>

        <Text style={styles.paragraph}>
          No PetResc, você pode apoiar diretamente as ONGs cadastradas. Cada contribuição ajuda a oferecer alimentação, cuidados médicos e abrigo para animais em situação de vulnerabilidade. Escolha a ONG que mais toca seu coração e faça parte dessa rede de solidariedade.
        </Text>

        {/* ESTATÍSTICAS */}
        <View style={styles.cartao}>
          <Image source={require('../../../assets/images/ui/gato-preto-branco.png')} style={styles.imagemCima} />
          <View style={styles.caixaTexto}>
            <Text style={styles.numero}>85</Text>
            <Text style={styles.texto}>Campanhas{"\n"}Realizadas</Text>
          </View>
        </View>

        <View style={styles.cartao}>
          <View style={styles.caixaTexto}>
            <Text style={styles.numero}>157</Text>
            <Text style={styles.texto}>Doadores{"\n"}Ativos</Text>
          </View>
          <Image source={require('../../../assets/images/ui/mulherAjudando.png')} style={styles.imagemBaixo} />
        </View>

        <View style={[styles.cartao, { flexDirection: 'column', padding: 0 }]}>
          <Image source={require('../../../assets/images/pets/branquinho.png')} style={[styles.imagemCima, { width: '100%', height: 170, resizeMode: 'cover' }]} />
          <View style={styles.overlayText}>
            <Text style={[styles.numero, { color: '#fff', fontSize: 30, fontWeight: '700', marginBottom: 6 }]}>R$ 78.446,96</Text>
            <Text style={[styles.texto, { color: '#fff', fontSize: 16 }]}>Valor Arrecadado</Text>
          </View>
        </View>

        <View style={{ marginTop: 25 }}>
          <Text style={{ color: '#2D68A6', fontSize: 16, fontWeight: '600', marginBottom: 16 }}>Mais populares</Text>

          {/* === CARD 1: INSTITUTO CARAMELO === */}
          <TouchableOpacity style={styles.cardOng} activeOpacity={0.9} onPress={() => iniciarDoacao('caramelo')}>
            <Image source={require('../../../assets/images/ui/institutoCaramelo.png')} style={styles.cardOngImage} />
            <Text style={styles.cardOngTitle}>Instituto Caramelo</Text>
            <View style={{flexDirection:'row', marginTop:3}}>
                <Ionicons name="location-outline" size={14} color="#444" style={{marginRight:4, marginTop:2}}/>
                <Text style={styles.cardOngAddress}>Rua José Felix de Oliveira, 1234 – Granja Viana, Cotia – SP, 06709-400</Text>
            </View>
            <View style={{ marginTop: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, height: 6, backgroundColor: '#E5ECF3', borderRadius: 4 }}>
                  <View style={{ width: getPercentageWidth(carameloArrecadado, carameloMeta) as any, height: 6, backgroundColor: '#2D68A6', borderRadius: 4 }} />
                </View>
                <Text style={{ fontSize: 11, color: '#666', marginLeft: 6 }}>{getPercentage(carameloArrecadado, carameloMeta)}</Text>
              </View>
              <Text style={{ fontSize: 12, color: '#444', marginTop: 6 }}>
                Arrecadado: <Text style={{ fontWeight: '600' }}>R$ {formatCurrency(carameloArrecadado)}</Text> / R$ {formatCurrency(carameloMeta)}
              </Text>
            </View>
          </TouchableOpacity>

          {/* === CARD 2: SUIPA === */}
          <TouchableOpacity style={styles.cardOng} activeOpacity={0.9} onPress={() => iniciarDoacao('suipa')}>
            <Image source={require('../../../assets/images/ui/suipa.png')} style={styles.cardOngImage} />
            <Text style={styles.cardOngTitle}>SUIPA</Text>
            <View style={{flexDirection:'row', marginTop:3}}>
                <Ionicons name="location-outline" size={14} color="#444" style={{marginRight:4, marginTop:2}}/>
                <Text style={styles.cardOngAddress}>Av. Dom Hélder Câmara, 1801 – Benfica, Rio de Janeiro – RJ</Text>
            </View>
            <View style={{ marginTop: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, height: 6, backgroundColor: '#E5ECF3', borderRadius: 4 }}>
                  <View style={{ width: getPercentageWidth(suipaArrecadado, suipaMeta) as any, height: 6, backgroundColor: '#2D68A6', borderRadius: 4 }} />
                </View>
                <Text style={{ fontSize: 11, color: '#666', marginLeft: 6 }}>{getPercentage(suipaArrecadado, suipaMeta)}</Text>
              </View>
              <Text style={{ fontSize: 12, color: '#444', marginTop: 6 }}>
                Arrecadado: <Text style={{ fontWeight: '600' }}>R$ {formatCurrency(suipaArrecadado)}</Text> / R$ {formatCurrency(suipaMeta)}
              </Text>
            </View>
          </TouchableOpacity>


        </View>
    </View>
  );

  // 3. FORMULÁRIO DE DOAÇÃO
  const renderDonationForm = () => {
    
    // Define qual ONG mostrar no topo
    const currentOng = ongSelecionada === 'caramelo' ? {
        name: 'Instituto Caramelo',
        image: require('../../../assets/images/ui/institutoCaramelo.png'),
        address: 'Rua José Felix de Oliveira, 1234 – Granja Viana, Cotia – SP'
    } : {
        name: 'SUIPA',
        image: require('../../../assets/images/ui/suipa.png'),
        address: 'Av. Dom Hélder Câmara, 1801 – Benfica, Rio de Janeiro – RJ'
    };

    return (
        <View style={{ paddingBottom: 40 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 }}>
                <TouchableOpacity onPress={() => setStep(1)} style={{ padding: 5 }}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
               
            </View>

            <View style={styles.formContent}>
                
                {/* --- AQUI ESTÁ O AJUSTE DE ESPAÇAMENTO (marginTop: 20) --- */}
                <Image source={currentOng.image} style={styles.ongHeaderImage} />
                {/* -------------------------------------------------------- */}
                
                <Text style={styles.ongHeaderTitle}>{currentOng.name}</Text>
                
                <View style={styles.ongHeaderLocation}>
                    <Ionicons name="location-outline" size={16} color="#666" style={{marginRight: 5}}/>
                    <Text style={styles.ongHeaderAddress}>{currentOng.address}</Text>
                </View>
                
                <View style={styles.divider} />

                <Text style={styles.bodyText}>
                    Todos os dias, milhares de animais resgatados recebem cuidados, alimentação e muito amor. 
                    Mas para continuarmos oferecendo abrigo, tratamento veterinário e a chance de um novo lar, precisamos da sua ajuda.
                </Text>
                
                <Text style={[styles.bodyText, { marginTop: 10, fontWeight: 'bold' }]}>Com a sua doação, você garante:</Text>
                <View style={styles.bulletPoint}><Text style={styles.bulletDot}>•</Text><Text style={styles.bodyText}>Alimentação de cães e gatos acolhidos</Text></View>
                <View style={styles.bulletPoint}><Text style={styles.bulletDot}>•</Text><Text style={styles.bodyText}>Tratamento médico e medicamentos essenciais</Text></View>
                <View style={styles.bulletPoint}><Text style={styles.bulletDot}>•</Text><Text style={styles.bodyText}>Abrigo seguro... <Text style={{color: COLORS.secondary}}>Ler mais</Text></Text></View>
                
                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Escolha um valor:</Text>
                <RadioOption label="R$ 20 - Alimentação diária" selected={selectedValue === '20'} onPress={() => setSelectedValue('20')} />
                <RadioOption label="R$ 50 - Vacina essencial" selected={selectedValue === '50'} onPress={() => setSelectedValue('50')} />
                <RadioOption label="R$ 100 - Veterinário" selected={selectedValue === '100'} onPress={() => setSelectedValue('100')} />
                <RadioOption label="R$ 200 - 1 mês de cuidados" selected={selectedValue === '200'} onPress={() => setSelectedValue('200')} />
                <RadioOption label="" hasInput={true} selected={selectedValue === 'custom'} onPress={() => setSelectedValue('custom')} inputValue={customValue} onInputChange={setCustomValue} />

                <View style={[styles.divider, { marginTop: 20 }]} />

                <Text style={styles.sectionTitle}>Formas de pagamento:</Text>
                <RadioOption label="Cartão de Crédito" selected={paymentMethod === 'credito'} onPress={() => setPaymentMethod('credito')} />
                <RadioOption label="PIX" selected={paymentMethod === 'pix'} onPress={() => setPaymentMethod('pix')} />
                <RadioOption label="Boleto" selected={paymentMethod === 'boleto'} onPress={() => setPaymentMethod('boleto')} />

                <TouchableOpacity style={styles.botaoFinalizar} onPress={handleFinalizarDoacao}>
                    <Text style={styles.textoBotaoFinalizar}>Finalizar</Text>
                </TouchableOpacity>
            </View>

            {/* Rodapé Dinâmico */}
            <View style={styles.footerInfoBox}>
                <View style={styles.footerContentRow}>
                    <View style={styles.chartContainer}>
                        <View style={styles.chartCircle} /><View style={styles.chartCircleFill} />
                        <View style={styles.chartInnerCircle}><Text style={styles.chartPercentage}>52%</Text></View>
                    </View>
                    <View style={styles.footerTexts}>
                        <Text style={styles.footerLabelBold}>Arrecadado</Text>
                        <Text style={styles.footerValues}>
                            <Text style={{fontWeight:'bold', color:'#333'}}>
                                R$ {ongSelecionada === 'caramelo' ? formatCurrency(carameloArrecadado) : formatCurrency(suipaArrecadado)}
                            </Text> 
                            <Text style={{color:'#999'}}> / R$ {ongSelecionada === 'caramelo' ? formatCurrency(carameloMeta) : formatCurrency(suipaMeta)}</Text>
                        </Text>
                        <Text style={styles.footerDesc}>Destinado ao cuidado dos animais.</Text>
                    </View>
                </View>
            </View>
        </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <DenuncieModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      {/* MODAL SUCESSO */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Doação recebida</Text>
                <Text style={styles.modalText}>Sua contribuição foi recebida com sucesso e já está ajudando a transformar a vida de cães e gatos resgatados pela {ongSelecionada === 'caramelo' ? 'Instituto Caramelo' : 'SUIPA'}.</Text>
                <Text style={[styles.modalText, {fontWeight: 'bold', marginTop: 10}]}>Você receberá um e-mail com o comprovante da sua doação.</Text>
                <View style={styles.modalDivider}/>
                <TouchableOpacity onPress={handleCloseSuccess} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* HEADER FIXO DO APP */}
      {step === 1 && (
        <View style={styles.iconHeaderContainer}>
            <CustomHeaderLeft onDenunciePress={handleDenunciePress} />
            <CustomHeaderRight />
        </View>
      )}

      <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        {step === 1 && renderDashboard()}
        {step === 3 && renderDonationForm()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  
  // SEUS ESTILOS ORIGINAIS
  iconHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 10, paddingHorizontal: 20 },
  tituloDePagina: { fontSize: 26, fontWeight: "700", color: "#2D68A6", width: "80%", marginBottom: 20, marginTop: 10 },
  paragraph: { fontSize: 18, lineHeight: 28, color: '#333', textAlign: 'left', marginBottom: 20 },
  
  cartao: { flexDirection: 'row', backgroundColor: '#fff', marginVertical: 10 },
  imagemCima: { width: '50%', height: 180, resizeMode: 'cover' },
  imagemBaixo: { width: '50%', height: 180, resizeMode: 'cover' },
  caixaTexto: { width: '50%', backgroundColor: '#bcd0e8', alignItems: 'center', justifyContent: 'center', padding: 10 },
  numero: { fontSize: 40, fontWeight: 'bold', color: '#4a6a8a' },
  texto: { fontSize: 18, textAlign: 'center', color: '#4a6a8a' },
  overlayText: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(45,104,166,0.65)', justifyContent: 'center', alignItems: 'center' },

  // Card ONG
  cardOng: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 35, borderWidth: 1, borderColor: '#E5ECF3', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  cardOngImage: { width: '100%', height: 150, borderRadius: 10 },
  cardOngTitle: { fontSize: 15, fontWeight: '600', marginTop: 8, color: '#000' },
  cardOngAddress: { fontSize: 12, color: '#444', flex: 1 },

  boxContribuicao: { flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 30 },
  textoContribuicao: { flex: 1, marginRight: 10 },
  paragrafoContribuicao: { fontSize: 14, color: "#3A5C7A", lineHeight: 22, marginBottom: 20 },
  botaoDoar: { backgroundColor: "#BFE1F7", borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, alignSelf: "flex-start" },
  textoBotaoDoar: { color: "#2D68A6", fontWeight: "700" },
  imagemContribuicao: { width: 130, height: 180, resizeMode: "contain" },

  // ESTILOS DO FORMULÁRIO
  formContent: { paddingHorizontal: 20 },
  
  // ESPAÇAMENTO DA IMAGEM
  ongHeaderImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 12, 
    marginBottom: 15,
    marginTop: 20 // <--- AQUI ESTÁ O ESPAÇAMENTO SOLICITADO
  },
  
  ongHeaderTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 5 },
  ongHeaderLocation: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  ongHeaderAddress: { fontSize: 13, color: '#666', marginLeft: 5, flex: 1 },

  divider: { height: 1, backgroundColor: '#A0B4CC', marginVertical: 15, width: '100%' },
  bodyText: { fontSize: 15, color: '#333', lineHeight: 22, textAlign: 'justify' },
  bulletPoint: { flexDirection: 'row', marginTop: 8, paddingRight: 10 },
  bulletDot: { fontSize: 15, color: '#333', marginRight: 8, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginTop: 10, marginBottom: 15 },
  
  radioContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  radioCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#E0E0E0', marginRight: 12 },
  radioCircleSelected: { backgroundColor: COLORS.secondary },
  radioLabel: { fontSize: 14, color: '#333', fontWeight: '500', flex: 1 },
  radioInputRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  inlineInput: { borderBottomWidth: 1, borderBottomColor: '#999', width: 100, padding: 0, height: 20, fontSize: 14 },

  botaoFinalizar: { backgroundColor: '#2D68A6', width: 180, paddingVertical: 15, borderRadius: 30, alignItems: 'center', alignSelf: 'center', marginTop: 30 },
  textoBotaoFinalizar: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },

  // Footer Arrecadado
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

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 25, width: '90%', alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#003366', marginBottom: 15 },
  modalText: { fontSize: 16, color: '#2D68A6', textAlign: 'center', marginBottom: 10, lineHeight: 24 },
  modalDivider: { height: 1, width: '100%', backgroundColor: '#A0B4CC', marginVertical: 15 },
  modalButton: { paddingVertical: 10, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, color: '#2D68A6', fontWeight: 'bold' },
});