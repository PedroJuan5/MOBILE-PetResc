
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const DenuncieModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={30} color="#ccc" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Denuncie!</Text>
          <Text style={styles.modalSubtitle}>Sua atitude é a voz de quem não pode falar.</Text>

          <View style={styles.infoRow}>
            <Ionicons name="shield-outline" size={24} color="#D9534F" />
            <Text style={styles.infoText}>Polícia Militar <Text style={styles.boldText}>190</Text></Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={24} color="#2D68A6" />
            <Text style={styles.infoText}>Disque denúncia (181 ou números estaduais)</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="leaf-outline" size={24} color="#5CB85C" />
            <Text style={styles.infoText}>IBAMA <Text style={styles.boldText}>0800 61 8080</Text></Text>
          </View>

          <Text style={styles.orText}>ou</Text>

          <Text style={styles.finalText}>
            Procure a Delegacia de Polícia mais próxima para fazer um Boletim de Ocorrência (B.O)
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalView: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  closeButton: { position: 'absolute', top: 10, right: 10 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#2D68A6', marginBottom: 10 },
  modalSubtitle: { fontSize: 14, color: '#3A5C7A', textAlign: 'center', marginBottom: 30 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, width: '100%' },
  infoText: { marginLeft: 10, fontSize: 16, color: '#3A5C7A', flex: 1 },
  boldText: { fontWeight: 'bold' },
  orText: { fontSize: 14, color: '#3A5C7A', marginVertical: 10 },
  finalText: { fontSize: 16, color: '#3A5C7A', textAlign: 'center', marginTop: 10 },
});