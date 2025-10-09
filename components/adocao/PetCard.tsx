import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';

interface Pet {
  id: string;
  name: string;
  breed: string;
  gender: string;
  image: ImageSourcePropType;
}

interface PetCardProps {
  pet: Pet;
}

export const PetCard = ({ pet }: PetCardProps) => (
  <TouchableOpacity style={styles.card}>
    <Image source={pet.image} style={styles.image} />
    <Text style={styles.name}>{pet.name}</Text>
    <Text style={styles.info}>{`${pet.breed} ${pet.gender}`}</Text>
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
  image: {
    width: '100%',
    height: 120,
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