import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AlterarSenhaScreen() {
    // Estados para controlar a visibilidade de cada campo individualmente
    const [secureAtual, setSecureAtual] = useState(true);
    const [secureNova, setSecureNova] = useState(true);
    const [secureConfirmar, setSecureConfirmar] = useState(true);

    return (
        <>
            <Stack.Screen options={{ title: 'Segurança', headerShown: true }} />
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Alterar senha</Text>

                    {/* Senha Atual */}
                    <View style={styles.inputContainer}>
                        <TextInput 
                            placeholder="Senha atual" 
                            secureTextEntry={secureAtual} 
                            style={styles.inputField} 
                            placeholderTextColor="#999"
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
                        />
                        <TouchableOpacity onPress={() => setSecureConfirmar(!secureConfirmar)}>
                            <Ionicons name={secureConfirmar ? "eye-off-outline" : "eye-outline"} size={24} color="#3A5C7A" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button} accessibilityRole="button">
                        <Text style={styles.buttonText}>Finalizar</Text>
                    </TouchableOpacity>
                </View>
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
        paddingTop: 40
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
        marginTop: 400
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600'
    },
});