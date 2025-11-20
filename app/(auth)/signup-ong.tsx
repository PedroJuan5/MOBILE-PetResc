import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {Alert,KeyboardAvoidingView,Platform,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View,ActivityIndicator} from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import api from '@/lib/axios'; 

export default function SignupOngScreen() {
  const router = useRouter();
  
  // Estados de Controle
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  // Visibilidade de Senha
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Formulário Único
  const [form, setForm] = useState({
    nomeResponsavel: '',
    cpf: '',
    nomeOng: '',
    email: '',
    cnpj: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    estado: '',
    cidade: ''
  });

  // Atualiza campos do formulário
  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // --- Lógica de Busca de CEP ---
  const buscarCep = async (cepDigitado: string) => {
    const cepLimpo = cepDigitado.replace(/\D/g, '');

    if (cepLimpo.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (data.erro) {
          Alert.alert("Atenção", "CEP não encontrado.");
          return;
        }

        //preenche os campos automaticamente
        setForm(prev => ({
          ...prev,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
          cep: cepDigitado //mantem o valor no input
        }));
      } catch (error) {
        console.log(error); 
      } finally {
        setLoadingCep(false);
      }
    }
  };

  // Navegação Voltar
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  //navegação Próximo (Validações)
  const handleNext = () => {
    if (step === 1) {
      if (!form.nomeResponsavel || !form.cpf || !form.nomeOng || !form.email) {
        Alert.alert("Campos obrigatórios", "Preencha todos os campos da etapa 1.");
        return;
      }
      setStep(2);
    } 
    else if (step === 2) {
      if (!form.cnpj || !form.telefone || !form.senha || !form.confirmarSenha) {
        Alert.alert("Campos obrigatórios", "Preencha todos os campos da etapa 2.");
        return;
      }
      if (form.senha !== form.confirmarSenha) {
        Alert.alert("Erro", "As senhas não coincidem.");
        return;
      }
      if (form.senha.length < 6) {
        Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
        return;
      }
      setStep(3);
    } 
    else if (step === 3) {
      if (!form.cep || !form.rua || !form.numero) {
        Alert.alert("Campos obrigatórios", "Preencha os dados de endereço.");
        return;
      }
      setStep(4);
    } 
    else if (step === 4) {
      handleFinalize();
    }
  };

  //finalizar Cadastro
  const handleFinalize = async () => {
    if (!form.bairro || !form.estado || !form.cidade) {
      Alert.alert("Campos obrigatórios", "Preencha os campos finais.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        nomeResponsavel: form.nomeResponsavel,
        cpf: form.cpf,
        nomeOng: form.nomeOng,
        email: form.email,
        cnpj: form.cnpj,
        telefone: form.telefone,
        password: form.senha,
        cep: form.cep,
        rua: form.rua,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        estado: form.estado,
        cidade: form.cidade,
        role: 'ONG'
      };

      await api.post('/auth/register-ong', payload); 

      Alert.alert("Sucesso", "Cadastro realizado! Faça seu login.");

      router.replace('/(auth)/login-ong');

    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Erro ao realizar cadastro.";
      Alert.alert("Erro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* Cabeçalho */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#1c5b8f" />
            </TouchableOpacity>
            <Text style={styles.title}>Cadastre-se</Text>
            <Text style={styles.subtitle}>Crie sua conta e ajude a transformar vidas.</Text>
          </View>

          {/*ETAPA 1: Dados Pessoais*/}
          {step === 1 && (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Nome do Responsável</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Digite seu nome" 
                placeholderTextColor="#a0c4df"
                value={form.nomeResponsavel}
                onChangeText={(t) => updateForm('nomeResponsavel', t)}
              />

              <Text style={styles.label}>CPF do Responsável</Text>
              <MaskInput
                style={styles.input}
                placeholder="000.000.000-00"
                placeholderTextColor="#a0c4df"
                value={form.cpf}
                onChangeText={(masked) => updateForm('cpf', masked)}
                mask={Masks.BRL_CPF}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Nome da ONG</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Digite o nome da ONG" 
                placeholderTextColor="#a0c4df"
                value={form.nomeOng}
                onChangeText={(t) => updateForm('nomeOng', t)}
              />

              <Text style={styles.label}>Email da ONG</Text>
              <TextInput 
                style={styles.input} 
                placeholder="ong@email.com" 
                placeholderTextColor="#a0c4df"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(t) => updateForm('email', t)}
              />
            </View>
          )}

          {/*ETAPA 2: Dados da ONG e Acesso*/}
          {step === 2 && (
            <View style={styles.formContainer}>
              <Text style={styles.label}>CNPJ</Text>
              <MaskInput
                style={styles.input}
                placeholder="XX.XXX.XXX/0001-XX"
                placeholderTextColor="#a0c4df"
                value={form.cnpj}
                onChangeText={(masked) => updateForm('cnpj', masked)}
                mask={Masks.BRL_CNPJ}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Telefone</Text>
              <MaskInput
                style={styles.input}
                placeholder="(+55) 00 00000-0000"
                placeholderTextColor="#a0c4df"
                value={form.telefone}
                onChangeText={(masked) => updateForm('telefone', masked)}
                mask={['(', '+', /\d/, /\d/, ')', ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput 
                  style={styles.passwordInput} 
                  placeholder="Digite sua senha" 
                  placeholderTextColor="#a0c4df"
                  secureTextEntry={!showPassword}
                  value={form.senha}
                  onChangeText={(t) => updateForm('senha', t)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirmar senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput 
                  style={styles.passwordInput} 
                  placeholder="Confirme sua senha" 
                  placeholderTextColor="#a0c4df"
                  secureTextEntry={!showConfirmPassword}
                  value={form.confirmarSenha}
                  onChangeText={(t) => updateForm('confirmarSenha', t)}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/*ETAPA 3: Endereço 1 (CEP Automático)*/}
          {step === 3 && (
            <View style={styles.formContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={styles.labelNoMargin}>CEP</Text>
                {loadingCep && <ActivityIndicator size="small" color="#1c5b8f" style={{ marginLeft: 10 }} />}
              </View>
              
              <MaskInput
                style={styles.input}
                placeholder="00000-000"
                placeholderTextColor="#a0c4df"
                value={form.cep}
                onChangeText={(masked, unmasked) => {
                  updateForm('cep', masked);
                  //chama a API do ViaCEP ao completar 8 dígitos
                  buscarCep(unmasked);
                }}
                mask={Masks.ZIP_CODE}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Rua / Avenida</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Digite o nome da rua" 
                placeholderTextColor="#a0c4df"
                value={form.rua}
                onChangeText={(t) => updateForm('rua', t)}
              />

              <Text style={styles.label}>Número</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Digite o número" 
                placeholderTextColor="#a0c4df"
                value={form.numero}
                onChangeText={(t) => updateForm('numero', t)}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Complemento</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Apto, bloco, etc (opcional)" 
                placeholderTextColor="#a0c4df"
                value={form.complemento}
                onChangeText={(t) => updateForm('complemento', t)}
              />
            </View>
          )}

          {/*ETAPA 4: Endereço 2 e Aviso*/}
          {step === 4 && (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Bairro</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Digite o bairro" 
                placeholderTextColor="#a0c4df"
                value={form.bairro}
                onChangeText={(t) => updateForm('bairro', t)}
              />

              <Text style={styles.label}>Estado (UF)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Digite o estado (ex: SP)" 
                placeholderTextColor="#a0c4df"
                value={form.estado}
                onChangeText={(t) => updateForm('estado', t)}
                maxLength={2}
              />

              <Text style={styles.label}>Cidade</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Digite a cidade" 
                placeholderTextColor="#a0c4df"
                value={form.cidade}
                onChangeText={(t) => updateForm('cidade', t)}
              />

              <Text style={styles.disclaimer}>
                Caso a ONG tenha mais de um endereço, opte pela unidade principal e depois adicione o outro endereço no perfil.
              </Text>
            </View>
          )}

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleNext}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#1c5b8f" />
            ) : (
              <Text style={styles.buttonText}>
                {step === 4 ? "Finalizar" : "Próximo"}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Já tem conta? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login-ong')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dotsContainer}>
            {[1, 2, 3, 4].map((item) => (
              <View 
                key={item} 
                style={[
                  styles.dot, 
                  step === item ? styles.dotActive : (step > item ? styles.dotActive : styles.dotInactive)
                ]} 
              />
            ))}
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { padding: 24, paddingBottom: 100 },
  
  header: { marginBottom: 20 },
  backButton: { marginBottom: 15, alignSelf: 'flex-start' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1c5b8f', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#1c5b8f', marginBottom: 10, fontWeight: '600' },
  
  formContainer: { marginBottom: 20 },
  label: { fontSize: 16, color: '#1c5b8f', marginBottom: 8, fontWeight: '500' },
  labelNoMargin: { fontSize: 16, color: '#1c5b8f', fontWeight: '500' }, // Para alinhar com o loading
  
  input: {
    backgroundColor: '#1c5b8f',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c5b8f',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 13,
    color: '#1c5b8f',
    marginTop: 10,
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  footer: { padding: 24, backgroundColor: '#FFFFFF' },
  button: {
    backgroundColor: '#94B9D8',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: { color: '#1c5b8f', fontSize: 18, fontWeight: 'bold' },
  loginLinkContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  loginText: { color: '#1c5b8f', fontSize: 14 },
  loginLink: { color: '#1c5b8f', fontWeight: 'bold', fontSize: 14 },
  
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotActive: { backgroundColor: '#1c5b8f' },
  dotInactive: { backgroundColor: '#94B9D8' },
});