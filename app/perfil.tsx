import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PerfilScreen() {
    return (
        <SafeAreaView>
          <View>
            <Text>Tela de Perfil</Text>
            <Text>Aqui ficarão os outros detalhes</Text>


        <Link href="/">
            <Text>Voltar para home</Text>
        </Link>
          </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create ({
    saferea: {
        flex: 1, 
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 10,
    },
    linkText:{
        color: '#2D68A6',
        fontSize: 16,
    },
});