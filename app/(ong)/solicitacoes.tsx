import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dados simulados de pessoas interessadas
const INTERESSADOS = [
  { id: '1', nome: 'Ana Clara', pet: 'Branquinho', contato: '(11) 99999-9999', imgPet: require('../../assets/images/pets/branquinho.png') },
  { id: '2', nome: 'Roberto Alves', pet: 'Zeus', contato: '(11) 98888-8888', imgPet: require('../../assets/images/pets/zeus.png') },
];

export default function SolicitacoesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Interessados</Text>
        <Text style={styles.subtitle}>Pessoas que demonstraram interesse nos seus pets.</Text>
      </View>

      <FlatList
        data={INTERESSADOS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.imgPet} style={styles.avatarPet} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardSubtitle}>Tem interesse no <Text style={{fontWeight: 'bold'}}>{item.pet}</Text></Text>
              <View style={styles.contactRow}>
                <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
                <Text style={styles.contactText}>{item.contato}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#2D68A6" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma solicitação ainda.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#F5F8FA' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2D68A6' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  avatarPet: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 14, color: '#666' },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  contactText: { fontSize: 12, color: '#666', marginLeft: 5 },
  actionButton: { padding: 10 },
  
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#999', marginTop: 10, fontSize: 16 },
});