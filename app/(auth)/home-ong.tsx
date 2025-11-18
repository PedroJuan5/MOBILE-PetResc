import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DenuncieModal } from "../../components/denuncieModal";

const HomeScreen = () => {
  const [denuncieVisible, setDenuncieVisible] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      {/* Topo */}
      <View style={styles.header}>
        <View style={styles.icons}>
          <TouchableOpacity
            onPress={() => setDenuncieVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Denunciar"
          >
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#0d549b"
            />
          </TouchableOpacity>
          <Ionicons name="notifications-outline" size={22} color="#0d549b" />
        </View>

        <View>
          <Text style={styles.title}>Conheça seu novo melhor amigo!</Text>
        </View>
      </View>

      <DenuncieModal
        visible={denuncieVisible}
        onClose={() => setDenuncieVisible(false)}
      />

      {/* Pedidos de adoção */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pedidos de Adoção</Text>
        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>
            Pedidos de adoção pendentes: 5
          </Text>

          {/* Card 1 */}
          <View style={styles.card}>
            <Image
              source={{ uri: "https://place-puppy.com/200x200" }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Não possui nome</Text>
              <Text style={styles.cardSubtitle}>
                Sem raça definida (SRD) | AD
              </Text>
              <Text style={styles.cardStatus}>Status: Em tratamento</Text>
            </View>
          </View>

          {/* Card 2 */}
          <View style={styles.card}>
            <Image
              source={{ uri: "https://placekitten.com/200x200" }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Amendoim</Text>
              <Text style={styles.cardSubtitle}>
                Sem raça definida (SRD) | FI
              </Text>
              <Text style={styles.cardStatus}>Status:</Text>
            </View>
          </View>

          <TouchableOpacity>
            <Text style={styles.linkText}>Ver mais</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Animais em lares temporários */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Animais em Lares Temporários</Text>
        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>
            Animais em lares temporários ativos: 6
          </Text>

          {/* Card 1 */}
          <View style={styles.card}>
            <Image
              source={{ uri: "https://place-puppy.com/201x201" }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Não possui nome</Text>
              <Text style={styles.cardSubtitle}>
                Sem raça definida (SRD) | AD
              </Text>
              <Text style={styles.cardStatus}>Status: Em tratamento</Text>
            </View>
          </View>

          {/* Card 2 */}
          <View style={styles.card}>
            <Image
              source={{ uri: "https://placekitten.com/201/201" }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Amendoim</Text>
              <Text style={styles.cardSubtitle}>
                Sem raça definida (SRD) | FI
              </Text>
              <Text style={styles.cardStatus}>Status:</Text>
            </View>
          </View>

          {/* Card 3 */}
          <View style={styles.card}>
            <Image
              source={{ uri: "https://placekitten.com/201/201" }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Amendoim</Text>
              <Text style={styles.cardSubtitle}>
                Sem raça definida (SRD) | FI
              </Text>
              <Text style={styles.cardStatus}>Status:</Text>
            </View>
          </View>

          {/* Card 4 */}
          <View style={styles.card}>
            <Image
              source={{ uri: "https://placekitten.com/201/201" }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Amendoim</Text>
              <Text style={styles.cardSubtitle}>
                Sem raça definida (SRD) | FI
              </Text>
              <Text style={styles.cardStatus}>Status:</Text>
            </View>
          </View>

          <TouchableOpacity>
            <Text style={styles.linkText}>Ver mais</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  title: {
    marginBottom: 20,
    marginTop: 10,
    fontSize: 26,
    fontWeight: "700",
    color: "#2D68A6",
    width: "75%",
  },
  addButton: {
    backgroundColor: "#2b95ffff",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#ffffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  section: {
    marginTop: 20,
    backgroundColor: "#eeeeeeff",
    borderRadius: 10,
    padding: 10,
  },
  sectionTitle: {
    backgroundColor: "#9ac6f5ff",
    textAlign: "center",
    color: "#18395aff",
    fontWeight: "700",
    fontSize: 15,
    borderRadius: 6,
    paddingVertical: 6,
  },
  subSection: {
    backgroundColor: "#eeeeeeff",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  subSectionTitle: {
    color: "#18395aff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#9ac6f5ff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: "600",
    color: "#18395aff",
    fontSize: 14,
  },
  cardSubtitle: {
    color: "#555",
    fontSize: 12,
  },
  cardStatus: {
    color: "#000000ff",
    fontSize: 12,
    marginTop: 4,
  },
  linkText: {
    color: "#0d549b",
    textAlign: "right",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 4,
  },
});

export default HomeScreen;
