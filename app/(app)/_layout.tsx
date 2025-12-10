import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function AppGroupLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/");
      return;
    }

    // Verifica onde o usuário está
    const inOngGroup = segments.some(s => s === '(ong)');
    const inTabsGroup = segments.some(s => s === '(tabs)');

    // === CENÁRIO 1: É UMA ONG ===
    if (user.role === "ONG") {
      // ONG só pode ficar dentro da pasta (ong)
      if (!inOngGroup) {
        router.replace("/home-ong"); 
      }
    } 
    
    // === CENÁRIO 2: É USUÁRIO COMUM ===
    else {
      // Usuário Comum NÃO pode entrar na pasta (ong).
      // Mas pode estar em (tabs) OU em qualquer tela solta na raiz de (app).
      
      if (inOngGroup) {
        // Se tentar entrar na área da ONG, chuta pra Home
        router.replace("/home");
      }
      
      // REMOVIDO: if (!inTabsGroup) ... 
      // Não forçamos mais ele a ficar só nas abas, assim ele consegue abrir Configurações.
    }
  }, [isLoading, user, segments]);

  if (isLoading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#2D68A6"/>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Rotas de Usuário Comum */}
      <Stack.Screen name="(tabs)" />
      
      {/* Rotas de ONG */}
      <Stack.Screen name="(ong)" />

      {/* --- IMPORTANTE: Registe suas telas soltas aqui --- */}
      <Stack.Screen 
        name="menu-configuracoes" 
        options={{ headerShown: true, title: "Configurações" }} 
      />
      
      <Stack.Screen name="meus-dados" />
      <Stack.Screen name="seguranca" />
      <Stack.Screen name="formulario-interesse" />
      <Stack.Screen name="pet/[id]" />
      <Stack.Screen name="formulario-voluntarios" />
      
      <Stack.Screen 
        name="HistoricoSolicitacoes" 
        options={{ headerShown: true, title: "Histórico" }} 
      />
      <Stack.Screen 
        name="notificacoes" 
        options={{ headerShown: true, title: "Notificações" }} 
      />
      <Stack.Screen 
        name="AlterarSenha-ong" 
        options={{ headerShown: true, title: "Alterar Senha" }} 
      />
    </Stack>
  );
}