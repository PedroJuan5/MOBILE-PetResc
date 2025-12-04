import React, { useState } from 'react';
import {  View,  Text,  StyleSheet,  TouchableOpacity,  FlatList,  StatusBar, Modal, Dimensions, TouchableWithoutFeedback, ScrollView, TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

const COLORS = {
  primary: '#2D68A6',
  bg: '#FFFFFF',
  cardBg: '#94B9D8',
  white: '#FFFFFF',
  textLight: '#666',
  progressGreen: '#50C878',
  border: '#E0E0E0'
};

const PETS_DATA = [
  { 
    id: '1', nome: 'Luna', tipo: 'Gato', labelDono: 'ONG', nomeDono: 'Instituto Caramelo', 
    status: 'Em análise', saude: 75 
  },
  { 
    id: '2', nome: 'Rex', tipo: 'Cachorro', labelDono: 'ONG', nomeDono: 'SUIPA', 
    status: 'Disponível', saude: 100 
  },
  { 
    id: '3', nome: 'Listrada', tipo: 'Gato', labelDono: 'Protetor', nomeDono: 'Carlos M.', 
    status: 'Adotado', saude: 100 
  },
];

export default function GerenciarPetsScreen() {
  const router = useRouter();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  //navega para a ong parceira
  const handleOngParceiraClick = () => {
    console.log("Indo para ONG Parceira...");
    setModalVisible(false); 
    router.push('/(admin)/ong-parceira' as any); 
  };

  //navega para o perido de cadastro
  const handlePeriodoCadastroClick = () => {
    console.log("Indo para Periodo de Cadastro...");
    setModalVisible(false); //fecha o modal primeiro
    router.push('/(admin)/periodo-cadastro' as any); // Navega
  };

  //componentes auxiliares
  const AccordionItem = ({ title, sectionName, children }: any) => {
    const isOpen = expandedSection === sectionName;
    return (
        <View style={styles.accordionContainer}>
            <TouchableOpacity style={styles.filterItemHeader} onPress={() => toggleSection(sectionName)}>
                <Text style={styles.filterHeaderText}>{title}</Text>
                <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color={COLORS.primary} />
            </TouchableOpacity>
            {isOpen && <View style={styles.accordionContent}>{children}</View>}
        </View>
    );
  };

  const FilterSubItem = ({ text }: { text: string }) => (
    <TouchableOpacity style={styles.subItem}>
        <Text style={styles.subItemText}>{text}</Text>
    </TouchableOpacity>
  );

  const renderPetItem = ({ item }: any) => {
    const progressColor = item.status === 'Em análise' ? '#FFD700' : '#2E7D32'; 
    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <View style={styles.headerRow}>
            <Text style={styles.petName}>
                {item.nome} <Text style={styles.petType}>({item.tipo})</Text>
            </Text>
            <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Status: {item.status}</Text>
            </View>
          </View>
          <Text style={styles.ownerName}>{item.labelDono}: {item.nomeDono}</Text>
          <View style={styles.progressRow}>
             <Text style={styles.progressLabel}>Progresso:</Text>
             <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${item.saude}%`, backgroundColor: progressColor }]} />
                </View>
             </View>
             <Text style={styles.progressPercent}>{item.saude}%</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/*modal*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
           <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalBackground} />
           </TouchableWithoutFeedback>

           <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filtros</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={20}>
                  <Ionicons name="close" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                
                {/*status*/}
                <AccordionItem title="Status" sectionName="Status">
                   <FilterSubItem text="Pendente de revisão" />
                   <FilterSubItem text="Em tratamento" />
                   <FilterSubItem text="Disponível" />
                   <FilterSubItem text="Adotado" />
                </AccordionItem>

                {/*especie*/}
                <AccordionItem title="Espécie" sectionName="Espécie">
                   <FilterSubItem text="Cachorro" />
                   <FilterSubItem text="Gato" />
                   <FilterSubItem text="Outros" />
                </AccordionItem>

                {/*porte*/}
                <AccordionItem title="Porte" sectionName="Porte">
                   <FilterSubItem text="Pequeno" />
                   <FilterSubItem text="Médio" />
                   <FilterSubItem text="Grande" />
                </AccordionItem>

                {/*idade*/}
                <AccordionItem title="Idade" sectionName="Idade">
                   <FilterSubItem text="Filhote" />
                   <FilterSubItem text="Adulto" />
                   <View style={styles.ageInputRow}>
                      <Text style={styles.ageInputLabel}>Anos ou meses:</Text>
                      <TextInput style={styles.ageInputLine} placeholder="0" keyboardType="numeric" />
                   </View>
                </AccordionItem>

                {/*ong parceria*/}
                <TouchableOpacity style={styles.filterLinkItem} onPress={handleOngParceiraClick}>
                    <Text style={styles.filterLinkText}>ONG parceira</Text>
                </TouchableOpacity>
                
                {/*periodo de cadastro*/}
                <TouchableOpacity style={styles.filterLinkItem} onPress={handlePeriodoCadastroClick}>
                    <Text style={styles.filterLinkText}>Periodo de cadastro</Text>
                </TouchableOpacity>

              </ScrollView>

              <TouchableOpacity style={styles.applyButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.applyButtonText}>Ver Resultados</Text>
              </TouchableOpacity>
           </View>
        </View>
      </Modal>

      {/*header*/}
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Gerenciar Pets</Text>
        <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications" size={26} color={COLORS.primary} />
            <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {/*sub titulo e filtro*/}
      <View style={styles.subHeaderRow}>
        <Text style={styles.subTitle}>Gerenciamento de animais (geral)</Text>
        <TouchableOpacity 
            onPress={() => setModalVisible(true)} 
            hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
            style={styles.filterBtn}
        >
            <Ionicons name="swap-vertical-outline" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/*lista*/}
      <FlatList 
        data={PETS_DATA}
        keyExtractor={item => item.id}
        renderItem={renderPetItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  // Header e Sub
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, zIndex: 5 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary },
  notificationBtn: { position: 'relative', padding: 5 },
  badge: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E91E63' },
  subHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20, backgroundColor: COLORS.bg, zIndex: 10 },
  subTitle: { fontSize: 16, color: COLORS.primary, fontWeight: '400', flex: 1, marginRight: 10 },
  filterBtn: { padding: 5 },

  // Lista
  listContent: { paddingHorizontal: 20, paddingBottom: 20, zIndex: 1 },
  card: { backgroundColor: COLORS.cardBg, borderRadius: 12, padding: 15, marginBottom: 15 },
  cardInfo: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  petName: { fontSize: 16, fontWeight: '600', color: COLORS.white },
  petType: { fontSize: 14, fontWeight: '400', color: '#F0F4F8' },
  statusBadge: { backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: 'bold', color: COLORS.white },
  ownerName: { fontSize: 14, color: '#F0F4F8', marginBottom: 15, fontWeight: '600' },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  progressLabel: { fontSize: 14, color: COLORS.white, marginRight: 8 },
  progressContainer: { flex: 1, height: 12, marginRight: 8 },
  progressBarBackground: { width: '100%', height: '100%', backgroundColor: COLORS.white, borderRadius: 0 },
  progressBarFill: { height: '100%', borderRadius: 0 },
  progressPercent: { fontSize: 12, color: COLORS.white, fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 25, maxHeight: height * 0.85 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  applyButton: { backgroundColor: COLORS.primary, paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  applyButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  // Accordion
  accordionContainer: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  filterItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  filterHeaderText: { fontSize: 18, color: COLORS.primary, fontWeight: '500' },
  accordionContent: { paddingLeft: 10, paddingBottom: 15 },
  subItem: { paddingVertical: 8 },
  subItemText: { fontSize: 16, color: '#5A7A9A' },
  ageInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  ageInputLabel: { fontSize: 14, color: '#5A7A9A', marginRight: 10 },
  ageInputLine: { borderBottomWidth: 1, borderBottomColor: '#A0B4CC', width: 60, paddingVertical: 2, textAlign: 'center', color: COLORS.primary },

  // Links (ONG e Periodo)
  filterLinkItem: { 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0' 
  },
  filterLinkText: { 
    fontSize: 18, 
    color: COLORS.primary, 
    fontWeight: '500' 
  },
});