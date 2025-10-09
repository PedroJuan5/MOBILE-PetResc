// Arquivo: app/(app)/_layout.tsx
import React, { useState } from "react"; // 1. Importe o useState
import { Stack } from 'expo-router/stack';
import { useAuth } from '../../context/AuthContext';
import CustomHeaderLeft from "../../components/elementosEsquerda";
import CustomHeaderRight from "../../components/elementosDireita";

// 2. Importe o seu Modal de Denúncia
import { DenuncieModal } from "../../components/denuncieModal"; 

export default function AppLayout() {
  const { session } = useAuth();
  
  // 3. Crie o estado para controlar a visibilidade do modal
  const [isModalVisible, setModalVisible] = useState(false);

  if (!session) return null;

  return (
    <>
      {/* 4. Renderize o Modal aqui, ele ficará "escondido" até ser ativado */}
      <DenuncieModal visible={isModalVisible} onClose={() => setModalVisible(false)} />

      <Stack
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#F6FBFF" },
          headerTintColor: "#2D68A6",
        }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            title: "Início",
            headerShown: true,
            // 5. Passe a função para abrir o modal para o componente do cabeçalho
            headerLeft: () => <CustomHeaderLeft onDenunciePress={() => setModalVisible(true)} />,
            headerRight: () => <CustomHeaderRight />,
          }}
        />
        {/* O resto das suas telas continua igual */}
        <Stack.Screen name="perfil" options={{ title: "Meu Perfil", presentation: 'modal' }} />
        <Stack.Screen name="notificacoes" options={{ title: "Notificação" }} />
      </Stack>
    </>
  );
}