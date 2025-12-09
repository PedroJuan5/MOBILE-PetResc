import React, { useState } from 'react';
import { View,  Text, StyleSheet,  FlatList,  StatusBar, TextInput, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2D68A6',
  bg: '#FFFFFF',
  cardBg: '#DDE8F0', 
  textLight: '#A0B4CC'
};

// Dados Mockados de Logs
const LOGS_DATA = [
  {
    id: '1023',
    acao: 'Aprovação de ONG',
    responsavel: 'Admin Principal',
    data: '04/12/2025 - 14:30',
    tipo: 'Sistema'
  },
  {
    id: '1022',
    acao: 'Bloqueio de Usuário',
    responsavel: 'Admin Suporte',
    data: '04/12/2025 - 10:15',
    tipo: 'Segurança'
  },
  {
    id: '1021',
    acao: 'Alteração de Senha',
    responsavel: 'Carlos M.',
    data: '03/12/2025 - 18:45',
    tipo: 'Usuário'
  },
  {
    id: '1020',
    acao: 'Nova Campanha Criada',
    responsavel: 'Vira Lata é Dez',
    data: '03/12/2025 - 09:20',
    tipo: 'ONG'
  },
  {
    id: '1019',
    acao: 'Exclusão de Pet',
    responsavel: 'Admin Principal',
    data: '02/12/2025 - 16:00',
    tipo: 'Sistema'
  },
];

export default function LogsScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  // Filtro
  const filteredLogs = LOGS_DATA.filter(log => 
    log.acao.toLowerCase().includes(searchText.toLowerCase()) || 
    log.responsavel.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderLogItem = ({ item }: any) => (
    <View style={styles.card}>
      {/* cabeçalho do card (ID na direita) */}
      <View style={styles.cardHeader}>
        <Text style={styles.actionLabel}>Ação: <Text style={styles.actionText}>{item.acao}</Text></Text>
        <Text style={styles.idText}>ID: {item.id}</Text>
      </View>
      
      {/* detalhes */}
      <Text style={styles.detailLabel}>
        Responsável: <Text style={styles.detailValue}>{item.responsavel}</Text>
      </Text>
      
      <Text style={styles.detailLabel}>
        Data: <Text style={styles.detailValue}>{item.data}</Text>
      </Text>

      {/* tipo e seta */}
      <View style={styles.footerCard}>
        <Text style={styles.typeText}>Tipo: {item.tipo}</Text>
        <Feather name="arrow-right" size={20} color={COLORS.primary} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Logs</Text>
        <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications" size={24} color="#5A7A9A" />
            <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {/* subtitle */}
      <Text style={styles.subTitle}>Histórico de atividades</Text>

      {/*barra de pesquisa*/}
      <View style={styles.searchContainer}>
        <TextInput 
            style={styles.searchInput}
            placeholder="Buscar por Ação ou Responsável"
            placeholderTextColor={COLORS.textLight}
            value={searchText}
            onChangeText={setSearchText}
        />
        <Ionicons name="search" size={20} color={COLORS.primary} style={{marginRight: 10}} />
      </View>

      {/*lista*/}
      <FlatList 
        data={filteredLogs}
        keyExtractor={item => item.id}
        renderItem={renderLogItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 15,
    marginBottom: 5,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary },
  notificationBtn: { position: 'relative', padding: 5 },
  badge: { position: 'absolute', top: 5, right: 5, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E91E63' },

  // Subtitle
  subTitle: { 
    fontSize: 18, 
    color: COLORS.primary, 
    fontWeight: '400', 
    paddingHorizontal: 25, 
    marginBottom: 15 
  },

  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE8F0',
    borderRadius: 8,
    marginHorizontal: 25,
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 45,
    backgroundColor: '#FAFAFA'
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.primary },

  // List
  listContent: { paddingHorizontal: 25, paddingBottom: 20 },

  // Card
  card: { 
    backgroundColor: COLORS.cardBg, 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: {width:0, height: 2}
  },
  
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 8
  },
  
  actionLabel: { fontSize: 15, color: COLORS.primary },
  actionText: { fontWeight: '600' },
  idText: { fontSize: 12, color: COLORS.primary, opacity: 0.7 },

  detailLabel: { fontSize: 14, color: COLORS.primary, marginBottom: 4 },
  detailValue: { fontWeight: '400', color: '#5A7A9A' }, 

  footerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  typeText: { fontSize: 12, color: COLORS.primary, fontStyle: 'italic' }
});