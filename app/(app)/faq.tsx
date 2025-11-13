import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FAQScreen: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const router = useRouter();

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section) // fecha se já estiver aberta
        : [...prev, section] // adiciona se não estiver aberta
    );
  };

  const renderQuestion = (question: string, answer: string) => (
    <View style={styles.questionContainer}>
      <Text style={styles.question}>• {question}</Text>
      <Text style={styles.answer}>{answer}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>FAQ</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Conta e acesso */}
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('conta')}>
          <Text style={styles.sectionTitle}>Conta e acesso</Text>
          <Ionicons
            name={expandedSections.includes('conta') ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#003366"
          />
        </TouchableOpacity>
        {expandedSections.includes('conta') && (
          <View style={styles.sectionContent}>
            {renderQuestion(
              'Como criar uma conta no aplicativo?',
              'Na tela inicial, toque em “Cadastrar-se” e preencha os campos solicitados. Você pode se registrar como usuário comum ou como ONG.'
            )}
            {renderQuestion(
              'Esqueci minha senha, como recuperar?',
              'Na tela de login, toque em “Esqueci minha senha”. Você receberá um e-mail com as instruções para redefinir sua senha.'
            )}
            {renderQuestion(
              'Posso alterar meus dados pessoais?',
              'Sim! Vá até o seu perfil e selecione “Editar informações” para atualizar nome, e-mail ou telefone.'
            )}
          </View>
        )}

        {/* Cadastro de ONGs */}
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('ongs')}>
          <Text style={styles.sectionTitle}>Cadastro de ONGs</Text>
          <Ionicons
            name={expandedSections.includes('ongs') ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#003366"
          />
        </TouchableOpacity>
        {expandedSections.includes('ongs') && (
          <View style={styles.sectionContent}>
            {renderQuestion(
              'Como cadastrar uma ONG?',
              'Durante o cadastro, selecione a opção “Cadastrar ONG”. Será necessário informar CNPJ, endereço e uma breve descrição da instituição.'
            )}
            {renderQuestion(
              'A ONG pode gerenciar vários animais?',
              'Sim! Após o cadastro, a ONG poderá adicionar e gerenciar todos os pets disponíveis para adoção dentro do painel.'
            )}
            {renderQuestion(
              'Existe algum custo para o cadastro?',
              'Não. O cadastro de ONGs é totalmente gratuito.'
            )}
          </View>
        )}

        {/* Cadastro de animais */}
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('animais')}>
          <Text style={styles.sectionTitle}>Cadastro de animais</Text>
          <Ionicons
            name={expandedSections.includes('animais') ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#003366"
          />
        </TouchableOpacity>
        {expandedSections.includes('animais') && (
          <View style={styles.sectionContent}>
            {renderQuestion(
              'Como cadastrar um pet para adoção?',
              'Acesse seu perfil e toque em “Adicionar pet”. Preencha as informações sobre o animal e envie fotos claras.'
            )}
            {renderQuestion(
              'Posso editar as informações do pet depois?',
              'Sim, é possível editar ou remover o cadastro a qualquer momento no painel do usuário.'
            )}
            {renderQuestion(
              'Há limite de pets cadastrados?',
              'Não há limite fixo, mas recomendamos manter apenas animais realmente disponíveis para adoção.'
            )}
          </View>
        )}

        {/* Adoção e doação */}
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('adocao')}>
          <Text style={styles.sectionTitle}>Adoção e doação</Text>
          <Ionicons
            name={expandedSections.includes('adocao') ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#003366"
          />
        </TouchableOpacity>
        {expandedSections.includes('adocao') && (
          <View style={styles.sectionContent}>
            {renderQuestion(
              'Como adotar um animal?',
              'Navegue pela lista de pets disponíveis e toque em “Quero adotar”. Você poderá conversar diretamente com o responsável.'
            )}
            {renderQuestion(
              'Posso doar um animal mesmo sem ser ONG?',
              'Sim! Usuários comuns também podem doar, desde que o animal esteja em boas condições de saúde e segurança.'
            )}
            {renderQuestion(
              'Há acompanhamento após a adoção?',
              'Algumas ONGs realizam acompanhamento. Em adoções diretas entre usuários, isso é opcional.'
            )}
          </View>
        )}

        {/* Notificações e alertas */}
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('notificacoes')}>
          <Text style={styles.sectionTitle}>Notificações e alertas</Text>
          <Ionicons
            name={expandedSections.includes('notificacoes') ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#003366"
          />
        </TouchableOpacity>
        {expandedSections.includes('notificacoes') && (
          <View style={styles.sectionContent}>
            {renderQuestion(
              'Como funcionam as notificações?',
              'Você receberá alertas sobre novas mensagens, atualizações de pets e respostas das ONGs.'
            )}
            {renderQuestion(
              'Posso desativar notificações?',
              'Sim, vá até as configurações do app e ajuste suas preferências de notificação.'
            )}
          </View>
        )}

        {/* Suporte e contato */}
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('suporte')}>
          <Text style={styles.sectionTitle}>Suporte e contato</Text>
          <Ionicons
            name={expandedSections.includes('suporte') ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#003366"
          />
        </TouchableOpacity>
        {expandedSections.includes('suporte') && (
          <View style={styles.sectionContent}>
            {renderQuestion(
              'Como entro em contato com o suporte?',
              'Envie um e-mail para suporte@petco.com.br informando o problema ou dúvida. Nosso time responderá o mais rápido possível.'
            )}
            {renderQuestion(
              'O suporte funciona em quais horários?',
              'Nosso atendimento é de segunda a sexta, das 8h às 18h (exceto feriados).'
            )}
          </View>
        )}

        {/* Segurança e privacidade */}
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('seguranca')}>
          <Text style={styles.sectionTitle}>Segurança e privacidade</Text>
          <Ionicons
            name={expandedSections.includes('seguranca') ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#003366"
          />
        </TouchableOpacity>
        {expandedSections.includes('seguranca') && (
          <View style={styles.sectionContent}>
            {renderQuestion(
              'Meus dados estão protegidos?',
              'Sim! Seguimos a LGPD e utilizamos criptografia para proteger suas informações pessoais.'
            )}
            {renderQuestion(
              'O aplicativo compartilha meus dados?',
              'Não compartilhamos informações pessoais com terceiros sem o seu consentimento.'
            )}
            {renderQuestion(
              'Posso excluir minha conta?',
              'Sim. Basta acessar as configurações da conta e selecionar “Excluir conta permanentemente”.'
            )}
          </View>
        )}
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
    marginRight: 24,
  },
  scrollContent: {
    paddingBottom: 40,
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
  questionContainer: {
    marginBottom: 10,
  },
  question: {
    color: '#0d549bff',
    fontSize: 14,
    fontWeight: '500',
  },
  answer: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 10,
    marginTop: 2,
  },
});

export default FAQScreen;
