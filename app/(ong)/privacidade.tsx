import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function PrivacidadeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2D68A6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidade</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Conteúdo */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Termos de Uso */}
        <Text style={styles.sectionTitle}>Termos de uso</Text>
        <Text style={styles.paragraph}>
          Bem-vindo(a) ao nosso aplicativo de doação e adoção de pets! Ao utilizar a
          plataforma, você concorda com os termos abaixo. Caso não concorde, recomendamos
          não utilizar nossos serviços.
        </Text>

        <Text style={styles.paragraph}>
          Nosso objetivo é aproximar pessoas interessadas em doar ou adotar animais,
          promovendo a adoção responsável. Não realizamos vendas ou intermediações
          financeiras entre usuários.
        </Text>

        <Text style={styles.paragraph}>
          Para utilizar o aplicativo, o usuário deve fornecer informações verdadeiras e
          atualizadas. É proibido criar perfis falsos, divulgar anúncios de venda, ou
          publicar conteúdos ofensivos ou enganosos.
        </Text>

        <Text style={styles.paragraph}>
          A plataforma atua apenas como intermediária de contato entre adotantes e
          doadores, não se responsabilizando pelas informações fornecidas por terceiros ou
          por compromissos firmados fora do ambiente digital.
        </Text>

        <Text style={styles.paragraph}>
          Reservamo-nos o direito de suspender contas que violem estes termos ou utilizem
          o serviço de forma inadequada. O uso contínuo da plataforma após atualizações
          implica a aceitação das novas versões dos termos.
        </Text>

        {/* Política de Privacidade */}
        <Text style={styles.sectionTitle}>Política de Privacidade</Text>
        <Text style={styles.paragraph}>
          Valorizamos sua privacidade e seguimos a Lei Geral de Proteção de Dados
          (LGPD). Coletamos apenas informações essenciais para o funcionamento do app, como
          nome, e-mail, telefone e dados sobre os pets cadastrados.
        </Text>

        <Text style={styles.paragraph}>
          Seus dados são utilizados para melhorar sua experiência, facilitar o contato com
          outros usuários e garantir a segurança da plataforma. Não compartilhamos suas
          informações com terceiros sem consentimento.
        </Text>

        <Text style={styles.paragraph}>
          Adotamos medidas técnicas e administrativas para proteger seus dados contra
          acessos não autorizados. Você pode solicitar, a qualquer momento, a exclusão ou
          atualização de suas informações.
        </Text>

        <Text style={styles.paragraph}>
          Para mais informações ou dúvidas, entre em contato pelo e-mail:
          suporte@petco.com.br
        </Text>

        {/* Seção adicional (Serviço) */}
        <Text style={styles.sectionTitle}>Serviço PetCo</Text>
        <Text style={styles.paragraph}>
          Nosso serviço tem como missão promover conexões seguras entre pessoas e animais.
          Acreditamos que cada adoção é um ato de amor e responsabilidade. Trabalhamos para
          garantir que cada pet encontre um lar adequado e amoroso.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2D68A6',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D68A6',
    marginBottom: 8,
    marginTop: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 20,
    padding: 0,
    color: '#4A4A4A',
    textAlign: 'justify',
    marginBottom: 16,
  },
});
