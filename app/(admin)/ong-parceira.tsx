import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2D68A6',
  secondary: '#5A7A9A',
  bg: '#FFFFFF',
  red: '#E57373',
  border: '#E0E0E0',
};

// Dados Mockados das ONGs
const ONGS_DATA = [
  {
    id: '1',
    nome: 'ONG Cão Amigo',
    cnpj: '00.000.000/0000-00',
    pets: 50,
    status: 'Ativa'
  },
  {
    id: '2',
    nome: 'Instituto Patas Unidas',
    cnpj: '00.000.000/0000-01',
    pets: 25,
    status: 'Pendente'
  },
  {
    id: '3',
    nome: 'Abrigo Bons Cães',
    cnpj: '00.000.000/0000-12',
    pets: 0,
    status: 'Em análise'
  },
];

export default function GerenciarOngsScreen() {
  const router = useRouter();

  const renderOngItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.ongName}>{item.nome}</Text>
      
      <Text style={styles.label}>CNPJ: <Text style={styles.value}>{item.cnpj}</Text></Text>
      <Text style={styles.label}>Pets ativos: <Text style={styles.value}>{item.pets} Pets ativos</Text></Text>
      <Text style={styles.label}>Status: <Text style={styles.value}>{item.status}</Text></Text>

      {/*ações*/}
      <View style={styles.actionsRow}>
        <Text style={styles.actionTextLabel}>Aprovar / Suspender / Ativar</Text>
        <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.iconBtn}>
                <Feather name="edit-2" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
                <MaterialIcons name="block" size={20} color={COLORS.red} />
            </TouchableOpacity>
        </View>
      </View>
      
      {/*linha separadora*/}
      <View style={styles.separator} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/*header*/}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ONG parceira</Text>
        <TouchableOpacity>
            <Ionicons name="notifications" size={24} color={COLORS.secondary} />
            <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {/*sub titulo*/}
      <View style={styles.subHeader}>
        <Text style={styles.subTitle}>Todas as ONGS</Text>
        <View style={styles.subHeaderLine} />
      </View>

      {/*lista*/}
      <FlatList 
        data={ONGS_DATA}
        keyExtractor={item => item.id}
        renderItem={renderOngItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/*footer seta de voltar*/}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>
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
    paddingTop: 20,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary },
  badge: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E91E63' },

  // SubHeader
  subHeader: { paddingHorizontal: 25, marginBottom: 20 },
  subTitle: { fontSize: 18, color: COLORS.primary, fontWeight: '600', marginBottom: 10 },
  subHeaderLine: { height: 1, backgroundColor: '#A0B4CC', width: '100%' },

  // List
  listContent: { paddingHorizontal: 25 },

  // Card
  card: { marginBottom: 25 },
  ongName: { fontSize: 18, color: COLORS.primary, fontWeight: '600', marginBottom: 15 },
  label: { fontSize: 14, color: COLORS.primary, marginBottom: 8, fontWeight: '500' },
  value: { color: COLORS.secondary, fontWeight: '400' },

  // Actions
  actionsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 5
  },
  actionTextLabel: { fontSize: 10, color: COLORS.primary },
  iconsContainer: { flexDirection: 'row', gap: 15 },
  iconBtn: { padding: 5 },

  separator: { height: 1, backgroundColor: '#A0B4CC', marginTop: 15, opacity: 0.5 },

  // Footer
  footer: { paddingHorizontal: 25, paddingBottom: 20 },
});