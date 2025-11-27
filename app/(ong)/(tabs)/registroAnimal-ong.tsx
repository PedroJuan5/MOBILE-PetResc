import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function RegistroAnimalScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cadastrar Novo Pet</Text>
        <Text style={styles.subtitle}>O formulário aparecerá aqui.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D68A6',
    marginBottom: 10,
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
  }
});