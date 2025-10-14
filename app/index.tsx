import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DenuncieModal } from '../components/denuncieModal';

// --- Tipos para os componentes (Boa Prática) ---
interface FeatureCardProps { icon: string; title: string; description: string; }
interface StatCardProps { value: string; label: string; }

// --- Componentes Reutilizáveis para esta tela ---
const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <View style={styles.featureCard}>
    {/* ...código do seu FeatureCard... */}
  </View>
);

const StatCard = ({ value, label }: StatCardProps) => (
  <View style={styles.statCard}>
    {/* ...código do seu StatCard... */}
  </View>
);

// Componente principal da tela de entrada publica
export default function PublicIndex() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [signupModalVisible, setSignupModalVisible] = useState(false);
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
        <TouchableOpacity onPress={() => setSignupModalVisible(true)} style={{ marginRight: 20 }}>
          <Ionicons name="person-add-outline" size={28} color="#2D68A6" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
                router.push('/signup'); // rota de cadastro de usuário
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
                // 2. AVISO: Garanta que o arquivo 'signup-ong.tsx' existe!
                (router as any).push('/signup-ong'); 
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

      {/* O resto do seu código da tela continua aqui... */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
            {/* ... */}
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
  
  //estilos para os cards de funcionalidade
  featureCard: {
    width: 200,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#BFE1F7',
    borderStyle: 'dashed', //borda pontilhada
    padding: 20,
    paddingTop: 40, 
    marginRight: 20,
    alignItems: 'center',
  },
  featureIconContainer: {
    position: 'absolute',//posiçao absoluta para "flutuar"
    top: -30, //puxa o ícone para cima, para fora do card
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

  //estilos para os cards de marcos
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
  // estilos do popup/modal de cadastro
  overlay: { 
    flex: 1, 
    justifyContent: 'center',
     alignItems: 'center', 
     backgroundColor: 'rgba(0,0,0,0.3)' },

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