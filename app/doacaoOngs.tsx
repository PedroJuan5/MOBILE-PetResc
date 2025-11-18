import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

export default function DoacaoOngScreen() {
  const { name } = useLocalSearchParams() as { name: string };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Doação para:</Text>
        <Text style={styles.ongName}>{name || 'ONG Desconhecida'}</Text>

        <Text style={styles.sectionTitle}>Selecione um valor:</Text>
        
        <View style={styles.donationOptions}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => alert(`Doando R$ 20 para ${name}`)}
          >
            <Text style={styles.buttonText}>R$ 20,00</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => alert(`Doando R$ 50 para ${name}`)}
          >
            <Text style={styles.buttonText}>R$ 50,00</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => alert(`Doando R$ 100 para ${name}`)}
          >
            <Text style={styles.buttonText}>R$ 100,00</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, styles.customButton]} 
          onPress={() => alert(`Acessando campo de valor personalizado para ${name}`)}
        >
          <Text style={styles.buttonText}>Doar Outro Valor</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D68A6',
    marginBottom: 5,
  },
  ongName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#444',
    marginBottom: 15,
  },
  donationOptions: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2D68A6',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 8,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  customButton: {
    backgroundColor: '#FF9800',
    marginTop: 20,
  },
});