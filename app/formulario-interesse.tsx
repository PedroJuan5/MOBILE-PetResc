import React, { useState, useMemo } from 'react';
import {View,Text, StyleSheet,ScrollView, TextInput,TouchableOpacity,Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import MaskInput from 'react-native-mask-input';

//define o tipo para os dados do formulário
interface FormData {
  termsAccepted: boolean;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  cidadeEstado: string;
  tipoMoradia: string;
  porteAceito: string;
  animalAceito: string;
  viuPetInteresse: string; // 'sim' | 'nao'
  tipoPetInteresse: string; // (se nao)
  preferenciaSexo: string; // (se nao)
  codigoPet: string; // (se sim)
}

export default function FormularioInteresseScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1); 

  const [formData, setFormData] = useState<FormData>({
    termsAccepted: false,
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    cidadeEstado: '',
    tipoMoradia: '',
    porteAceito: '',
    animalAceito: '',
    viuPetInteresse: '',
    tipoPetInteresse: '',
    preferenciaSexo: '',
    codigoPet: '',
  });

  //função para atualizar o estado do formulário
  const updateFormData = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  //logica da Barra de Progresso
  const { currentProgressStep, totalProgressSteps } = useMemo(() => {
    let total = 10; // Caminho padrão (1-8 + 9 + 10)
    let current = step;

    if (formData.viuPetInteresse === 'sim') {
      total = 9;
      if (step === 11) current = 9; 
    } else if (formData.viuPetInteresse === 'nao') {
      total = 10;
      if (step === 9) current = 9;
      if (step === 10) current = 10;
    } else {
      total = 10;
    }
    return { currentProgressStep: current, totalProgressSteps: total };
  }, [step, formData.viuPetInteresse]);
 

  //função para lidar com o botao "Voltar"
  const handleBack = () => {
    if (step === 1) {
      router.back(); 
    } else if (step === 11 || step === 9) {
      setStep(8); 
    } else {
      setStep(step - 1);
    }
  };

  //função para lidar com o botão "Próximo"
  const handleNext = () => {
    //validações de cada passo
    if (step === 2 && !formData.termsAccepted) {
      Alert.alert('Atenção', 'Você precisa aceitar os termos para continuar.');
      return;
    }
    if (
      step === 3 &&
      (!formData.nome ||
        !formData.cpf ||
        !formData.dataNascimento ||
        !formData.telefone ||
        !formData.email ||
        formData.cpf.length !== 14 ||
        formData.dataNascimento.length !== 10)
    ) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos corretamente.');
      return;
    }
    if (step === 4 && (!formData.cep || !formData.rua || !formData.numero || !formData.cidadeEstado)) {
      Alert.alert('Atenção', 'Por favor, preencha os campos de endereço obrigatórios.');
      return;
    }
    if (step === 5 && !formData.tipoMoradia) {
      Alert.alert('Atenção', 'Por favor, selecione o tipo de moradia.');
      return;
    }
    if (step === 6 && !formData.porteAceito) {
      Alert.alert('Atenção', 'Por favor, selecione o porte aceito.');
      return;
    }
    if (step === 7 && !formData.animalAceito) {
      Alert.alert('Atenção', 'Por favor, selecione os animais aceitos.');
      return;
    }

    //logica de Ramificação
    if (step === 8) {
      if (!formData.viuPetInteresse) {
        Alert.alert('Atenção', 'Por favor, selecione uma opção.');
        return;
      }
      if (formData.viuPetInteresse === 'sim') {
        setStep(11); 
      } else {
        setStep(9);
      }
      return; 
    }
    
    // validação do caminho "Não sei qual pet"
    if (step === 9 && !formData.tipoPetInteresse) {
      Alert.alert('Atenção', 'Por favor, selecione o tipo de pet.');
      return;
    }
    if (step === 10) {
      if (!formData.preferenciaSexo) {
        Alert.alert('Atenção', 'Por favor, selecione a preferência de sexo.');
        return;
      }
      
      submitForm();
      return;
    }

    if (step === 11) {
      if (!formData.codigoPet) {
        Alert.alert('Atenção', 'Por favor, insira o código do pet.');
        return;
      }

      submitForm();
      return;
    }

    if (step < 8) {
      setStep(step + 1);
    }
  };

  const submitForm = () => {
    console.log('Formulário completo:', formData);
    Alert.alert(
      'Formulário Enviado!',
      'Seu formulário de interesse foi enviado com sucesso. A ONG entrará em contato em breve.',
    );
    router.back(); //volta para a tela de voluntários
  };


  const SingleChoiceOption = ({
    label,
    value,
    icon,
    field,
  }: {
    label: string;
    value: string;
    icon: string;
    field: keyof FormData;
  }) => (
    <TouchableOpacity
      style={[styles.choiceOption, formData[field] === value && styles.choiceOptionSelected]}
      onPress={() => updateFormData(field, value)}
    >
      <Text style={[styles.choiceIcon, formData[field] === value && styles.choiceTextSelected]}>
        {icon}
      </Text>
      <Text style={[styles.choiceLabel, formData[field] === value && styles.choiceTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
              <Feather name="chevron-left" size={28} color="#005A9C" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <Feather name="user" size={24} color="#005A9C" />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
          headerTitle: () => (
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${(currentProgressStep / totalProgressSteps) * 100}%` },
                ]}
              />
            </View>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
      

  
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Formulário de interesse em adoção</Text>
            <Text style={styles.stepParagraph}>
              Bem-vindo(a) ao nosso Formulário de Interesse. Ficamos muito felizes por você ter dado
              o primeiro passo para adotar um pet.
            </Text>
            <Text style={styles.stepParagraph}>
              Aqui você irá responder algumas perguntas iniciais para que a ONG/protetor parceiro
              possa te conhecer melhor e dar agilidade ao processo de adoção.
            </Text>
          </View>
        )}

       
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Antes de começar</Text>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => updateFormData('termsAccepted', !formData.termsAccepted)}
            >
              <MaterialCommunityIcons
                name={formData.termsAccepted ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                size={28}
                color="#005A9C"
              />
              <Text style={styles.checkboxLabel}>
                Declaro que sou maior de 18 anos, li e estou ciente das informações pessoais e do
                acordo em compartilhar meus dados para fins de contato por uma ONG/protetor.
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Informações pessoais</Text>
            <Text style={styles.inputLabel}>Nome completo</Text>
            <TextInput
              style={styles.input}
              value={formData.nome}
              onChangeText={(val) => updateFormData('nome', val)}
            />
            <Text style={styles.inputLabel}>CPF</Text>
            <MaskInput
              style={styles.input}
              value={formData.cpf}
              onChangeText={(masked) => updateFormData('cpf', masked)}
              mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
              placeholder="000.000.000-00"
              keyboardType="numeric"
            />
            <Text style={styles.inputLabel}>Data de nascimento</Text>
            <MaskInput
              style={styles.input}
              value={formData.dataNascimento}
              onChangeText={(masked) => updateFormData('dataNascimento', masked)}
              mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
            />
            <Text style={styles.inputLabel}>Telefone</Text>
            <MaskInput
              style={styles.input}
              value={formData.telefone}
              onChangeText={(masked) => updateFormData('telefone', masked)}
              mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
              placeholder="(00) 00000-0000"
              keyboardType="numeric"
            />
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(val) => updateFormData('email', val)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Endereço</Text>
            <Text style={styles.inputLabel}>CEP</Text>

            <MaskInput
              style={styles.input}
              value={formData.cep}
              onChangeText={(masked) => updateFormData('cep', masked)}
              mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
              placeholder="00000-000"
              keyboardType="numeric"
            />
            <Text style={styles.inputLabel}>Rua/Avenida e Bairro</Text>
            <TextInput
              style={styles.input}
              value={formData.rua}
              onChangeText={(val) => updateFormData('rua', val)}
            />
            <Text style={styles.inputLabel}>Número</Text>
            <TextInput
              style={styles.input}
              value={formData.numero}
              onChangeText={(val) => updateFormData('numero', val)}
              keyboardType="numeric"
            />
            <Text style={styles.inputLabel}>Complemento (Opcional)</Text>
            <TextInput
              style={styles.input}
              value={formData.complemento}
              onChangeText={(val) => updateFormData('complemento', val)}
            />
            <Text style={styles.inputLabel}>Cidade e Estado</Text>
            <TextInput
              style={styles.input}
              value={formData.cidadeEstado}
              onChangeText={(val) => updateFormData('cidadeEstado', val)}
              placeholder="Ex: São Paulo, SP"
            />
          </View>
        )}

        {step === 5 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Tipo de moradia:</Text>
            <SingleChoiceOption label="Casa" value="casa" icon="A" field="tipoMoradia" />
            <SingleChoiceOption
              label="Apartamento"
              value="apartamento"
              icon="B"
              field="tipoMoradia"
            />
            <SingleChoiceOption label="Sítio" value="sitio" icon="C" field="tipoMoradia" />
            <SingleChoiceOption label="Outro" value="outro" icon="D" field="tipoMoradia" />
          </View>
        )}

        {step === 6 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Quais portes são aceitos:</Text>
            <SingleChoiceOption label="Pequeno" value="pequeno" icon="A" field="porteAceito" />
            <SingleChoiceOption label="Médio" value="medio" icon="B" field="porteAceito" />
            <SingleChoiceOption label="Grande" value="grande" icon="C" field="porteAceito" />
            <SingleChoiceOption label="Todos" value="todos" icon="D" field="porteAceito" />
          </View>
        )}

        {step === 7 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Quais animais são aceitos:</Text>
            <SingleChoiceOption label="Gato" value="gato" icon="A" field="animalAceito" />
            <SingleChoiceOption label="Cachorro" value="cachorro" icon="B" field="animalAceito" />
            <SingleChoiceOption label="Pássaros" value="passaros" icon="C" field="animalAceito" />
            <SingleChoiceOption label="Todos" value="todos" icon="D" field="animalAceito" />
          </View>
        )}

        {step === 8 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Você já viu algum pet que tem interesse em adotar?</Text>
            <SingleChoiceOption
              label="Sim, já sei qual quero."
              value="sim"
              icon="A"
              field="viuPetInteresse"
            />
            <SingleChoiceOption
              label="Não, quero achar um."
              value="nao"
              icon="B"
              field="viuPetInteresse"
            />
          </View>
        )}

        {step === 9 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Qual tipo de pet que tem interesse em adotar?</Text>
            <SingleChoiceOption
              label="Gato"
              value="gato"
              icon="A"
              field="tipoPetInteresse"
            />
            <SingleChoiceOption
              label="Cachorro"
              value="cachorro"
              icon="B"
              field="tipoPetInteresse"
            />
            <SingleChoiceOption
              label="Pássaros"
              value="passaros"
              icon="C"
              field="tipoPetInteresse"
            />
          </View>
        )}

        {step === 10 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Qual a sua preferência que o pet seja:</Text>
            <SingleChoiceOption
              label="Macho"
              value="macho"
              icon="A"
              field="preferenciaSexo"
            />
            <SingleChoiceOption
              label="Fêmea"
              value="femea"
              icon="B"
              field="preferenciaSexo"
            />
            <SingleChoiceOption
              label="Tanto faz"
              value="tanto"
              icon="C"
              field="preferenciaSexo"
            />
          </View>
        )}

        {step === 11 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Qual é o código do pet?</Text>
            <Text style={styles.stepParagraph}>
              Este código aparece no perfil do pet.
            </Text>
            <TextInput
              style={styles.input}
              value={formData.codigoPet}
              onChangeText={(val) => updateFormData('codigoPet', val)}
              placeholder="Ex: #A123"
              autoCapitalize="characters"
            />
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Feather
          name={
            (step === 10 && formData.preferenciaSexo) || (step === 11 && formData.codigoPet)
              ? 'check'
              : 'chevron-right'
          }
          size={32}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: 25,
    paddingBottom: 100, 
  },
  headerButton: {
    padding: 10,
  },
  progressContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#005A9C',
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005A9C',
    marginBottom: 20,
  },
  stepParagraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  // Checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 8,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
    flex: 1, 
  },
  // Inputs
  inputLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  choiceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  choiceOptionSelected: {
    borderColor: '#005A9C',
    backgroundColor: '#E6F3FF',
  },
  choiceIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005A9C',
    width: 30,
    textAlign: 'center',
  },
  choiceLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  choiceTextSelected: {
    color: '#005A9C',
    fontWeight: 'bold',
  },
  nextButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#005A9C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});