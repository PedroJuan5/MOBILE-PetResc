import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';

interface Pet {
  id: string;
  nome: string;
  raca: string;
  genero: string;
  imagem: ImageSourcePropType;
  especie: string;
  idade: string;
  tamanho: string;
}

interface PetCardProps {
  pet: Pet;
}

export const PetCard = ({ pet }: PetCardProps) => (
  <TouchableOpacity style={styles.card}>
    <Image source={pet.imagem} style={styles.imagem} />
    <Text style={styles.name}>{pet.nome}</Text>
    <Text style={styles.info}>{`${pet.raca} ${pet.genero}`}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#E6F0FA',
    borderRadius: 15,
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  imagem: {
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