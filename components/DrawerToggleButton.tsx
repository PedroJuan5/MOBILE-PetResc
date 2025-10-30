import React from "react";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

interface Props {
  style?: StyleProp<ViewStyle>;
}

export default function DrawerToggleButton({ style }: Props) {
  const router = useRouter();

  const handlePress = () => {
    router.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={style}
      accessibilityLabel="Abrir menu"
    >
      <Ionicons name="menu" size={26} color="#2D68A6" />
    </TouchableOpacity>
  );
}