import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { TouchableOpacity, StyleSheet } from "react-native";

export default function DrawerToggleButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
      <Ionicons name="menu" size={26} color="#2D68A6" style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: {
    paddingHorizontal: 15,
  },
});