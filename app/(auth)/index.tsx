// Arquivo: app/(auth)/index.tsx
import React, { useState, useLayoutEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { DenuncieModal } from '../../components/denuncieModal';

// --- Componentes Reutilizáveis para esta tela ---

const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <View style={styles.featureCard}>
    <View style={styles.featureIconContainer}>
      <FontAwesome5 name={icon} size={24} color="#2D68A6" />
    </View>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
    <TouchableOpacity>
      <Text style={styles.featureLink}>Saiba mais</Text>
    </TouchableOpacity>
  </View>
);

const StatCard = ({ value, label }: { value: string, label: string }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);


// --- Componente Principal da Tela de Entrada Pública ---
export default function PublicIndex() {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginLeft: 20 }}>
          <Ionicons name="alert-circle-outline" size={28} color="#2D68A6" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => router.push('/signup')} style={{ marginRight: 20 }}>
          <Ionicons name="person-add-outline" size={28} color="#2D68A6" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <DenuncieModal visible={isModalVisible} onClose={() => setModalVisible(false)} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          
          <View style={styles.headerTitle}>
            <Text style={styles.title}>Conheça seu novo melhor amigo!</Text>
            <View style={styles.paws}><FontAwesome5 name="paw" size={18} color="#BFE1F7" /></View>
          </View>

          <Text style={styles.sectionTitle}>Nossa missão</Text>
          <View style={styles.missionBox}>
              <Text style={styles.missionText}>
                Nosso objetivo é otimizar a gestão das organizações, dar mais visibilidade aos animais em situação de vulnerabilidade e incentivar a participação social, ajudando a reduzir o abandono e promovendo a adoção responsável.
              </Text>
          </View>

          <Text style={styles.sectionTitle}>Funcionalidades em destaque</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 30 }}>
            <FeatureCard icon="bone" title="Faça sua doação" description="Contribua com suprimentos ou recursos e ajude a transformar a vida de animais resgatados." />
            <FeatureCard icon="hand-holding-heart" title="Seja voluntário" description="Doe seu tempo e talento para cuidar dos animais, ajudar em eventos e muito mais." />
            <FeatureCard icon="paw" title="Adote um amigo" description="Encontre seu companheiro ideal e dê a ele um lar amoroso e seguro para sempre." />
          </ScrollView>

          <Text style={styles.sectionTitle}>Nossos marcos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <StatCard value="63" label="Animais adotados" />
            <StatCard value="12" label="ONGs parceiras" />
            <StatCard value="25" label="Campanhas" />
          </ScrollView>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS ATUALIZADOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { paddingHorizontal: 20 },
  headerTitle: { paddingTop: 80, marginBottom: 30, position: 'relative' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#2D68A6', width: '80%' },
  paws: { position: 'absolute', right: 10, top: 80 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#3A5C7A', marginBottom: 5 },
  missionBox: { backgroundColor: '#E6F0FA', padding: 25, borderRadius: 20, marginBottom: 30 },
  missionText: { fontSize: 16, color: '#3A5C7A', lineHeight: 24, textAlign: 'center' },
  
  // Estilos atualizados para os cards de funcionalidade
  featureCard: {
    width: 200,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#BFE1F7',
    borderStyle: 'dashed', // Borda pontilhada
    padding: 20,
    paddingTop: 40, // Mais espaço no topo para o ícone
    marginRight: 20,
    alignItems: 'center',
  },
  featureIconContainer: {
    position: 'absolute', // Posição absoluta para "flutuar"
    top: -30, // Puxa o ícone para cima, para fora do card
    backgroundColor: 'white', // Fundo branco para cobrir a linha pontilhada
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    // Adiciona a mesma borda pontilhada ao redor do ícone
    borderWidth: 2,
    borderColor: '#BFE1F7',
    borderStyle: 'dashed',
  },
  featureTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D68A6', marginBottom: 10 },
  featureDescription: { fontSize: 14, color: '#3A5C7A', textAlign: 'center', lineHeight: 20, marginBottom: 15 },
  featureLink: { fontSize: 14, color: '#A0A0A0', fontWeight: '500' },

  // Estilos atualizados para os cards de marcos
  statCard: {
    backgroundColor: '#E6F0FA',
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    width: 150, // Um pouco mais largo
    height: 150, // Altura fixa para ficarem iguais
    marginRight: 15,
    marginBottom: 30,
    justifyContent: 'center', // Centraliza o conteúdo
  },
  statValue: {
    fontSize: 64, // Número bem maior
    fontWeight: '300', // Fonte mais fina e moderna
    color: '#2D68A6',
  },
  statLabel: {
    fontSize: 16, // Rótulo um pouco maior
    color: '#3A5C7A',
    marginTop: 5,
    textAlign: 'center',
  },
});