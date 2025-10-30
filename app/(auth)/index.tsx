import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DenuncieModal } from '../../components/DenuncieModal';
import { useAuth } from '../../context/AuthContext';

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

export default function PublicIndex() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [signupModalVisible, setSignupModalVisible] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && session) {
      router.replace('/home');
    }
  }, [session, isLoading]);

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
        <TouchableOpacity onPress={() => setSignupModalVisible(true)} style={{ marginRight: 20 }}>
          <Ionicons name="person-add-outline" size={28} color="#2D68A6" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  
  // Enquanto verifica o login, ou se já está redirecionando, não mostra nada.
  if (isLoading || session) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <DenuncieModal visible={isModalVisible} onClose={() => setModalVisible(false)} />

      {/* Modal de escolha de cadastro */}
      <Modal
        visible={signupModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSignupModalVisible(false)}
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPressOut={() => setSignupModalVisible(false)}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Cadastrar-se como:</Text>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setSignupModalVisible(false);
                router.push('/signup'); 
              }}
            >
              <Ionicons name="person-outline" size={20} color="#2D68A6" />
              <Text style={styles.optionText}>Usuário</Text>
            </TouchableOpacity>

            <View style={styles.dividerLine} />

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setSignupModalVisible(false);
                router.push('/signup-ong'); 
              }}
            >
              <Ionicons name="paw-outline" size={20} color="#2D68A6" />
              <Text style={styles.optionText}>ONG</Text>
            </TouchableOpacity>
            
            <View style={styles.dividerLine2} />
            <TouchableOpacity style={{ marginTop: 12 }} onPress={() => setSignupModalVisible(false)}>
              <Text style={{ color: '#1c5b8f' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { paddingHorizontal: 20 },
  headerTitle: { paddingTop: 80, marginBottom: 30, position: 'relative' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#2D68A6', width: '80%' },
  paws: { position: 'absolute', right: 10, top: 80 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#3A5C7A', marginBottom: 5 },
  missionBox: { backgroundColor: '#E6F0FA', padding: 25, borderRadius: 20, marginBottom: 30 },
  missionText: { fontSize: 16, color: '#3A5C7A', lineHeight: 24, textAlign: 'center' },
  
  featureCard: {
    width: 200,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#BFE1F7',
    borderStyle: 'dashed',
    padding: 20,
    paddingTop: 40, 
    marginRight: 20,
    alignItems: 'center',
  },
  featureIconContainer: {
    position: 'absolute',
    top: -30,
    backgroundColor: 'white', 
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BFE1F7',
    borderStyle: 'dashed',
  },
  featureTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D68A6', marginBottom: 10 },
  featureDescription: { fontSize: 14, color: '#3A5C7A', textAlign: 'center', lineHeight: 20, marginBottom: 15 },
  featureLink: { fontSize: 14, color: '#A0A0A0', fontWeight: '500' },

  statCard: {
    backgroundColor: '#E6F0FA',
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    width: 150, 
    height: 150, 
    marginRight: 15,
    marginBottom: 30,
    justifyContent: 'center', 
  },
  statValue: {
    fontSize: 64, 
    fontWeight: '300',
    color: '#2D68A6',
  },
  statLabel: {
    fontSize: 16, 
    color: '#3A5C7A',
    marginTop: 5,
    textAlign: 'center',
  },
  overlay: { 
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.3)' 
  },
  popup: {
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 20, 
    width: 300, 
    alignItems: 'center' 
  },
  popupTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#2D68A6',
    marginBottom: 12
  },
  option: {
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 10,
    width: '100%',
    borderRadius: 8,
    marginBottom: 8
  },
  optionText: { 
    marginLeft: 8, 
    fontSize: 16,
    color: '#2D68A6', 
    fontWeight: '600'
  },
  dividerLine: { 
    height: 1,
    backgroundColor: '#E6F0FA',
    width: '80%',
    marginVertical: 8
  },
  dividerLine2: {
    height: 2, 
    backgroundColor: '#eaf0f7ff',
    width: '100%', 
    marginVertical: 8 
  },
});