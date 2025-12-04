import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width - 40;

export default function HomeScreen(): React.ReactElement {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="home-outline" size={24} color="#1A3C6E" />
        <Ionicons name="notifications-outline" size={24} color="#1A3C6E" />
      </View>

      {/* FOTO + NOME ONG */}
      <View style={styles.cardOng}>
        <Image
          source={require("../../../assets/images/ui/institutoCaramelo.png")}
          style={styles.ongImage}
        />
        <View style={styles.ongProfileCircle} />
      </View>

      <Text style={styles.ongName}>Nome da ONG</Text>

      {/* CONTATO E LOCAL */}
      <View style={styles.infoRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Contato</Text>
          <Text style={styles.infoText}>username@gmail.com</Text>
          <Text style={styles.infoText}>11 96584 2214</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Localização</Text>
          <Text style={styles.infoText}>SP, Brasil</Text>
        </View>
      </View>

      {/* BOTÕES */}
       <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.buttonsScrollView}
            >
              <TouchableOpacity style={styles.btn} onPress={() => router.push("/perfil-ong")}>
                <Text style={styles.btnText}>Adotados</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.btn} onPress={() => router.push("/registrados")}>
                <Text style={styles.btnText}>Registrados</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => router.push("/lar-temporario")}>
                <Text style={styles.btnText}>Lar Temporario</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => router.push("/doacoes-ong")}>
                <Text style={styles.btnText}>Doações</Text>
              </TouchableOpacity>
            </ScrollView>
      

      {/* CARD PET */}
      <View style={styles.petCard}>
        <Image
          source={require("../../../assets/images/pets/branquinho.png")}
          style={styles.petImg}
        />
        <View style={styles.petInfo}>
          <Text style={styles.petName}>Nome</Text>
          <Text style={styles.petSub}>Sem raça definida (SRD) - AD</Text>
          <Text style={styles.petDetails}>
            Adotado em 00/00/0000 {"\n"}
            Status: Visita Agendada
          </Text>

          <TouchableOpacity style={styles.infoButton} onPress={() => router.push("/detalhes-pet-ong")}>
            <Text style={styles.infoButtonText}>Ver informações</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* GRÁFICO 6 MESES */}
      <Text style={styles.graphTitle}>Processos de adoção (6 meses)</Text>

   <View style={styles.chartCard}>
  <BarChart
    data={{
      labels: ["Mai", "Jun", "Jul", "Ago", "Set", "Out"],
      datasets: [{ data: [23, 12, 25, 16, 22, 7] }]
    }}
    width={screenWidth}
    height={220}
    yAxisLabel=""  // <--- ADICIONE ESTA LINHA
    yAxisSuffix="" // <--- ADICIONE ESTA LINHA
    fromZero
    chartConfig={{
      backgroundGradientFrom: "#fff",
      backgroundGradientTo: "#fff",
      decimalPlaces: 0,
      color: () => "#1A3C6E",
      labelColor: () => "#1A3C6E",
      barPercentage: 0.55,
    }}
    style={{ borderRadius: 12 }}
  />
</View>

      {/* GRÁFICO 1 SEMANA */}
      <Text style={styles.graphTitle}>Processos de adoção (1 semana) - (05/10 - 11/10)</Text>

      <View style={styles.chartCard}>
        <LineChart

          data={{
            labels: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
            datasets: [{ data: [1, 2, 1, 1, 2, 3, 2] }]
          }}
          width={screenWidth} 
          height={250}
          fromZero
          bezier
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: () => "#1A3C6E",
            labelColor: () => "#1A3C6E",
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#1A3C6E"
            },
          }}
          style={{ borderRadius: 12 }}
        />
      </View>

      {/* ESTATÍSTICAS SIMPLES */}
      <Text style={styles.graphTitle}>Estatísticas (6 meses)</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Adotados</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>18</Text>
          <Text style={styles.statLabel}>Em processo</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>7</Text>
          <Text style={styles.statLabel}>Aguardando</Text>
        </View>
      </View>

      {/* FOOTER */}
      <View style={{ alignItems: "flex-end", marginTop: 20, marginBottom: 40 }}>
        <Ionicons name="settings-outline" size={28} color="#1A3C6E" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    padding: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  cardOng: {
    width: "100%",
    height: 140,
    backgroundColor: "#CCE1FF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    
  },

  ongImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    opacity: 0.5,
    
  },

  ongProfileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1A3C6E",
    position: "absolute",
    top: 100,
  },

  ongName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A3C6E",
    marginTop: 45,
    marginBottom: 15,
    textAlign: "center",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
    
    
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A3C6E",
    marginBottom: 5,
    
  },

  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
    
  },

  buttonsScrollView: {
    marginBottom: 20,
  },

  btn: {
    minWidth: 140,
    backgroundColor: "#87b0ceff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },

  btnText: {
    color: "#1A3C6E",
    fontWeight: "600",
    fontSize: 14,
  },

  petCard: {
    flexDirection: "row",
    backgroundColor: "#87b0ceff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    gap: 15,
    elevation: 2,
  },

  petImg: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },

  petInfo: {
    flex: 1,
    justifyContent: "space-between",
  },

  petName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3C6E",
  },

  petSub: {
    fontSize: 14,
    color: "#1A3C6E",
    marginTop: 2,
    fontWeight: "semibold"
  },

  petDetails: {
    fontSize: 14,
    color: "#1A3C6E",
    marginTop: 5,
  },

  infoButton: {
  
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-end",
    marginTop: 8,
  },

  infoButtonText: {
    color: "#1A3C6E",
    fontWeight: "600",
    fontSize: 12,
  },

  graphTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3C6E",
    marginBottom: 10,
    marginTop: 10,
  },

  chartCard: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 25,
    elevation: 2,
    alignItems: "center",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    elevation: 2,
  },

  statItem: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A3C6E",
  },

  statLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
});
