import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CustomHeaderRight() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Botão de Notificações */}
      <TouchableOpacity
        onPress={() => router.push('/notificacoes')}
        style={styles.button}
      >
        <Ionicons name="notifications-outline" size={25} color="#2D68A6" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  button: {
    
  },
});