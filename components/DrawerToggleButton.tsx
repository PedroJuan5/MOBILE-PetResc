import React from "react";
import { TouchableOpacity, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

interface Props {
  style?: StyleProp<ViewStyle>;
}

export default function DrawerToggleButton({ style }: Props) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      // Adicionei um estilo padrão para garantir o espaçamento
      style={[styles.button, style]} 
      accessibilityLabel="Abrir menu"
    >
      <Ionicons name="menu" size={26} color="#2D68A6" />
    </TouchableOpacity>
  );
}

// Estilo padrão para o botão
const styles = StyleSheet.create({
  button: {
    marginLeft: 15,
  },
});