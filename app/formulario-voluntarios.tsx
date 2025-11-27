import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Keyboard,
} from 'react-native';
import MaskInput from 'react-native-mask-input';

//Definição de Tipos 
interface FormDataState {
  nome: string;
  cpf: string;
  cpfUnmasked: string;
  dataNascimento: string;
  dataNascimentoUnmasked: string;
  telefone: string;
  telefoneUnmasked: string;
  email: string;
  cep: string;
  cepUnmasked: string;
  ruaBairro: string;
  numero: string;
  complemento: string;
  cidadeEstado: string;
  tipoMoradia: string | null;
  possuiQuintal: boolean | null;
  portesAceitos: string[];
  especiesAceitas: string[];
  outrosAnimais: boolean | null;
  administrarMedicamentos: boolean | null;
  disponibilidadeVeterinario: boolean | null;
  fornecerRacao: boolean | null;
  ajudaONGSuprimentos: boolean | null;
  tempoDisponibilidade: string;
  declaracaoCompromisso: boolean;
  aceiteObrigatorio: boolean;
}

type StepProps = {
  formData: FormDataState;
  updateFormData: (key: keyof FormDataState, value: any, isCheckbox?: boolean) => void;
  updateUnmasked?: (key: keyof FormDataState, value: string) => void;
  isLoadingCep?: boolean;
  onFetchCep?: (cep: string) => void;
};

// Componente para Múltipla Escolha (Quadrado)
const CustomCheckbox = ({ label, isSelected, onSelect }: { label: string, isSelected: boolean, onSelect: () => void }) => (
  <TouchableOpacity style={styles.optionButton} onPress={onSelect}>
    <Ionicons
      name={isSelected ? 'checkbox' : 'square-outline'}
      size={26}
      color={isSelected ? '#005A9C' : '#a0a0a0'}
    />
    <Text style={styles.optionLabel}>{label}</Text>
  </TouchableOpacity>
);

// Componente para Escolha Única (Redondo)
const CustomRadio = ({ label, isSelected, onSelect }: { label: string, isSelected: boolean, onSelect: () => void }) => (
  <TouchableOpacity style={styles.optionButton} onPress={onSelect}>
    <Ionicons
      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
      size={26}
      color={isSelected ? '#005A9C' : '#a0a0a0'}
    />
    <Text style={styles.optionLabel}>{label}</Text>
  </TouchableOpacity>
);


//Informações Pessoais
const Step1 = ({ formData, updateFormData, updateUnmasked }: StepProps) => (
  <>
    <Text style={styles.stepTitle}>Informações pessoais</Text>
    <Text style={styles.label}>Nome completo</Text>
    <TextInput
      style={styles.input}
      placeholder="Digite seu nome"
      value={formData.nome}
      onChangeText={(v) => updateFormData('nome', v)}
      maxLength={100}
    />
    <Text style={styles.label}>CPF</Text>
    <MaskInput
      style={styles.input}
      placeholder="000.000.000-00"
      value={formData.cpf}
      onChangeText={(masked, unmasked) => {
        updateFormData('cpf', masked);
        updateUnmasked!('cpfUnmasked', unmasked); 
      }}
      mask={[/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'-',/\d/,/\d/]}
      keyboardType="numeric"
    />
    <Text style={styles.label}>Data de nascimento</Text>
    <MaskInput
      style={styles.input}
      placeholder="DD/MM/AAAA"
      value={formData.dataNascimento}
      onChangeText={(masked, unmasked) => {
        updateFormData('dataNascimento', masked);
        updateUnmasked!('dataNascimentoUnmasked', unmasked);
      }}
      mask={[/\d/,/\d/,'/',/\d/,/\d/,'/',/\d/,/\d/,/\d/,/\d/]}
      keyboardType="numeric"
    />
    <Text style={styles.label}>Telefone</Text>
    <MaskInput
      style={styles.input}
      placeholder="(00) 00000-0000"
      value={formData.telefone}
      onChangeText={(masked, unmasked) => {
        updateFormData('telefone', masked);
        updateUnmasked!('telefoneUnmasked', unmasked);
      }}
      mask={['(',/\d/,/\d/,')',' ',/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/]}
      keyboardType="phone-pad"
    />
    <Text style={styles.label}>E-mail</Text>
    <TextInput
      style={styles.input}
      placeholder="seuemail@exemplo.com"
      value={formData.email}
      onChangeText={(v) => updateFormData('email', v)}
      keyboardType="email-address"
      autoCapitalize="none"
      maxLength={100}
    />
  </>
);

