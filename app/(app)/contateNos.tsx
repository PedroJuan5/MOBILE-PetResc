import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const primaryColor = '#205a8dff';
const textColor = '#205a8dff';
const secondaryTextColor = '#6c757d';

const ContatoScreen = () => {
  const router = useRouter();
  return (
   
    <SafeAreaView style={styles.safeArea}>  
      <ScrollView style={styles.container}> 
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={primaryColor} />
          </TouchableOpacity>
          <Text style={styles.title}>Contate-nos</Text>
        </View>

        {/* Seção principal de informações */}
        <View style={styles.content}>
          <Text style={styles.subtitle}>Fale conosco!</Text>
          <Text style={styles.introText}>
            Tem alguma dúvida, sugestão ou problema? Entre em contato pelos canais abaixo:
          </Text>

          {/* 1. E-mail */}
          <Text style={styles.sectionTitle}>1. E-mail</Text>
          <Text style={styles.listItem}>• petresc@gmail.com</Text>

          {/* 2. Telefone/WhatsApp */}
          <Text style={styles.sectionTitle}>2. Telefone/WhatsApp</Text>
          <Text style={styles.listItem}>• (11) 90000 - 0009</Text>
          <Text style={styles.listItem}>• 4009 - 9004</Text>

          {/* 3. Chat online */}
          <Text style={styles.sectionTitle}>3. Chat online</Text>
          <Text style={styles.listItem}>• Disponível no app e site</Text>
          <Text style={styles.listItem}>• durante o horário de</Text>
          <Text style={styles.listItem}>  atendimento: 09:00 - 18:00</Text>
          
          {/* 4. Redes sociais */}
          <Text style={styles.sectionTitle}>4. Redes sociais</Text>
          <Text style={styles.listItem}>• Instagram: @petco</Text>
          <Text style={styles.listItem}>• Facebook: /petco</Text>

          {/* 5. Formulário de contato */}
          <Text style={styles.sectionTitle}>5. Formulário de contato</Text>
          
          <View style={styles.form}>
            {/* Campo Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.formLabel}>• Nome:</Text>
              <TextInput style={styles.input} />
            </View>

            {/* Campo E-mail */}
            <View style={styles.inputGroup}>
              <Text style={styles.formLabel}>• E-mail:</Text>
              <TextInput style={styles.input} keyboardType="email-address" />
            </View>

            {/* Campo Mensagem */}
            <View style={styles.inputGroup}>
              <Text style={styles.formLabel}>• Mensagem:</Text>
              <TextInput style={styles.input} />
            </View>
            
            {/* Botão Enviar */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '500', 
    color: primaryColor,
    marginLeft: 15,
  },
  content: {
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: textColor,
    marginBottom: 5,
  },
  introText: {
    fontSize: 14,
    color: secondaryTextColor,
    marginBottom: 25,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: textColor,
    marginTop: 15,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 14,
    color: textColor,
    marginLeft: 10, 
    lineHeight: 20,
  },
  form: {
    marginTop: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 13,
    color: '#205a8dff',
    width: 90,
    fontWeight: 'bold',
   
  },
  input: {
    flex: 1, 
    height: 30, 
    borderBottomWidth: 1,
    borderBottomColor: secondaryTextColor,
    paddingVertical: 0,
    fontSize: 20,
    marginTop: 20,
    color: '#205a8dff',
    padding: 5,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 40,
  },
  button: {
    backgroundColor: primaryColor,
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContatoScreen;