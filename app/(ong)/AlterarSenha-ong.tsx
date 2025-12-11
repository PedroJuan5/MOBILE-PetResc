import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert, 
  ActivityIndicator,
  ScrollView,
  Modal,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/axios';

const { width } = Dimensions.get('window');

export default function AlterarSenhaScreen() {
    const router = useRouter();

    // Estados dos campos
    const [secureAtual, setSecureAtual] = useState(true);
    const [secureNova, setSecureNova] = useState(true);
    const [secureConfirmar, setSecureConfirmar] = useState(true);

    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); // Estado do Modal

    const handleAlterarSenha = async () => {
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            Alert.alert("Atenção", "Por favor, preencha todos os campos.");
            return;
        }

        if (novaSenha.length < 6) {
            Alert.alert("Senha fraca", "A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            Alert.alert("Erro", "A nova senha e a confirmação não conferem.");
            return;
        }

        setLoading(true);

        try {
            await api.put('/usuarios/me/alterar-senha', {
                senhaAntiga: senhaAtual,
                novaSenha: novaSenha
            });

            // Abre o modal de sucesso em vez do Alert
            setModalVisible(true);

        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || "Erro ao alterar a senha.";
            Alert.alert("Erro", msg);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Esconde o header padrão para usar o nosso personalizado */}
            <Stack.Screen options={{ headerShown: false }} />

            {/* --- HEADER PERSONALIZADO --- */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/seguranca-ong')} style={styles.backButton}>

                    <Ionicons name="arrow-back" size={24} color="#2D68A6" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Segurança</Text>
                <View style={{ width: 24 }} /> {/* Espaço vazio para centralizar o título */}
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                
                <Text style={styles.title}>Alterar senha</Text>
                <Text style={styles.subtitle}>Digite sua senha atual e a nova senha desejada.</Text>

                {/* Senha Atual */}
                <View style={styles.inputContainer}>
                    <TextInput 
                        placeholder="Senha atual" 
                        secureTextEntry={secureAtual} 
                        style={styles.inputField} 
                        placeholderTextColor="#999"
                        value={senhaAtual}
                        onChangeText={setSenhaAtual}
                    />
                    <TouchableOpacity onPress={() => setSecureAtual(!secureAtual)}>
                        <Ionicons name={secureAtual ? "eye-off-outline" : "eye-outline"} size={22} color="#2D68A6" />
                    </TouchableOpacity>
                </View>

                {/* Nova Senha */}
                <View style={styles.inputContainer}>
                    <TextInput 
                        placeholder="Nova senha" 
                        secureTextEntry={secureNova} 
                        style={styles.inputField} 
                        placeholderTextColor="#999"
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                    />
                    <TouchableOpacity onPress={() => setSecureNova(!secureNova)}>
                        <Ionicons name={secureNova ? "eye-off-outline" : "eye-outline"} size={22} color="#2D68A6" />
                    </TouchableOpacity>
                </View>

                {/* Confirmar Senha */}
                <View style={styles.inputContainer}>
                    <TextInput 
                        placeholder="Confirmar nova senha" 
                        secureTextEntry={secureConfirmar} 
                        style={styles.inputField} 
                        placeholderTextColor="#999"
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                    />
                    <TouchableOpacity onPress={() => setSecureConfirmar(!secureConfirmar)}>
                        <Ionicons name={secureConfirmar ? "eye-off-outline" : "eye-outline"} size={22} color="#2D68A6" />
                    </TouchableOpacity>
                </View>

                {/* Espaçador Flexível (Empurra o botão para baixo) */}
                <View style={{ flex: 1 }} />

                {/* BOTÃO */}
                <TouchableOpacity 
                    style={[styles.button, loading && { opacity: 0.7 }]} 
                    onPress={handleAlterarSenha}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Confirmar Alteração</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>

            {/* --- MODAL DE SUCESSO --- */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="checkmark" size={40} color="#FFF" />
                        </View>
                        <Text style={styles.modalTitle}>Senha Alterada!</Text>
                        <Text style={styles.modalText}>Sua senha foi atualizada com sucesso.</Text>
                        
                        <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    // Header Customizado
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D68A6',
    },
    // Conteúdo
    content: {
        padding: 25,
        flexGrow: 1 // Garante que o scroll ocupe a tela toda para o flex funcionar
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D68A6',
        marginTop: 10,
        marginBottom: 5
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30
    },
    inputContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#A0B4CC',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 20,
        height: 55, 
        backgroundColor: '#F7F9FC'
    },
    inputField: {
        flex: 1,
        color: '#333',
        height: '100%',
        fontSize: 16
    },
    button: {
        backgroundColor: '#2D68A6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        elevation: 2
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    // Estilos do Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        width: '85%',
        elevation: 5
    },
    iconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#27AE60',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D68A6',
        marginBottom: 10
    },
    modalText: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20
    },
    modalButton: {
        backgroundColor: '#2D68A6',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center'
    },
    modalButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    }
});