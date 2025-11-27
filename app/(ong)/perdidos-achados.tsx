import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ImageSourcePropType
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Tipagem
interface Animal {
  id: string;
  nome: string;
  imagem: ImageSourcePropType;
  descricao: string;
  status: string; // PERDIDO ou ACHADO
}

// Dados de Exemplo para Perdidos
const ANIMAIS_PERDIDOS: Animal[] = [
  { id: '1', nome: 'Totó', imagem: require('../../assets/images/pets/caramelo.png'), descricao: 'Visto no centro', status: 'PERDIDO' },
  { id: '2', nome: 'Mimi', imagem: require('../../assets/images/ui/gatoHome.png'), descricao: 'Encontrada na praça', status: 'ACHADO' },
  { id: '3', nome: 'Rex', imagem: require('../../assets/images/pets/branquinho.png'), descricao: 'Fugiu ontem', status: 'PERDIDO' },
];

const AnimalCard = ({ item }: { item: Animal }) => (
  <View style={styles.cardContainer}>
    <Image source={item.imagem} style={styles.cardImage} resizeMode="cover" />
    <View style={styles.cardInfo}>
      <Text style={styles.cardName}>{item.nome}</Text>
      <Text style={styles.cardDetails}>
        {item.descricao} <Text style={{fontWeight: 'bold', color: item.status === 'PERDIDO' ? 'red' : 'green'}}>{item.status}</Text>
      </Text>
    </View>
  </View>
);

export default function PerdidosAchadosScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header Simples com Voltar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#2D68A6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perdidos e Achados</Text>
          <View style={{width: 28}} /> 
        </View>

        <FlatList
          data={ANIMAIS_PERDIDOS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AnimalCard item={item} />}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff", paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2D68A6' },
  listContent: { paddingHorizontal: 15, paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  cardContainer: { backgroundColor: '#fff', borderRadius: 12, width: '48%', overflow: 'hidden', elevation: 3, borderWidth: 1, borderColor: '#f0f0f0' },
  cardImage: { width: '100%', height: 130 },
  cardInfo: { padding: 10 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#2D68A6' },
  cardDetails: { fontSize: 11, color: '#555', marginTop: 4 },
});