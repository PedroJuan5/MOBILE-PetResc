import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, 
  ActivityIndicator, Keyboard, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import MaskInput from 'react-native-mask-input';
import api from '@/lib/axios';

interface FormData {
  termsAccepted: boolean;
  nome: string; cpf: string; dataNascimento: string; telefone: string; email: string;
  cep: string; rua: string; numero: string; complemento: string; cidadeEstado: string; bairro: string; estado: string;
  tipoMoradia: string; porteAceito: string; animalAceito: string;
  viuPetInteresse: string; tipoPetInteresse: string; preferenciaSexo: string; 
  codigoPet: string; 
  pessoasLar: string; qtdOutrosAnimais: string; tipoOutrosAnimais: string; temAlergia: string;
  declaracaoCompromisso: boolean;
}

export default function FormularioInteresseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  
  const [step, setStep] = useState(1);
  const [loadingCep, setLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsExpanded, setTermsExpanded] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  
  // Estado Inicial
  const [formData, setFormData] = useState<FormData>({
    termsAccepted: false,
    nome: '', cpf: '', dataNascimento: '', telefone: '', email: '',
    cep: '', rua: '', numero: '', complemento: '', cidadeEstado: '', bairro: '', estado: '',
    tipoMoradia: '', porteAceito: '', animalAceito: '',
    viuPetInteresse: params.animalId ? 'sim' : '', 
    tipoPetInteresse: '', preferenciaSexo: '', 
    codigoPet: (params.animalId as string) || '', 
    pessoasLar: '', qtdOutrosAnimais: '', tipoOutrosAnimais: '', temAlergia: '',
    declaracaoCompromisso: false,
  });

  const updateFormData = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // --- 1. CARREGAR DADOS E PREENCHER (CORRIGIDO) ---
  useEffect(() => {
    async function fetchUser() {
        try {
            const res = await api.get('/usuarios/me');
            const user = res.data;
            setUserId(user.id);
            
            // Tenta pegar dados da raiz ou de sub-objetos (caso existam no seu backend)
            const publico = user.publico || {}; // Se seus dados extras estiverem aqui

            setFormData(prev => ({
                ...prev,
                // Dados Pessoais
                nome: user.nome || prev.nome,
                email: user.email || prev.email,
                telefone: user.telefone || prev.telefone,
                cpf: user.cpf || prev.cpf,
                
                // Endereço
                cep: user.cep || prev.cep,
                rua: user.rua || prev.rua,
                numero: user.numero || prev.numero,
                complemento: user.complemento || prev.complemento,
                bairro: user.bairro || prev.bairro,
                estado: user.estado || prev.estado,
                cidadeEstado: (user.cidade && user.estado) ? `${user.cidade} - ${user.estado}` : prev.cidadeEstado,

                // Preferências (Verifica se está na raiz ou no objeto publico)
                tipoMoradia: user.tipoMoradia || publico.tipoMoradia || prev.tipoMoradia,
                pessoasLar: user.pessoasNaCasa || publico.pessoasNaCasa || prev.pessoasLar,
                temAlergia: (user.alergias === 'sim' || publico.alergias === 'sim') ? 'sim' : 'nao',
                
                // Se o usuário já tem cadastro, já aceitamos os termos iniciais pra ele
                termsAccepted: !!user.cpf
            }));

        } catch (error) {
            console.log("Erro ao carregar usuário:", error);
        }
    }
    fetchUser();
  }, []);

  const buscarCep = async (cepDigitado: string) => {
    const cepLimpo = cepDigitado.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    setLoadingCep(true);
    Keyboard.dismiss();
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      if (data.erro) { Alert.alert('Erro', 'CEP não encontrado.'); return; }
      
      setFormData(prev => ({ 
          ...prev, 
          rua: data.logradouro,
          bairro: data.bairro,
          estado: data.uf, 
          cidadeEstado: `${data.localidade} - ${data.uf}` 
      }));
    } catch { Alert.alert('Erro', 'Falha ao buscar CEP.'); } finally { setLoadingCep(false); }
  };

  const handleBack = () => {
    if (step === 1) router.back();
    else if (step === 12) {
        if (formData.viuPetInteresse === 'sim') setStep(11);
        else setStep(10);
    }
    else if (step === 11) setStep(8);
    else if (step === 9) setStep(8); 
    else setStep(step - 1);
  };

  const handleNext = () => {
    // Validações simples (apenas checa se está vazio)
    if (step === 2 && !formData.termsAccepted) return Alert.alert('Atenção', 'Aceite os termos.');
    if (step === 3 && !formData.nome) return Alert.alert('Atenção', 'Preencha o nome.');
    if (step === 4 && !formData.cep) return Alert.alert('Atenção', 'Preencha o CEP.');
    
    // ... validações dos outros passos ...

    if (step === 15) {
        if (!formData.declaracaoCompromisso) return Alert.alert('Atenção', 'Aceite o termo.');
        finalizarFormulario();
        return;
    }
    if (step === 16) {
        router.push('/(app)/(tabs)/home' as any);
        return;
    }
    setStep(step + 1);
  };

  // --- ENVIAR E SALVAR PARA A PRÓXIMA ---
  const finalizarFormulario = async () => {
    setIsSubmitting(true);
    try {
        const cidadeSplit = formData.cidadeEstado.split(' - ');
        const cidade = cidadeSplit[0] || '';
        const estado = formData.estado || cidadeSplit[1] || '';

        // 1. Atualiza Perfil (SALVA AS RESPOSTAS PARA O FUTURO)
        if (userId) {
            await api.put(`/usuarios/${userId}`, {
                // Dados básicos
                nome: formData.nome,
                telefone: formData.telefone,
                cpf: formData.cpf,
                cep: formData.cep,
                rua: formData.rua,
                numero: formData.numero,
                complemento: formData.complemento,
                bairro: formData.bairro,
                cidade: cidade,
                estado: estado,
                
                // Dados do Formulário (Para persistir)
                tipoMoradia: formData.tipoMoradia,
                pessoasNaCasa: formData.pessoasLar,
                alergias: formData.temAlergia
            });
        }

        // 2. Cria o Pedido
        if (formData.codigoPet) {
            const payload = {
                animalId: parseInt(formData.codigoPet),
                respostasFormulario: {
                    // ... (resto do payload igual ao anterior)
                    tipoMoradia: formData.tipoMoradia,
                    pessoasNaCasa: formData.pessoasLar,
                    alergias: formData.temAlergia,
                    // ...
                }
            };
            await api.post('/pedidos-adocao', payload);
        }

        setStep(16);

    } catch (error: any) {
        console.error("Erro envio:", error.response?.data || error);
        Alert.alert("Erro", "Falha ao enviar solicitação.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- COMPONENTES VISUAIS (MANTIDOS) ---
  const SingleChoiceOption = ({ label, value, icon, field }: any) => (
    <TouchableOpacity style={[styles.choiceOption, (formData as any)[field] === value && styles.choiceOptionSelected]} onPress={() => updateFormData(field, value)}>
      <View style={[styles.iconBox, (formData as any)[field] === value && styles.iconBoxSelected]}><Text style={[styles.choiceIcon, (formData as any)[field] === value && styles.choiceIconSelected]}>{icon}</Text></View>
      <Text style={[styles.choiceLabel, (formData as any)[field] === value && styles.choiceTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  const CustomCheckbox = ({ label, isSelected, onSelect }: any) => (
    <TouchableOpacity style={[styles.checkboxContainer, {marginTop: 0}]} onPress={onSelect}>
      <MaterialCommunityIcons name={isSelected ? 'checkbox-marked-outline' : 'checkbox-blank-outline'} size={28} color="#005A9C" />
      {label ? <Text style={styles.checkboxLabel}>{label}</Text> : null}
    </TouchableOpacity>
  );

  const renderStep = () => {
    switch (step) {
      case 1: return (
        <View style={styles.stepContent}>
            <Text style={styles.pageTitle}>Formulário de Interesse</Text>
            <Text style={styles.paragraphCenter}>Preencha seus dados para agilizar a adoção.</Text>
        </View>
      );
      // ... MANTENHA TODOS OS SEUS CASES DO 2 AO 16 AQUI ...
      // (Estou omitindo para não ficar gigante, mas use o JSX que você já tem)
      // O IMPORTANTE É QUE O 'useEffect' LÁ EM CIMA VAI PREENCHER OS CAMPOS NOS 'value={formData...}'
      
      // EXEMPLO DO PASSO 3 PREENCHIDO AUTOMATICAMENTE
      case 3: return (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Dados Pessoais</Text>
            {/* Como formData.nome foi preenchido pelo useEffect, o input já aparece com texto */}
            <Text style={styles.inputLabel}>Nome completo</Text><TextInput style={styles.input} value={formData.nome} onChangeText={v=>updateFormData('nome',v)}/>
            <Text style={styles.inputLabel}>CPF</Text><MaskInput style={styles.input} value={formData.cpf} onChangeText={m=>updateFormData('cpf',m)} mask={[/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'-',/\d/,/\d/]} keyboardType="numeric"/>
            {/* ... */}
        </View>
      );
      
      // ...
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      {step !== 2 && (
        <View style={styles.headerBar}>
            <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
            <Feather name="chevron-left" size={28} color="#005A9C" />
            </TouchableOpacity>
            <View style={{flex:1, height:4, backgroundColor:'#E0E0E0', marginHorizontal:10, borderRadius:2}}>
                <View style={{width:`${(step/16)*100}%`, height:'100%', backgroundColor:'#005A9C', borderRadius:2}}/>
            </View>
            <View style={styles.headerButton} /> 
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollContainer}>{renderStep()}</ScrollView>
      {step !== 2 && step !== 15 && step < 16 && (
        <TouchableOpacity style={styles.fabNext} onPress={handleNext}>
          <Feather name="chevron-right" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, height: 60 },
  headerButton: { padding: 5, width: 40 },
  scrollContainer: { padding: 25, paddingBottom: 100 },
  stepContent: { flex: 1 },
  stepContainer: { flex: 1 },
  stepTitle: { fontSize: 24, fontWeight: 'bold', color: '#005A9C', marginBottom: 20, textAlign: 'center' },
  pageTitle: { fontSize: 26, fontWeight: 'bold', color: '#005A9C', marginBottom: 30, textAlign: 'center' },
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
  modalStepContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.05)', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 10, padding: 30, elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#005A9C', marginBottom: 20 },
  termsRow: { flexDirection: 'row', marginBottom: 30 },
  termsText: { fontSize: 16, color: '#555', marginLeft: 15, flex: 1 },
  btnComecar: { backgroundColor: '#94B9D8', paddingVertical: 15, borderRadius: 6, alignItems: 'center' }, 
  btnDisabled: { backgroundColor: '#ccc' },
  btnComecarText: { color: '#005A9C', fontSize: 18, fontWeight: 'bold' },
  okButton: { backgroundColor: '#94B9D8', paddingVertical: 12, paddingHorizontal: 60, borderRadius: 6 },
  okButtonText: { color: '#005A9C', fontWeight: 'bold', fontSize: 16 },
  idBox: { padding: 20, borderWidth: 1, borderColor: '#A0B4CC', borderRadius: 6, backgroundColor: '#fff' },
  termsBox: { padding: 20, backgroundColor: '#FAFAFA', borderRadius: 6, borderWidth: 1, borderColor: '#EEE' },
  termsList: { fontSize: 13, color: '#555', lineHeight: 20 },
  verMaisLink: { color: '#005A9C', fontWeight: 'bold', marginTop: 15, textAlign: 'center', fontSize: 14 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkboxLabel: { fontSize: 14, color: '#333' },
  fabNext: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#005A9C', justifyContent: 'center', alignItems: 'center', elevation: 5 },
});