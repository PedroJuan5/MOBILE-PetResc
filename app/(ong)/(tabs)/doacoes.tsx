import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DoacoesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Doações (Presente)</Text>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { fontSize: 18, color: '#2D68A6' } });