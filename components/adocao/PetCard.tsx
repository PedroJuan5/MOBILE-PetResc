import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Link } from 'expo-router';

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

interface PetCardProps { pet: Pet;
}

export const PetCard = ({ pet }: PetCardProps) => (
<Link href={`/pets/${pet.id}`} asChild>
<TouchableOpacity style={styles.card}>
<Image source={pet.imagem} style={styles.image} />
<Text style={styles.name}>{pet.nome}</Text>
<Text style={styles.info}>{`${pet.raca} ${pet.genero}`}</Text>
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