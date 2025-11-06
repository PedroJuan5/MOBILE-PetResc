// app/(app)/pet/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
// Importe o Stack e o useLocalSearchParams
import { Stack, useLocalSearchParams } from 'expo-router';

// Um tipo de exemplo para os detalhes do pet
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
  // 1. Pega o 'id' que veio da URL (ex: /pet/1)
  const { id } = useLocalSearchParams<{ id: string }>();

  const [pet, setPet] = useState<PetDetalhado | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Busca os dados do Pet
  useEffect(() => {
    if (id) {
      console.log('Buscando dados para o pet com ID:', id);
      // --- LÓGICA DE BUSCA DE DADOS ---
      // Aqui você buscaria os dados do pet na sua API usando o 'id'

      // Vamos simular uma busca por enquanto:
      setTimeout(() => {
        // Simula que encontrou o pet
        setPet({
          id: id,
          nome: `Nome do Pet ${id}`,
          // Ajuste o caminho do 'require' se necessário
          imagem: require('../../../assets/images/pets/caramelo.png'),
          raca: 'SRD (Sem Raça Definida)',
          idade: '2 anos',
          local: 'Cotia, SP',
          descricao:
            'Este é um pet muito amigável e brincalhão, resgatado das ruas e agora procurando um lar amoroso. Ele adora passear e é ótimo com crianças.',
        });
        setLoading(false);
      }, 300);
    }
  }, [id]);

  // --- CORREÇÃO AQUI (Início) ---

  // 1. Se estiver carregando, mostre o "loading" e não continue.
  // O componente <Stack.Screen> NÃO será renderizado.
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005A9C" />
      </View>
    );
  }

  // 2. Se não estiver carregando E o pet não foi encontrado (ainda é null)
  // mostre um erro e não continue.
  if (!pet) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Pet não encontrado.</Text>
      </View>
    );
  }

  // 3. Se o código chegou até aqui, significa que:
  //    - loading = false
  //    - pet = NÃO é null (tem os dados do pet)
  //
  // Agora é 100% seguro renderizar o <Stack.Screen> e ler "pet.nome".
  
  // --- CORREÇÃO AQUI (Fim) ---

  return (
    <>
      {/* Esta linha agora é segura e não vai mais dar erro */}
      <Stack.Screen options={{ title: pet.nome, headerBackTitleVisible: false }} />

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
    backgroundColor: '#FFFFFF', // Adicionado fundo branco
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