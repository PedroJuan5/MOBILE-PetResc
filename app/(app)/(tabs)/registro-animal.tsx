import React, { useState } from "react"; 
import { Image, Modal,SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert,} from "react-native";
import { useNavigation, useRouter, Stack } from "expo-router"; 
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

interface DadosPet {
  situacao?: string; especie?: string; genero?: string; imagemUri?: string;
  raca?: string; porte?: string; cor?: string; idade?: string;
  nome?: string; historia?: string;
}

const OPCOES_SITUACAO = ["Perdido", "Para Adoção", "Encontrado"];
const OPCOES_ESPECIE = ["Cachorro", "Gato", "Outro"];
const OPCOES_GENERO = ["Macho", "Fêmea"];

const IndicadorEtapas = ({ etapaAtual, total }: { etapaAtual: number; total: number }) => (
  <View style={styles.indicadorWrapper}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={[styles.indicadorPonto, i + 1 === etapaAtual ? styles.indicadorAtivo : undefined]}
      />
    ))}
  </View>
);

export default function RegistroPet() {
  const [etapa, setEtapa] = useState(1);
  const [dados, setDados] = useState<DadosPet>({});
  const [modalSucesso, setModalSucesso] = useState(false);
  const navigation = useNavigation(); 
  const router = useRouter();
  const totalEtapas = 4;

  const avancar = () => setEtapa((e) => (e < totalEtapas ? e + 1 : e));
  const voltar = () => setEtapa((e) => (e > 1 ? e - 1 : e));

  const atualizarCampo = (campo: keyof DadosPet, valor: string) =>
    setDados((ant) => ({ ...ant, [campo]: valor }));

  const escolherImagem = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      alert("Permissão necessária para acessar a galeria de fotos.");
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true,
      aspect: [4, 4], quality: 1,
    });
    if (!resultado.canceled) {
      atualizarCampo("imagemUri", resultado.assets[0].uri);
    }
  };

  const validarEtapa = () => {
    switch (etapa) {
      case 1:
        if (!dados.situacao || !dados.especie || !dados.genero) {
          Alert.alert("Campos obrigatórios", "Por favor, preencha a Situação, Espécie e Gênero.");
          return false;
        }
        break;
      case 2:
        if (!dados.imagemUri) {
          Alert.alert("Campo obrigatório", "Por favor, selecione uma imagem do pet.");
          return false;
        }
        break;
      default: break;
    }
    return true;
  };

  const handleAvancar = () => {
    if (validarEtapa()) {
      avancar();
    }
  };

  const finalizar = () => {
    console.log("Enviar para API:", dados);
    setModalSucesso(true);
  };

  const renderEtapa = () => {
    switch (etapa) {
      case 1:
        return (
          <>
            <Text style={styles.rotulo}>Situação *</Text>
            <View style={styles.seletor}>
              <Picker selectedValue={dados.situacao} onValueChange={(v) => atualizarCampo("situacao", v)}>
                <Picker.Item label="Selecione..." value="" />
                {OPCOES_SITUACAO.map((op) => <Picker.Item key={op} label={op} value={op} />)}
              </Picker>
            </View>
            <Text style={styles.ajuda}>Se seu pet sumiu, o app pode ajudar a encontrá-lo.</Text>
            <Text style={styles.rotulo}>Espécie *</Text>
            <View style={styles.seletor}>
              <Picker selectedValue={dados.especie} onValueChange={(v) => atualizarCampo("especie", v)}>
                <Picker.Item label="Selecione..." value="" />
                {OPCOES_ESPECIE.map((op) => <Picker.Item key={op} label={op} value={op} />)}
              </Picker>
            </View>
            <Text style={styles.rotulo}>Gênero *</Text>
            <View style={styles.seletor}>
              <Picker selectedValue={dados.genero} onValueChange={(v) => atualizarCampo("genero", v)}>
                <Picker.Item label="Selecione..." value="" />
                {OPCOES_GENERO.map((op) => <Picker.Item key={op} label={op} value={op} />)}
              </Picker>
            </View>
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.rotulo}>Adicione a foto do pet *</Text>
            <TouchableOpacity style={styles.areaImagem} onPress={escolherImagem} accessibilityLabel="Selecionar imagem">
              {dados.imagemUri ? ( <Image source={{ uri: dados.imagemUri }} style={styles.imagemSelecionada} /> ) : (
                <>
                  <Ionicons name="image-outline" size={48} color="#BFE1F7" />
                  <Text style={styles.textoArea}>Toque para escolher uma imagem</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.rotulo}>Raça</Text>
            <TextInput style={styles.campo} value={dados.raca} onChangeText={(v) => atualizarCampo("raca", v)} placeholder="Opcional" placeholderTextColor="#7a98b2" />
            <Text style={styles.rotulo}>Porte</Text>
            <View style={styles.seletor}>
              <Picker selectedValue={dados.porte} onValueChange={(v) => atualizarCampo("porte", v)}>
                <Picker.Item label="Opcional" value="" /><Picker.Item label="Pequeno" value="pequeno" /><Picker.Item label="Médio" value="medio" /><Picker.Item label="Grande" value="grande" />
              </Picker>
            </View>
            <Text style={styles.rotulo}>Cor predominante</Text>
            <TextInput style={styles.campo} value={dados.cor} onChangeText={(v) => atualizarCampo("cor", v)} placeholder="Opcional" placeholderTextColor="#7a98b2" />
            <Text style={styles.rotulo}>Idade</Text>
            <View style={styles.seletor}>
              <Picker selectedValue={dados.idade} onValueChange={(v) => atualizarCampo("idade", v)}>
                <Picker.Item label="Opcional" value="" /><Picker.Item label="Filhote" value="filhote" /><Picker.Item label="Adulto" value="adulto" /><Picker.Item label="Idoso" value="idoso" />
              </Picker>
            </View>
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.rotulo}>Nome do pet</Text>
            <TextInput style={styles.campo} value={dados.nome} onChangeText={(v) => atualizarCampo("nome", v)} placeholder="Opcional" placeholderTextColor="#7a98b2" />
            <Text style={styles.rotulo}>História do pet</Text>
            <TextInput style={styles.campoMultiline} value={dados.historia} onChangeText={(v) => atualizarCampo("historia", v)} placeholder="Opcional - conte a história do pet..." placeholderTextColor="#7a98b2" multiline />
          </>
        );
      default: return null;
    }
  };

  return (
    <>
      {/*garante que o cabeçalho nativo esteja desligado*/}
      <Stack.Screen options={{ headerShown: false }} />
    
      <SafeAreaView style={styles.areaSegura}>
        <ScrollView style={styles.wrapper}>
          
          <View style={styles.headerContainer}>
            {etapa > 1 ? (
              <TouchableOpacity onPress={voltar} style={styles.backButton} accessibilityLabel="Voltar etapa">
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ) : (
         
              <View style={styles.backButton} /> 
            )}

            <Text style={styles.titulo}>Criar registro Pet</Text>
            
            <View style={styles.backButton} /> 
          </View>
          
          <Text style={styles.subtitulo}>Crie o perfil do pet passo a passo</Text>
          {renderEtapa()}
        </ScrollView>

        <View style={styles.rodape}>
          <IndicadorEtapas etapaAtual={etapa} total={totalEtapas} />
          <TouchableOpacity
            style={styles.botaoAcao}
            onPress={etapa === totalEtapas ? finalizar : handleAvancar}
            accessibilityLabel={etapa === totalEtapas ? "Finalizar registro" : "Próxima etapa"}>
            <Text style={styles.textoBotao}>{etapa === totalEtapas ? "Finalizar" : "Prosseguir"}</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={modalSucesso} transparent animationType="fade">
          <View style={styles.fundoModal}>
            <View style={styles.cardModal}>
              <Text style={styles.tituloModal}>Registrado com sucesso</Text>
              <Text style={styles.subModal}>O pet foi cadastrado no sistema.</Text>
              <TouchableOpacity style={styles.botaoModal} onPress={() => { setModalSucesso(false); router.push("/(app)/(tabs)/home"); }} accessibilityLabel="Confirmar">
                <Text style={styles.textoBotaoModal}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  areaSegura: { flex: 1, backgroundColor: "#2D68A6" },
  wrapper: { flex: 1, padding: 22 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    width: 24, 
    height: 24,
  },
  titulo: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitulo: { fontSize: 16, color: "#ffffff", marginBottom: 18, textAlign: 'center' }, // Centralizado
  //formulário
  rotulo: { fontSize: 16, fontWeight: "700", color: "#ffffff", marginTop: 12, marginBottom: 8 },
  ajuda: { fontSize: 12, color: "#BFE1F7", marginBottom: 10 },
  campo: { backgroundColor: "#F0F2F5", borderRadius: 10, padding: 12, fontSize: 16, color: "#2D68A6", marginBottom: 8 },
  campoMultiline: { backgroundColor: "#F0F2F5", borderRadius: 10, padding: 12, fontSize: 16, color: "#2D68A6", height: 120, textAlignVertical: "top", marginBottom: 8 },
  seletor: { backgroundColor: "#F0F2F5", borderRadius: 10, justifyContent: "center", marginBottom: 10, overflow: "hidden" },

  //area de Imagem
  areaImagem: { height: 200, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 10, justifyContent: "center", alignItems: "center", padding: 18, borderWidth: 2, borderColor: "#BFE1F7", borderStyle: "dashed", marginBottom: 10 },
  imagemSelecionada: { width: "100%", height: "100%", borderRadius: 8 },
  textoArea: { color: "#ffffff", textAlign: "center", marginTop: 10 },

  // Rodapé
  rodape: { backgroundColor: "#ffffff", borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 18, paddingTop: 12, alignItems: "center" },
  indicadorWrapper: { flexDirection: "row", gap: 8, marginBottom: 12 },
  indicadorPonto: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#E6F0FA" },
  indicadorAtivo: { backgroundColor: "#2D68A6" },
  botaoAcao: { width: "100%", backgroundColor: "#2D68A6", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 6 },
  textoBotao: { color: "#ffffff", fontSize: 16, fontWeight: "700" },

  //modal de Sucesso
  fundoModal: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  cardModal: { width: "86%", backgroundColor: "#ffffff", borderRadius: 14, padding: 20, alignItems: "center" },
  tituloModal: { fontSize: 20, fontWeight: "700", color: "#2D68A6", marginBottom: 8 },
  subModal: { fontSize: 14, color: "#3A5C7A", textAlign: "center", marginBottom: 14 },
  botaoModal: { width: "100%", backgroundColor: "#BFE1F7", padding: 12, borderRadius: 10, alignItems: "center" },
  textoBotaoModal: { color: "#2D68A6", fontWeight: "700" },
});