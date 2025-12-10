import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar,Dimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, Stack, useNavigation } from 'expo-router'; // 1. Importe useNavigation

const { width } = Dimensions.get('window');

const VOLUNTARIOS = [
  { id: '0001', nome: '' }, 
  { id: '0011', nome: '' },
  { id: '0111', nome: '' },
  { id: '1111', nome: '' },
  { id: '1112', nome: '' },
  { id: '1122', nome: '' },
  { id: '1222', nome: '' },
  { id: '2222', nome: '' },
  { id: '2223', nome: '' },
];

export default function VoluntariosLarTemporarioScreen() {
  const router = useRouter();
  const navigation = useNavigation(); // 2. Instancie a navegação nativa
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const renderRow = (item: { id: string; nome: string }, index: number) => {
    const isEven = index % 2 === 0; 
    const rowColor = isEven ? '#FFF' : '#E6E6E6'; 
    const isSelected = selectedIds.includes(item.id);

    return (
      <TouchableOpacity 
        key={item.id} 
        style={[styles.rowItem, { backgroundColor: rowColor }]}
        activeOpacity={0.8}
        onPress={() => toggleSelection(item.id)}
      >
        <Ionicons 
          name={isSelected ? "checkbox" : "square-outline"} 
          size={24} 
          color="#8899A6" 
          style={{ marginRight: 15 }}
        />
        <Text style={styles.cellTextId}>{item.id}</Text>
        <Text style={styles.cellTextNome}>{item.nome}</Text> 
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      <Stack.Screen options={{ headerShown: false }} />
      
      {/*PARTE SUPERIOR (BRANCA)*/}
      <SafeAreaView edges={['top']} style={styles.whiteHeader}>
        
        {/* Header de Navegação */}
        <View style={styles.navBar}>
          
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#2D68A6" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push('/(ong)/notificacao-ong' as any)}>
             <View>
                <Ionicons name="notifications" size={24} color="#5D8AB5" />
                <View style={styles.notificationDot} />
             </View>
          </TouchableOpacity>
        </View>

        {/* Título e Patinhas */}
        <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>Voluntários para Lar{'\n'}temporário</Text>
            
            <FontAwesome5 name="paw" size={24} color="#B4CDE3" style={[styles.paw, {top: -40, right: 60}]} />
            <FontAwesome5 name="paw" size={20} color="#B4CDE3" style={[styles.paw, {top: 0, right: 10}]} />
            <FontAwesome5 name="paw" size={22} color="#B4CDE3" style={[styles.paw, {bottom: -10, left: '60%'}]} />
        </View>
      </SafeAreaView>

      {/*PARTE INFERIOR (AZUL)*/}
      <View style={styles.blueBody}>
        
        <Text style={styles.subtitle}>
            Acompanhe todos os voluntários e{'\n'}seus formulários
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
            
            {/* CABEÇALHO DA TABELA */}
            <View style={[styles.rowItem, styles.tableHeader]}>
                <Ionicons name="square-outline" size={24} color="#8899A6" style={{ marginRight: 15 }} />
                <View style={styles.headerSeparator}>
                    <Text style={styles.headerTextId}>ID</Text>
                </View>
                <Text style={styles.headerTextNome}>Nome</Text>
            </View>

            {/* LISTA DE VOLUNTÁRIOS */}
            {VOLUNTARIOS.map((item, index) => renderRow(item, index))}

            <View style={{height: 40}} />
        </ScrollView>

        <FontAwesome5 name="paw" size={100} color="rgba(255,255,255,0.05)" style={styles.bigPaw} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  
  whiteHeader: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B', 
  },
  titleContainer: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '400', 
    color: '#2D68A6',
    lineHeight: 34,
  },
  paw: {
    position: 'absolute',
    opacity: 0.6,
    transform: [{ rotate: '25deg' }]
  },

  blueBody: {
    flex: 1,
    backgroundColor: '#2D68A6',
    paddingTop: 20,
    width: '100%',
  },
  subtitle: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12, 
    marginBottom: 10, 
    height: 50,
  },
  
  tableHeader: {
    backgroundColor: '#E6E6E6', 
    marginBottom: 10,
  },
  headerSeparator: {
    borderRightWidth: 1,
    borderRightColor: '#CCC',
    paddingRight: 10,
    marginRight: 10,
  },
  headerTextId: {
    fontSize: 16,
    color: '#5D8AB5', 
    fontWeight: 'bold',
  },
  headerTextNome: {
    fontSize: 16,
    color: '#5D8AB5',
    fontWeight: 'normal',
  },

  cellTextId: {
    fontSize: 16,
    color: '#5D8AB5',
    fontWeight: 'bold',
    width: 60, 
  },
  cellTextNome: {
    fontSize: 16,
    color: '#5D8AB5',
    flex: 1,
  },

  bigPaw: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    transform: [{ rotate: '-20deg' }]
  }
});