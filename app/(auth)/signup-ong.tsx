import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginCadastroScreen() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={[styles.dot, step === i + 1 && styles.dotActive]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Botão de voltar */}
        {step > 0 && (
          <TouchableOpacity onPress={prevStep} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2D68A6" />
          </TouchableOpacity>
        )}

        {/* Tela de Login */}
        {step === 0 && (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>

            <Text style={styles.label}>CNPJ</Text>
            <TextInput
              placeholder="XX.XXX.XXX/0001-XX"
              placeholderTextColor="#999"
              style={styles.input}
            />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Digite sua senha"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                style={[styles.input, {  flex: 1, marginBottom: 0 }]}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={22}
                  color="#2D68A6"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push('/esqueci-senha')}>
              <Text style={styles.forgot}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/home-ong')} accessibilityRole="button" accessibilityLabel="Entrar">
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Não tem conta?{' '}
              <Text style={styles.linkText} onPress={nextStep}>
                Cadastre-se
              </Text>
            </Text>
          </View>
        )}

        {/* Cadastro - Etapa 1 */}
        {step === 1 && (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Cadastre-se</Text>
            <Text style={styles.subtitle}>Crie sua conta e ajude a transformar vidas.</Text>

            <TextInput placeholder="Nome completo" style={styles.input} />
            <TextInput placeholder="CPF" style={styles.input} />
            <TextInput placeholder="Nome ONG" style={styles.input} />
            <TextInput placeholder="Email" style={styles.input} />

            <TouchableOpacity style={styles.button} onPress={nextStep}>
              <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>

            {renderDots()}

            <Text style={styles.footerText}>
              Já tem conta? <Text style={styles.linkText} onPress={() => setStep(0)}>Login</Text>
            </Text>
          </View>
        )}

        {/* Cadastro - Etapa 2 */}
        {step === 2 && (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Cadastre-se</Text>
            <Text style={styles.subtitle}>Crie sua conta e ajude a transformar vidas.</Text>

            <TextInput placeholder="CNPJ" style={styles.input} />
            <TextInput placeholder="Telefone" style={styles.input} />
            <TextInput
              placeholder="Senha"
              style={styles.input}
              secureTextEntry={!showPassword}
            />
            <TextInput
              placeholder="Confirmar senha"
              style={styles.input}
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity style={styles.button} onPress={nextStep}>
              <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>

            {renderDots()}

            <Text style={styles.footerText}>
              Já tem conta? <Text style={styles.linkText} onPress={() => setStep(0)}>Login</Text>
            </Text>
          </View>
        )}

        {/* Cadastro - Etapa 3 */}
        {step === 3 && (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Cadastre-se</Text>
            <Text style={styles.subtitle}>Crie sua conta e ajude a transformar vidas.</Text>

            <TextInput placeholder="CEP" style={styles.input} />
            <TextInput placeholder="Rua / Avenida" style={styles.input} />
            <TextInput placeholder="Número" style={styles.input} />
            <TextInput placeholder="Complemento" style={styles.input} />

            <TouchableOpacity style={styles.button} onPress={nextStep}>
              <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>

            {renderDots()}

            <Text style={styles.footerText}>
              Já tem conta? <Text style={styles.linkText} onPress={() => setStep(0)}>Login</Text>
            </Text>
          </View>
        )}

        {/* Cadastro - Etapa 4 */}
        {step === 4 && (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Cadastre-se</Text>
            <Text style={styles.subtitle}>Crie sua conta e ajude a transformar vidas.</Text>

            <TextInput placeholder="Bairro" style={styles.input} />
            <TextInput placeholder="Estado" style={styles.input} />
            <TextInput placeholder="Cidade" style={styles.input} />

            <Text style={styles.infoText}>
              Caso a ONG esteja em uma aldeia ou endereço, opte pela unidade principal
              e adicione o endereço no perfil.
            </Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Finalizar</Text>
            </TouchableOpacity>

            {renderDots()}

            <Text style={styles.footerText}>
              Já tem conta? <Text style={styles.linkText} onPress={() => setStep(0)}>Login</Text>
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  formContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D68A6',
    marginBottom: 6,
  },
  subtitle: {
    color: '#666',
    marginBottom: 12,
  },
  label: {
    color: '#2D68A6',
    marginTop: 8,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e6ef',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#a1a1a1ff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e6ef',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  forgot: {
    color: '#2D68A6',
    textAlign: 'right',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2D68A6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 12,
    color: '#666',
  },
  linkText: {
    color: '#2D68A6',
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#2D68A6',
  },
  infoText: {
    color: '#666',
    marginTop: 10,
  },
});

