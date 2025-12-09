import React from 'react';
import { View, Text, StyleSheet,ScrollView,TouchableOpacity,Dimensions,StatusBar} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

const COLORS = {
  primaryText: '#2D68A6',
  secondaryText: '#5A7A9A',
  cardBg: '#DDE8F0',
  bg: '#FFFFFF',
  blueChart: '#2D68A6',
  greenChart: '#6FCF97',
  purpleChart: '#9B51E0',
  pieBlue1: '#2D68A6',
  pieBlue2: '#5A7A9A',
  pieBlue3: '#8BA3BC',
  btnApprove: '#2D68A6',
  btnReject: '#D9534F',
};

export default function HomeAdminScreen() {
  const router = useRouter(); 

  //gráfico de barras manual
  const ManualBarChart = () => {
    const maxHeight = 100; 
    
    const Bar = ({ height, color }: any) => (
      <View style={styles.barContainer}>
        <View style={[styles.bar, { height: (height / 100) * maxHeight, backgroundColor: color }]} />
        <Text style={styles.barLabel}>{height}%</Text>
      </View>
    );

    return (
      <View style={styles.barChartContainer}>
        <View style={styles.barsRow}>
          <Bar height={65} color={COLORS.blueChart} />
          <Bar height={20} color={COLORS.greenChart} />
          <Bar height={15} color={COLORS.purpleChart} />
        </View>
        <View style={styles.chartBaseline} />
      </View>
    );
  };

  const pieChartData = [
    { name: 'PIX', population: 65, color: COLORS.pieBlue1, legendFontColor: 'transparent', legendFontSize: 0 },
    { name: 'Crédito', population: 25, color: COLORS.pieBlue2, legendFontColor: 'transparent', legendFontSize: 0 },
    { name: 'Boleto', population: 10, color: COLORS.pieBlue3, legendFontColor: 'transparent', legendFontSize: 0 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/*header*/}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity>
            <Ionicons name="notifications" size={28} color={COLORS.secondaryText} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/*banner status*/}
        <View style={styles.statusBanner}>
          <View style={styles.statusContent}>
            <Text style={styles.cardTitle}>Status da plataforma (hoje)</Text>
            <Text style={styles.statusText}>12 novas solicitações pendentes</Text>
            <Text style={styles.statusText}>R$ 4.580 arrecadados no mês</Text>
          </View>
          <MaterialCommunityIcons name="party-popper" size={45} color="#E91E63" style={styles.confettiIcon} />
        </View>

          
          <View style={styles.rowContainer}>
          
          <View style={[styles.columnCard, { marginRight: 10 }]}>
            <Text style={styles.cardTitle}>Status dos Pets (450)</Text>
            <View style={styles.legendContainer}>
               <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.blueChart }]} /><Text style={styles.legendText}>Disponíveis</Text></View>
               <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.greenChart }]} /><Text style={styles.legendText}>Aguardando</Text></View>
               <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.purpleChart }]} /><Text style={styles.legendText}>Em tratamento</Text></View>
            </View>
            <ManualBarChart />
          </View>

          <View style={[styles.columnCard, { marginLeft: 10 }]}>
            <Text style={styles.cardTitle}>Últimas ações</Text>
            <View style={styles.actionList}>
              <View style={styles.actionItem}>
                <Text style={styles.actionText}>Nova ONG: Cão Feliz</Text>
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.btnApprove, marginRight: 5 }]}>
                    <Text style={styles.actionBtnText}>Aprovar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.secondaryText }]}>
                    <Text style={styles.actionBtnText}>Rejeitar</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.actionItem}>
                <Text style={styles.actionText}>Doação R$ 500,00</Text>
                <TouchableOpacity><Text style={styles.actionLink}>Ver detalhes</Text></TouchableOpacity>
              </View>

               <View style={styles.actionItem}>
                <Text style={styles.actionText}>Nova solicit.: Pet Max</Text>
                <TouchableOpacity><Text style={styles.actionLink}>Avaliar</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/*banner gerenciamento de pets*/}
        <TouchableOpacity 
            style={styles.petsManagementBanner} 
            activeOpacity={0.9}
            onPress={() => router.push('/(admin)/gerenciar-pets' as any)}
        >
          <View>
            <Text style={styles.cardTitle}>Gerenciamento de Pets</Text>
            <View style={styles.linkRow}>
              <Ionicons name="arrow-forward" size={20} color={COLORS.primaryText} style={{ marginRight: 8 }} />
              <Text style={styles.linkText}>Ir para lista completa</Text>
            </View>
          </View>
          <Ionicons name="paw-outline" size={60} color={COLORS.secondaryText} style={{ opacity: 0.3 }} />
        </TouchableOpacity>

        {/*gráfico de pizza*/}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.cardTitle, { color: COLORS.primaryText, marginBottom: 15 }]}>
            Distribuição de doações
          </Text>
          <View style={styles.donationRow}>
            <View style={styles.donationLegend}>
              <View style={styles.legendItemLarge}><View style={[styles.legendDot, { backgroundColor: COLORS.pieBlue1 }]} /><Text style={styles.legendTextLarge}>PIX: 65%</Text></View>
               <View style={styles.legendItemLarge}><View style={[styles.legendDot, { backgroundColor: COLORS.pieBlue2 }]} /><Text style={styles.legendTextLarge}>Crédito: 25%</Text></View>
               <View style={styles.legendItemLarge}><View style={[styles.legendDot, { backgroundColor: COLORS.pieBlue3 }]} /><Text style={styles.legendTextLarge}>Outros: 10%</Text></View>
            </View>
            <PieChart
              data={pieChartData}
              width={140}
              height={140}
              chartConfig={{ color: (opacity = 1) => `rgba(0,0,0, ${opacity})` }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 0]}
              absolute={false}
              hasLegend={false}
            />
            <View style={styles.donutHole} />
          </View>
        </View>

        {/*monitor de temperatura*/}
        <TouchableOpacity 
            style={styles.tempBanner} 
            activeOpacity={0.9}
            onPress={() => router.push('/(admin)/monitoramento-temperatura' as any)} // <--- NAVEGAÇÃO AQUI
        >
            {/*lado esquerdo*/}
            <View style={styles.tempInfo}>
                <Text style={styles.cardTitle}>Monitor de Temperatura</Text>
                
                <View style={styles.tempValueRow}>
                    <FontAwesome5 name="temperature-low" size={24} color={COLORS.primaryText} style={{marginRight: 8}} />
                    <Text style={styles.tempBigNumber}>24°C</Text>
                </View>

                <View style={styles.tempDetailRow}>
                    <Ionicons name="water-outline" size={16} color={COLORS.secondaryText} />
                    <Text style={styles.tempDetailText}>Umidade: 45%</Text>
                    <Text style={styles.tempDetailText}> • </Text>
                    <Text style={[styles.tempDetailText, {color: COLORS.greenChart}]}>Estável</Text>
                </View>
            </View>

            {/*lado direito*/}
            <View style={styles.tempIconContainer}>
                <MaterialCommunityIcons name="fan" size={50} color={COLORS.secondaryText} style={{ opacity: 0.3 }} />
            </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: 20, paddingBottom: 40 },

  //header
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 25, 
    marginTop: 10 
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.primaryText },
  notificationBadge: { 
    position: 'absolute', top: 2, right: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: '#E91E63', borderWidth: 1.5, borderColor: COLORS.bg 
  },

  //texto do card e status  
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.primaryText, marginBottom: 10 },
  statusText: { fontSize: 14, color: COLORS.secondaryText, marginBottom: 5, fontWeight: '500' },

  //status banner
  statusBanner: { 
    backgroundColor: COLORS.cardBg, 
    borderRadius: 16, 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20, 
    overflow: 'hidden' 
  },
  statusContent: { flex: 1 },
  confettiIcon: { opacity: 0.8 },

  //colunas 
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  columnCard: { 
    flex: 1, 
    backgroundColor: COLORS.cardBg, 
    borderRadius: 16, 
    padding: 15, 
    minHeight: 280 
  },

  //gráfico barras manual
  legendContainer: { marginBottom: 20, marginTop: 5 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  legendText: { fontSize: 10, color: COLORS.secondaryText },
  
  barChartContainer: { alignItems: 'center', marginTop: 10, flex: 1, justifyContent: 'flex-end' },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', height: 110, marginBottom: 5 },
  barContainer: { alignItems: 'center', marginHorizontal: 8 },
  bar: { width: 14, borderRadius: 4 },
  barLabel: { fontSize: 10, color: COLORS.secondaryText, marginTop: 4, fontWeight: '600' },
  chartBaseline: { width: '90%', height: 1, backgroundColor: '#BDCEDE' },

  //ações
  actionList: { marginTop: 5 },
  actionItem: { marginBottom: 15 },
  actionText: { fontSize: 11, color: COLORS.secondaryText, marginBottom: 6, fontWeight: '500' },
  actionButtonsRow: { flexDirection: 'row' },
  actionBtn: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4 },
  actionBtnText: { color: '#FFF', fontSize: 9, fontWeight: '600' },
  actionLink: { fontSize: 10, color: COLORS.primaryText, textDecorationLine: 'underline', alignSelf: 'flex-end' },

  //banner gerenciamento de pets
  petsManagementBanner: { 
    backgroundColor: COLORS.cardBg, 
    borderRadius: 16, 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 25 
  },
  linkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  linkText: { fontSize: 16, color: COLORS.primaryText, fontWeight: '500' },

  //grafico de pizza
  donationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  donationLegend: { flex: 1 },
  legendItemLarge: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  legendTextLarge: { fontSize: 14, color: COLORS.secondaryText, fontWeight: '500' },
  donutHole: { position: 'absolute', right: 35, width: 70, height: 70, borderRadius: 35, backgroundColor: COLORS.bg },

  //monitor de temperatura
  tempBanner: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tempInfo: { flex: 1 },
  tempValueRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 5, 
    marginBottom: 5 
  },
  tempBigNumber: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: COLORS.primaryText 
  },
  tempDetailRow: { flexDirection: 'row', alignItems: 'center' },
  tempDetailText: { fontSize: 13, color: COLORS.secondaryText, marginLeft: 4 },
  tempIconContainer: { justifyContent: 'center', alignItems: 'center' }
});