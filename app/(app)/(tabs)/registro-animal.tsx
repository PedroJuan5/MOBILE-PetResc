import React, { useState } from "react"; 
import { Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, FlatList } from "react-native";
import { useNavigation, useRouter, Stack } from "expo-router"; 
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

// --- CORES DO SEU OUTRO ARQUIVO ---
const COLORS = {
  primary: '#2D68A6',
  background: '#205A8D',
  inputBg: '#CFDEE9', // Fundo azul claro dos inputs
  textLight: '#FFF',
  textDark: '#2D68A6',
  placeholder: '#7E9EB6',
  border: '#A0B4CC',
  white: '#FFFFFF',
};

// --- DADOS ---
interface DadosPet {
  situacao?: string; especie?: string; genero?: string; imagemUri?: string;
  raca?: string; porte?: string; cor?: string; idade?: string;
  nome?: string; historia?: string;
}

const OPCOES_SITUACAO = ["Perdido", "Para Adoção", "Encontrado"];
const OPCOES_ESPECIE = ["Cachorro", "Gato", "Outro"];
const OPCOES_GENERO = ["Macho", "Fêmea"];
const OPCOES_PORTE = ["Pequeno", "Médio", "Grande"];
const OPCOES_IDADE = ["Filhote", "Adulto", "Idoso"];

// --- COMPONENTES VISUAIS (COPIADOS DO SEU OUTRO ARQUIVO) ---

const InputField = ({ label, value, onChangeText, placeholder, multiline }: any) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.labelText}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && { height: 100, textAlignVertical: 'top', paddingTop: 15 }]}
      value={value || ''}
      onChangeText={onChangeText}
      placeholder={placeholder || ""}
      placeholderTextColor={COLORS.placeholder}
      multiline={multiline}
    />
  </View>
);

