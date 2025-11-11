import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function PrivacidadeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2D68A6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidade</Text>
        <View style={{ width: 24 }} /> {/* Espaço para alinhar o título */}
      </View>

      {/* Conteúdo */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Termos de uso</Text>
        <Text style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Mauris interdum sapien sodales mi sagittis hendrerit. 
          Curabitur ut lectus nec orci cursus rhoncus. 
          Donec a ultrices risus. Mauris ut erat ut urna rhoncus 
          facilisis a eu neque. Ut iaculis viverra laoreet. 
          In interdum, augue non auctor pharetra, felis ante gravida ante, 
          quis mattis quam eros non quam. Vivamus scelerisque ante nec dapibus 
          convallis. Vestibulum quis scelerisque leo. Vestibulum quis porttitor 
          tellus, non finibus nibh. Quisque ut tempor nulla, sed consectetur tortor.
        </Text>

        <Text style={styles.sectionTitle}>Serviço PetCo</Text>
        <Text style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Mauris interdum sapien sodales mi sagittis hendrerit. 
          Curabitur ut lectus nec orci cursus rhoncus. 
          Donec a ultrices risus. Mauris ut erat ut urna rhoncus 
          facilisis a eu neque. Ut iaculis viverra laoreet. 
          In interdum, augue non auctor pharetra, felis ante gravida ante, 
          quis mattis quam eros non quam. Vivamus scelerisque ante nec dapibus convallis.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2D68A6',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D68A6',
    marginBottom: 8,
    marginTop: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4A4A4A',
    textAlign: 'justify',
    marginBottom: 16,
  },
});

