import { Stack } from "expo-router";
import { StrictMode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from 'react-native';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Using UNSAFE_componentWillUpdate',
  'Using UNSAFE_componentWillReceiveProps',
  'Using UNSAFE_componentWillMount',
]);

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "MoreSugar": require("../assets/fonts/MoreSugar-Regular.otf"),
  });

  if (!loaded && !error) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#2D68A6"/>
      </View>
    );
  }

  return (
    <StrictMode>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Index: Tela de Entrada/Splash */}
          <Stack.Screen name="index" />

          {/* (auth): Login e Cadastro */}
          <Stack.Screen name="(auth)" />

          {/* (app): Toda a área logada (Protegida) */}
          <Stack.Screen name="(app)" />
        </Stack>
      </AuthProvider>
    </StrictMode>
  );
}