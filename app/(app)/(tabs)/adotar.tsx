import React, { useState, useLayoutEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

//importe os componentes que criamos
import { PetCard } from '../../../components/adocao/PetCard';
import { FiltrosModal } from '../../../components/adocao/FiltrosModal';

//Dados de exemplo
const DADOS_PETS = [
  { id: "1", name: "Branquinho", breed: "Sem raça definida (SRD)", gender: "AD.", image: require("../../../assets/Amarula.png") },
  { id: "2", name: "Frajola", breed: "Sem raça definida (SRD)", gender: "FI.", image: require("../../../assets/caramelo.png") },
  { id: "3", name: "Zeus", breed: "Pitbull", gender: "FI.", image: require("../../../assets/django.png") },
  { id: "4", name: "Paçoca", breed: "Não informado", gender: "AD.", image: require("../../../assets/jimjim.png") },
  { id: "5", name: "Neauinho", breed: "Sem raça definida (SRD)", gender: "AD.", image: require("../../../assets/mel.png") },
  { id: "6", name: "Caramelo", breed: "Sem raça definida (SRD)", gender: "FI.", image: require("../../../assets/pingo.png") },
];

export default function AdotarScreen() {
  const [isFilterVisible, setFilterVisible] = useState(false);
  const navigation = useNavigation();

  //configura o cabeçalho desta tela
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Pets para adoção',
      headerLeft: () => (
        <TouchableOpacity onPress={() => setFilterVisible(true)} style={{ marginLeft: 15 }}>
          <Ionicons name="menu" size={28} color="#2D68A6" />
        </TouchableOpacity>
      ),
      //o headerRight já é configurado no _layout pai
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FiltrosModal visible={isFilterVisible} onClose={() => setFilterVisible(false)} />

      <View style={styles.container}>
        <View style={styles.subHeader}>
          <Text style={styles.subtitle}>Animais em destaque</Text>
          <TouchableOpacity>
            <Ionicons name="swap-horizontal" size={24} color="#2D68A6" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={DADOS_PETS}
          renderItem={({ item }) => <PetCard pet={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 12 },
  subHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8, marginTop: 10, marginBottom: 5 },
  subtitle: { fontSize: 18, fontWeight: '600', color: '#3A5C7A' },
});