import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Alert,
  Platform,
  StatusBar
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router'; // <--- CORRIGIDO AQUI: Adicionado 'Stack'

// --- TIPOS DE DADOS DO FORMULÁRIO ---
interface OngPetFormData {
  nome: string;
  tipo: string; // Gato, Cachorro, Passaro, Outro
  raca: string;
  sexo: string; // Macho, Femea
  porte: string; // Pequeno, Medio, Grande
  idade: string; // Filhote, Adulto, Idoso
  tags: string[]; // Vacinado, Dócil, etc.
  historia: string;
  fotos: string[]; // Simulando array de fotos
}

export default function RegistroAnimalOngScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 5; 

  const [formData, setFormData] = useState<OngPetFormData>({
    nome: '',
    tipo: '',
    raca: '',
    sexo: '',
    porte: '',
    idade: '',
    tags: [],
    historia: '',
    fotos: []
  });

  // Atualiza campos de texto/simples
  const updateForm = (key: keyof OngPetFormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Atualiza Tags (Múltipla escolha)
  const toggleTag = (tag: string) => {
    setFormData(prev => {
      const exists = prev.tags.includes(tag);
      if (exists) return { ...prev, tags: prev.tags.filter(t => t !== tag) };
      return { ...prev, tags: [...prev.tags, tag] };
    });
  };

  // --- NAVEGAÇÃO ---
  const handleBack = () => {
    if (step === 1) router.back();
    else setStep(step - 1);
  };

  const handleNext = () => {
    // Validações básicas
    if (step === 1 && (!formData.nome || !formData.tipo)) return Alert.alert("Atenção", "Preencha nome e tipo.");
    if (step === 2 && (!formData.raca || !formData.sexo || !formData.porte || !formData.idade)) return Alert.alert("Atenção", "Preencha as características.");
    
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Finalizar
      Alert.alert("Sucesso", "Pet cadastrado e publicado!", [
        { text: "OK", onPress: () => router.push('/(ong)/(tabs)/pets' as any) }
      ]);
    }
  };

  // --- COMPONENTES VISUAIS AUXILIARES ---

  // Card de Tipo de Animal (Quadrado com ícone)
  const AnimalTypeCard = ({ label, icon, selected, onPress }: any) => (
    <TouchableOpacity 
      style={[styles.typeCard, selected && styles.typeCardSelected]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons 
        name={icon} 
        size={32} 
        color={selected ? "#005A9C" : "#8FA7B8"} 
      />
      <Text style={[styles.typeLabel, selected && styles.typeLabelSelected]}>{label}</Text>
      {selected && (
        <View style={styles.checkIconBadge}>
          <Feather name="check" size={12} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  // Chip de Seleção (Texto simples)
  const SelectChip = ({ label, selected, onPress }: any) => (
    <TouchableOpacity 
      style={[styles.chip, selected && styles.chipSelected]} 
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  // --- RENDERIZAÇÃO DOS PASSOS ---

  // Passo 1: Informações Básicas
  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Informações básicas</Text>
      
      <Text style={styles.label}>Nome do animal</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Digite o nome" 
        value={formData.nome}
        onChangeText={(t) => updateForm('nome', t)}
      />

      <Text style={styles.label}>Tipo de animal</Text>
      <View style={styles.gridContainer}>
        <AnimalTypeCard label="Gato" icon="cat" selected={formData.tipo === 'Gato'} onPress={() => updateForm('tipo', 'Gato')} />
        <AnimalTypeCard label="Cachorro" icon="dog" selected={formData.tipo === 'Cachorro'} onPress={() => updateForm('tipo', 'Cachorro')} />
        <AnimalTypeCard label="Pássaros" icon="bird" selected={formData.tipo === 'Passaro'} onPress={() => updateForm('tipo', 'Passaro')} />
        <AnimalTypeCard label="Outro" icon="paw" selected={formData.tipo === 'Outro'} onPress={() => updateForm('tipo', 'Outro')} />
      </View>
    </View>
  );

  // Passo 2: Características Físicas
  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Características físicas</Text>

      <Text style={styles.label}>Raça</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ex: SRD, Siamês, Poodle..." 
        value={formData.raca}
        onChangeText={(t) => updateForm('raca', t)}
      />

      <Text style={styles.label}>Sexo</Text>
      <View style={styles.row}>
        <SelectChip label="Macho" selected={formData.sexo === 'Macho'} onPress={() => updateForm('sexo', 'Macho')} />
        <SelectChip label="Fêmea" selected={formData.sexo === 'Fêmea'} onPress={() => updateForm('sexo', 'Fêmea')} />
      </View>

      <Text style={styles.label}>Porte</Text>
      <View style={styles.row}>
        {['Pequeno', 'Médio', 'Grande'].map(p => (
          <SelectChip key={p} label={p} selected={formData.porte === p} onPress={() => updateForm('porte', p)} />
        ))}
      </View>

      <Text style={styles.label}>Idade Aproximada</Text>
      <View style={styles.row}>
        {['Filhote', 'Adulto', 'Idoso'].map(i => (
          <SelectChip key={i} label={i} selected={formData.idade === i} onPress={() => updateForm('idade', i)} />
        ))}
      </View>
    </View>
  );

  // Passo 3: Saúde e Temperamento
  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Saúde e Temperamento</Text>
      <Text style={styles.helperText}>Selecione todas as opções que se aplicam:</Text>
      
      <View style={styles.tagsContainer}>
        {['Vacinado', 'Vermifugado', 'Castrado', 'Necessita Cuidados Especiais', 'Dócil', 'Sociável', 'Calmo', 'Brincalhão', 'Agitado', 'Tímido'].map(tag => (
          <TouchableOpacity 
            key={tag} 
            style={[styles.tagChip, formData.tags.includes(tag) && styles.tagChipSelected]} 
            onPress={() => toggleTag(tag)}
          >
            <Text style={[styles.tagText, formData.tags.includes(tag) && styles.tagTextSelected]}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Passo 4: História
  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>História / Descrição</Text>
      <Text style={styles.helperText}>Conte um pouco sobre o resgate, a personalidade e o que o pet precisa.</Text>
      
      <TextInput 
        style={styles.textArea} 
        placeholder="Escreva aqui..." 
        value={formData.historia}
        onChangeText={(t) => updateForm('historia', t)}
        multiline
        textAlignVertical="top"
      />
    </View>
  );

  // Passo 5: Fotos
  const renderStep5 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Fotos do Animal</Text>
      <Text style={styles.helperText}>Adicione fotos de boa qualidade para aumentar as chances de adoção.</Text>
      
      <TouchableOpacity style={styles.uploadBox} onPress={() => Alert.alert("Upload", "Abrir galeria...")}>
        <View style={styles.uploadIconCircle}>
            <Feather name="camera" size={32} color="#005A9C" />
        </View>
        <Text style={styles.uploadText}>Adicionar fotos</Text>
      </TouchableOpacity>

      {/* Exemplo de como ficaria uma foto adicionada */}
      <View style={styles.photosPreviewRow}>
         {/* Espaço reservado para previews */}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.iconBtn}>
          <Feather name="chevron-left" size={28} color="#005A9C" />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${(step / totalSteps) * 100}%` }]} />
        </View>

        <View style={styles.iconBtn}>
           <Feather name="user" size={24} color="#005A9C" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.pageTitle}>Cadastrar animal</Text>
        <Text style={styles.pageSubtitle}>Preencha as informações para cadastrar um novo pet</Text>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB NEXT BUTTON */}
      <TouchableOpacity style={styles.fabNext} onPress={handleNext}>
        <Feather name={step === totalSteps ? "check" : "chevron-right"} size={32} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
  },
  iconBtn: { padding: 5 },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginHorizontal: 15,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#005A9C',
    borderRadius: 4,
  },

  // Conteúdo
  scrollContainer: { padding: 25 },
  stepContent: { flex: 1 },
  pageTitle: { fontSize: 26, fontWeight: 'bold', color: '#005A9C', marginBottom: 5 },
  pageSubtitle: { fontSize: 14, color: '#666', marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#005A9C', marginBottom: 15 },
  helperText: { fontSize: 14, color: '#666', marginBottom: 15 },

  // Inputs
  label: { fontSize: 16, color: '#333', marginBottom: 8, marginTop: 15, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    height: 150,
  },

  // Grid Tipo de Animal
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  typeCard: {
    width: '48%',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  typeCardSelected: {
    borderColor: '#005A9C',
    backgroundColor: '#E6F3FF',
  },
  typeLabel: { marginTop: 10, fontSize: 16, color: '#555', fontWeight: '500' },
  typeLabelSelected: { color: '#005A9C', fontWeight: 'bold' },
  checkIconBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#005A9C',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Chips (Botões de seleção)
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  chipSelected: {
    backgroundColor: '#005A9C',
    borderColor: '#005A9C',
  },
  chipText: { color: '#555', fontSize: 15 },
  chipTextSelected: { color: '#fff', fontWeight: 'bold' },

  // Tags
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginBottom: 8,
  },
  tagChipSelected: { backgroundColor: '#005A9C' },
  tagText: { color: '#555', fontSize: 14 },
  tagTextSelected: { color: '#fff', fontWeight: 'bold' },

  // Upload Area
  uploadBox: {
    borderWidth: 2,
    borderColor: '#005A9C',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
  uploadIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadText: { color: '#005A9C', fontWeight: 'bold', fontSize: 16 },
  photosPreviewRow: { flexDirection: 'row', marginTop: 15 },

  // FAB
  fabNext: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#005A9C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});