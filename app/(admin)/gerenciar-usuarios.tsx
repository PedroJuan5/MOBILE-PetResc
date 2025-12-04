import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar,TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2D68A6',
  bg: '#FFFFFF',
  cardBg: '#DDE8F0', 
  textLight: '#A0B4CC'
};

// Dados Mockados de usuários
const USERS_DATA = [
  {
    id: '1',
    nome: 'Ana Silva',
    email: 'ana.silva@email.com',
    status: 'Ativa'
  },
  {
    id: '2',
    nome: 'Carlos Eduardo',
    email: 'carlos.edu@email.com',
    status: 'Inativa'
  },
  {
    id: '3',
    nome: 'Beatriz Souza',
    email: 'bia.souza@email.com',
    status: 'Ativa'
  },
  {
    id: '4',
    nome: 'João Pedro',
    email: 'joao.pedro@email.com',
    status: 'Ativa'
  },
  {
    id: '5',
    nome: 'Mariana Lima',
    email: 'mari.lima@email.com',
    status: 'Bloqueada'
  },
];

export default function GerenciarUsuariosScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  //filtro simples por nome ou email
  const filteredUsers = USERS_DATA.filter(user => 
    user.nome.toLowerCase().includes(searchText.toLowerCase()) || 
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderUserItem = ({ item }: any) => (
    <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.9}
        onPress={() => console.log("Ir para detalhes do usuário", item.id)} // Futura navegação
    >
      {/* linha 1: Nome e Status */}
      <View style={styles.cardHeader}>
        <Text style={styles.userNameLabel}>Usuário: <Text style={styles.userName}>{item.nome}</Text></Text>
        <Text style={styles.statusText}>Status: {item.status}</Text>
      </View>
      
      {/* linha 2: Email */}
      <Text style={styles.emailLabel}>
        Email: <Text style={styles.emailLink}>{item.email}</Text>
      </Text>

      {/* seta no canto inferior direito */}
      <View style={styles.arrowContainer}>
        <Feather name="arrow-right" size={20} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Usuários</Text>
        <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications" size={24} color="#5A7A9A" />
            <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {/*sub titulo*/}
      <Text style={styles.subTitle}>Gerenciamento de usuários</Text>

      {/*barra de pesquisa*/}
      <View style={styles.searchContainer}>
        <TextInput 
            style={styles.searchInput}
            placeholder="Busque por Nome ou Email"
            placeholderTextColor={COLORS.textLight}
            value={searchText}
            onChangeText={setSearchText}
        />
        <Ionicons name="search" size={20} color={COLORS.primary} style={{marginRight: 10}} />
      </View>

      {/* LISTA */}
      <FlatList 
        data={filteredUsers}
        keyExtractor={item => item.id}
        renderItem={renderUserItem}
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
  
  userNameLabel: { fontSize: 15, color: COLORS.primary },
  userName: { fontWeight: '600' }, // Nome em negrito
  
  statusText: { fontSize: 14, color: COLORS.primary },

  emailLabel: { fontSize: 15, color: COLORS.primary },
  emailLink: { textDecorationLine: 'underline' },

  // Seta
  arrowContainer: { 
    alignItems: 'flex-end', 
    marginTop: 5 
  },
});