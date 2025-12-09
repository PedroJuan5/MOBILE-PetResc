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
  ScrollView // <--- Adicionado para permitir rolar até o botão
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/axios';

export default function AlterarSenhaScreen() {
    const router = useRouter();

    const [secureAtual, setSecureAtual] = useState(true);
    const [secureNova, setSecureNova] = useState(true);
    const [secureConfirmar, setSecureConfirmar] = useState(true);

    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    
    const [loading, setLoading] = useState(false);

    // FUNÇÃO QUE ENVIA A SENHA
    const handleAlterarSenha = async () => {
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        if (novaSenha.length < 6) {
            Alert.alert("Erro", "A nova senha deve ter pelo menos 6 caracteres.");
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

            Alert.alert("Sucesso", "Senha alterada com sucesso!", [
                { text: "OK", onPress: () => router.back() }
            ]);

        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || "Erro ao alterar a senha.";
            Alert.alert("Erro", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Segurança', headerShown: true }} />
            <SafeAreaView style={styles.container}>
                {/* Troquei View por ScrollView para o botão não sumir da tela */}
                <ScrollView contentContainerStyle={styles.content}>
                    
                    <Text style={styles.title}>Alterar senha</Text>

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
                            <Ionicons name={secureAtual ? "eye-off-outline" : "eye-outline"} size={24} color="#3A5C7A" />
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
                            <Ionicons name={secureNova ? "eye-off-outline" : "eye-outline"} size={24} color="#3A5C7A" />
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
                            <Ionicons name={secureConfirmar ? "eye-off-outline" : "eye-outline"} size={24} color="#3A5C7A" />
                        </TouchableOpacity>
                    </View>

                    {/* ESTE É O BOTÃO QUE ENVIA */}
                    <TouchableOpacity 
                        style={styles.button} 
                        accessibilityRole="button"
                        onPress={handleAlterarSenha} // <--- A AÇÃO ESTÁ AQUI
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Finalizar</Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    content: {
        padding: 20,
        paddingTop: 40,
        flexGrow: 1 // Garante que o scroll ocupe a tela toda
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#3A5C7A',
        marginBottom: 20
    },
    inputContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        borderWidth: 1.4,
        borderColor: '#3A5C7A',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 30,
        height: 50, 
    },
    inputField: {
        flex: 1,
        color: '#000000ff',
        height: '100%',
    },
    button: {
        backgroundColor: '#225d9bff',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 350, // Reduzi levemente de 400 para 350 para caber em mais telas, mas mantém o visual "lá embaixo"
        marginBottom: 40 // Margem inferior para segurança
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600'
    },
});