//Endereço
const Step2 = ({ formData, updateFormData, updateUnmasked, isLoadingCep, onFetchCep }: StepProps) => (
  <>
    <Text style={styles.stepTitle}>Endereço</Text>
    
    <Text style={styles.label}>CEP</Text>
    <View style={styles.cepContainer}>
      <MaskInput
        style={[styles.input, { flex: 1, marginBottom: 0 }]} 
        placeholder="00000-000"
        value={formData.cep}
        onChangeText={(masked, unmasked) => {
          updateFormData('cep', masked);
          updateUnmasked!('cepUnmasked', unmasked);
          
          if (unmasked.length === 8 && onFetchCep) {
            onFetchCep(unmasked);
          }
        }}
        mask={[/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/]}
        keyboardType="numeric"
      />
      {isLoadingCep && (
        <View style={styles.loadingIcon}>
            <ActivityIndicator size="small" color="#005A9C" />
        </View>
      )}
    </View>
    <View style={{ marginBottom: 20 }} /> 

    <Text style={styles.label}>Rua/Avenida e Bairro</Text>
    <TextInput
      style={styles.input}
      placeholder="Ex: Av. Paulista, Bela Vista"
      value={formData.ruaBairro}
      onChangeText={(v) => updateFormData('ruaBairro', v)}
      maxLength={150}
    />
    <Text style={styles.label}>Número</Text>
    <TextInput
      style={styles.input}
      placeholder="Digite o número"
      value={formData.numero}
      onChangeText={(v) => updateFormData('numero', v)}
      keyboardType="numeric"
      maxLength={10}
    />
    <Text style={styles.label}>Complemento</Text>
    <TextInput
      style={styles.input}
      placeholder="Ex: Apto 101, Bloco B"
      value={formData.complemento}
      onChangeText={(v) => updateFormData('complemento', v)}
      maxLength={50}
    />
    <Text style={styles.label}>Cidade e Estado</Text>
    <TextInput
      style={styles.input}
      placeholder="Ex: São Paulo, SP"
      value={formData.cidadeEstado}
      onChangeText={(v) => updateFormData('cidadeEstado', v)}
      maxLength={100}
    />
  </>
);

// --- CORREÇÃO AQUI NO STEP 3 ---
const Step3 = ({ formData, updateFormData }: StepProps) => (
  <>
    <Text style={styles.stepTitle}>Sobre o espaço disponível</Text>
    <Text style={styles.label}>Tipo de moradia:</Text>
    <View style={styles.optionRow}>
      <CustomRadio label="Casa" isSelected={formData.tipoMoradia === 'Casa'} onSelect={() => updateFormData('tipoMoradia', 'Casa')} />
      <CustomRadio label="Apartamento" isSelected={formData.tipoMoradia === 'Apartamento'} onSelect={() => updateFormData('tipoMoradia', 'Apartamento')} />
    </View>
    <View style={styles.optionRow}>
      <CustomRadio label="Sítio" isSelected={formData.tipoMoradia === 'Sitio'} onSelect={() => updateFormData('tipoMoradia', 'Sitio')} />
      <CustomRadio label="Outro" isSelected={formData.tipoMoradia === 'Outro'} onSelect={() => updateFormData('tipoMoradia', 'Outro')} />
    </View>

    <Text style={styles.label}>Possui quintal?</Text>
    <View style={styles.optionRow}>
      <CustomRadio label="Sim" isSelected={formData.possuiQuintal === true} onSelect={() => updateFormData('possuiQuintal', true)} />
      <CustomRadio label="Não" isSelected={formData.possuiQuintal === false} onSelect={() => updateFormData('possuiQuintal', false)} />
    </View>

    <Text style={styles.label}>Quais portes aceita?</Text>
    <View style={styles.optionRow}>
      <CustomCheckbox label="Pequeno" isSelected={formData.portesAceitos.includes('Pequeno')} onSelect={() => updateFormData('portesAceitos', 'Pequeno', true)} />
      
      {/* CORREÇÃO: Mudado de 'Média' para 'Médio' para bater com o filtro includes('Médio') */}
      <CustomCheckbox label="Médio" isSelected={formData.portesAceitos.includes('Médio')} onSelect={() => updateFormData('portesAceitos', 'Médio', true)} />
      
      <CustomCheckbox label="Grande" isSelected={formData.portesAceitos.includes('Grande')} onSelect={() => updateFormData('portesAceitos', 'Grande', true)} />
    </View>

    <Text style={styles.label}>Quais espécies aceita?</Text>
    <View style={styles.optionRow}>
      <CustomCheckbox label="Gato" isSelected={formData.especiesAceitas.includes('Gato')} onSelect={() => updateFormData('especiesAceitas', 'Gato', true)} />
      <CustomCheckbox label="Cão" isSelected={formData.especiesAceitas.includes('Cão')} onSelect={() => updateFormData('especiesAceitas', 'Cão', true)} />
      <CustomCheckbox label="Todos" isSelected={formData.especiesAceitas.includes('Todos')} onSelect={() => updateFormData('especiesAceitas', 'Todos', true)} />
    </View>
  </>
);
// --------------------------------

