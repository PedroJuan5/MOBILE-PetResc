import React from "react";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";

interface Props {
  style?: StyleProp<ViewStyle>;
}

export default function DrawerToggleButton({ style }: Props) {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={style}
      accessibilityLabel="Abrir menu"
    >
      <FontAwesome5 name="bars" size={24} color="#2D68A6" />
    </TouchableOpacity>
  );
}
