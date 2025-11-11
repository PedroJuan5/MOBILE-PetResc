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
} from 'react-native';
import MaskInput from 'react-native-mask-input';

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
};


const CustomCheckbox = ({ label, isSelected, onSelect }: { label: string, isSelected: boolean, onSelect: () => void }) => (
  <TouchableOpacity style={styles.optionButton} onPress={onSelect}>
    <Ionicons
      name={isSelected ? 'md-checkbox' : 'md-square-outline'}
      size={26}
      color={isSelected ? '#005A9C' : '#a0a0a0'}
    />
    <Text style={styles.optionLabel}>{label}</Text>
  </TouchableOpacity>
);
const CustomRadio = ({ label, isSelected, onSelect }: { label: string, isSelected: boolean, onSelect: () => void }) => (
  <TouchableOpacity style={styles.optionButton} onPress={onSelect}>
    <Ionicons
      name={isSelected ? 'md-radio-button-on' : 'md-radio-button-off'}
      size={26}
      color={isSelected ? '#005A9C' : '#a0a0a0'}
    />
    <Text style={styles.optionLabel}>{label}</Text>
  </TouchableOpacity>
);

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

const Step2 = ({ formData, updateFormData, updateUnmasked }: StepProps) => (
  <>
    <Text style={styles.stepTitle}>Endereço</Text>
    <Text style={styles.label}>CEP</Text>
    <MaskInput
      style={styles.input}
      placeholder="00000-000"
      value={formData.cep}
      onChangeText={(masked, unmasked) => {
        updateFormData('cep', masked);
        updateUnmasked!('cepUnmasked', unmasked);
      }}
      mask={[/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/]}
      keyboardType="numeric"
    />
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

const Step6 = ({ formData, updateFormData }: StepProps) => (
  <>
    <Text style={styles.stepTitle}>Finalizando formulário</Text>
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

const Step7 = () => (
  <View style={styles.successContainer}>
    <Ionicons name="checkmark-circle-outline" size={80} color="#005A9C" />
    <Text style={styles.successTitle}>Formulário enviado</Text>
    <Text style={styles.successMessage}>
      Sua inscrição como Lar Temporário foi recebida com sucesso.
    </Text>
    <Text style={styles.successMessage}>
      Em breve, nossa equipe entrará em contato para alinhar os próximos passos e apresentar o animal que poderá ficar sob seus cuidados.
    </Text>
  </View>
);

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

//Componente Principal do Formulário 
export default function FormularioVoluntariosScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleNext = () => {
    if (step < 7) setStep(step + 1);
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
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(7);
      
    } catch (err) {
      Alert.alert("Erro", "Não foi possível enviar seu formulário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    const props: StepProps = { formData, updateFormData, updateUnmasked };
    switch (step) {
      case 1: return <Step1 {...props} />;
      case 2: return <Step2 {...props} />;
      case 3: return <Step3 {...props} />;
      case 4: return <Step4 {...props} />;
      case 5: return <Step5 {...props} />;
      case 6: return <Step6 {...props} />;
      case 7: return <Step7 />;
      default: return null;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Seja um lar temporário',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
          // @ts-ignore (Ignora o "falso positivo" do 'elevation')
          headerStyle: { backgroundColor: '#FFFFFF', elevation: 0, shadowOpacity: 0 },
          
          // @ts-ignore (Ignora o "falso positivo" do tipo do 'headerLeft')
          headerLeft: () =>
            step > 1 && step < 7 ? (
              <TouchableOpacity onPress={handleBack} style={{ paddingLeft: 20 }}>
                <Ionicons name="arrow-back" size={24} color="#005A9C" />
              </TouchableOpacity>
            ) : (step === 7 ? () => null : undefined),
          headerBackTitleVisible: false,
        }}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.subtitle}>Crie o conta suas seguindo suas necessidades</Text>
          {renderStep()}
        </ScrollView>
        
        {step < 6 && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.navButton} onPress={handleNext}>
              <Ionicons name="arrow-forward" size={28} color="white" />
            </TouchableOpacity>
          </View>
        )}
        {step === 6 && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Próximo</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
        {step === 7 && (
           <View style={styles.footer}>
            <TouchableOpacity style={styles.submitButton} onPress={() => router.back()}>
              <Text style={styles.submitButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
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
    // @ts-ignore --- CORREÇÃO 3 (Ignora o "falso positivo" do 'elevation')
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
  submitButton: {
    backgroundColor: '#005A9C',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#005A9C',
    marginTop: 20,
    marginBottom: 15,
  },
  successMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },
});
