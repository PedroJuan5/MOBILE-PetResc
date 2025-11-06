import { Ionicons } from '@expo/vector-icons'; // use 'react-native-vector-icons/Ionicons' se não for Expo
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FAQScreen: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderQuestion = (question: string) => (
    <Text style={styles.question}>• {question}</Text>
  );

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>FAQ</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Conta e acesso */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('conta')}
        >
          <Text style={styles.sectionTitle}>Conta e acesso</Text>
          <Ionicons
            name={expandedSection === 'conta' ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#003366"
          />
        </TouchableOpacity>
        {expandedSection === 'conta' && (
          <View style={styles.sectionContent}>
            {renderQuestion('Como criar uma conta no app/site?')}
            {renderQuestion('Esqueci minha senha, como recuperar?')}
            {renderQuestion('Posso alterar meus dados pessoais?')}
          </View>
        )}

        {/* Cadastro de ONGs */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('ongs')}
        >
          <Text style={styles.sectionTitle}>Cadastro de ONGs</Text>
          <Ionicons
            name={expandedSection === 'ongs' ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#003366"
          />
        </TouchableOpacity>
         
        {expandedSection === 'ongs' && (
          <View style={styles.sectionContent}>
            {renderQuestion('Como eu faço para cadastrar uma ong?')}
            {renderQuestion('?')}
            {renderQuestion('?')}
          </View>
        )}

        {/* Cadastro de animais */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('animais')}
        >
          <Text style={styles.sectionTitle}>Cadastro de animais</Text>
          <Ionicons
            name={expandedSection === 'animais' ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#003366"
          />
        </TouchableOpacity>

        {/* Adoção e doação */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('adocao')}
        >
          <Text style={styles.sectionTitle}>Adoção e doação</Text>
          <Ionicons
            name={expandedSection === 'adocao' ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#003366"
          />
        </TouchableOpacity>

        {/* Notificações e alertas */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('notificacoes')}
        >
          <Text style={styles.sectionTitle}>Notificações e alertas</Text>
          <Ionicons
            name={expandedSection === 'notificacoes' ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#003366"
          />
        </TouchableOpacity>

        {/* Suporte e contato */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('suporte')}
        >
          <Text style={styles.sectionTitle}>Suporte e contato</Text>
          <Ionicons
            name={expandedSection === 'suporte' ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#003366"
          />
        </TouchableOpacity>

        {/* Segurança e privacidade */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('seguranca')}
        >
          <Text style={styles.sectionTitle}>Segurança e privacidade</Text>
          <Ionicons
            name={expandedSection === 'seguranca' ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#003366"
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: '#0d549bff',
    fontWeight: '600',
    marginRight: 24, // para centralizar visualmente o título
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#d0d0d0',
    paddingVertical: 14,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#0c4a88ff',
    fontWeight: '500',
  },
  sectionContent: {
    paddingLeft: 10,
    paddingBottom: 10,
  },
  question: {
    color: '#888',
    fontSize: 14,
    lineHeight: 22,
  },
});

export default FAQScreen;
