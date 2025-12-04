import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Dimensions,
  Modal,
  FlatList,
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MaskInput from 'react-native-mask-input';
import * as ImagePicker from 'expo-image-picker';

// --- CORES PADRÃO ---
const COLORS = {
  primary: '#2D68A6',
  background: '#205A8D',
  inputBg: '#CFDEE9',
  textLight: '#FFF',
  textDark: '#2D68A6',
  placeholder: '#7E9EB6',
  border: '#A0B4CC',
  white: '#FFFFFF',
};

// --- INTERFACE DOS DADOS ---
interface AnimalData {
  nome: string; especie: string; raca: string; sexo: string;
  idade: string; dataResgate: string;
  localEncontro: string; condicaoResgate: string; comFilhotes: string; comColeira: string;
  vermifugado: boolean; dataVermifugo: string;
  vacinado: boolean; descVacina: string;
  castrado: boolean; dataCastracao: string;
  doencas: boolean; descDoencas: string;
  tratamentos: string;
  disponivelAdocao: string; motivoIndisponivel: string; localAtual: string;
  fotoResgate: string | null; fotoAtual: string | null;
  observacoes: string; historia: string;
}

export default function RegistroAnimalScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 7; 

  // --- ESTADOS DOS MODAIS DE FEEDBACK ---
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const [formData, setFormData] = useState<AnimalData>({
    nome: '', especie: '', raca: '', sexo: '',
    idade: '', dataResgate: '',
    localEncontro: '', condicaoResgate: '', comFilhotes: '', comColeira: '',
    vermifugado: false, dataVermifugo: '', vacinado: false, descVacina: '',
    castrado: false, dataCastracao: '', doencas: false, descDoencas: '', tratamentos: '',
    disponivelAdocao: '', motivoIndisponivel: '', localAtual: '',
    fotoResgate: null, fotoAtual: null,
    observacoes: '', historia: ''
  });

  // --- LÓGICA GERAL ---
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<keyof AnimalData | null>(null);
  const [optionsList, setOptionsList] = useState<string[]>([]);

  const updateForm = (key: keyof AnimalData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const openOptionModal = (field: keyof AnimalData, options: string[]) => {
    setCurrentField(field); setOptionsList(options); setModalVisible(true);
  };

  const handleSelectOption = (option: string) => {
    if (currentField) updateForm(currentField, option);
    setModalVisible(false);
  };

  const pickImage = async (fieldKey: keyof AnimalData) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) updateForm(fieldKey, result.assets[0].uri);
  };

  // --- LÓGICA DE NAVEGAÇÃO E VALIDAÇÃO ---
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // VALIDAÇÃO FINAL
      if (!formData.nome || !formData.especie) {
        setErrorModalVisible(true);
      } else {
        setSuccessModalVisible(true);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  // --- COMPONENTES VISUAIS ---
  
  const InputField = ({ label, value, fieldKey, placeholder, mask, subLabel, multiline, height }: any) => (
    <View style={styles.inputWrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.labelText}>{label}</Text>
        {subLabel && <Text style={styles.subLabelText}>{subLabel}</Text>}
      </View>
      {mask ? (
        <MaskInput
          style={[styles.input, multiline && { height: height || 100, textAlignVertical: 'top', paddingTop: 15 }]}
          value={value || ''}
          onChangeText={(text) => updateForm(fieldKey, text)}
          mask={mask}
          placeholder={placeholder || ""}
          placeholderTextColor={COLORS.placeholder}
          multiline={multiline}
        />
      ) : (
        <TextInput
          style={[styles.input, multiline && { height: height || 100, textAlignVertical: 'top', paddingTop: 15 }]}
          value={value || ''}
          onChangeText={(text) => updateForm(fieldKey, text)}
          placeholder={placeholder || ""}
          placeholderTextColor={COLORS.placeholder}
          multiline={multiline}
        />
      )}
    </View>
  );

  const SelectField = ({ label, value, placeholder, subLabel, options, fieldKey }: any) => (
    <View style={styles.inputWrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.labelText}>{label}</Text>
        {subLabel && <Text style={styles.subLabelText}>{subLabel}</Text>}
      </View>
      <TouchableOpacity style={styles.selectButton} activeOpacity={0.8} onPress={() => openOptionModal(fieldKey, options)}>
        <Text style={[styles.selectValueText, !value && { color: COLORS.placeholder }]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  const YesNoSelector = ({ label, value, fieldKey }: any) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.labelText}>{label}</Text>
      <View style={styles.yesNoContainer}>
        <TouchableOpacity 
          style={[styles.yesNoButton, value === 'sim' && styles.yesNoButtonActive]} 
          onPress={() => updateForm(fieldKey, 'sim')}
        >
            <Text style={[styles.yesNoText, value === 'sim' && styles.yesNoTextActive]}>SIM</Text>
        </TouchableOpacity>
        
        <View style={{ width: 15 }} />
        
        <TouchableOpacity 
          style={[styles.yesNoButton, value === 'nao' && styles.yesNoButtonActive]} 
          onPress={() => updateForm(fieldKey, 'nao')}
        >
            <Text style={[styles.yesNoText, value === 'nao' && styles.yesNoTextActive]}>NÃO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const MedicalCheckbox = ({ label, checkKey, textKey, textPlaceholder, mask }: any) => (
    <View style={styles.checkboxWrapper}>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => updateForm(checkKey, !(formData as any)[checkKey])}>
            <View style={[styles.checkboxBox, (formData as any)[checkKey] && styles.checkboxBoxChecked]}>
                {(formData as any)[checkKey] && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
            </View>
            <Text style={styles.checkboxText}>{label}</Text>
        </TouchableOpacity>
        
        {(formData as any)[checkKey] && (
            <MaskInput
                style={styles.conditionalInput}
                value={(formData as any)[textKey]}
                onChangeText={(text) => updateForm(textKey, text)}
                placeholder={textPlaceholder}
                placeholderTextColor={COLORS.placeholder}
                mask={mask}
            />
        )}
    </View>
  );

  const ImageUploadBox = ({ label, subLabel, fieldKey, imageUri }: any) => (
    <View style={styles.inputWrapper}>
        <View style={styles.labelRow}>
            <Text style={styles.labelText}>{label}</Text>
            {subLabel && <Text style={styles.subLabelText}>{subLabel}</Text>}
        </View>
        <TouchableOpacity style={styles.uploadContainer} onPress={() => pickImage(fieldKey)}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.uploadImagePreview} />
            ) : (
                <>
                    <Ionicons name="image-outline" size={40} color={COLORS.placeholder} />
                    <Text style={styles.uploadPlaceholderText}>
                        Arraste uma imagem nesta área, ou clique para selecionar.
                    </Text>
                </>
            )}
        </TouchableOpacity>
    </View>
  );

  // --- CONTEÚDO DAS ETAPAS ---
  const renderStepContent = () => {
    switch(step) {
        // Etapa 1
        case 1: return (
            <>
                <InputField label="Nome do animal" subLabel="Opcional" value={formData.nome} fieldKey="nome"/>
                <SelectField label="Espécie" value={formData.especie} fieldKey="especie" placeholder="Selecione" options={['Cachorro', 'Gato', 'Outro']}/>
                <InputField label="Raça" subLabel="Opcional" value={formData.raca} fieldKey="raca" placeholder="Ex: Poodle"/>
                <SelectField label="Sexo" value={formData.sexo} fieldKey="sexo" placeholder="Selecione" options={['Macho', 'Fêmea']}/>
            </>
        );
        // Etapa 2
        case 2: return (
            <>
                <InputField label="Idade aproximada" subLabel="Em meses ou anos" value={formData.idade} fieldKey="idade"/>
                <InputField label="Data de resgate" value={formData.dataResgate} fieldKey="dataResgate" mask={[/\d/,/\d/, '/', /\d/,/\d/, '/', /\d/,/\d/,/\d/,/\d/]} placeholder="00/00/0000"/>
            </>
        );
        // Etapa 3
        case 3: return (
            <>
                <InputField label="Onde foi encontrado" value={formData.localEncontro} fieldKey="localEncontro" placeholder="Rua, bairro, cidade"/>
                <InputField label="Condição no resgate" value={formData.condicaoResgate} fieldKey="condicaoResgate" placeholder="Desnutrido..."/>
                <YesNoSelector label="Estava com filhotes?" value={formData.comFilhotes} fieldKey="comFilhotes"/>
                <YesNoSelector label="Estava com coleira/ID?" value={formData.comColeira} fieldKey="comColeira"/>
            </>
        );
        // Etapa 4
        case 4: return (
            <>
                <Text style={styles.sectionHeaderTitle}>Exames realizados:</Text>
                <MedicalCheckbox label="Vermifugado" checkKey="vermifugado" textKey="dataVermifugo" textPlaceholder="Data: 00/00/0000" mask={[/\d/,/\d/, '/', /\d/,/\d/, '/', /\d/,/\d/,/\d/,/\d/]} />
                <MedicalCheckbox label="Vacinado" checkKey="vacinado" textKey="descVacina" textPlaceholder="Quais / Data" />
                <MedicalCheckbox label="Castrado" checkKey="castrado" textKey="dataCastracao" textPlaceholder="Data: 00/00/0000" mask={[/\d/,/\d/, '/', /\d/,/\d/, '/', /\d/,/\d/,/\d/,/\d/]} />
                <MedicalCheckbox label="Testado (FIV/FeLV...)" checkKey="doencas" textKey="descDoencas" textPlaceholder="Resultado..." />
                <View style={{ height: 15 }}/>
                <InputField label="Tratamentos em andamento:" value={formData.tratamentos} fieldKey="tratamentos" placeholder="Ex. antibióticos..." multiline={true} height={80} />
            </>
        );
        // Etapa 5
        case 5: return (
            <>
                <YesNoSelector label="Disponível para adoção?" value={formData.disponivelAdocao} fieldKey="disponivelAdocao" />
                <SelectField label="Motivo (se não)" value={formData.motivoIndisponivel} fieldKey="motivoIndisponivel" placeholder="Selecione" options={['Em tratamento', 'Muito jovem', 'Aguardando castração']} />
                <SelectField label="Local atual" value={formData.localAtual} fieldKey="localAtual" placeholder="Selecione" options={['Lar temporário', 'Abrigo', 'Clínica']} />
            </>
        );
        // Etapa 6
        case 6: return (
            <>
                <ImageUploadBox label="Foto do resgate" subLabel="Opcional" fieldKey="fotoResgate" imageUri={formData.fotoResgate} />
                <View style={{ height: 15 }}/>
                <ImageUploadBox label="Foto atual do animal" fieldKey="fotoAtual" imageUri={formData.fotoAtual} />
            </>
        );
        // Etapa 7
        case 7: return (
            <>
                <InputField label="Observações gerais" subLabel="Opcional" value={formData.observacoes} fieldKey="observacoes" placeholder="Ex. dócil..." multiline={true} height={120} />
                <InputField label="História do pet" subLabel="Opcional" value={formData.historia} fieldKey="historia" placeholder="Conte a história..." multiline={true} height={180} />
            </>
        );
        default: return null;
    }
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* MODAL DE SELEÇÃO (DROPDOWN) */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)} activeOpacity={1}>
            <View style={styles.modalContent}>
                <Text style={styles.modalHeaderTitle}>Selecione</Text>
                <FlatList data={optionsList} keyExtractor={(item) => item} renderItem={({item}) => (
                    <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectOption(item)}>
                        <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                )}/>
            </View>
        </TouchableOpacity>
      </Modal>

      {/* --- MODAL DE SUCESSO --- */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.feedbackCard}>
                <Text style={styles.feedbackTitle}>Registrado com sucesso!</Text>
                <Text style={styles.feedbackText}>O animal foi cadastrado em nosso sistema.</Text>
                <Text style={styles.feedbackText}>Você receberá um e-mail com os detalhes.</Text>
                
                <TouchableOpacity 
                    style={styles.feedbackButton} 
                    onPress={() => { 
                        setSuccessModalVisible(false); 
                        // MANDA PARA A HOME DA ONG
                        router.navigate('/(ong)/(tabs)/home-ong' as any); 
                    }}
                >
                    <Text style={styles.feedbackButtonText}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* --- MODAL DE ERRO / FALTOU ALGO --- */}
      <Modal visible={errorModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.feedbackCard}>
                <Text style={styles.feedbackTitle}>Ei, faltou algo!</Text>
                <Text style={styles.feedbackText}>Ops! Parece que você esqueceu de preencher alguns campos obrigatórios.</Text>
                <Text style={styles.feedbackText}>Por favor, revise as informações.</Text>
                
                <TouchableOpacity 
                    style={styles.feedbackButton} 
                    onPress={() => setErrorModalVisible(false)}
                >
                    <Text style={styles.feedbackButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* --- HEADER --- */}
      <SafeAreaView edges={['top']} style={styles.headerContainer}>
        <View style={styles.headerNav}>
            <TouchableOpacity onPress={handleBack} style={{padding: 5}}>
                <Ionicons name="arrow-back" size={28} color={COLORS.white} />
            </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Criar registro Pet</Text>
        <Text style={styles.headerSubtitle}>Crie a conta do pet seguindo suas necessidades</Text>
      </SafeAreaView>

      {/* --- SCROLL CONTENT --- */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
        <View style={{ height: 130 }} /> 
      </ScrollView>

      {/* --- FOOTER FIXO --- */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>{step === totalSteps ? "Finalizar" : "Prosseguir"}</Text>
        </TouchableOpacity>

        <View style={styles.paginationContainer}>
            {Array.from({ length: totalSteps }).map((_, index) => {
                const isActive = step === (index + 1);
                return <View key={index} style={[styles.paginationDot, isActive ? styles.paginationDotActive : styles.paginationDotInactive]} />;
            })}
        </View>
      </View>
    </View>
  );
}

