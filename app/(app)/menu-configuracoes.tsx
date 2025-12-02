import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useAuth } from '../../context/AuthContext'; 

export default function ConfigScreen() {
  const router = useRouter();
  const { signOut } = useAuth(); 
  
  // --- CORREÇÃO DO GO BACK (Com P Maiúsculo) ---
  const handleGoBackToProfile = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Força a rota para o grupo (app) -> (tabs) -> Perfil (com P maiúsculo)
      router.replace('/(app)/(tabs)/Perfil' as any); 
    }
  };

  // --- BOTÃO DE SAÍDA ---
  const handleLogout = () => {
    signOut(); 
    router.replace('/'); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          {/* Botão de Voltar */}
          <TouchableOpacity 
            onPress={handleGoBackToProfile} 
            style={styles.backButtonContainer} 
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="chevron-back" size={24} color="#2D68A6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configurações</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Conta</Text>

          <TouchableOpacity style={styles.item} onPress={() => (router as any).push('/configperfil')}>
            <Ionicons name="person-outline" size={22} color="#2D68A6" />
            <Text style={styles.itemText}>Conta</Text>
            <Feather name="chevron-right" size={20} color="#2D68A6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => (router as any).push('/endereco')}>
            <Ionicons name="home-outline" size={22} color="#2D68A6" />
            <Text style={styles.itemText}>Endereço</Text>
            <Feather name="chevron-right" size={20} color="#2D68A6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => (router as any).push('/notificacoes')}>
            <Ionicons name="notifications-outline" size={22} color="#2D68A6" />
            <Text style={styles.itemText}>Notificação</Text>
            <Feather name="chevron-right" size={20} color="#2D68A6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => (router as any).push('/privacidade')}>
            <Ionicons name="shield-outline" size={22} color="#2D68A6" />
            <Text style={styles.itemText}>Privacidade</Text>
            <Feather name="chevron-right" size={20} color="#2D68A6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => (router as any).push('/seguranca')}>
            <Ionicons name="lock-closed-outline" size={22} color="#2D68A6" />
            <Text style={styles.itemText}>Segurança</Text>
            <Feather name="chevron-right" size={20} color="#2D68A6" />
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Ajuda</Text>

          <TouchableOpacity style={styles.item} onPress={() => (router as any).push('/contateNos')}>
            <MaterialIcons name="support-agent" size={22} color="#2D68A6" />
            <Text style={styles.itemText}>Contate-nos</Text>
            <Feather name="chevron-right" size={20} color="#2D68A6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => (router as any).push('/faq')}>
            <Ionicons name="help-circle-outline" size={22} color="#2D68A6" />
            <Text style={styles.itemText}>FAQ</Text>
            <Feather name="chevron-right" size={20} color="#2D68A6" />
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
              <Feather name="log-out" size={20} color="#2D68A6" />
              <Text style={styles.logoutText}>Saída</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButtonContainer: { 
    paddingRight: 10,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2D68A6',
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D68A6',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    paddingVertical: 15,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    color: '#2D68A6',
    marginLeft: 10,
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: '#2D68A6',
    marginLeft: 5,
    fontWeight: '500',
  },
});