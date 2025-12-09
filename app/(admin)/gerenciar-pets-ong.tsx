import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar,TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2D68A6',
  bg: '#FFFFFF',
  cardBg: '#DDE8F0', 
  textDark: '#2D68A6',
};

//dados Mockados para essa ONG específica
const PETS_ONG_DATA = [
  { id: '1', nome: 'Luna (Gato)', ong: 'Abrigo Viver', status: 'Ativa' },
  { id: '2', nome: 'Luna (Gato)', ong: 'Abrigo Viver', status: 'Ativa' }, 
  { id: '3', nome: 'Luna (Gato)', ong: 'Abrigo Viver', status: 'Ativa' },
  { id: '4', nome: 'Luna (Gato)', ong: 'Abrigo Viver', status: 'Ativa' },
  { id: '5', nome: 'Luna (Gato)', ong: 'Abrigo Viver', status: 'Ativa' },
];

export default function GerenciarPetsOngScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.petName}>{item.nome}</Text>
        <Text style={styles.statusText}>Status: {item.status}</Text>
      </View>
      
      <Text style={styles.ongName}>ONG: {item.ong}</Text>

      <View style={styles.arrowContainer}>
        <Feather name="arrow-right" size={20} color={COLORS.primary} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Pets</Text>
        <TouchableOpacity>
            <Ionicons name="notifications" size={24} color="#5A7A9A" />
            <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {/*subtitulo*/}
      <Text style={styles.subTitle}>ONG: Vira Lata é Dez</Text>

      {/*barra de pesquisa*/}
      <View style={styles.searchContainer}>
        <TextInput 
            style={styles.searchInput}
            placeholder="Busque por Nome ou Email"
            placeholderTextColor="#A0B4CC"
            value={searchText}
            onChangeText={setSearchText}
        />
        <Ionicons name="search" size={20} color={COLORS.primary} style={{marginRight: 10}} />
      </View>

      {/*lista*/}
      <FlatList 
        data={PETS_ONG_DATA}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/*footer seta voltar*/}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
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
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary },
  badge: { position: 'absolute', top: 0, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E91E63' },

  subTitle: { 
    fontSize: 18, 
    color: COLORS.primary, 
    paddingHorizontal: 25, 
    marginBottom: 15,
    fontWeight: '400' 
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE8F0',
    borderRadius: 8,
    marginHorizontal: 25,
    marginBottom: 25,
    paddingHorizontal: 10,
    height: 45
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
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  petName: { fontSize: 16, color: COLORS.primary, fontWeight: '400' },
  statusText: { fontSize: 14, color: COLORS.primary, fontWeight: '400' },
  ongName: { fontSize: 14, color: COLORS.primary, fontWeight: '400' },

  arrowContainer: { alignItems: 'flex-end', marginTop: 5 },

  // Footer
  footer: { paddingHorizontal: 25, paddingBottom: 20 },
});