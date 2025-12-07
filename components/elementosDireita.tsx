import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 1. Definimos que o componente aceita uma prop opcional
interface CustomHeaderRightProps {
  onNotificationPress?: () => void;
}

// 2. Recebemos a prop no componente
export default function CustomHeaderRight({ onNotificationPress }: CustomHeaderRightProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onNotificationPress) {
      // Se a página (como a da ONG) passou uma função específica, usa ela
      onNotificationPress();
    } else {
      // Se não passou nada (como no App de Usuário), usa o padrão
      router.push('/notificacoes' as any);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.button}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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