import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Keyboard,
  Pressable
} from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import api from '@/lib/axios';

export default function SignupOngScreen() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const buscarCep = async (cepDigitado: string) => {
    const cepLimpo = cepDigitado.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      setLoadingCep(true);
      Keyboard.dismiss();
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (data.erro) {
          Alert.alert("Atenção", "CEP não encontrado.");
          return;
        }
        setForm(prev => ({
          ...prev,
          rua: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
          cep: cepDigitado 
        }));
      } catch (error) {
        console.log(error); 
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    Keyboard.dismiss();

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

  const handleFinalize = async () => {
    if (!form.bairro || !form.estado || !form.cidade) {
      Alert.alert("Campos obrigatórios", "Preencha os campos finais.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Limpeza de máscaras
      const cpfLimpo = form.cpf.replace(/\D/g, '');
      const cnpjLimpo = form.cnpj.replace(/\D/g, '');
      const telefoneLimpo = form.telefone.replace(/\D/g, '');
      const cepLimpo = form.cep.replace(/\D/g, '');

      // 2. Payload
      const payload = {
        name: form.nomeResponsavel,
        cpf: cpfLimpo,
        nomeOng: form.nomeOng,      
        email: form.email,
        cnpj: cnpjLimpo,
        telefone: telefoneLimpo,
        password: form.senha,
        cep: cepLimpo,
        rua: form.rua,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        estado: form.estado,
        cidade: form.cidade,
        role: 'ONG'
      };

      console.log("🚀 Enviando Payload:", payload);

      await api.post('/auth/register-ong', payload); 

      // 3. Sucesso e Redirecionamento CORRETO
      Alert.alert(
        "Sucesso", 
        "Cadastro realizado com sucesso! Faça login para continuar.",
        [
          { 
            text: "OK", 
            onPress: () => {
              console.log("Redirecionando para Login...");
              // CORREÇÃO AQUI: Adicionado /(auth) para igualar ao seu arquivo
              router.replace('/(auth)/login-ong');
            } 
          }
        ]
      );

    } catch (error: any) {
      console.error("Erro API:", error.response?.data || error.message);
      const msg = error.response?.data?.error || "Erro de conexão ao cadastrar.";
      Alert.alert("Erro", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={styles.header}>
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#1c5b8f" />
            </Pressable>
            <Text style={styles.title}>Cadastre-se</Text>
            <Text style={styles.subtitle}>Crie sua conta e ajude a transformar vidas.</Text>
          </View>

          {/* FORMULÁRIO */}
          <View style={styles.formContainer}>
            
            {step === 1 && (
              <>
                <Text style={styles.label}>Nome do Responsável</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Nome completo" 
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
                  placeholder="Nome da organização" 
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
              </>
            )}

            {step === 2 && (
              <>
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
                    placeholder="Mínimo 6 caracteres" 
                    placeholderTextColor="#a0c4df"
                    secureTextEntry={!showPassword}
                    value={form.senha}
                    onChangeText={(t) => updateForm('senha', t)}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#fff" />
                  </Pressable>
                </View>
                <Text style={styles.label}>Confirmar senha</Text>
                <View style={styles.passwordContainer}>
                  <TextInput 
                    style={styles.passwordInput} 
                    placeholder="Repita a senha" 
                    placeholderTextColor="#a0c4df"
                    secureTextEntry={!showConfirmPassword}
                    value={form.confirmarSenha}
                    onChangeText={(t) => updateForm('confirmarSenha', t)}
                  />
                  <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#fff" />
                  </Pressable>
                </View>
              </>
            )}

            {step === 3 && (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.label}>CEP</Text>
                  {loadingCep && <ActivityIndicator size="small" color="#1c5b8f" style={{ marginLeft: 10 }} />}
                </View>
                <MaskInput
                  style={styles.input}
                  placeholder="00000-000"
                  placeholderTextColor="#a0c4df"
                  value={form.cep}
                  onChangeText={(masked, unmasked) => {
                    updateForm('cep', masked);
                    if (unmasked && unmasked.length === 8) buscarCep(unmasked);
                  }}
                  mask={Masks.ZIP_CODE}
                  keyboardType="numeric"
                />
                <Text style={styles.label}>Rua</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Logradouro" 
                  placeholderTextColor="#a0c4df"
                  value={form.rua}
                  onChangeText={(t) => updateForm('rua', t)}
                />
                <Text style={styles.label}>Número</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Nº" 
                  placeholderTextColor="#a0c4df"
                  value={form.numero}
                  onChangeText={(t) => updateForm('numero', t)}
                  keyboardType="numeric"
                />
                <Text style={styles.label}>Complemento</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Opcional" 
                  placeholderTextColor="#a0c4df"
                  value={form.complemento}
                  onChangeText={(t) => updateForm('complemento', t)}
                />
              </>
            )}

            {step === 4 && (
              <>
                <Text style={styles.label}>Bairro</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Bairro" 
                  placeholderTextColor="#a0c4df"
                  value={form.bairro}
                  onChangeText={(t) => updateForm('bairro', t)}
                />
                <Text style={styles.label}>Estado (UF)</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="SP" 
                  placeholderTextColor="#a0c4df"
                  value={form.estado}
                  onChangeText={(t) => updateForm('estado', t)}
                  maxLength={2}
                  autoCapitalize="characters"
                />
                <Text style={styles.label}>Cidade</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Cidade" 
                  placeholderTextColor="#a0c4df"
                  value={form.cidade}
                  onChangeText={(t) => updateForm('cidade', t)}
                />
              </>
            )}

          </View>

          {/* RODAPÉ */}
          <View style={styles.footer}>
            <Pressable 
              style={({pressed}) => [styles.button, { opacity: pressed ? 0.8 : 1 }]} 
              onPress={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#1c5b8f" />
              ) : (
                <Text style={styles.buttonText}>
                  {step === 4 ? "Finalizar Cadastro" : "Próximo"}
                </Text>
              )}
            </Pressable>

            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>Já tem conta? </Text>
              <Pressable onPress={() => router.replace('/(auth)/login-ong')}>
                <Text style={styles.loginLink}>Login</Text>
              </Pressable>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { 
    padding: 24, 
    flexGrow: 1, 
    paddingBottom: 50
  },
  header: { marginBottom: 20 },
  backButton: { marginBottom: 15, alignSelf: 'flex-start', padding: 5 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1c5b8f', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#1c5b8f', marginBottom: 20, fontWeight: '600' },
  
  formContainer: { marginBottom: 30 },
  
  label: { fontSize: 16, color: '#1c5b8f', marginBottom: 5, fontWeight: '500' },
  
  input: {
    backgroundColor: '#1c5b8f',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c5b8f',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  
  footer: { 
    marginTop: 10,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#94B9D8',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: { color: '#1c5b8f', fontSize: 18, fontWeight: 'bold' },
  
  loginLinkContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  loginText: { color: '#1c5b8f', fontSize: 14 },
  loginLink: { color: '#1c5b8f', fontWeight: 'bold', fontSize: 14 },
});