// --- ESTILOS ORGANIZADOS ---
const styles = StyleSheet.create({
  // LAYOUT GERAL
  screenContainer: { flex: 1, backgroundColor: COLORS.background },
  headerContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  headerNav: { marginBottom: 10 },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 10 },
  
  // TEXTOS DO HEADER
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.white, marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: '#E0E0E0', marginBottom: 10 },
  sectionHeaderTitle: { fontSize: 18, color: COLORS.white, marginBottom: 15, fontWeight: 'bold' },

  // --- INPUTS & LABELS ---
  inputWrapper: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  labelText: { fontSize: 18, color: COLORS.white, fontWeight: '500' },
  subLabelText: { fontSize: 12, color: COLORS.border, marginLeft: 8 },
  
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 6,
    height: 55,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.primary,
  },
  
  // SELECT (DROPDOWN FAKE)
  selectButton: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 6,
    height: 55,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectValueText: { fontSize: 16, color: COLORS.primary },

  // INPUT CONDICIONAL (CHECKBOX)
  checkboxWrapper: { marginBottom: 15 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  checkboxBox: {
    width: 24, height: 24,
    backgroundColor: COLORS.inputBg,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxChecked: { backgroundColor: COLORS.white },
  checkboxText: { fontSize: 16, color: COLORS.white },
  conditionalInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 6,
    height: 45,
    paddingHorizontal: 10,
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 34,
    marginTop: 5,
  },

  // YES/NO SELECTOR
  yesNoContainer: { flexDirection: 'row' },
  yesNoButton: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  yesNoButtonActive: { borderColor: COLORS.white },
  yesNoText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16, opacity: 0.6 },
  yesNoTextActive: { opacity: 1 },

  // UPLOAD
  uploadContainer: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  uploadPlaceholderText: {
    fontSize: 14,
    color: COLORS.placeholder,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  uploadImagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },

  // --- FOOTER ---
  footerContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  
  // PAGINAÇÃO (BOLINHAS)
  paginationContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  paginationDot: { width: 10, height: 10, borderRadius: 5 },
  paginationDotActive: { backgroundColor: COLORS.primary, width: 30 },
  paginationDotInactive: { backgroundColor: COLORS.border },

  // --- MODAIS ---
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    width: '80%', borderRadius: 12, padding: 20, maxHeight: '50%',
  },
  modalHeaderTitle: {
    fontSize: 18, fontWeight: 'bold', color: COLORS.primary,
    marginBottom: 15, textAlign: 'center',
  },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalItemText: { fontSize: 16, color: '#333', textAlign: 'center' },

  // CARD DE FEEDBACK (SUCESSO/ERRO)
  feedbackCard: {
    backgroundColor: COLORS.white,
    width: '90%', borderRadius: 16, padding: 25, alignItems: 'center',
  },
  feedbackTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15, textAlign: 'center' },
  feedbackText: { fontSize: 14, color: COLORS.primary, textAlign: 'center', marginBottom: 15, lineHeight: 20 },
  feedbackButton: {
    backgroundColor: '#94B9D8',
    paddingVertical: 12, paddingHorizontal: 40,
    borderRadius: 8, marginTop: 10, width: '100%', alignItems: 'center',
  },
  feedbackButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
});