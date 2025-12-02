import React, { useState } from 'react';
import {View,Text,StyleSheet,Image, ScrollView, TouchableOpacity,SafeAreaView, Dimensions,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; 

// Dados simulados
const MEUS_PETS = [
  {
    id: '1',
    nome: 'Atlas',
    raca: 'Pitbull puro',
    idade: 'FI.',
    imagem: require('../../../assets/images/pets/zeus.png'), 
  },
  {
    id: '2',
    nome: 'Loretta',
    raca: 'SRD',
    idade: 'FI.',
    imagem: require('../../../assets/images/ui/gatoVoluntario.png'),
  },
  {
    id: '3',
    nome: 'Caramelo',
    raca: 'SRD',
    idade: 'Ad.',
    imagem: require('../../../assets/images/pets/caramelo.png'),
  },
];

export default function PerfilScreen() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState<'perfil' | 'salvos'>('perfil');

  const irParaConfiguracoes = () => {
    router.push('/menu-configuracoes'); 
  };

  // Função para ir para notificações
  const irParaNotificacoes = () => {
    router.push('/notificacoes');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Cabeçalho Superior (Notificação) */}
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={irParaNotificacoes}>
            <Ionicons name="notifications-outline" size={28} color="#2D68A6" />
            <View style={styles.notificacaoDot} />
          </TouchableOpacity>
        </View>

        {/* Banner e Avatar */}
        <View style={styles.perfilHeader}>
          <View style={styles.banner} />
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={50} color="#FFF" />
          </View>
          <Text style={styles.username}>Username</Text>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, abaAtiva === 'perfil' && styles.toggleButtonAtivo]}
            onPress={() => setAbaAtiva('perfil')}
          >
            <Text style={[styles.toggleText, abaAtiva === 'perfil' && styles.toggleTextAtivo]}>
              Meu perfil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, abaAtiva === 'salvos' && styles.toggleButtonAtivo]}
            onPress={() => setAbaAtiva('salvos')}
          >
            <Text style={[styles.toggleText, abaAtiva === 'salvos' && styles.toggleTextAtivo]}>
              Salvos
            </Text>
          </TouchableOpacity>
        </View>

        {abaAtiva === 'perfil' && (
          <>
            {/* Informações de Contato e localizaçao */}
            <View style={styles.infoSection}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoTitle}>Contato</Text>
                <Text style={styles.infoText}>username@gmail.com</Text>
                <Text style={styles.infoText}>11 96584 2214</Text>
              </View>

              <View style={styles.infoColumnDireita}>
                <Text style={styles.infoTitle}>Localização</Text>
                <Text style={styles.infoText}>SP, Brasil</Text>
              </View>
            </View>

            {/* Seção Meus Pets */}
            <View style={styles.petsSection}>
              <View style={styles.petsHeader}>
                <Text style={styles.petsTitle}>Meus pets</Text>

              </View>

              <View style={styles.petsGrid}>
                {MEUS_PETS.map((pet) => (
                  <View key={pet.id} style={styles.petCard}>
                    <Image source={pet.imagem} style={styles.petImage} resizeMode="cover" />
                    <View style={styles.petInfo}>
                      <View style={styles.petHeaderInfo}>
                        <Text style={styles.petName}>{pet.nome}</Text>
                        <Text style={styles.petAge}>{pet.idade}</Text>
                      </View>
                      <View style={styles.petFooterInfo}>
                        <Text style={styles.petBreed}>{pet.raca}</Text>
                        <TouchableOpacity>
                           <Ionicons name="heart" size={16} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {abaAtiva === 'salvos' && (
           <View style={{ padding: 40, alignItems: 'center' }}>
             <Text style={{ color: '#3A5C7A' }}>Seus pets favoritos aparecerão aqui.</Text>
           </View>
        )}

      </ScrollView>

      {/* Botão flutuante de Configuraçao */}
      <TouchableOpacity style={styles.settingsButton} onPress={irParaConfiguracoes}>
        <Ionicons name="settings-outline" size={26} color="#2D68A6" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 80, 
  },
  headerTop: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 40, 
    marginBottom: 10, 
  },
  notificacaoDot: {
    position: 'absolute',
    top: 2,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  perfilHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  banner: {
    width: '90%',
    height: 120,
    backgroundColor: '#BFE1F7', 
    borderRadius: 20,
    marginTop: 10,
  },
  avatarContainer: {
    marginTop: -50, 
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2D68A6', 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF', 
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D68A6',
    marginTop: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'transparent', 
  },
  toggleButtonAtivo: {
    backgroundColor: '#E6F0FA', 
    borderColor: '#BFE1F7',
  },
  toggleText: {
    fontSize: 16,
    color: '#A0A0A0',
    fontWeight: '500',
  },
  toggleTextAtivo: {
    color: '#2D68A6',
    fontWeight: 'bold',
  },
  infoSection: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoColumn: {
    flex: 2,
  },
  infoColumnDireita: {
    flex: 1,
    alignItems: 'flex-end', 
  },
  infoTitle: {
    fontSize: 16,
    color: '#2D68A6',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#555', 
    marginBottom: 2,
  },
  petsSection: {
    paddingHorizontal: 20,
  },
  petsHeader: {
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  petsTitle: {
    fontSize: 18,
    color: '#2D68A6',
    fontWeight: 'bold',
  },
  petsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  petCard: {
    width: cardWidth,
    backgroundColor: '#F7F9FC', 
    borderRadius: 15,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  petImage: {
    width: '100%',
    height: 110,
    borderRadius: 10,
    marginBottom: 8,
  },
  petInfo: {
    paddingHorizontal: 2,
  },
  petHeaderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  petName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2D68A6',
  },
  petAge: {
    fontSize: 12,
    color: '#2D68A6',
    fontWeight: 'bold',
  },
  petFooterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petBreed: {
    fontSize: 12,
    color: '#666',
    maxWidth: '80%', 
  },
  settingsButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
});