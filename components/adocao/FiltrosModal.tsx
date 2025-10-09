import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable, TextInput, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FiltrosModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FiltrosModal = ({ visible, onClose }: FiltrosModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <SafeAreaView>
            <ScrollView style={styles.content}>
              <Text style={styles.title}>Filtros</Text>
              
              <Text style={styles.label}>Nome ou id</Text>
              <TextInput style={styles.input} />

              <Text style={styles.label}>Espécie</Text>
              {/* Adicione a lógica com useState para controlar os toggles */}
              <View style={styles.switchRow}><Text>Gato</Text><Switch /></View>
              <View style={styles.switchRow}><Text>Cães</Text><Switch /></View>
              <View style={styles.switchRow}><Text>Todos</Text><Switch /></View>

              <Text style={styles.label}>Gênero</Text>
              <View style={styles.switchRow}><Text>Macho</Text><Switch /></View>
              <View style={styles.switchRow}><Text>Fêmea</Text><Switch /></View>
              
              {/* Adicione Pickers para Porte, Raça e Idade aqui */}
              <Text style={styles.label}>Porte</Text>
              <TextInput style={styles.input} placeholder="Selecione..." />

              <Text style={styles.label}>Raça</Text>
              <TextInput style={styles.input} placeholder="Selecione..." />

              <Text style={styles.label}>Idade</Text>
              <TextInput style={styles.input} placeholder="Selecione..." />

            </ScrollView>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { width: '85%', height: '100%', backgroundColor: 'white', borderTopRightRadius: 20, borderBottomRightRadius: 20, padding: 20 },
  content: { flex: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2D68A6', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#3A5C7A', marginTop: 15, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#BFE1F7', borderRadius: 10, padding: 10, backgroundColor: '#F6FBFF' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 },
});