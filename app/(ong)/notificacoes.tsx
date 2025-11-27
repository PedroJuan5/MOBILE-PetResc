import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NotificacoesOngScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D68A6" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações da ONG</Text>
      </View>
      
      <View style={styles.content}>
        <Ionicons name="notifications-off-outline" size={50} color="#ccc" />
        <Text style={styles.text}>Nenhuma notificação nova.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2D68A6', marginLeft: 15 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: '#999', marginTop: 10 }
});