const SelectField = ({ label, value, placeholder, onPress }: any) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.labelText}>{label}</Text>
    <TouchableOpacity style={styles.selectButton} activeOpacity={0.8} onPress={onPress}>
      <Text style={[styles.selectValueText, !value && { color: COLORS.placeholder }]}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  </View>
);

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
  
  // MODAIS
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalOptionsVisible, setModalOptionsVisible] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [currentField, setCurrentField] = useState<keyof DadosPet | null>(null);

  const router = useRouter();
  const totalEtapas = 4;

  const avancar = () => setEtapa((e) => (e < totalEtapas ? e + 1 : e));
  const voltar = () => setEtapa((e) => (e > 1 ? e - 1 : e));

  const atualizarCampo = (campo: keyof DadosPet, valor: string) =>
    setDados((ant) => ({ ...ant, [campo]: valor }));

  // Função para abrir o modal de seleção (igual ao seu outro arquivo)
  const openOptionModal = (field: keyof DadosPet, options: string[]) => {
    setCurrentField(field);
    setCurrentOptions(options);
    setModalOptionsVisible(true);
  };

  const handleSelectOption = (option: string) => {
    if (currentField) atualizarCampo(currentField, option);
    setModalOptionsVisible(false);
  };

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
            <SelectField 
              label="Situação *" 
              value={dados.situacao} 
              placeholder="Selecione..." 
              onPress={() => openOptionModal("situacao", OPCOES_SITUACAO)}
            />
            <Text style={styles.ajuda}>Se seu pet sumiu, o app pode ajudar a encontrá-lo.</Text>
            
            <SelectField 
              label="Espécie *" 
              value={dados.especie} 
              placeholder="Selecione..." 
              onPress={() => openOptionModal("especie", OPCOES_ESPECIE)}
            />
            
            <SelectField 
              label="Gênero *" 
              value={dados.genero} 
              placeholder="Selecione..." 
              onPress={() => openOptionModal("genero", OPCOES_GENERO)}
            />
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.labelText}>Adicione a foto do pet *</Text>
            <TouchableOpacity style={styles.areaImagem} onPress={escolherImagem}>
              {dados.imagemUri ? ( 
                <Image source={{ uri: dados.imagemUri }} style={styles.imagemSelecionada} /> 
              ) : (
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
            <InputField 
              label="Raça" 
              value={dados.raca} 
              onChangeText={(v: string) => atualizarCampo("raca", v)} 
              placeholder="Opcional" 
            />
            
            <SelectField 
              label="Porte" 
              value={dados.porte} 
              placeholder="Opcional" 
              onPress={() => openOptionModal("porte", OPCOES_PORTE)}
            />
            
            <InputField 
              label="Cor predominante" 
              value={dados.cor} 
              onChangeText={(v: string) => atualizarCampo("cor", v)} 
              placeholder="Opcional" 
            />
            
            <SelectField 
              label="Idade" 
              value={dados.idade} 
              placeholder="Opcional" 
              onPress={() => openOptionModal("idade", OPCOES_IDADE)}
            />
          </>
        );
      case 4:
        return (
          <>
            <InputField 
              label="Nome do pet" 
              value={dados.nome} 
              onChangeText={(v: string) => atualizarCampo("nome", v)} 
              placeholder="Opcional" 
            />
            
            <InputField 
              label="História do pet" 
              value={dados.historia} 
              onChangeText={(v: string) => atualizarCampo("historia", v)} 
              placeholder="Conte a história do pet..." 
              multiline={true}
            />
          </>
        );
      default: return null;
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
    
      <SafeAreaView style={styles.areaSegura}>
        <ScrollView style={styles.wrapper} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerContainer}>
            {etapa > 1 ? (
              <TouchableOpacity onPress={voltar} style={styles.backButton}>
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
          
          <View style={{ height: 100 }} /> 
        </ScrollView>

        {/* RODAPÉ */}
        <View style={styles.rodape}>
          <IndicadorEtapas etapaAtual={etapa} total={totalEtapas} />
          <TouchableOpacity
            style={styles.botaoAcao}
            onPress={etapa === totalEtapas ? finalizar : handleAvancar}
          >
            <Text style={styles.textoBotao}>{etapa === totalEtapas ? "Finalizar" : "Prosseguir"}</Text>
          </TouchableOpacity>
        </View>

        {/* MODAL DE SELEÇÃO (Igual ao do arquivo ONG) */}
        <Modal visible={modalOptionsVisible} transparent animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalOptionsVisible(false)} activeOpacity={1}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalHeaderTitle}>Selecione</Text>
                  <FlatList 
                    data={currentOptions} 
                    keyExtractor={(item) => item} 
                    renderItem={({item}) => (
                      <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectOption(item)}>
                          <Text style={styles.modalItemText}>{item}</Text>
                      </TouchableOpacity>
                  )}/>
              </View>
          </TouchableOpacity>
        </Modal>

        {/* MODAL SUCESSO */}
        <Modal visible={modalSucesso} transparent animationType="fade">
          <View style={styles.fundoModal}>
            <View style={styles.cardModal}>
              <Text style={styles.tituloModal}>Registrado com sucesso</Text>
              <Text style={styles.subModal}>O pet foi cadastrado no sistema.</Text>
              <TouchableOpacity style={styles.botaoModal} onPress={() => { setModalSucesso(false); router.push("/(app)/(tabs)/home"); }}>
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
  areaSegura: { flex: 1, backgroundColor: COLORS.background }, // Usei a cor do outro arquivo
  wrapper: { flex: 1, padding: 22 },
  
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  backButton: { width: 24, height: 24 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: COLORS.white, textAlign: 'center' },
  subtitulo: { fontSize: 16, color: COLORS.white, marginBottom: 18, textAlign: 'center' },

  // --- ESTILOS DOS INPUTS (COPIADOS) ---
  inputWrapper: { marginBottom: 20 },
  labelText: { fontSize: 18, color: COLORS.white, fontWeight: '500', marginBottom: 8 },
  
  input: {
    backgroundColor: COLORS.inputBg, // #CFDEE9
    borderRadius: 6,
    height: 55,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.primary,
  },
  
  selectButton: {
    backgroundColor: COLORS.inputBg, // #CFDEE9
    borderRadius: 6,
    height: 55,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectValueText: { fontSize: 16, color: COLORS.primary },
  
  ajuda: { fontSize: 12, color: "#BFE1F7", marginBottom: 10, marginTop: -10 },

  // Área de Imagem
  areaImagem: { 
    height: 200, 
    backgroundColor: "rgba(255,255,255,0.08)", 
    borderRadius: 10, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 18, 
    borderWidth: 2, 
    borderColor: "#BFE1F7", 
    borderStyle: "dashed", 
    marginBottom: 10 
  },
  imagemSelecionada: { width: "100%", height: "100%", borderRadius: 8 },
  textoArea: { color: COLORS.white, textAlign: "center", marginTop: 10 },

  // Rodapé
  rodape: { 
    backgroundColor: COLORS.white, 
    borderTopLeftRadius: 22, 
    borderTopRightRadius: 22, 
    padding: 18, 
    paddingTop: 12, 
    alignItems: "center",
    position: 'absolute', bottom: 0, left: 0, right: 0
  },
  indicadorWrapper: { flexDirection: "row", gap: 8, marginBottom: 12 },
  indicadorPonto: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#E6F0FA" },
  indicadorAtivo: { backgroundColor: COLORS.primary },
  botaoAcao: { width: "100%", backgroundColor: COLORS.primary, padding: 14, borderRadius: 10, alignItems: "center", marginTop: 6 },
  textoBotao: { color: COLORS.white, fontSize: 16, fontWeight: "700" },

  // Modais
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: COLORS.white, width: '80%', borderRadius: 12, padding: 20, maxHeight: '50%' },
  modalHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15, textAlign: 'center' },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalItemText: { fontSize: 16, color: '#333', textAlign: 'center' },

  fundoModal: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  cardModal: { width: "86%", backgroundColor: COLORS.white, borderRadius: 14, padding: 20, alignItems: "center" },
  tituloModal: { fontSize: 20, fontWeight: "700", color: COLORS.primary, marginBottom: 8 },
  subModal: { fontSize: 14, color: "#3A5C7A", textAlign: "center", marginBottom: 14 },
  botaoModal: { width: "100%", backgroundColor: "#BFE1F7", padding: 12, borderRadius: 10, alignItems: "center" },
  textoBotaoModal: { color: COLORS.primary, fontWeight: "700" },
});