import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Modal,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MaskInput from 'react-native-mask-input';
import * as ImagePicker from 'expo-image-picker';
import api from '@/lib/axios';

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

// --- COMPONENTES VISUAIS (MOVIDOS PARA FORA PARA CORRIGIR O BUG DA DIGITAÇÃO) ---

const InputField = ({ label, value, onChangeText, placeholder, mask, subLabel, multiline, height }: any) => (
  <View style={styles.inputWrapper}>
    <View style={styles.labelRow}>
      <Text style={styles.labelText}>{label}</Text>
      {subLabel && <Text style={styles.subLabelText}>{subLabel}</Text>}
    </View>
    {mask ? (
      <MaskInput
        style={[styles.input, multiline && { height: height || 100, textAlignVertical: 'top', paddingTop: 15 }]}
        value={value || ''}
        onChangeText={onChangeText}
        mask={mask}
        placeholder={placeholder || ""}
        placeholderTextColor={COLORS.placeholder}
        multiline={multiline}
      />
    ) : (
      <TextInput
        style={[styles.input, multiline && { height: height || 100, textAlignVertical: 'top', paddingTop: 15 }]}
        value={value || ''}
        onChangeText={onChangeText}
        placeholder={placeholder || ""}
        placeholderTextColor={COLORS.placeholder}
        multiline={multiline}
      />
    )}
  </View>
);

const SelectField = ({ label, value, placeholder, subLabel, onPress }: any) => (
  <View style={styles.inputWrapper}>
    <View style={styles.labelRow}>
      <Text style={styles.labelText}>{label}</Text>
      {subLabel && <Text style={styles.subLabelText}>{subLabel}</Text>}
    </View>
    <TouchableOpacity style={styles.selectButton} activeOpacity={0.8} onPress={onPress}>
      <Text style={[styles.selectValueText, !value && { color: COLORS.placeholder }]}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  </View>
);

