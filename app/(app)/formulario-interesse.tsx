import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  StatusBar,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import MaskInput from 'react-native-mask-input';
import api from '@/lib/axios';

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

  viuPetInteresse: string;
  tipoPetInteresse: string;
  preferenciaSexo: string;
  codigoPet: string;

  pessoasLar: string;
  qtdOutrosAnimais: string;
  tipoOutrosAnimais: string;
  temAlergia: string;

  declaracaoCompromisso: boolean;
  aceiteObrigatorio: boolean;
}

export default function FormularioInteresseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [step, setStep] = useState<number>(1); 
  
  // --- MUDANÇA 1: Modal começa fechado ---
  const [showTermsModal, setShowTermsModal] = useState(false); 

  const [loadingCep, setLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsExpanded, setTermsExpanded] = useState(false);

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

    viuPetInteresse: params?.animalId ? 'sim' : '',
    tipoPetInteresse: '',
    preferenciaSexo: '',
    codigoPet: (params?.animalId as string) || '',

    pessoasLar: '',
    qtdOutrosAnimais: '',
    tipoOutrosAnimais: '',
    temAlergia: '',

    declaracaoCompromisso: false,
    aceiteObrigatorio: false
  });

  const updateFormData = (key: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const buscarCep = async (cepDigitado: string) => {
    const cepLimpo = cepDigitado.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    setLoadingCep(true);
    Keyboard.dismiss();
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado.');
        setLoadingCep(false);
        return;
      }
      setFormData(prev => ({
        ...prev,
        rua: `${data.logradouro} - ${data.bairro}`,
        cidadeEstado: `${data.localidade} - ${data.uf}`,
        cep: cepDigitado
      }));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar o endereço.');
    } finally {
      setLoadingCep(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
        router.back(); 
    } else if (step === 3) {
        setStep(1); 
    } else if (step === 12) {
      if (formData.viuPetInteresse === 'sim') setStep(11);
      else setStep(10);
    } else if (step === 11) setStep(8);
    else if (step === 9) setStep(8);
    else setStep(step - 1);
  };

  const finalizarFormulario = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const meRes = await api.get('/usuarios/me');
      const user = meRes.data;
      const userId = user?.id;

      const cidadeSplit = (formData.cidadeEstado || '').split(' - ');
      const cidade = cidadeSplit[0] || '';
      const estado = cidadeSplit[1] || formData.cidadeEstado || '';

      if (userId) {
        try {
          await api.put(`/usuarios/${userId}`, {
            nome: formData.nome || user.nome,
            telefone: formData.telefone || user.telefone,
            cpf: formData.cpf || user.cpf,
            email: formData.email || user.email,
            cep: formData.cep || user.cep,
            rua: formData.rua || user.rua,
            numero: formData.numero || user.numero,
            complemento: formData.complemento || user.complemento,
            bairro: user.bairro || '',
            cidade: cidade || user.cidade,
            estado: estado || user.estado,
            tipoMoradia: formData.tipoMoradia || (user.tipoMoradia ?? undefined),
            pessoasNaCasa: formData.pessoasLar || (user.pessoasNaCasa ?? undefined),
            alergias: formData.temAlergia || (user.alergias ?? undefined)
          } as any);
        } catch (err) {
          console.warn('Falha ao atualizar perfil:', err);
        }
      }

      if (!formData.codigoPet) {
        setStep(16);
        return;
      }

      const payload = {
        animalId: parseInt(formData.codigoPet.replace(/\D/g, '')) || parseInt(formData.codigoPet) || null,
        respostasFormulario: {
          tipoMoradia: formData.tipoMoradia || 'Não informado',
          possuiQuintal: undefined,
          quintalTelado: undefined,
          janelasTeladas: undefined,
          moradiaPropria: undefined,
          todosConcordam: undefined,
          criancasEmCasa: undefined,
          alergias: formData.temAlergia === 'sim' ? 'sim' : 'nao',
          possuiOutrosAnimais: formData.qtdOutrosAnimais && Number(formData.qtdOutrosAnimais) > 0 ? 'sim' : 'nao',
          teveAnimaisAntes: undefined,
          temVeterinario: undefined,
          cienteCustos: undefined,
          pessoasNaCasa: formData.pessoasLar || '1',
          horasSozinho: undefined,
          rotinaPasseios: undefined,
          quemCuidara: undefined,
          historicoAnimais: undefined,
          motivoAdocao: `Interesse via app - preferencia: ${formData.preferenciaSexo || 'N/A'}`,
          observacoes: `Telefone: ${formData.telefone || ''} | Email: ${formData.email || ''} | Outros animais: ${formData.qtdOutrosAnimais || '0'} - ${formData.tipoOutrosAnimais || ''}`
        }
      };

      if (!payload.animalId || Number.isNaN(payload.animalId)) {
        Alert.alert('Atenção', 'Código do pet inválido. Verifique e tente novamente.');
        setIsSubmitting(false);
        return;
      }

      const res = await api.post('/pedidos-adocao', payload);
      if (res?.status === 201 || res?.status === 200) {
        setStep(16);
      } else {
        Alert.alert('Erro', 'Ocorreu um problema ao enviar o pedido. Tente novamente.');
      }
    } catch (err: any) {
      console.error('Erro envio:', err?.response?.data || err);
      const msg = err?.response?.data?.error || 'Falha ao enviar solicitação.';
      Alert.alert('Erro', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    // --- MUDANÇA 2: No passo 1, clicar na seta ABRE O MODAL ---
    if (step === 1) {
        setShowTermsModal(true); 
        return;
    }

    // Validações
    if (step === 3 && (!formData.nome || !formData.cpf || !formData.email)) return Alert.alert('Atenção', 'Preencha os dados obrigatórios.');
    if (step === 4 && (!formData.cep || !formData.rua)) return Alert.alert('Atenção', 'Preencha o endereço.');
    if (step === 5 && !formData.tipoMoradia) return Alert.alert('Atenção', 'Selecione a moradia.');
    if (step === 6 && !formData.porteAceito) return Alert.alert('Atenção', 'Selecione o porte.');
    if (step === 7 && !formData.animalAceito) return Alert.alert('Atenção', 'Selecione o animal.');

    if (step === 8) {
      if (!formData.viuPetInteresse) return Alert.alert('Atenção', 'Selecione uma opção.');
      if (formData.viuPetInteresse === 'sim') {
        setStep(11);
      } else {
        setStep(9);
      }
      return;
    }

    if (step === 9) {
      if (!formData.tipoPetInteresse) return Alert.alert('Atenção', 'Selecione o tipo.');
      setStep(10);
      return;
    }

    if (step === 10) {
      if (!formData.preferenciaSexo) return Alert.alert('Atenção', 'Selecione a preferência.');
      setStep(12);
      return;
    }

    if (step === 11) {
      if (!formData.codigoPet) return Alert.alert('Atenção', 'Digite o código do pet.');
      setStep(12);
      return;
    }

    if (step === 12) {
      if (!formData.pessoasLar) return Alert.alert('Atenção', 'Informe quantas pessoas moram no lar.');
    }

    if (step === 14) {
      if (!formData.temAlergia) return Alert.alert('Atenção', 'Responda sobre alergia.');
    }

    if (step === 15) {
      if (!formData.declaracaoCompromisso) return Alert.alert('Atenção', 'Você precisa aceitar os termos finais para continuar.');
      finalizarFormulario();
      return;
    }

    if (step === 16) {
      router.push('/(app)/(tabs)/pets-disponiveis' as any);
      return;
    }

    setStep(step + 1);
  };

  // --- MUDANÇA 3: Ao aceitar o modal, fecha e VAI PARA O PASSO 3 ---
  const handleAcceptTerms = () => {
      setShowTermsModal(false);
      setStep(3); // Pula direto para o formulário
  };

  const SingleChoiceOption = ({ label, value, icon, field }: any) => (
    <TouchableOpacity
      style={[styles.choiceOption, (formData as any)[field] === value && styles.choiceOptionSelected]}
      onPress={() => updateFormData(field, value)}
    >
      <View style={[styles.iconBox, (formData as any)[field] === value && styles.iconBoxSelected]}>
        <Text style={[styles.choiceIcon, (formData as any)[field] === value && styles.choiceIconSelected]}>{icon}</Text>
      </View>
      <Text style={[styles.choiceLabel, (formData as any)[field] === value && styles.choiceTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  const CustomCheckbox = ({ label, isSelected, onSelect }: any) => (
    <TouchableOpacity style={[styles.checkboxContainer, { marginTop: 0, backgroundColor: 'transparent', padding: 0 }]} onPress={onSelect}>
      <MaterialCommunityIcons name={isSelected ? 'checkbox-marked-outline' : 'checkbox-blank-outline'} size={28} color="#005A9C" />
      {label ? <Text style={styles.checkboxLabel}>{label}</Text> : null}
    </TouchableOpacity>
  );

  const renderStep = () => {
    switch (step) {
      case 1: return (
        <View style={styles.stepContent}>
          <View style={{flexDirection:'row', alignItems:'center', marginBottom: 20}}>
             <TouchableOpacity onPress={handleBack} style={{padding: 5, marginRight: 10}}>
                <Ionicons name="arrow-back" size={24} color="#005A9C" />
             </TouchableOpacity>
          </View>

          <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom: 20}}>
             <View style={styles.iconCircleBig}><Feather name="user" size={24} color="#005A9C" /></View>
             <View style={{width: 50, height: 4, backgroundColor: '#E0E0E0'}} />
             <View style={styles.iconCircleBig}><Feather name="home" size={24} color="#005A9C" /></View>
          </View>

          <Text style={styles.pageTitle}>Formulário de{'\n'}interesse em adoção</Text>
          <Text style={styles.paragraphCenter}>Bem-vindo(a) ao nosso Formulário de Interesse.</Text>
          <Text style={styles.paragraphCenter}>Ficamos muito felizes por você ter dado o primeiro passo para adotar um pet.</Text>
          <View style={{ height: 20 }} />
          <Text style={styles.paragraphCenter}>
            Aqui você irá responder algumas perguntas iniciais para que a ONG/protetor parceiro possa te conhecer melhor e dar agilidade ao processo de adoção. Precisaremos de alguns dados pessoais para que possam entrar em contato com você, além de saber um pouco sobre a sua casa, sua família, estrutura, entre outras informações.
          </Text>
          
          <View style={{alignItems:'flex-end', marginTop: 30}}>
             {/* Este botão agora chama handleNext, que abre o modal */}
             <TouchableOpacity style={styles.fabNextBig} onPress={handleNext}>
                <Feather name="chevron-right" size={32} color="#FFFFFF" />
             </TouchableOpacity>
          </View>
        </View>
      );

      case 3: return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Informações pessoais</Text>
          <Text style={styles.inputLabel}>Nome completo</Text>
          <TextInput style={styles.input} value={formData.nome} onChangeText={v => updateFormData('nome', v)} />
          <Text style={styles.inputLabel}>CPF</Text>
          <MaskInput style={styles.input} value={formData.cpf} onChangeText={m => updateFormData('cpf', m)} mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]} keyboardType="numeric" />
          <Text style={styles.inputLabel}>Data de nascimento</Text>
          <MaskInput style={styles.input} value={formData.dataNascimento} onChangeText={m => updateFormData('dataNascimento', m)} mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]} keyboardType="numeric" placeholder="DD/MM/AAAA" />
          <Text style={styles.inputLabel}>Telefone</Text>
          <MaskInput style={styles.input} value={formData.telefone} onChangeText={m => updateFormData('telefone', m)} mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} keyboardType="numeric" />
          <Text style={styles.inputLabel}>E-mail</Text>
          <TextInput style={styles.input} value={formData.email} onChangeText={v => updateFormData('email', v)} keyboardType="email-address" />
        </View>
      );

      case 4: return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Endereço</Text>
          <Text style={styles.inputLabel}>CEP</Text>
          <View style={{ position: 'relative', justifyContent: 'center' }}>
            <MaskInput style={styles.input} value={formData.cep} onChangeText={(m, u) => { updateFormData('cep', m); if (u.length === 8) buscarCep(u); }} mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]} keyboardType="numeric" />
            {loadingCep && <ActivityIndicator style={{ position: 'absolute', right: 15, top: 15 }} color="#005A9C" />}
          </View>

          <Text style={styles.inputLabel}>Rua</Text>
          <TextInput style={styles.input} value={formData.rua} onChangeText={v => updateFormData('rua', v)} />
          <Text style={styles.inputLabel}>Número</Text>
          <TextInput style={styles.input} value={formData.numero} onChangeText={v => updateFormData('numero', v)} keyboardType="numeric" />
          <Text style={styles.inputLabel}>Complemento</Text>
          <TextInput style={styles.input} value={formData.complemento} onChangeText={v => updateFormData('complemento', v)} />
          <Text style={styles.inputLabel}>Cidade/Estado</Text>
          <TextInput style={styles.input} value={formData.cidadeEstado} onChangeText={v => updateFormData('cidadeEstado', v)} />
        </View>
      );

      case 5: return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Tipo de moradia:</Text>
          <SingleChoiceOption label="Casa" value="casa" icon="A" field="tipoMoradia" />
          <SingleChoiceOption label="Apartamento" value="apartamento" icon="B" field="tipoMoradia" />
          <SingleChoiceOption label="Sítio" value="sitio" icon="C" field="tipoMoradia" />
          <SingleChoiceOption label="Outro" value="outro" icon="D" field="tipoMoradia" />
        </View>
      );

      case 6: return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Quais portes são aceitos:</Text>
          <SingleChoiceOption label="Pequeno" value="pequeno" icon="A" field="porteAceito" />
          <SingleChoiceOption label="Médio" value="medio" icon="B" field="porteAceito" />
          <SingleChoiceOption label="Grande" value="grande" icon="C" field="porteAceito" />
          <SingleChoiceOption label="Todos" value="todos" icon="D" field="porteAceito" />
        </View>
      );

      case 7: return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Quais animais são aceitos:</Text>
          <SingleChoiceOption label="Gato" value="gato" icon="A" field="animalAceito" />
          <SingleChoiceOption label="Cachorro" value="cachorro" icon="B" field="animalAceito" />
          <SingleChoiceOption label="Pássaros" value="outros" icon="C" field="animalAceito" />
          <SingleChoiceOption label="Todos" value="todos" icon="D" field="animalAceito" />
        </View>
      );

      case 8: return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Você já viu algum pet que tem interesse em adotar?</Text>
          <SingleChoiceOption label="Sim, já sei qual quero." value="sim" icon="A" field="viuPetInteresse" />
          <SingleChoiceOption label="Não, quero achar um." value="nao" icon="B" field="viuPetInteresse" />
        </View>
      );

      case 9: return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Qual tipo de pet que tem interesse em adotar?</Text>
          <SingleChoiceOption label="Gato" value="gato" icon="A" field="tipoPetInteresse" />
          <SingleChoiceOption label="Cachorro" value="cachorro" icon="B" field="tipoPetInteresse" />
          <SingleChoiceOption label="Pássaros" value="passaros" icon="C" field="tipoPetInteresse" />
        </View>
      );

      case 10: return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Qual a sua preferência que o pet seja:</Text>
          <SingleChoiceOption label="Macho" value="macho" icon="A" field="preferenciaSexo" />
          <SingleChoiceOption label="Fêmea" value="femea" icon="B" field="preferenciaSexo" />
          <SingleChoiceOption label="Tanto faz" value="tanto" icon="C" field="preferenciaSexo" />
        </View>
      );

      case 11: return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Qual é o código do pet?</Text>
          <View style={styles.idBox}>
            <Text style={{ color: '#666', marginBottom: 10 }}>Esse código aparece no perfil do pet</Text>
            <TextInput style={styles.input} value={formData.codigoPet} onChangeText={v => updateFormData('codigoPet', v)} placeholder="Ex: 123" autoCapitalize="characters" />
          </View>
        </View>
      );

      case 12: return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Quantas pessoas moram no lar?</Text>
          <Text style={styles.stepParagraph}>Conte com você.</Text>
          <TextInput style={styles.input} value={formData.pessoasLar} onChangeText={v => updateFormData('pessoasLar', v)} placeholder="Ex: 3" keyboardType="numeric" />
        </View>
      );

      case 13: return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Outros animais no local?</Text>
          <Text style={styles.inputLabel}>Quantidade</Text>
          <TextInput style={[styles.input]} value={formData.qtdOutrosAnimais} onChangeText={v => updateFormData('qtdOutrosAnimais', v)} placeholder="Ex: 1" keyboardType="numeric" />
          <Text style={styles.inputLabel}>Quais tipos?</Text>
          <TextInput style={styles.input} value={formData.tipoOutrosAnimais} onChangeText={v => updateFormData('tipoOutrosAnimais', v)} placeholder="Ex: Gato" />
        </View>
      );

      case 14: return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Alguma pessoa da casa possui alergia a animais?</Text>
          <SingleChoiceOption label="Sim" value="sim" icon="A" field="temAlergia" />
          <SingleChoiceOption label="Não" value="nao" icon="B" field="temAlergia" />
        </View>
      );

      case 15: return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Termo de responsabilidade de adoção</Text>
          <Text style={styles.stepParagraph}>
            Ao adotar um animal por meio da plataforma PetControl, declaro estar ciente de que a adoção é um compromisso sério e de longo prazo. Assim, comprometo-me a:
          </Text>

          <View style={styles.termsBox}>
            <Text style={styles.termsList} numberOfLines={termsExpanded ? undefined : 4}>
              1. Oferecer alimentação de qualidade, água fresca e cuidados veterinários regulares, incluindo vacinas anuais e vermifugação.{'\n\n'}
              2. Manter o animal em local seguro, limpo e protegido de intempéries, sem mantê-lo acorrentado ou em espaços exíguos.{'\n\n'}
              3. Nunca praticar maus tratos, abandono ou agressão física, sob pena das sanções previstas na Lei de Crimes Ambientais.{'\n\n'}
              4. Garantir que o animal não tenha acesso à rua desacompanhado, prevenindo fugas, atropelamentos e brigas.{'\n\n'}
              5. Comunicar a ONG/protetor em caso de fuga, óbito ou necessidade de devolução do animal.{'\n\n'}
              6. Permitir visitas de acompanhamento por parte dos protetores responsáveis.
            </Text>

            <TouchableOpacity onPress={() => setTermsExpanded(!termsExpanded)}>
              <Text style={styles.verMaisLink}>{termsExpanded ? 'Ver menos' : 'Ver mais'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.disclaimerText}>
            Ao clicar em "Li e concordo com o Termo de Responsabilidade", você confirma a veracidade das informações preenchidas neste formulário.
          </Text>

          <View style={{ height: 15 }} />

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomCheckbox label="" isSelected={formData.declaracaoCompromisso} onSelect={() => updateFormData('declaracaoCompromisso', !formData.declaracaoCompromisso)} />
            <Text style={{ flex: 1, marginLeft: 10, color: '#333' }}>Li e concordo com o Termo de Responsabilidade de Adoção.</Text>
          </View>
        </View>
      );

      case 16: return (
        <View style={[styles.stepContainer, { alignItems: 'center', justifyContent: 'center', paddingTop: 50 }]}>
          <Feather name="check-circle" size={80} color="#005A9C" style={{ marginBottom: 20 }} />
          <Text style={styles.stepTitle}>Formulário enviado</Text>
          <Text style={[styles.stepParagraph, { textAlign: 'center' }]}>Sua solicitação de adoção foi recebida e será analisada pela nossa equipe. Em breve entraremos em contato.</Text>
          <Text style={[styles.stepParagraph, { textAlign: 'center', fontSize: 13, color: '#666', marginTop: 10 }]}>
            Lembre-se: o animal escolhido pode não estar mais disponível no momento da aprovação, mas apresentaremos outras opções semelhantes caso isso aconteça.
          </Text>

          <View style={{ height: 20 }} />
          <TouchableOpacity style={styles.okButton} onPress={() => router.push('/(app)/(tabs)/pets-disponiveis' as any)}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      );

      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* HEADER DE PROGRESSO (Só aparece do step 3 em diante) */}
      {step > 1 && (
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={handleBack} style={styles.headerButton}><Feather name="chevron-left" size={28} color="#005A9C" /></TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.iconProgressRow}>
              <View style={[styles.iconCircle, step <= 3 ? styles.iconCircleActive : null]}>
                <Feather name="user" size={20} color={step <= 3 ? "#005A9C" : "#A0B4CC"} />
              </View>
              <View style={styles.progressLine} />
              <View style={[styles.iconCircle, step > 3 ? styles.iconCircleActive : null]}>
                <Feather name="home" size={20} color={step > 3 ? "#005A9C" : "#A0B4CC"} />
              </View>
            </View>
            <View style={[styles.progressBar, { width: `${(step / 16) * 100}%` }]} />
          </View>
          <View style={styles.headerButton} />
        </View>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderStep()}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTÃO NEXT FLUTUANTE (Step 3 ao 15) */}
      {step > 1 && step < 16 && (
        <TouchableOpacity style={styles.fabNext} onPress={handleNext}>
          {isSubmitting ? <ActivityIndicator color="#fff" /> : <Feather name="chevron-right" size={32} color="#FFFFFF" />}
        </TouchableOpacity>
      )}

      {/* --- MODAL DE TERMOS --- */}
      <Modal 
        visible={showTermsModal} 
        transparent={true} 
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Antes de começar</Text>
            <TouchableOpacity style={styles.termsRow} onPress={() => updateFormData('termsAccepted', !formData.termsAccepted)}>
              <MaterialCommunityIcons name={formData.termsAccepted ? 'checkbox-marked-outline' : 'checkbox-blank-outline'} size={28} color="#005A9C" />
              <Text style={styles.termsText}>
                Declaro que sou maior de 18 anos, li e estou ciente das informações passadas e de acordo em compartilhar meus dados para fins de contato por uma ONG/protetor.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.btnComecar, !formData.termsAccepted && styles.btnDisabled]} 
                onPress={handleAcceptTerms} 
                disabled={!formData.termsAccepted}
            >
              <Text style={styles.btnComecarText}>Aceitar e Começar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, height: 60 },
  headerButton: { padding: 5, width: 40 },
  progressContainer: { flex: 1, alignItems: 'center' },
  iconProgressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#A0B4CC', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  iconCircleActive: { borderColor: '#005A9C' },
  
  // ESTILOS PARA STEP 1 (ICONES GRANDES)
  iconCircleBig: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#005A9C', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  fabNextBig: { width: 60, height: 60, borderRadius: 15, backgroundColor: '#005A9C', justifyContent: 'center', alignItems: 'center', elevation: 5 },

  progressLine: { width: 50, height: 2, backgroundColor: '#E0E0E0', marginHorizontal: 5 },
  progressBar: { width: '80%', height: 4, backgroundColor: '#005A9C', borderRadius: 2 },
  scrollContainer: { padding: 25, paddingBottom: 100 },
  stepContent: { flex: 1 },
  stepContainer: { flex: 1 },
  stepTitle: { fontSize: 24, fontWeight: 'bold', color: '#005A9C', marginBottom: 20, textAlign: 'center' },
  pageTitle: { fontSize: 26, fontWeight: 'bold', color: '#005A9C', marginBottom: 30, textAlign: 'center' },
  stepParagraph: { fontSize: 15, color: '#333', marginBottom: 20, lineHeight: 22 },
  paragraphCenter: { fontSize: 18, color: '#555', textAlign: 'center', marginBottom: 15, lineHeight: 28 },
  inputLabel: { fontSize: 16, color: '#555', marginBottom: 5, marginTop: 10 },
  input: { height: 50, borderColor: '#A0B4CC', borderWidth: 1, borderRadius: 6, paddingHorizontal: 15, fontSize: 16, backgroundColor: '#FFFFFF', marginBottom: 10 },
  choiceOption: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderRadius: 6, marginBottom: 15, borderWidth: 1, borderColor: '#A0B4CC', elevation: 2 },
  choiceOptionSelected: { borderColor: '#005A9C', backgroundColor: '#F0F8FF' },
  iconBox: { width: 40, height: 40, borderRadius: 4, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconBoxSelected: { backgroundColor: '#005A9C' },
  choiceIcon: { fontSize: 18, fontWeight: 'bold', color: '#555' },
  choiceIconSelected: { color: '#fff' },
  choiceLabel: { fontSize: 16, color: '#333', fontWeight: '500' },
  choiceTextSelected: { color: '#005A9C', fontWeight: 'bold' },
  
  // MODAL STYLES (NOVO)
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 10, padding: 30, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#005A9C', marginBottom: 20 },
  
  termsRow: { flexDirection: 'row', marginBottom: 30 },
  termsText: { fontSize: 16, color: '#555', marginLeft: 15, flex: 1, lineHeight: 24 },
  btnComecar: { backgroundColor: '#94B9D8', paddingVertical: 15, borderRadius: 6, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#ccc' },
  btnComecarText: { color: '#005A9C', fontSize: 18, fontWeight: 'bold' },
  okButton: { backgroundColor: '#94B9D8', paddingVertical: 12, paddingHorizontal: 60, borderRadius: 6 },
  okButtonText: { color: '#005A9C', fontWeight: 'bold', fontSize: 16 },
  questionLabel: { fontSize: 16, color: '#333', marginBottom: 10, fontWeight: '600' },
  optionLabel: { fontSize: 16, color: '#333', marginLeft: 8 },
  idBox: { padding: 20, borderWidth: 1, borderColor: '#A0B4CC', borderRadius: 6, backgroundColor: '#fff' },
  termsBox: { padding: 20, backgroundColor: '#FAFAFA', borderRadius: 6, borderWidth: 1, borderColor: '#EEE' },
  termsList: { fontSize: 13, color: '#555', lineHeight: 20 },
  verMaisLink: { color: '#005A9C', fontWeight: 'bold', marginTop: 15, textAlign: 'center', fontSize: 14 },
  disclaimerText: { fontSize: 12, color: '#777', marginTop: 12, marginBottom: 10, lineHeight: 16 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkboxLabel: { fontSize: 14, color: '#333' },
  fabNext: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#005A9C', justifyContent: 'center', alignItems: 'center', elevation: 5 }
});