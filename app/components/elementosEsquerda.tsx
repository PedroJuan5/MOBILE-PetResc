import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CustomHeaderLeft() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Botão de Notificações*/}
      <TouchableOpacity
        onPress={() => router.push('/notificacoes')}
        style={styles.button}>
        <Ionicons name="notifications-outline" size={25} color="#2D68A6" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  button: {
    justifyContent: 'center',
  },
});