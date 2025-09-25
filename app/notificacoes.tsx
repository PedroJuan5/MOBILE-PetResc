import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

//dados de exemplo
const DADOS_NAO_LIDOS = [
  { id: '1', icon: 'alert-circle', text: 'Termos de uso e privacidade' },
  { id: '2', icon: 'gift', text: 'Nova campanha de doação iniciada!' },
];
const DADOS_LIDOS = [
  { id: '3', icon: 'paw', text: 'Bem-vindo ao PetCo!' },
  { id: '4', icon: 'checkmark-circle', text: 'Seu cadastro foi concluído.' },
];

//componente para uma linha de notificaçao
const NotificationRow = ({ item }) => (
  <TouchableOpacity style={styles.row}>
    <Ionicons name={item.icon} size={24} color="#3A5C7A" />
    <Text style={styles.rowText}>{item.text}</Text>
    <Ionicons name="chevron-forward" size={20} color="#B0C4DE" />
  </TouchableOpacity>
);

export default function NotificacoesScreen() {
  const [activeTab, setActiveTab] = useState('NÃO LIDOS'); // Começa na aba "NÃO LIDOS"

  const notificationsToShow = activeTab === 'LIDOS' ? DADOS_LIDOS : DADOS_NAO_LIDOS;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* abas de Lidos / nao Lidos */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'LIDOS' && styles.activeTab]}
            onPress={() => setActiveTab('LIDOS')}>
            <Text style={[styles.tabText, activeTab === 'LIDOS' && styles.activeTabText]}>
              LIDOS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'NÃO LIDOS' && styles.activeTab]}
            onPress={() => setActiveTab('NÃO LIDOS')}>
            <Text style={[styles.tabText, activeTab === 'NÃO LIDOS' && styles.activeTabText]}>
              NÃO LIDOS
            </Text>
          </TouchableOpacity>
        </View>

        {/*lista de Notificaçoes*/}
        <ScrollView>
          {notificationsToShow.map(item => (
            <NotificationRow key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>

       {/*patinhas decorativas no rodape*/}
      <View style={styles.pawsContainer}>
          <FontAwesome5 name="paw" size={20} color="#D6EAF7" style={styles.paw1} />
          <FontAwesome5 name="paw" size={16} color="#E6F0FA" style={styles.paw2} />
          <FontAwesome5 name="paw" size={18} color="#D6EAF7" style={styles.paw3} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6FBFF' },
  container: { flex: 1, paddingHorizontal: 20 },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#E6F0FA', borderRadius: 20, marginVertical: 20, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 18, alignItems: 'center' },
  activeTab: { backgroundColor: '#2D68A6' },
  tabText: { color: '#3A5C7A', fontWeight: 'bold' },
  activeTabText: { color: '#FFFFFF' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#E6F0FA' },
  rowText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#3A5C7A' },
  pawsContainer: { position: 'absolute', bottom: 20, right: 20, width: 100, height: 100 },
  paw1: { position: 'absolute', bottom: 10, right: 40, transform: [{ rotate: '20deg' }] },
  paw2: { position: 'absolute', bottom: 50, right: 60, transform: [{ rotate: '-10deg' }] },
  paw3: { position: 'absolute', bottom: 80, right: 20, transform: [{ rotate: '30deg' }] },
});