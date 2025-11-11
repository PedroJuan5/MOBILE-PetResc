import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

// interface de exemplo
interface PetDetalhado {
  id: string;
  nome: string;
  imagem: any;
  raca: string;
  idade: string;
  local: string;
  descricao: string;
}

export default function PetDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pet, setPet] = useState<PetDetalhado | null>(null);
  const [loading, setLoading] = useState(true);

  // busca os dados do Pet (simulação)
  useEffect(() => {
    if (id) {
      setTimeout(() => {
        setPet({
          id: id,
          nome: `Detalhes do ${id}`, 
          imagem: require('../../../assets/images/pets/caramelo.png'),
          raca: 'SRD',
          idade: '2 anos',
          local: 'Cotia, SP',
          descricao: 'Descrição completa do pet...',
        });
        setLoading(false);
      }, 300);
    }
  }, [id]);

  return (
    <>
      <Stack.Screen
        options={{
          title: pet ? pet.nome : 'Carregando...',
          headerBackTitleVisible: false,
          headerShown: true,
          headerStyle: { backgroundColor: '#005A9C' },
          headerTintColor: '#FFFFFF',
        }}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005A9C" />
        </View>
      )}
      {!loading && !pet && (
        <View style={styles.loadingContainer}>
          <Text>Pet não encontrado.</Text>
        </View>
      )}

      {!loading && pet && (
        <ScrollView style={styles.container}>
          <Image source={pet.imagem} style={styles.image} />
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{pet.nome}</Text>
            <Text style={styles.detail}>{pet.raca}</Text>
            <Text style={styles.detail}>{pet.idade} • {pet.local}</Text>
            <Text style={styles.sectionTitle}>Sobre</Text>
            <Text style={styles.description}>{pet.descricao}</Text>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 350,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#005A9C',
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});