//Experiência com animais
const Step4 = ({ formData, updateFormData }: StepProps) => (
  <>
    <Text style={styles.stepTitle}>Experiência com animais</Text>
    <Text style={styles.label}>Possui outros animais em casa?</Text>
    <View style={styles.optionRow}>
      <CustomRadio label="Sim" isSelected={formData.outrosAnimais === true} onSelect={() => updateFormData('outrosAnimais', true)} />
      <CustomRadio label="Não" isSelected={formData.outrosAnimais === false} onSelect={() => updateFormData('outrosAnimais', false)} />
    </View>

    <Text style={styles.label}>Está disposto a administrar medicamentos, se necessário?</Text>
    <View style={styles.optionRow}>
      <CustomRadio label="Sim" isSelected={formData.administrarMedicamentos === true} onSelect={() => updateFormData('administrarMedicamentos', true)} />
      <CustomRadio label="Não" isSelected={formData.administrarMedicamentos === false} onSelect={() => updateFormData('administrarMedicamentos', false)} />
    </View>

    <Text style={styles.label}>Tem disponibilidade para levar o animal ao veterinário, se solicitado pela ONG?</Text>
    <View style={styles.optionRow}>
      <CustomRadio label="Sim" isSelected={formData.disponibilidadeVeterinario === true} onSelect={() => updateFormData('disponibilidadeVeterinario', true)} />
      <CustomRadio label="Não" isSelected={formData.disponibilidadeVeterinario === false} onSelect={() => updateFormData('disponibilidadeVeterinario', false)} />
    </View>
  </>
);

//Recursos e condições
const Step5 = ({ formData, updateFormData }: StepProps) => (
  <>
    <Text style={styles.stepTitle}>Recursos e condições</Text>
    <Text style={styles.label}>Pode fornecer ração e cuidados básicos?</Text>
    <View style={styles.optionRow}>
      <CustomRadio label="Sim" isSelected={formData.fornecerRacao === true} onSelect={() => updateFormData('fornecerRacao', true)} />
      <CustomRadio label="Não" isSelected={formData.fornecerRacao === false} onSelect={() => updateFormData('fornecerRacao', false)} />
    </View>

    <Text style={styles.label}>Precisa de ajuda da ONG com suprimentos?</Text>
    <View style={styles.optionRow}>
      <CustomRadio label="Sim" isSelected={formData.ajudaONGSuprimentos === true} onSelect={() => updateFormData('ajudaONGSuprimentos', true)} />
      <CustomRadio label="Não" isSelected={formData.ajudaONGSuprimentos === false} onSelect={() => updateFormData('ajudaONGSuprimentos', false)} />
    </View>

    <Text style={styles.label}>Tempo de disponibilidade</Text>
    <TextInput
      style={styles.input}
      placeholder="Período disponível para abrigar"
      value={formData.tempoDisponibilidade}
      onChangeText={(v) => updateFormData('tempoDisponibilidade', v)}
      maxLength={100}
    />
  </>
);

//Finalizando
const Step6 = ({ formData, updateFormData }: StepProps) => (
  <>
    <Text style={styles.modalTitle}>Finalizando formulário</Text>
    <CustomCheckbox
      label="Declaração de que se compromete a cuidar do animal com responsabilidade, respeitando as orientações da ONG."
      isSelected={formData.declaracaoCompromisso}
      onSelect={() => updateFormData('declaracaoCompromisso', !formData.declaracaoCompromisso)}
    />
    <View style={{ height: 20 }} />
    <CustomCheckbox
      label="Aceite obrigatório antes do envio."
      isSelected={formData.aceiteObrigatorio}
      onSelect={() => updateFormData('aceiteObrigatorio', !formData.aceiteObrigatorio)}
    />
  </>
);

//Formulário Enviado
const Step7 = () => (
  <>
    <Text style={styles.modalTitle}>Formulário enviado</Text>
    <Text style={styles.modalMessage}>
      Sua inscrição como Lar Temporário foi recebida com sucesso.
    </Text>
    <Text style={styles.modalMessage}>
      Em breve, nossa equipe entrará em contato para alinhar os próximos passos e apresentar o animal que poderá ficar sob seus cuidados.
    </Text>
  </>
);


//Dados Iniciais
const initialState: FormDataState = {
  nome: '',
  cpf: '',
  cpfUnmasked: '',
  dataNascimento: '',
  dataNascimentoUnmasked: '',
  telefone: '',
  telefoneUnmasked: '',
  email: '',
  cep: '',
  cepUnmasked: '',
  ruaBairro: '',
  numero: '',
  complemento: '',
  cidadeEstado: '',
  tipoMoradia: null,
  possuiQuintal: null,
  portesAceitos: [],
  especiesAceitas: [],
  outrosAnimais: null,
  administrarMedicamentos: null,
  disponibilidadeVeterinario: null,
  fornecerRacao: null,
  ajudaONGSuprimentos: null,
  tempoDisponibilidade: '',
  declaracaoCompromisso: false,
  aceiteObrigatorio: false,
};

