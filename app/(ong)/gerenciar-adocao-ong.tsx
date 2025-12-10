import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Alert,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

// Dados Mockados (Simulando o pet que o USUÁRIO cadastrou)
const PET_MOCK = {
  id: 19,
  nome: "Marcos",
  status: "DISPONIVEL",
  dataAtualizacao: "05/12/2025",
  foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Plains_Zebra_Equus_quagga.jpg/1200px-Plains_Zebra_Equus_quagga.jpg" 
};

const CANDIDATOS_MOCK = [
  {
    id: 1,
    nome: "Kaique",
    status: "PENDENTE - 08/12/2025",
    dados: {
      nomeCompleto: "Kaique",
      cpf: "---",
      telefone: "11956674434",
      email: "matheus@gmail.com",
      cep: "---",
      rua: "---",
      numero: "---",
      complemento: "-",
      bairro: "---",
      cidade: "---",
      tipoImovel: "Casa",
      outrosAnimais: "Não",
      residentes: "3 pessoa(s)",
      historico: "Quantidade: 0, Tipo de Animal: ---"
    }
  },
  {
    id: 2,
    nome: "Ana Silva",
    status: "PENDENTE - 09/12/2025",
    dados: {
      nomeCompleto: "Ana Maria Silva",
      cpf: "123.456.789-00",
      telefone: "11999998888",
      email: "ana@email.com",
      cep: "01001-000",
      rua: "Rua das Flores",
      numero: "123",
      complemento: "Apto 12",
      bairro: "Centro",
      cidade: "São Paulo - SP",
      tipoImovel: "Apartamento",
      outrosAnimais: "Sim (1 Gato)",
      residentes: "2 pessoa(s)",
      historico: "Já teve cães antes"
    }
  }
];

export default function GerenciarAdocaoUsuarioScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedCandidateId, setSelectedCandidateId] = useState<number>(CANDIDATOS_MOCK[0].id);

  const candidatoSelecionado = CANDIDATOS_MOCK.find(c => c.id === selectedCandidateId);

  const handleAprovar = () => {
    Alert.alert("Sucesso", `Adoção aprovada para ${candidatoSelecionado?.nome}!`);
  };

  const handleReprovar = () => {
    Alert.alert("Atenção", `Candidato ${candidatoSelecionado?.nome} reprovado.`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1A3C6E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gerenciar Adoção</Text>
          <View style={{width: 24}}/>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
        
        {/* SEÇÃO DO PET */}
        <View style={styles.petSection}>
            <Image 
                source={{ uri: PET_MOCK.foto }} 
                style={styles.petImage} 
            />
            <View style={styles.petInfo}>
                <Text style={styles.petName}>{PET_MOCK.nome}</Text>
                
                <View style={{flexDirection:'row', alignItems:'center', marginTop: 5}}>
                    <Text style={styles.labelStatus}>Status: </Text>
                    <Text style={styles.valueStatus}>{PET_MOCK.status}</Text>
                </View>
                
                <Text style={styles.dateUpdate}>Atualizado em: {PET_MOCK.dataAtualizacao}</Text>
                
                <TouchableOpacity style={styles.statusButton}>
                    <Text style={styles.statusButtonText}>Mudar Status</Text>
                </TouchableOpacity>
                
                <Text style={styles.petId}>ID: #{PET_MOCK.id}</Text>
            </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Informações dos Candidatos</Text>

        {/* SELETOR DE CANDIDATOS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.candidatesScroll}>
            {CANDIDATOS_MOCK.map((cand) => (
                <TouchableOpacity 
                    key={cand.id} 
                    style={[
                        styles.candidateTab, 
                        selectedCandidateId === cand.id && styles.candidateTabActive
                    ]}
                    onPress={() => setSelectedCandidateId(cand.id)}
                >
                    <Text style={[
                        styles.candidateNameTab,
                        selectedCandidateId === cand.id && styles.candidateNameTabActive
                    ]}>
                        {cand.nome}
                    </Text>
                    <Text style={[
                        styles.candidateStatusTab,
                        selectedCandidateId === cand.id && styles.candidateNameTabActive
                    ]}>
                        {cand.status}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {/* DETALHES DO CANDIDATO */}
        {candidatoSelecionado && (
            <View style={styles.detailsContainer}>
                
                <Text style={styles.groupTitle}>Informações Pessoais</Text>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>NOME COMPLETO</Text>
                        <Text style={styles.fieldValue}>{candidatoSelecionado.dados.nomeCompleto}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>CPF</Text>
                        <Text style={styles.fieldValue}>{candidatoSelecionado.dados.cpf}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>TELEFONE</Text>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Text style={styles.fieldValue}>{candidatoSelecionado.dados.telefone}</Text>
                            <Ionicons name="logo-whatsapp" size={16} color="green" style={{marginLeft:5}}/>
                        </View>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>E-MAIL</Text>
                        <Text style={styles.fieldValue}>{candidatoSelecionado.dados.email}</Text>
                    </View>
                </View>

                <Text style={[styles.groupTitle, {marginTop: 20}]}>Endereço</Text>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>CEP</Text>
                        <Text style={styles.fieldValue}>{candidatoSelecionado.dados.cep}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>RUA</Text>
                        <Text style={styles.fieldValue}>{candidatoSelecionado.dados.rua}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>NÚMERO</Text>
                        <Text style={styles.fieldValue}>{candidatoSelecionado.dados.numero}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>COMPLEMENTO</Text>
                        <Text style={styles.fieldValue}>{candidatoSelecionado.dados.complemento}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>BAIRRO</Text>
                        <Text style={styles.fieldValue}>{candidatoSelecionado.dados.bairro}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>CIDADE / ESTADO</Text>
                        <Text style={styles.fieldValue}>{candidatoSelecionado.dados.cidade}</Text>
                    </View>
                </View>

                <Text style={[styles.groupTitle, {marginTop: 20}]}>Moradia</Text>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>TIPO DE IMÓVEL</Text>
                        <Text style={styles.fieldValue}>{candidatoSelecionado.dados.tipoImovel}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>OUTROS ANIMAIS</Text>
                        <Text style={styles.fieldValue}>{candidatoSelecionado.dados.outrosAnimais}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>RESIDENTES</Text>
                        <Text style={styles.fieldValue}>{candidatoSelecionado.dados.residentes}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>HISTÓRICO</Text>
                        <Text style={styles.fieldValue}>{candidatoSelecionado.dados.historico}</Text>
                    </View>
                </View>

            </View>
        )}

      </ScrollView>

      {/* FOOTER BOTOES */}
      <View style={styles.footerActions}>
         <TouchableOpacity style={styles.btnReprovar} onPress={handleReprovar}>
            <Text style={styles.btnText}>Reprovar</Text>
         </TouchableOpacity>
         
         <TouchableOpacity style={styles.btnAprovar} onPress={handleAprovar}>
            <Text style={styles.btnText}>Aprovar Adoção</Text>
         </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerSafe: { backgroundColor: '#FFF', borderBottomWidth:1, borderBottomColor:'#EEE' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 10
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A3C6E' },

  petSection: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#F9FCFF',
    margin: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6F0FA'
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#CCC'
  },
  petInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  petName: { fontSize: 20, fontWeight: 'bold', color: '#2D68A6' },
  labelStatus: { fontSize: 12, color: '#666', fontWeight: 'bold' },
  valueStatus: { fontSize: 12, color: '#2D68A6', fontWeight: 'bold' },
  dateUpdate: { fontSize: 10, color: '#999', marginTop: 2, marginBottom: 8 },
  statusButton: { backgroundColor: '#3A5C7A', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 20, alignSelf: 'flex-start' },
  statusButtonText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  petId: { fontSize: 10, color: '#CCC', marginTop: 8 },

  divider: { height: 1, backgroundColor: '#DDD', marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D68A6', marginLeft: 20, marginBottom: 15 },

  candidatesScroll: { paddingHorizontal: 20, marginBottom: 20 },
  candidateTab: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D68A6',
    marginRight: 10,
    backgroundColor: '#FFF',
    minWidth: 120
  },
  candidateTabActive: {
    backgroundColor: '#E7F1FC',
    borderWidth: 2,
  },
  candidateNameTab: { fontSize: 14, fontWeight: 'bold', color: '#2D68A6' },
  candidateNameTabActive: { color: '#1A3C6E' },
  candidateStatusTab: { fontSize: 10, color: '#666', marginTop: 4 },

  detailsContainer: { paddingHorizontal: 25 },
  groupTitle: { fontSize: 14, color: '#2D68A6', fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 5 },
  row: { flexDirection: 'row', marginBottom: 12 },
  col: { flex: 1, paddingRight: 10 },
  fieldLabel: { fontSize: 10, color: '#1A3C6E', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
  fieldValue: { fontSize: 14, color: '#555' },

  footerActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
    gap: 15
  },
  btnReprovar: {
    flex: 1,
    backgroundColor: '#E74C3C',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center'
  },
  btnAprovar: {
    flex: 1,
    backgroundColor: '#27AE60',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center'
  },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});