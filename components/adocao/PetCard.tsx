import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Link } from 'expo-router'; // 1. Importamos o componente Link para navegação

// O "contrato" do Pet, garantindo que ele tenha todas as propriedades necessárias
interface Pet {
  id: string;
  name: string;
  breed: string;
  gender: string;
  image: ImageSourcePropType;
  species: string;
  age: string;
  size: string;
}

interface PetCardProps {
  pet: Pet;
}

export const PetCard = ({ pet }: PetCardProps) => (
  // 2. Envolvemos o card com o componente Link
  //    'href' define para onde navegar, usando o ID do pet
  //    'asChild' faz com que o Link passe suas propriedades de clique para o TouchableOpacity
  <Link href={`/pets/${pet.id}`} asChild>
    <TouchableOpacity style={styles.card}>
      <Image source={pet.image} style={styles.image} />
      <Text style={styles.name}>{pet.name}</Text>
      <Text style={styles.info}>{`${pet.breed} ${pet.gender}`}</Text>
    </TouchableOpacity>
  </Link>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#E6F0FA',
    borderRadius: 15,
    overflow: 'hidden',
    alignItems: 'flex-start',
    // Adicionando uma pequena sombra para destaque
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D68A6',
    marginTop: 8,
    marginLeft: 10,
  },
  info: {
    fontSize: 12,
    color: '#3A5C7A',
    marginLeft: 10,
    marginBottom: 10,
  },
});