//Componente Principal
export default function FormularioVoluntariosScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<'finalizando' | 'enviado'>('finalizando');
  const [isLoadingCep, setIsLoadingCep] = useState(false);


  const updateFormData = (key: keyof FormDataState, value: any, isCheckbox: boolean = false) => {
    setFormData(prev => {
      if (isCheckbox) {
        const currentValues = prev[key] as string[];
        if (currentValues.includes(value)) {
          return { ...prev, [key]: currentValues.filter(item => item !== value) };
        } else {
          return { ...prev, [key]: [...currentValues, value] };
        }
      }
      return { ...prev, [key]: value };
    });
  };

  const updateUnmasked = (key: keyof FormDataState, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const fetchAddress = async (cep: string) => {
      setIsLoadingCep(true);
      Keyboard.dismiss(); 
      
      try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();

          if (data.erro) {
              Alert.alert('Erro', 'CEP não encontrado.');
              setIsLoadingCep(false);
              return;
          }

          setFormData(prev => ({
              ...prev,
              ruaBairro: `${data.logradouro} - ${data.bairro}`, 
              cidadeEstado: `${data.localidade} - ${data.uf}`
          }));

      } catch (error) {
          Alert.alert('Erro', 'Falha ao buscar endereço. Verifique sua conexão.');
      } finally {
          setIsLoadingCep(false);
      }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } 
    else if (step === 5) {
      setModalContent('finalizando');
      setIsModalVisible(true);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!formData.declaracaoCompromisso || !formData.aceiteObrigatorio) {
      Alert.alert("Atenção", "Você precisa aceitar os termos para finalizar.");
      return;
    }
    if (!formData.nome || !formData.cpfUnmasked || !formData.email || !formData.telefoneUnmasked || !formData.cepUnmasked) {
      Alert.alert("Formulário incompleto", "Por favor, volte e preencha todos os campos obrigatórios (Passo 1 e 2).");
      setStep(1);
      setIsModalVisible(false);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setModalContent('enviado');
    } catch (err) {
      Alert.alert("Erro", "Não foi possível enviar seu formulário. Tente novamente.");
      setIsModalVisible(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCloseSuccessModal = () => {
    setIsModalVisible(false);
    router.back();
  };

  const renderStep = () => {
    const props: StepProps = { 
        formData, 
        updateFormData, 
        updateUnmasked,
        isLoadingCep,
        onFetchCep: fetchAddress 
    };

    switch (step) {
      case 1: return <Step1 {...props} />;
      case 2: return <Step2 {...props} />;
      case 3: return <Step3 {...props} />;
      case 4: return <Step4 {...props} />;
      case 5: return <Step5 {...props} />;
      default: return null;
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          {!isModalVisible && (
            <View style={styles.headerContainer}>
              {step === 1 && (
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#005A9C" />
                </TouchableOpacity>
              )}
              {step > 1 && step <= 5 && (
                 <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#005A9C" />
                </TouchableOpacity>
              )}
            </View>
          )}

          <Text style={styles.mainTitle}>Seja um lar temporário</Text>
          <Text style={styles.subtitle}>Crie o conta suas seguindo suas necessidadees</Text>
          
          {renderStep()}
        </ScrollView>
        
        {step <= 5 && !isModalVisible && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.navButton} onPress={handleNext}>
              <Ionicons name="arrow-forward" size={28} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalPopup}>
            
            {modalContent === 'finalizando' ? (
              <>
                <Step6 formData={formData} updateFormData={updateFormData} />
                <TouchableOpacity style={[styles.modalButton, isLoading && styles.buttonDisabled]} onPress={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color="#1c5b8f" />
                  ) : (
                    <Text style={styles.modalButtonText}>Próximo</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Step7 />
                <TouchableOpacity style={styles.modalButton} onPress={handleCloseSuccessModal}>
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  headerContainer: {
    width: '100%',
    height: 30, 
    justifyContent: 'center',
    alignItems: 'flex-start', 
    marginBottom: 10, 
  },
  backButton: {},
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#005A9C',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005A9C',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  cepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  loadingIcon: {
    position: 'absolute',
    right: 15,
  },
  optionRow: {
    flexDirection: 'row',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'flex-end',
    // @ts-ignore
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  navButton: {
    backgroundColor: '#005A9C',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalPopup: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005A9C',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#94B9D8',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  modalButtonText: {
    color: '#1c5b8f',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});