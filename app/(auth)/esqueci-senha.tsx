import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {ActivityIndicator, Alert,Keyboard, KeyboardAvoidingView,Platform,SafeAreaView,StyleSheet,Text,TextInput,TouchableOpacity, View,} from 'react-native';
import MaskInput from 'react-native-mask-input';

//componente Customizado de Checkbox
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

export default function EsqueciSenhaScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  
  const [step, setStep] = useState(1); //Email/Fone, 2: Código, 3: Nova Senha

  //estado do Passo 1 
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [telefoneUnmasked, setTelefoneUnmasked] = useState('');
  const [isNotRobot, setIsNotRobot] = useState(false);

  //estado do Passo 2 
  const [code, setCode] = useState(['', '', '', '']);
  const codeInputs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  //estado do Passo 3
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  //funções de Navegação
  const handleRequestCode = async () => {
    Keyboard.dismiss();
    if (!email && !telefone) {
      Alert.alert('Erro', 'Por favor, insira seu e-mail ou telefone.');
      return;
    }
    if (!isNotRobot) {
      Alert.alert('Erro', 'Por favor, confirme que você não é um robô.');
      return;
    }

    setIsLoading(true);
    try {
      // LÓGICA DA API (kaique coloque a nossa api depois)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email) {
        Alert.alert('Email enviado', `Enviamos um email para ${email} com um código.`);
      } else {
        Alert.alert('SMS enviado', `Enviamos um SMS para ${telefone} com um código.`);
      }
      setStep(2); 

    } catch (err) {
      Alert.alert('Erro', 'Não foi possível processar sua solicitação. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    Keyboard.dismiss();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 4) {
      Alert.alert('Erro', 'O código deve ter 4 dígitos.');
      return;
    }

    setIsLoading(true);
    try {
      //LOGICA DA API (Passo 2)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep(3); 

    } catch (err) {
      Alert.alert('Erro', 'Código inválido ou expirado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    Keyboard.dismiss();
    
    if (!password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha e confirme a nova senha.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Erro', 'Sua senha precisa ter no mínimo 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    try {
      //LOGICA DA API (Passo 3)
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Sucesso', 'Sua senha foi redefinida! Por favor, faça o login.');
      router.replace('/login'); 

    } catch (err) {
      Alert.alert('Erro', 'Não foi possível redefinir sua senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text.replace(/[^0-9]/g, '').slice(0, 1);
    setCode(newCode);

    if (text.length === 1 && index < 3) {
      codeInputs[index + 1].current?.focus();
    }
  };

  const handleCodeBackspace = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      codeInputs[index - 1].current?.focus();
    }
  };

  //renderização do Título do Cabeçalho
  const getHeaderTitle = () => {
    switch (step) {
      case 1: return 'Esqueceu a senha?';
      case 2: return 'Verificação';
      case 3: return 'Redefinir senha';
      default: return '';
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: getHeaderTitle(),
          headerShown: true,
          headerBackTitle: '', 
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
        }}
      />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {/*pedir Email/Telefone*/}
          {step === 1 && (
            <View style={styles.container}>
              <Text style={styles.subtitle}>
                Insira o seu email ou telefone e enviaremos um link para você voltar a acessar sua conta.
              </Text>
              
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enviar para seu email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                maxLength={100}
                editable={!isLoading}
              />
              
              <Text style={styles.label}>Telefone</Text>
              <MaskInput
                style={styles.input}
                placeholder="Enviar para seu telefone"
                value={telefone}
                onChangeText={(masked, unmasked) => {
                  setTelefone(masked);
                  setTelefoneUnmasked(unmasked);
                }}
                mask={['(',/\d/,/\d/,')',' ',/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/]}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
              
              <CustomCheckbox
                label="Não sou robô"
                isSelected={isNotRobot}
                onSelect={() => setIsNotRobot(!isNotRobot)}
              />

              <View style={styles.footer}>
                <TouchableOpacity 
                  style={[styles.button, isLoading && styles.buttonDisabled]} 
                  onPress={handleRequestCode}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Redefinir senha</Text>
                  )}
                </TouchableOpacity>
                <Text style={styles.footerText}>
                  Não consegue redefinir sua senha? <Text style={styles.footerLink}>Fale com o suporte</Text>
                </Text>
              </View>
            </View>
          )}

          {/*Código de Verificação*/}
          {step === 2 && (
            <View style={styles.container}>
              <Text style={styles.subtitle}>Entre com o código de verificação</Text>
              
              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={codeInputs[index]}
                    style={styles.codeInput}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleCodeBackspace(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    editable={!isLoading}
                  />
                ))}
              </View>
              
              <Text style={styles.footerText}>
                se você não recebeu um código, <Text style={styles.footerLink}>Reenviar</Text>
              </Text>

              <View style={styles.footer}>
                <TouchableOpacity 
                  style={[styles.button, isLoading && styles.buttonDisabled]} 
                  onPress={handleVerifyCode}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Próximo</Text>
                  )}
                </TouchableOpacity>
                <Text style={styles.footerText}>
                  Não consegue redefinir sua senha? <Text style={styles.footerLink}>Fale com o suporte</Text>
                </Text>
              </View>
            </View>
          )}

          {/*Nova Senha*/}
          {step === 3 && (
            <View style={styles.container}>
              <Text style={styles.subtitle}>
                Sua senha precisa no mínimo 8 caracteres sendo letras, numeros e/ou simbolos
              </Text>
              
              <Text style={styles.label}>Digite uma nova senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite aqui..."
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                maxLength={50}
                editable={!isLoading}
              />
              
              <Text style={styles.label}>Confirme a senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite aqui..."
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                maxLength={50}
                editable={!isLoading}
              />

              <View style={styles.footer}>
                <TouchableOpacity 
                  style={[styles.button, isLoading && styles.buttonDisabled]} 
                  onPress={handleResetPassword}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Salvar Senha</Text> 
                  )}
                </TouchableOpacity>
                <Text style={styles.footerText}>
                  Não consegue redefinir sua senha? <Text style={styles.footerLink}>Fale com o suporte</Text>
                </Text>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
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
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  codeInput: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005A9C',
  },
  footer: {
    marginTop: 'auto', 
    paddingTop: 20,
  },
  button: {
    backgroundColor: '#94B9D8', 
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#1c5b8f', 
    fontSize: 18,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  footerLink: {
    color: '#005A9C', 
    fontWeight: '700',
  },
});