const YesNoSelector = ({ label, value, onSelect }: any) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.labelText}>{label}</Text>
    <View style={styles.yesNoContainer}>
      <TouchableOpacity 
        style={[styles.yesNoButton, value === 'sim' && styles.yesNoButtonActive]} 
        onPress={() => onSelect('sim')}
      >
          <Text style={[styles.yesNoText, value === 'sim' && styles.yesNoTextActive]}>SIM</Text>
      </TouchableOpacity>
      
      <View style={{ width: 15 }} />
      
      <TouchableOpacity 
        style={[styles.yesNoButton, value === 'nao' && styles.yesNoButtonActive]} 
        onPress={() => onSelect('nao')}
      >
          <Text style={[styles.yesNoText, value === 'nao' && styles.yesNoTextActive]}>NÃO</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const MedicalCheckbox = ({ label, checked, textValue, onCheck, onTextChange, textPlaceholder, mask }: any) => (
  <View style={styles.checkboxWrapper}>
      <TouchableOpacity style={styles.checkboxRow} onPress={onCheck}>
          <View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>
              {checked && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
          </View>
          <Text style={styles.checkboxText}>{label}</Text>
      </TouchableOpacity>
      
      {checked && (
          <MaskInput
              style={styles.conditionalInput}
              value={textValue}
              onChangeText={onTextChange}
              placeholder={textPlaceholder}
              placeholderTextColor={COLORS.placeholder}
              mask={mask}
          />
      )}
  </View>
);

const ImageUploadBox = ({ label, subLabel, imageUri, onPress }: any) => (
  <View style={styles.inputWrapper}>
      <View style={styles.labelRow}>
          <Text style={styles.labelText}>{label}</Text>
          {subLabel && <Text style={styles.subLabelText}>{subLabel}</Text>}
      </View>
      <TouchableOpacity style={styles.uploadContainer} onPress={onPress}>
          {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.uploadImagePreview} />
          ) : (
              <>
                  <Ionicons name="image-outline" size={40} color={COLORS.placeholder} />
                  <Text style={styles.uploadPlaceholderText}>
                      Toque para selecionar uma imagem
                  </Text>
              </>
          )}
      </TouchableOpacity>
  </View>
);

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
  const [isLoading, setIsLoading] = useState(false);

  // --- MODAIS ---
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<keyof AnimalData | null>(null);
  const [optionsList, setOptionsList] = useState<string[]>([]);

  // --- ESTADO DO FORMULÁRIO ---
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

  const updateForm = (key: keyof AnimalData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // --- SELEÇÃO DE OPÇÃO ---
  const openOptionModal = (field: keyof AnimalData, options: string[]) => {
    setCurrentField(field); setOptionsList(options); setModalVisible(true);
  };

  const handleSelectOption = (option: string) => {
    if (currentField) updateForm(currentField, option);
    setModalVisible(false);
  };

  // --- SELEÇÃO DE IMAGEM ---
  const pickImage = async (fieldKey: keyof AnimalData) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) updateForm(fieldKey, result.assets[0].uri);
  };

  // --- LÓGICA DE NAVEGAÇÃO ---
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // VALIDAÇÃO FINAL BÁSICA
      if (!formData.nome || !formData.especie) {
        setErrorModalVisible(true);
      } else {
        handleSubmitFinal();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  // --- ENVIO PARA A API (INTEGRAÇÃO) ---
  const handleSubmitFinal = async () => {
    setIsLoading(true);

    try {
        const data = new FormData();

        // 1. DADOS BÁSICOS
        data.append('nome', formData.nome);
        data.append('especie', formData.especie);
        data.append('raca', formData.raca || "SRD");
        data.append('sexo', formData.sexo === 'Macho' ? 'MACHO' : (formData.sexo === 'Fêmea' ? 'FEMEA' : 'OUTRO'));
        data.append('idade', formData.idade);
        
        // 2. RESGATE (Opcionais)
        if (formData.dataResgate) data.append('data_resgate', convertDate(formData.dataResgate)); 
        data.append('local_atual', formData.localEncontro); 
        data.append('tinha_filhotes', formData.comFilhotes === 'sim' ? 'true' : 'false');
        data.append('tinha_coleira', formData.comColeira === 'sim' ? 'true' : 'false');

      
        // 3. SAÚDE
        data.append('vermifugado', formData.vermifugado ? 'true' : 'false');
        if (formData.dataVermifugo) data.append('data_vermifugado', convertDate(formData.dataVermifugo));
        
        data.append('vacinado', formData.vacinado ? 'true' : 'false');
        data.append('vacinas_texto', formData.descVacina);
        
        data.append('castrado', formData.castrado ? 'true' : 'false');
        if (formData.dataCastracao) data.append('data_castrado', convertDate(formData.dataCastracao));
        
        data.append('testado_doencas', formData.doencas ? 'true' : 'false');
        data.append('testes_texto', formData.descDoencas);
        data.append('cuidado', formData.tratamentos);

        // 4. TEXTOS
        data.append('descricao', formData.historia); 
        data.append('observacoes', formData.observacoes);

        // 5. IMAGENS
        if (formData.fotoAtual) {
            const filename = formData.fotoAtual.split('/').pop();
            const match = /\.(\w+)$/.exec(filename || '');
            const type = match ? `image/${match[1]}` : `image`;
            // @ts-ignore
            data.append('imagem', { uri: formData.fotoAtual, name: filename || 'foto.jpg', type });
        }

        if (formData.fotoResgate) {
            const filename = formData.fotoResgate.split('/').pop();
            const match = /\.(\w+)$/.exec(filename || '');
            const type = match ? `image/${match[1]}` : `image`;
            // @ts-ignore
            data.append('imagem_resgate', { uri: formData.fotoResgate, name: filename || 'resgate.jpg', type });
        }

        await api.post('/animais', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        setIsLoading(false);
        setSuccessModalVisible(true);

    } catch (error: any) {
        setIsLoading(false);
        console.error("Erro cadastro animal:", error.response?.data || error);
        Alert.alert("Erro", "Falha ao salvar animal. Verifique os dados.");
    }
  };

  const convertDate = (dateStr: string) => {
      if (!dateStr || dateStr.length !== 10) return '';
      const [dia, mes, ano] = dateStr.split('/');
      return `${ano}-${mes}-${dia}`;
  };

  // --- CONTEÚDO DAS ETAPAS ---
  const renderStepContent = () => {
    switch(step) {
        // Etapa 1: Dados Básicos
        case 1: return (
            <>
                <InputField label="Nome do animal" subLabel="Obrigatório" value={formData.nome} onChangeText={(t: string) => updateForm('nome', t)} />
                <SelectField label="Espécie" value={formData.especie} placeholder="Selecione" options={['Cachorro', 'Gato', 'Outro']} onPress={() => openOptionModal('especie', ['Cachorro', 'Gato', 'Outro'])} />
                <InputField label="Raça" subLabel="Opcional" value={formData.raca} onChangeText={(t: string) => updateForm('raca', t)} placeholder="Ex: Poodle"/>
                <SelectField label="Sexo" value={formData.sexo} placeholder="Selecione" options={['Macho', 'Fêmea']} onPress={() => openOptionModal('sexo', ['Macho', 'Fêmea'])} />
            </>
        );
        // Etapa 2: Idade / Data
        case 2: return (
            <>
                <InputField label="Idade aproximada" subLabel="Ex: 2 anos" value={formData.idade} onChangeText={(t: string) => updateForm('idade', t)} />
                <InputField label="Data de entrada/resgate" value={formData.dataResgate} onChangeText={(t: string) => updateForm('dataResgate', t)} mask={[/\d/,/\d/, '/', /\d/,/\d/, '/', /\d/,/\d/,/\d/,/\d/]} placeholder="00/00/0000"/>
            </>
        );
        // Etapa 3: Resgate (OPCIONAL AGORA)
        case 3: return (
            <>
                <Text style={styles.sectionHeaderTitle}>Informações de Resgate (Opcional)</Text>
                <InputField label="Onde foi encontrado" subLabel="Opcional" value={formData.localEncontro} onChangeText={(t: string) => updateForm('localEncontro', t)} placeholder="Rua, bairro..."/>
                <InputField label="Condição no resgate" subLabel="Opcional" value={formData.condicaoResgate} onChangeText={(t: string) => updateForm('condicaoResgate', t)} placeholder="Desnutrido, saudável..."/>
                <YesNoSelector label="Estava com filhotes?" value={formData.comFilhotes} onSelect={(val: string) => updateForm('comFilhotes', val)}/>
                <YesNoSelector label="Estava com coleira/ID?" value={formData.comColeira} onSelect={(val: string) => updateForm('comColeira', val)}/>
            </>
        );
        // Etapa 4: Saúde
        case 4: return (
            <>
                <Text style={styles.sectionHeaderTitle}>Exames realizados:</Text>
                <MedicalCheckbox label="Vermifugado" checked={formData.vermifugado} onCheck={() => updateForm('vermifugado', !formData.vermifugado)} textValue={formData.dataVermifugo} onTextChange={(t: string) => updateForm('dataVermifugo', t)} textPlaceholder="Data: 00/00/0000" mask={[/\d/,/\d/, '/', /\d/,/\d/, '/', /\d/,/\d/,/\d/,/\d/]} />
                <MedicalCheckbox label="Vacinado" checked={formData.vacinado} onCheck={() => updateForm('vacinado', !formData.vacinado)} textValue={formData.descVacina} onTextChange={(t: string) => updateForm('descVacina', t)} textPlaceholder="Quais / Data" />
                <MedicalCheckbox label="Castrado" checked={formData.castrado} onCheck={() => updateForm('castrado', !formData.castrado)} textValue={formData.dataCastracao} onTextChange={(t: string) => updateForm('dataCastracao', t)} textPlaceholder="Data: 00/00/0000" mask={[/\d/,/\d/, '/', /\d/,/\d/, '/', /\d/,/\d/,/\d/,/\d/]} />
                <MedicalCheckbox label="Testado (FIV/FeLV...)" checked={formData.doencas} onCheck={() => updateForm('doencas', !formData.doencas)} textValue={formData.descDoencas} onTextChange={(t: string) => updateForm('descDoencas', t)} textPlaceholder="Resultado..." />
                <View style={{ height: 15 }}/>
                <InputField label="Tratamentos em andamento:" value={formData.tratamentos} onChangeText={(t: string) => updateForm('tratamentos', t)} placeholder="Ex. antibióticos..." multiline={true} height={80} />
            </>
        );
        // Etapa 5: Disponibilidade
        case 5: return (
            <>
                <SelectField label="Local atual" value={formData.localAtual} placeholder="Selecione" options={['Lar temporário', 'Abrigo', 'Clínica']} onPress={() => openOptionModal('localAtual', ['Lar temporário', 'Abrigo', 'Clínica'])} />
            </>
        );
        // Etapa 6: Fotos
        case 6: return (
            <>
                <ImageUploadBox label="Foto do resgate" subLabel="Opcional" imageUri={formData.fotoResgate} onPress={() => pickImage('fotoResgate')} />
                <View style={{ height: 15 }}/>
                <ImageUploadBox label="Foto atual do animal" subLabel="Importante para divulgação" imageUri={formData.fotoAtual} onPress={() => pickImage('fotoAtual')} />
            </>
        );
        // Etapa 7: Detalhes Finais
        case 7: return (
            <>
                <InputField label="Observações gerais" subLabel="Opcional" value={formData.observacoes} onChangeText={(t: string) => updateForm('observacoes', t)} placeholder="Ex. dócil com crianças..." multiline={true} height={120} />
                <InputField label="História do pet" subLabel="Opcional" value={formData.historia} onChangeText={(t: string) => updateForm('historia', t)} placeholder="Conte a história..." multiline={true} height={180} />
            </>
        );
        default: return null;
    }
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* MODAL DE SELEÇÃO */}
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
                
                <TouchableOpacity 
                    style={styles.feedbackButton} 
                    onPress={() => { 
                        setSuccessModalVisible(false); 
                        router.replace('/(ong)/(tabs)/home-ong' as any); 
                    }}
                >
                    <Text style={styles.feedbackButtonText}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* --- MODAL DE ERRO --- */}
      <Modal visible={errorModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.feedbackCard}>
                <Text style={styles.feedbackTitle}>Ei, faltou algo!</Text>
                <Text style={styles.feedbackText}>Nome e Espécie são obrigatórios.</Text>
                
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
        <TouchableOpacity 
            style={[styles.nextButton, isLoading && { opacity: 0.7 }]} 
            onPress={handleNext}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
            ) : (
                <Text style={styles.nextButtonText}>{step === totalSteps ? "Finalizar" : "Prosseguir"}</Text>
            )}
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

