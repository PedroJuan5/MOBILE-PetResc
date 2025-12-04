import React from 'react';
import { View, Text,  StyleSheet,  TouchableOpacity,  FlatList,  StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2D68A6', 
  cardBg: '#DDE8F0',  
  bg: '#FFFFFF',      
};

// Dados da imagem
const ONGS_DATA = [
  {
    id: '1',
    nome: 'Vira Lata é Dez',
    email: 'ongviralataedez@gmail.com',
    status: 'Ativa'
  },
  {
    id: '2',
    nome: 'Catland',
    email: 'contato@catland.org.br',
    status: 'Inativa'
  },
  {
    id: '3',
    nome: 'SUIPA',
    email: 'suipa@gmail.com',
    status: 'Ativa'
  },
  {
    id: '4',
    nome: 'Lorem Ipsun',
    email: 'LoremIpsun@gmail.com',
    status: 'Inativa'
  },
  {
    id: '5',
    nome: 'Lorem Ipsun Lorem',
    email: 'LoremIpsunLorem@gmail.com',
    status: 'Ativa'
  },
];

export default function GerenciarOngsScreen() {
  const router = useRouter();

  //função para navegar para detalhes
  const handleCardPress = (id: string) => {
    router.push('/(admin)/detalhes-ong' as any);
  };

  const renderOngItem = ({ item }: any) => (
    <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => handleCardPress(item.id)}
        style={styles.cardContainer}
    >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.ongLabel}>ONG: <Text style={styles.ongName}>{item.nome}</Text></Text>
            <Text style={styles.statusText}>Status: {item.status}</Text>
          </View>
          
          <Text style={styles.emailLabel}>
            Email: <Text style={styles.emailLink}>{item.email}</Text>
          </Text>

          {/*seta no canto inferior direito*/}
          <View style={styles.arrowContainer}>
            <Feather name="arrow-right" size={20} color={COLORS.primary} />
          </View>
        </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/*header*/}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar ONGs</Text>
        <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications" size={24} color="#5A7A9A" />
            <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {/*subtitulo*/}
      <View style={styles.subHeader}>
        <Text style={styles.subTitle}>Gerenciamento de ONGs</Text>
      </View>

      {/*lista*/}
      <FlatList 
        data={ONGS_DATA}
        keyExtractor={item => item.id}
        renderItem={renderOngItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  
  //header
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

  // SubHeader
  subHeader: { paddingHorizontal: 25, marginBottom: 25 },
  subTitle: { fontSize: 18, color: COLORS.primary, fontWeight: '400' },

  listContent: { paddingHorizontal: 25, paddingBottom: 20 },

  // Card
  cardContainer: { marginBottom: 20 },
  card: { 
    backgroundColor: COLORS.cardBg, 
    borderRadius: 12, 
    padding: 15, 
    elevation: 1,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: {width:0, height: 2}
  },
  
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 8
  },
  
  ongLabel: { fontSize: 15, color: COLORS.primary },
  ongName: { fontWeight: '400' }, 
  
  statusText: { fontSize: 14, color: COLORS.primary },

  emailLabel: { fontSize: 15, color: COLORS.primary },
  emailLink: { textDecorationLine: 'underline' },

  // Seta
  arrowContainer: { 
    alignItems: 'flex-end', 
    marginTop: 5 
  },
});