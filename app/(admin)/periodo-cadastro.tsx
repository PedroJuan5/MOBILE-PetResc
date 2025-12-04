import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2D68A6', 
  secondary: '#5A7A9A', 
  bg: '#FFFFFF',
  line: '#A0B4CC'
};

export default function PeriodoCadastroScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Período de cadastro</Text>
          <TouchableOpacity>
             <Ionicons name="notifications" size={24} color={COLORS.secondary} />
             <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/*sub titulo*/}
        <Text style={styles.subTitle}>Todos os Períodos</Text>
        <View style={styles.separatorMain} />

        {/* seção 1: hoje */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>
                Pets cadastrados hoje <Text style={styles.sectionSubtitle}>(Para revisão imediata)</Text>
            </Text>
            
            <Text style={styles.listItem}>Luna (Gato) - Cadastrado à 7 horas</Text>
            <Text style={styles.listItem}>Billy (Cão) - Cadastrado à 20 horas</Text>
        </View>
        <View style={styles.separator} />

        {/* seção 2: 7 dias */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pets cadastrados últimos 7 dias</Text>
            
            <Text style={styles.listItem}>Bob (Cão) - Cadastrado à 3 dias</Text>
            <Text style={styles.listItem}>Matilda (Gato) - Cadastrado à 6 dias</Text>
            <Text style={styles.listItem}>Stuart (Gato) - Cadastrado à 2 dias</Text>
        </View>
        <View style={styles.separator} />

        {/* seção 3: 30 dias */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pets cadastrados últimos 30 dias</Text>
            
            <Text style={styles.listItem}>Luff (Cão) - Cadastrado à 22 dias</Text>
            <Text style={styles.listItem}>Matilda (Cão) - Cadastrado à 25 dias</Text>
            <Text style={styles.listItem}>Mily (Gato) - Cadastrado à 16 dias</Text>
            <Text style={styles.listItem}>Frajola (Gato) - Cadastrado à 10 dias</Text>
        </View>
        <View style={styles.separator} />

      </ScrollView>

      {/*footer seta de voltar*/}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary },
  badge: { position: 'absolute', top: 0, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E91E63' },

  // Subtitle
  subTitle: { fontSize: 18, fontWeight: '600', color: COLORS.primary, marginBottom: 10 },
  separatorMain: { height: 2, backgroundColor: '#DDE8F0', marginBottom: 25 },

  // Sections
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: COLORS.primary, marginBottom: 15 },
  sectionSubtitle: { fontSize: 12, fontWeight: '400', color: COLORS.secondary },
  
  listItem: { fontSize: 16, color: COLORS.primary, marginBottom: 12 },

  separator: { height: 1, backgroundColor: '#A0B4CC', marginBottom: 25, opacity: 0.5 },

  // Footer
  footer: { paddingHorizontal: 25, paddingBottom: 20 },
});