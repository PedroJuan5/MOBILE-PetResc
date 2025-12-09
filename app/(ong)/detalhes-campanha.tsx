import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions,StatusBar} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function DetalhesCampanhaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  //valores padrão caso venha vazio
  const nome = params.nome || "Campanha de Arrecadação";
  const meta = params.meta || "18.000";
  const descricao = params.descricao || "Milhares de animais vivem com frio, fome e medo. Precisamos da sua ajuda para mudar essa realidade.";
  const imagem = params.imagem;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4F8" />
      
      {/* Header com botão voltar */}
      <SafeAreaView style={styles.headerSafe} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#2D68A6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Campanha</Text>
          <View style={{width: 24}}/>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1}}>
        
        {/*topo azul*/}
        <View style={styles.blueSection}>
           <Text style={styles.mainTitle}>{nome}</Text>
           
           {/* Patinhas decorativas */}
           <Ionicons name="paw" size={30} color="rgba(255,255,255,0.2)" style={{position:'absolute', top: 20, right: 40}} />
           <Ionicons name="paw" size={20} color="rgba(255,255,255,0.2)" style={{position:'absolute', top: 60, right: 20}} />
           <Ionicons name="paw" size={25} color="rgba(255,255,255,0.2)" style={{position:'absolute', bottom: 100, left: 20}} />

           {/*card da Imagem ou Texto*/}
           {imagem ? (
             <Image source={{ uri: imagem as string }} style={styles.campaignImage} />
           ) : (
             <View style={styles.whiteCard}>
                <Text style={styles.cardTitle}>Você já imaginou como é a vida de um animal abandonado?</Text>
                <Text style={styles.cardText}>{descricao}</Text>
             </View>
           )}

           {/*Meta e Lista*/}
           <View style={{marginTop: 30, paddingBottom: 20}}>
                <Text style={styles.metaTitle}>Alimente uma vida! - Meta: R$ {meta}</Text>
                <Text style={styles.metaSub}>Com esse valor, poderemos garantir:</Text>

                <View style={styles.listContainer}>
                    <View style={styles.listItem}>
                        <MaterialCommunityIcons name="food-drumstick" size={20} color="#FFF" style={{marginRight: 10}} />
                        <Text style={styles.listText}>Ração por 30 dias</Text>
                    </View>
                    <View style={styles.listItem}>
                        <FontAwesome5 name="hospital-alt" size={18} color="#FFF" style={{marginRight: 10}} />
                        <Text style={styles.listText}>Tratamentos urgentes</Text>
                    </View>
                    <View style={styles.listItem}>
                        <FontAwesome5 name="syringe" size={18} color="#FFF" style={{marginRight: 10}} />
                        <Text style={styles.listText}>Vacinas e vermífugos</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons name="cut-outline" size={20} color="#FFF" style={{marginRight: 10}} />
                        <Text style={styles.listText}>Castrações mensais</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons name="home-outline" size={20} color="#FFF" style={{marginRight: 10}} />
                        <Text style={styles.listText}>Manutenção do abrigo</Text>
                    </View>
                </View>
           </View>
        </View>

        {/*Dados Bancário*/}
        <View style={styles.whiteSection}>
            <Text style={styles.sectionTitle}>Formas de doação</Text>
            
            <View style={styles.bankInfo}>
                <Text style={styles.bankText}><Text style={{fontWeight:'bold', color: '#2D68A6'}}>PIX (chave aleatória):</Text> nomedaong@ong.com</Text>
                <Text style={styles.bankText}><Text style={{fontWeight:'bold', color: '#2D68A6'}}>Transferência:</Text> Banco: 000 - Banco do Bem</Text>
                <Text style={styles.bankText}>Agência: 1234   Conta: 000000-0</Text>
                <Text style={styles.bankText}><Text style={{fontWeight:'bold', color: '#2D68A6'}}>Nome:</Text> Nome da ONG</Text>
                <Text style={styles.bankText}><Text style={{fontWeight:'bold', color: '#2D68A6'}}>Vakinha:</Text> (Link da vakinha)</Text>
            </View>

            <View style={{marginTop: 25}}>
                <Text style={styles.pontosTitle}>Doação de ração:</Text>
                <Text style={[styles.pontosTitle, {fontSize: 14, fontWeight:'normal', marginTop:0, marginBottom:5}]}>Pontos de coleta:</Text>
                <Text style={styles.pointText}>• Pet Shop Amigo Animal - Centro</Text>
                <Text style={styles.pointText}>• Clínica Saúde Pet - Bairro Sul</Text>
                <Text style={styles.pointText}>• Mercado Bom Sabor - Bairro Norte</Text>
            </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  headerSafe: { backgroundColor: '#F0F4F8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D68A6' },
  backBtn: { padding: 5 },
  blueSection: {
    backgroundColor: '#2D68A6',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
    width: '90%',
  },
  whiteCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  campaignImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2D68A6',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    textAlign: 'center',
  },
  metaTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  metaSub: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    alignSelf: 'center',
    width: '95%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listText: {
    color: '#FFF',
    fontSize: 14,
  },
  whiteSection: {
    backgroundColor: '#FFF',
    flex: 1, 
    padding: 25,
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    marginTop: -20, 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D68A6',
    marginBottom: 15,
  },
  bankInfo: {
    backgroundColor: '#F9F9F9', 
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
  },
  bankText: {
    fontSize: 14,
    color: '#333', 
    marginBottom: 8,
    lineHeight: 20,
  },
  pontosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D68A6',
    marginTop: 5,
    marginBottom: 5,
  },
  pointText: {
    fontSize: 14,
    color: '#2D68A6', 
    marginLeft: 10,
    marginBottom: 4,
    fontWeight: '500',
  },
});