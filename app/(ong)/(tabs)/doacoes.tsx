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
  
  // Controle de Etapas
  const [step, setStep] = useState(1);
  const [denunciaVisivel, setDenunciaVisivel] = useState(false);

  // Estados Formulário
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [totalArrecadado, setTotalArrecadado] = useState(7813);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Estados Nova Campanha
  const [campanhaNome, setCampanhaNome] = useState('');
  const [campanhaData, setCampanhaData] = useState('');
  const [campanhaMeta, setCampanhaMeta] = useState('');
  const [campanhaDesc, setCampanhaDesc] = useState('');
  const [campanhaImagem, setCampanhaImagem] = useState<string | null>(null);

  // --- LÓGICA ---
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

    setTotalArrecadado(prev => prev + valorDoado);
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setStep(1); 
    setSelectedValue(null);
    setCustomValue('');
    setPaymentMethod(null);
  };

  const pickImageCampanha = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled) setCampanhaImagem(result.assets[0].uri);
  };

  const handleCriarCampanha = () => {
    if (!campanhaNome || !campanhaMeta) {
        Alert.alert("Atenção", "Preencha pelo menos o nome e a meta.");
        return;
    }
    Alert.alert("Sucesso", "Campanha criada com sucesso!", [
        { text: "OK", onPress: () => setStep(1) }
    ]);
  };

  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

  // --- CONTEÚDOS (APENAS O QUE ROLA) ---

  const renderDashboardContent = () => (
    <View style={{ paddingBottom: 100 }}>
      <View style={styles.introSection}>
        <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Veja a diferença que você pode fazer!</Text>
        </View>
        <Text style={styles.introText}>Na nossa ONG, cada doação faz a diferença na vida dos animais que resgatamos.</Text>
        <Text style={styles.introText}>Com sua ajuda, conseguimos oferecer alimento, cuidados veterinários e muito amor a cães e gatos em situação de abandono.</Text>
        <Text style={styles.introText}>Apoie nosso trabalho e transforme vidas com a gente!</Text>
        <TouchableOpacity style={styles.mainButton} onPress={() => setStep(2)}>
            <Text style={styles.mainButtonText}>NOVA CAMPANHA</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
            <Image source={require('../../../assets/images/pets/shanti.png')} style={styles.gridImage} />
            <View style={styles.gridBox}>
                <Text style={styles.gridNumber}>72</Text>
                <Text style={styles.gridLabel}>Campanhas</Text><Text style={styles.gridLabel}>Realizadas</Text>
            </View>
        </View>
        <View style={styles.gridRow}>
            <View style={styles.gridBox}>
                <Text style={styles.gridNumber}>1.420</Text>
                <Text style={styles.gridLabel}>Doadores</Text><Text style={styles.gridLabel}>Ativos</Text>
            </View>
            <Image source={require('../../../assets/images/pets/neguinho.png')} style={styles.gridImage} />
        </View>
      </View>

      <View style={styles.spacer} />
      <ImageBackground source={require('../../../assets/images/pets/branquinho.png')} style={styles.financialBanner}>
        <View style={styles.overlay} />
        <Text style={styles.moneyText}>R$ {formatCurrency(totalArrecadado)}</Text>
        <Text style={styles.moneyLabel}>Valor Arrecadado Total</Text>
      </ImageBackground>

      <View style={styles.donateSection}>
        <TouchableOpacity style={styles.mainButton} onPress={() => setStep(3)}>
            <Text style={styles.mainButtonText}>DOE AGORA</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>Sua doação ajuda a alimentar, tratar e proteger nossos resgatados.</Text>
        <Text style={styles.footerText}>Apoie nossa causa e faça parte da mudança que eles tanto precisam.</Text>
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
            <TextInput style={styles.ncInput} placeholder="Ex. Duração de 5 a 7 meses" placeholderTextColor="#A0B4CC" value={campanhaData} onChangeText={setCampanhaData}/>
        </View>
        <View style={styles.ncInputGroup}>
            <Text style={styles.ncLabel}>Meta financeira:</Text>
            <TextInput style={styles.ncInput} placeholder="Ex. 20.000,00" placeholderTextColor="#A0B4CC" keyboardType="numeric" value={campanhaMeta} onChangeText={setCampanhaMeta}/>
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
                        <Text style={styles.ncUploadText}>Arraste ou clique para selecionar.</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.ncSubmitButton} onPress={handleCriarCampanha}>
            <Text style={styles.ncSubmitText}>CRIAR CAMPANHA</Text>
        </TouchableOpacity>
    </View>
  );

  const renderDonationFormContent = () => (
    <View style={{ paddingBottom: 40 }}>
        <View style={styles.formContent}>
            <Text style={styles.blueTitle}>Obrigado por apoiar a causa!</Text>
            <Text style={styles.blueSubtitle}>Sua doação ajuda animais a terem uma nova chance.</Text>
            <View style={styles.divider} />
            <Text style={styles.bodyText}>Todos os dias, milhares de animais resgatados...</Text>
            <Text style={[styles.bodyText, { marginTop: 10, fontWeight: 'bold' }]}>Com a sua doação, você garante:</Text>
            <View style={styles.bulletPoint}><Text style={styles.bulletDot}>•</Text><Text style={styles.bodyText}>Alimentação de cães e gatos acolhidos</Text></View>
            <View style={styles.bulletPoint}><Text style={styles.bulletDot}>•</Text><Text style={styles.bodyText}>Tratamento médico e medicamentos essenciais</Text></View>
            <View style={styles.bulletPoint}><Text style={styles.bulletDot}>•</Text><Text style={styles.bodyText}>Abrigo seguro... <Text style={{color: COLORS.secondary}}>Ler mais</Text></Text></View>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Escolha um valor:</Text>
            <RadioOption label="R$ 20 - 1 dia de alimentação" selected={selectedValue === '20'} onPress={() => setSelectedValue('20')} />
            <RadioOption label="R$ 50 - Vacina essencial" selected={selectedValue === '50'} onPress={() => setSelectedValue('50')} />
            <RadioOption label="R$ 100 - Atendimento veterinário" selected={selectedValue === '100'} onPress={() => setSelectedValue('100')} />
            <RadioOption label="R$ 200 - 1 mês de cuidados" selected={selectedValue === '200'} onPress={() => setSelectedValue('200')} />
            <RadioOption label="" hasInput={true} selected={selectedValue === 'custom'} onPress={() => setSelectedValue('custom')} inputValue={customValue} onInputChange={setCustomValue} />
            <View style={[styles.divider, { marginTop: 20 }]} />
            <Text style={styles.sectionTitle}>Formas de pagamento:</Text>
            <RadioOption label="Cartão de Debito" selected={paymentMethod === 'debito'} onPress={() => setPaymentMethod('debito')} />
            <RadioOption label="Cartão de Crédito" selected={paymentMethod === 'credito'} onPress={() => setPaymentMethod('credito')} />
            <RadioOption label="PIX" selected={paymentMethod === 'pix'} onPress={() => setPaymentMethod('pix')} />
            <RadioOption label="Boleto Bancário" selected={paymentMethod === 'boleto'} onPress={() => setPaymentMethod('boleto')} />
            <TouchableOpacity style={[styles.mainButton, {width: 180, alignSelf:'center', marginTop: 30}]} onPress={handleFinalizarDoacao}>
                <Text style={styles.mainButtonText}>Finalizar</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.footerInfoBox}>
            <View style={styles.footerContentRow}>
                <View style={styles.chartContainer}>
                    <View style={styles.chartCircle} />
                    <View style={styles.chartCircleFill} /> 
                    <View style={styles.chartInnerCircle}><Text style={styles.chartPercentage}>52%</Text></View>
                </View>
                <View style={styles.footerTexts}>
                    <Text style={styles.footerLabelBold}>Arrecadado</Text>
                    <Text style={styles.footerValues}>
                        <Text style={{fontWeight:'bold', color:'#333'}}>R$ {formatCurrency(totalArrecadado)}</Text> 
                        <Text style={{color:'#999'}}> / R$ 15.000</Text>
                    </Text>
                    <Text style={styles.footerDesc}>Todos os valores arrecadados são destinados ao cuidado e manutenção dos animais da SUIPA.</Text>
                </View>
            </View>
        </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, step === 2 && { backgroundColor: COLORS.primary }]} edges={['top', 'left', 'right']}>
      {/* 1. HEADER FIXO (FORA DO SCROLLVIEW) 
          Ele fica preso no topo da tela. 
      */}
      {step === 2 ? (
        // HEADER AZUL (Nova Campanha)
        <View style={styles.ncHeaderFixed}>
            <TouchableOpacity onPress={() => setStep(1)} style={{padding: 5}}>
                <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            
            <View style={{flex: 1, marginLeft: 10}}>
                <Ionicons name="alert-circle" size={20} color={COLORS.primary} />
                <Text style={styles.ncHeaderTitle}>Iniciar uma nova campanha</Text>
            </View>

            <View style={styles.headerIcons}>
                <TouchableOpacity onPress={() => router.push('/(ong)/notificacoes' as any)}>
                    <Ionicons name="notifications" size={24} color="#E57373" />
                </TouchableOpacity>
                <View style={{marginLeft: 10}}>
                    <Ionicons name="paw" size={16} color={COLORS.secondary} />
                    <Ionicons name="paw" size={16} color={COLORS.secondary} style={{marginLeft: 5, marginTop: 5}} />
                </View>
            </View>
        </View>
      ) : (
        // HEADER PADRÃO (Dashboard e Doação) - IGUAL AO DA HOME
        <View style={styles.headerFixed}>
            {/* Esquerda: Alerta Vermelho */}
            <TouchableOpacity onPress={() => setDenunciaVisivel(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="alert-circle-outline" size={26} color="#D9534F" />
            </TouchableOpacity>
            
            {/* Centro: Título */}
            <Text style={styles.headerTitle}>Painel de Doações</Text>
            
            {/* Direita: Notificação Azul */}
            <TouchableOpacity onPress={() => router.push('/(ong)/notificacoes' as any)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="notifications-outline" size={26} color="#2D68A6" />
            </TouchableOpacity>
        </View>
      )}

      {/* 2. CONTEÚDO QUE ROLA 
          Fica abaixo do header e ocupa o resto da tela (flex: 1).
      */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <StatusBar barStyle={step === 2 ? "light-content" : "dark-content"} backgroundColor={step === 2 ? COLORS.primary : "#FFF"} />
        <DenuncieModal visible={denunciaVisivel} onClose={() => setDenunciaVisivel(false)} />

        {step === 1 && renderDashboardContent()}
        {step === 2 && renderNewCampaignContent()}
        {step === 3 && renderDonationFormContent()}
      </ScrollView>

      {/* MODAL SUCESSO */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Doação recebida</Text>
                <Text style={styles.modalText}>Sua contribuição foi recebida com sucesso e já está ajudando a transformar a vida de cães e gatos resgatados pela (nome da ONG).</Text>
                <Text style={[styles.modalText, {fontWeight: 'bold', marginTop: 10}]}>Você receberá um e-mail com o comprovante da sua doação.</Text>
                <View style={styles.modalDivider}/>
                <TouchableOpacity onPress={handleCloseSuccess} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  
  // --- HEADER PADRÃO (FIXO) ---
  headerFixed: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 10,
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0',
    // Não precisa de position absolute aqui, pois está antes do ScrollView dentro de um Flex Column
  },
  
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  
  // --- HEADER NOVA CAMPANHA (FIXO) ---
  ncHeaderFixed: { 
    backgroundColor: '#FFF', 
    paddingHorizontal: 20, 
    paddingVertical: 10,
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    borderBottomRightRadius: 30, 
  },
  ncHeaderTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginTop: 5, lineHeight: 30, width: '70%' },
  headerIcons: { flexDirection: 'row', position: 'absolute', top: 15, right: 20 },

  // DASHBOARD CONTENT
  introSection: { padding: 25 },
  titleRow: { flexDirection: 'row', marginBottom: 20, width: '80%', justifyContent: 'center' },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', lineHeight: 32 },
  introText: { fontSize: 15, color: COLORS.primary, textAlign: 'center', marginBottom: 15, lineHeight: 22 },
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
  moneyText: { fontSize: 32, fontWeight: 'bold', color: '#FFF', zIndex: 1 },
  moneyLabel: { fontSize: 16, color: '#E0E0E0', zIndex: 1, marginTop: 5 },
  donateSection: { padding: 30, alignItems: 'center' },
  footerText: { fontSize: 15, color: COLORS.primary, textAlign: 'center', marginTop: 15, lineHeight: 22 },

  // NOVA CAMPANHA CONTENT
  ncIntroText: { color: '#FFF', fontSize: 16, textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  ncInputGroup: { marginBottom: 20 },
  ncLabel: { color: '#FFF', fontSize: 16, marginBottom: 8 },
  ncInput: { backgroundColor: '#FFF', borderRadius: 10, height: 50, paddingHorizontal: 15, fontSize: 16, color: '#333' },
  ncUploadBox: { backgroundColor: '#FFF', borderRadius: 10, height: 140, justifyContent: 'center', alignItems: 'center', padding: 20 },
  ncUploadText: { color: '#A0B4CC', textAlign: 'center', marginTop: 10 },
  ncUploadedImage: { width: '100%', height: '100%', borderRadius: 10, resizeMode: 'cover' },
  ncSubmitButton: { backgroundColor: '#FFF', paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  ncSubmitText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 },

  // DOAÇÃO FORM CONTENT
  formContent: { padding: 25 },
  blueTitle: { fontSize: 20, color: COLORS.primary, textAlign: 'center', marginBottom: 5 },
  blueSubtitle: { fontSize: 18, color: COLORS.primary, textAlign: 'center', marginBottom: 15 },
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

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 25, width: '90%', alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#003366', marginBottom: 15 },
  modalText: { fontSize: 16, color: '#2D68A6', textAlign: 'center', marginBottom: 10, lineHeight: 24 },
  modalDivider: { height: 1, width: '100%', backgroundColor: '#A0B4CC', marginVertical: 15 },
  modalButton: { paddingVertical: 10, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, color: '#2D68A6', fontWeight: 'bold' },
});