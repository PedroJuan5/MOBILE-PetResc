import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar,Dimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2D68A6',
  bg: '#FFFFFF',
  cardBg: '#DDE8F0', 
  white: '#FFFFFF',
  secondary: '#5A7A9A',
  green: '#27AE60', // normal
  orange: '#F2994A', //alerta
  red: '#EB5757',   //crítico
};

//dados das 4 ONGs (Simulando leitura de sensores)
const SENSORS_DATA = [
  {
    id: '1',
    ongName: 'Vira Lata é Dez',
    temp: '24°C',
    umidade: '45%',
    status: 'Normal',
    statusColor: COLORS.green
  },
  {
    id: '2',
    ongName: 'Instituto Caramelo',
    temp: '28°C',
    umidade: '40%',
    status: 'Alerta',
    statusColor: COLORS.orange
  },
  {
    id: '3',
    ongName: 'SUIPA',
    temp: '23°C',
    umidade: '50%',
    status: 'Normal',
    statusColor: COLORS.green
  },
  {
    id: '4',
    ongName: 'Abrigo Feliz',
    temp: '31°C',
    umidade: '30%',
    status: 'Crítico',
    statusColor: COLORS.red
  },
];

export default function MonitoramentoTemperaturaScreen() {
  const router = useRouter();

  const renderSensorCard = (item: any) => (
    <TouchableOpacity 
        key={item.id} 
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => console.log(`Abrir detalhes de ${item.ongName}`)}
    >
        <View style={styles.cardHeader}>
            <FontAwesome5 name="temperature-low" size={24} color={COLORS.primary} />
            <View style={[styles.statusBadge, { backgroundColor: item.statusColor }]}>
                <Text style={styles.statusText}>{item.status}</Text>
            </View>
        </View>

        <Text style={styles.tempValue}>{item.temp}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.ongName} numberOfLines={1}>{item.ongName}</Text>
        
        <View style={styles.footerRow}>
            <Ionicons name="water-outline" size={14} color={COLORS.secondary} />
            <Text style={styles.humidityText}>Umidade: {item.umidade}</Text>
        </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/*header*/}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
           <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Monitoramento</Text>
        <TouchableOpacity style={styles.iconBtn}>
           <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.pageTitle}>Visão Geral das ONGs</Text>
        <Text style={styles.subtitle}>Acompanhe a temperatura e umidade em tempo real dos abrigos parceiros.</Text>


        <View style={styles.gridContainer}>
            {SENSORS_DATA.map(item => renderSensorCard(item))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: 20 },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: COLORS.primary },
  iconBtn: { padding: 5 },

  // Titles
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 5 },
  subtitle: { fontSize: 14, color: COLORS.secondary, marginBottom: 25, lineHeight: 20 },

  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Card Style
  card: {
    width: (width - 55) / 2,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: { fontSize: 10, color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },

  tempValue: { fontSize: 36, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },

  divider: { height: 1, backgroundColor: 'rgba(45, 104, 166, 0.15)', marginBottom: 10 },

  ongName: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginBottom: 5 },
  
  footerRow: { flexDirection: 'row', alignItems: 'center' },
  humidityText: { fontSize: 12, color: COLORS.secondary, marginLeft: 4 }
});