// --- ESTILOS ---
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.background },
  headerContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  headerNav: { marginBottom: 10 },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.white, marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: '#E0E0E0', marginBottom: 10 },
  sectionHeaderTitle: { fontSize: 18, color: COLORS.white, marginBottom: 15, fontWeight: 'bold' },
  inputWrapper: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  labelText: { fontSize: 18, color: COLORS.white, fontWeight: '500' },
  subLabelText: { fontSize: 12, color: COLORS.border, marginLeft: 8 },
  input: { backgroundColor: COLORS.inputBg, borderRadius: 6, height: 55, paddingHorizontal: 15, fontSize: 16, color: COLORS.primary },
  selectButton: { backgroundColor: COLORS.inputBg, borderRadius: 6, height: 55, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectValueText: { fontSize: 16, color: COLORS.primary },
  checkboxWrapper: { marginBottom: 15 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  checkboxBox: { width: 24, height: 24, backgroundColor: COLORS.inputBg, borderRadius: 4, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checkboxBoxChecked: { backgroundColor: COLORS.white },
  checkboxText: { fontSize: 16, color: COLORS.white },
  conditionalInput: { backgroundColor: COLORS.inputBg, borderRadius: 6, height: 45, paddingHorizontal: 10, fontSize: 14, color: COLORS.primary, marginLeft: 34, marginTop: 5 },
  yesNoContainer: { flexDirection: 'row' },
  yesNoButton: { backgroundColor: COLORS.inputBg, borderRadius: 6, paddingVertical: 12, paddingHorizontal: 20, minWidth: 80, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  yesNoButtonActive: { borderColor: COLORS.white },
  yesNoText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16, opacity: 0.6 },
  yesNoTextActive: { opacity: 1 },
  uploadContainer: { backgroundColor: COLORS.inputBg, borderRadius: 12, height: 120, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderStyle: 'dashed', borderWidth: 1, borderColor: COLORS.border },
  uploadPlaceholderText: { fontSize: 14, color: COLORS.placeholder, textAlign: 'center', marginTop: 10, paddingHorizontal: 20 },
  uploadImagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingVertical: 30, paddingHorizontal: 30, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  nextButton: { backgroundColor: COLORS.primary, width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  nextButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  paginationContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  paginationDot: { width: 10, height: 10, borderRadius: 5 },
  paginationDotActive: { backgroundColor: COLORS.primary, width: 30 },
  paginationDotInactive: { backgroundColor: COLORS.border },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: COLORS.white, width: '80%', borderRadius: 12, padding: 20, maxHeight: '50%' },
  modalHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15, textAlign: 'center' },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalItemText: { fontSize: 16, color: '#333', textAlign: 'center' },
  feedbackCard: { backgroundColor: COLORS.white, width: '90%', borderRadius: 16, padding: 25, alignItems: 'center' },
  feedbackTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15, textAlign: 'center' },
  feedbackText: { fontSize: 14, color: COLORS.primary, textAlign: 'center', marginBottom: 15, lineHeight: 20 },
  feedbackButton: { backgroundColor: '#94B9D8', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, marginTop: 10, width: '100%', alignItems: 'center' },
  feedbackButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
});