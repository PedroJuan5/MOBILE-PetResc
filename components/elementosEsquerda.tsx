import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomHeaderLeft({ onDenunciePress }: { onDenunciePress: () => void }) {
  return (
    <View style={styles.container}>
 
      <TouchableOpacity onPress={onDenunciePress} style={styles.button}>
        <Ionicons name="alert-circle-outline" size={28} color="#2D68A6" />
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