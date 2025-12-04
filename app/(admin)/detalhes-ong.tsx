import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar,Image,Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2D68A6',
  secondary: '#5A7A9A',
  bg: '#FFFFFF',
  cardBg: '#DDE8F0',
  yellowBtn: '#FDD835',
  white: '#FFFFFF',
  danger: '#D9534F',
};

export default function DetalhesOngScreen() {
  const router = useRouter();
  
  const [menuVisible, setMenuVisible] = useState(false);

  const handleExcluirPress = () => {
    setMenuVisible(false);
    Alert.alert(
      "Excluir ONG",
      "Tem certeza que deseja excluir a ONG 'Vira Lata é Dez'? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: () => {
            console.log("ONG Excluída");
            router.back(); 
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        onTouchStart={() => setMenuVisible(false)} 
      >
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gerenciar ONGs</Text>
          <TouchableOpacity>
             <Ionicons name="notifications" size={24} color={COLORS.secondary} />
             <View style={styles.badge} />
          </TouchableOpacity>
        </View>

      
        <Text style={styles.pageTitle}>ONG: Vira Lata é Dez</Text>

        {/*card de detalhes*/}
        <View style={styles.detailCard}>
            <Image 
                source={require('../../assets/images/pets/caramelo.png')} 
                style={styles.ongLogo} 
            />

            <View style={styles.rowInfo}>
                <Text style={styles.infoText}>Pets ativos: Cerca de 920 animais.</Text>
                <Text style={styles.statusText}>Status: Ativa</Text>
            </View>

            <Text style={styles.infoText}>Adoção: Em média 30 a 40 animais por mês.</Text>
            <Text style={styles.infoText}>Nome completo: ONG Vira Lata É Dez</Text>
            <Text style={styles.infoText}>CNPJ: 05.551.027/0001-96</Text>
            
            <Text style={styles.infoText}>
                Email: <Text style={styles.linkText}>ongviralataedez@gmail.com</Text>
            </Text>
            
            <Text style={styles.infoText}>
                Endereço: Cobasi Villa Lobos (Rua Manuel Velasco, 90. Vila Leopoldina-SP)
            </Text>
        </View>

       
        <View style={styles.actionsHeader}>
            <Text style={styles.actionsTitle}>Ações administrativas</Text>
            
            {/* menu 3 pontinhos*/}
            <View style={{ position: 'relative', zIndex: 10 }}>
                <TouchableOpacity 
                    onPress={(e) => {
                        e.stopPropagation();
                        setMenuVisible(!menuVisible);
                    }}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                >
                    <MaterialIcons name="more-vert" size={24} color={COLORS.primary} />
                </TouchableOpacity>

                {menuVisible && (
                    <View style={styles.dropdownMenu}>
                        <TouchableOpacity style={styles.menuItem} onPress={handleExcluirPress}>
                            <Text style={styles.menuTextDanger}>Excluir ONG</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>

        
        <View style={styles.buttonsContainer}>
            
            {/*botão de gerenciar pets*/}
            <TouchableOpacity 
                style={styles.btnBlue} 
             onPress={() => router.push('/(admin)/gerenciar-pets-ong' as any)}
            >
                <Text style={styles.btnBlueText}>Gerenciar Pets</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnYellow} onPress={() => console.log('Bloquear')}>
                <Text style={styles.btnYellowText}>Bloquear ONG</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary },
  badge: { position: 'absolute', top: 0, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E91E63' },

  pageTitle: { fontSize: 18, color: COLORS.primary, marginBottom: 15, fontWeight: '500' },

  // Card Principal
  detailCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 20,
    paddingTop: 30,
    marginBottom: 25,
    position: 'relative',
  },
  ongLogo: {
    position: 'absolute',
    top: -20,
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: '#EEE'
  },
  rowInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingRight: 60 
  },
  infoText: { fontSize: 14, color: COLORS.primary, marginBottom: 12, lineHeight: 20 },
  statusText: { fontSize: 14, color: COLORS.primary, fontWeight: 'bold' },
  linkText: { textDecorationLine: 'underline' },

  // Ações
  actionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    zIndex: 10
  },
  actionsTitle: { fontSize: 18, color: COLORS.primary, fontWeight: '500' },

  dropdownMenu: {
    position: 'absolute',
    top: 25,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 5,
    minWidth: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 20
  },
  menuItem: { paddingVertical: 10, paddingHorizontal: 15 },
  menuTextDanger: { color: COLORS.danger, fontWeight: 'bold', fontSize: 14 },

  buttonsContainer: { alignItems: 'flex-start', gap: 15, zIndex: 1 },
  btnBlue: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center'
  },
  btnBlueText: { color: '#FFF', fontWeight: '600' },
  
  btnYellow: {
    backgroundColor: COLORS.yellowBtn,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center'
  },
  btnYellowText: { color: COLORS.primary, fontWeight: '600' },

  footer: { paddingHorizontal: 25, paddingBottom: 20, marginTop: 20 },
});