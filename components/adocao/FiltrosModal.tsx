import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, Pressable,TextInput,Switch,ScrollView,Button,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

/* Tipagem dos props do modal */
interface FiltrosModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export const FiltrosModal = ({ visible, onClose, onApplyFilters }: FiltrosModalProps) => {
  //estado locais para cada filtro
  const [nome, setNome] = useState("");
  const [mostrarGato, setMostrarGato] = useState(true);
  const [mostrarCao, setMostrarCao] = useState(true);
  const [mostrarMacho, setMostrarMacho] = useState(true);
  const [mostrarFemea, setMostrarFemea] = useState(true);
  const [porte, setPorte] = useState("");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");

  //quando o usuário confirma, agrupamos tudo num objeto e enviamos para a tela pai
  const aplicar = () => {
    const filtros = {
      nome,
      isGato: mostrarGato,
      isCao: mostrarCao,
      isMacho: mostrarMacho,
      isFemea: mostrarFemea,
      porte,
      raca,
      idade,
    };
    onApplyFilters(filtros);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      {/* backdrop: fecha o modal ao tocar fora */}
      <Pressable style={styles.fundoEscuro} onPress={onClose}>
        <Pressable style={styles.containerModal} onPress={(e) => e.stopPropagation()}>
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.conteudo}>
              <Text style={styles.titulo}>Filtros</Text>

              <Text style={styles.rotulo}>Nome ou id</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Buscar por nome ou id" placeholderTextColor="#9fb2cf" />

              <Text style={styles.rotulo}>Espécie</Text>
              <View style={styles.linhaSwitch}>
                <Text style={styles.labelSwitch}>Gato</Text>
                <Switch value={mostrarGato} onValueChange={setMostrarGato} />
              </View>
              <View style={styles.linhaSwitch}>
                <Text style={styles.labelSwitch}>Cães</Text>
                <Switch value={mostrarCao} onValueChange={setMostrarCao} />
              </View>
       
              <Text style={styles.rotulo}>Gênero</Text>
              <View style={styles.linhaSwitch}>
                <Text style={styles.labelSwitch}>Macho</Text>
                <Switch value={mostrarMacho} onValueChange={setMostrarMacho} />
              </View>
              <View style={styles.linhaSwitch}>
                <Text style={styles.labelSwitch}>Fêmea</Text>
                <Switch value={mostrarFemea} onValueChange={setMostrarFemea} />
              </View>

              <Text style={styles.rotulo}>Porte</Text>
              <View style={styles.seletor}>
                <Picker selectedValue={porte} onValueChange={(v) => setPorte(v)}>
                  <Picker.Item label="Selecione o porte..." value="" />
                  <Picker.Item label="Pequeno" value="pequeno" />
                  <Picker.Item label="Médio" value="medio" />
                  <Picker.Item label="Grande" value="grande" />
                </Picker>
              </View>

              <Text style={styles.rotulo}>Raça</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: SRD, Poodle..."
                placeholderTextColor="#9fb2cf"
                value={raca}
                onChangeText={setRaca}
              />

              <Text style={styles.rotulo}>Idade</Text>
              <View style={styles.seletor}>
                <Picker selectedValue={idade} onValueChange={(v) => setIdade(v)}>
                  <Picker.Item label="Selecione a idade..." value="" />
                  <Picker.Item label="Filhote" value="filhote" />
                  <Picker.Item label="Adulto" value="adulto" />
                  <Picker.Item label="Idoso" value="idoso" />
                </Picker>
              </View>

              {/*botao de aplicar filtros */}
              <View style={styles.containerBotao}>
                <Button title="Aplicar filtros" onPress={aplicar} />
              </View>
            </ScrollView>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};


const styles = StyleSheet.create({
  fundoEscuro: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  containerModal: {
    width: "85%",
    height: "100%",
    backgroundColor: "#ffffff",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  conteudo: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2D68A6",
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3A5C7A",
    marginTop: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#BFE1F7",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#F6FBFF",
    fontSize: 16,
    color: "#2D68A6",
  },
  linhaSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 5,
  },
  labelSwitch: {
    fontSize: 15,
    color: "#3A5C7A",
  },
  seletor: {
    borderWidth: 1,
    borderColor: "#BFE1F7",
    borderRadius: 10,
    backgroundColor: "#F6FBFF",
    justifyContent: "center",
  },
  containerBotao: {
    marginTop: 28,
    marginBottom: 20,
  },
});
