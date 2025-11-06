import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AlterarSenhaScreen() {
	return (
		<>
			<Stack.Screen options={{ title: 'Segurança', headerShown: true }} />
			<SafeAreaView style={styles.container}>
				<View style={styles.content}>
					<Text style={styles.title}>Alterar senha</Text>
					<TextInput placeholder="Senha atual" secureTextEntry style={styles.input} />
					<TextInput placeholder="Nova senha" secureTextEntry style={styles.input} />
					<TextInput placeholder="Confirmar nova senha" secureTextEntry style={styles.input} />
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
           color: '#3A5C7A', marginBottom: 20
         },
	input: { 
        color: '#000000ff',
        borderWidth: 1.4, 
        borderColor: '#3A5C7A',
         borderRadius: 10,
          padding: 12,
           marginBottom: 30 },
	button: {
         backgroundColor: '#225d9bff', 
         padding: 12,
          borderRadius: 10,
           alignItems: 'center',
            marginTop:   400  
        },
	buttonText: {
         color: '#fff',
          fontWeight: '600' 
        },
});
