import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConfigScreen() {
  const router = useRouter();
  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={24} color="#2D68A6" />
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
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
          <TouchableOpacity>
            <Text style={styles.deleteText}>Deletar conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logout}>
            <Feather name="log-out" size={20} color="#2D68A6" />
            <Text style={styles.logoutText}>Saída</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2D68A6',
    marginLeft: 10,
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
    marginTop: 40,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    paddingTop: 15,
  },
  deleteText: {
    color: '#EB5757',
    fontWeight: '500',
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
