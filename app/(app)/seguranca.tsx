import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SegurancaScreen() {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const handleDelete = () => {
    console.log("Conta excluída com sucesso!");
    setVisible(false);
  };

  const opcoes = [
    { id: 1, titulo: 'Alterar senha', icone: 'key-outline', rota: 'AlterarSenha' },
    { id: 2, titulo: 'Histórico de solicita..', icone: 'time-outline', rota: 'HistoricoSolicitacoes' },
    { id: 3, titulo: 'Excluir conta', icone: 'trash-outline', rota: 'ExcluirConta' },
  ];

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2D68A6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Segurança</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Título */}
      <Text style={styles.sectionTitle}>Segurança</Text>

      {/* Lista de Opções */}
      <View style={styles.optionsContainer}>
        {opcoes.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.option}
            onPress={() => {
              if (item.titulo === 'Excluir conta') {
                setVisible(true);
              } else {
                (navigation as any).navigate(item.rota);
              }
            }}
          >
            <View style={styles.iconCircle}>
              <Ionicons name={item.icone as any} size={20} color="#2D68A6" />
            </View>
            <Text style={styles.optionText}>{item.titulo}</Text>
            <Ionicons name="chevron-forward" size={20} color="#2D68A6" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal de confirmação para excluir conta */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.title}>Excluir conta</Text>

            <Text style={styles.text}>
              Recebemos sua solicitação de exclusão de conta.{"\n"}
              Antes de prosseguir, precisamos confirmar se realmente deseja
              continuar com este processo.
            </Text>

            <Text style={styles.warning}>
              Importante:{" "}
              <Text style={styles.warningSub}>
                a exclusão é definitiva e resultará na perda de todos os dados
                associados ao seu cadastro, incluindo histórico, preferências e
                informações salvas e qualquer solicitação de adoção e cadastro
                de lar temporário.
              </Text>
            </Text>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.cancelText}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Text style={styles.deleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2D68A6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D68A6',
    marginBottom: 16,
  },
  optionsContainer: {
    // 'gap' não é suportado pelo StyleSheet do React Native em muitas versões.
    // Usaremos marginBottom em cada item (.option) para espaçamento.
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  iconCircle: {
    backgroundColor: '#EAF1F8',
    padding: 10,
    borderRadius: 50,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#2D68A6',
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    paddingTop: 32,
    width: "92%",
    height: "70%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2D68A6",
    textAlign: "center",
    marginBottom: 32,
  },
  text: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 24,
   
  },
  warning: {
    fontSize: 20,
    color: "#000",
    textAlign: "center",
    fontWeight: "700",
    marginTop: 16,
    paddingHorizontal: 10,
    flex: 1,
  },
  warningSub: {
    fontWeight: "400",
  },
  buttons: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 6,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E8F0FA",
  },
  cancelText: {
    color: "#2D68A6",
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#FDECEA",
  },
  deleteText: {
    color: "#D32F2F",
    fontWeight: "600",
  },
});