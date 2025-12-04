import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width - 40;

export default function RegistradosScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={26} color="#1A3C6E" />
   
        <Ionicons name="settings-outline" size={24} color="#1A3C6E" />
      </View>

      {/* BANNER DA ONG */}
      <View style={styles.cardOng}>
        <Image
          source={require("../../assets/images/ui/institutoCaramelo.png")}
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
       
      {/* CARD DE PET */}
      <View style={styles.petCard}>
      <Image
  source={require("../../assets/images/pets/branquinho.png")}
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
            

      {/* ENTRADAS 6 MESES */}
      <Text style={styles.graphTitle}>Entradas de animais (6 meses)</Text>

      <View style={styles.chartCard}>
        <BarChart
          data={{
            labels: ["Mai", "Jun", "Jul", "Ago", "Set", "Out"],
            datasets: [{ data: [12, 18, 22, 15, 25, 10] }]
          }}
          width={screenWidth}
          height={220}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
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

      {/* ENTRADAS 1 SEMANA */}
      <Text style={styles.graphTitle}>Entradas (1 semana) - (05/10 - 11/10)</Text>

      <View style={styles.chartCard}>
        <LineChart
          data={{
            labels: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
            datasets: [{ data: [1, 2, 1, 3, 2, 2, 1] }]
          }}
          width={screenWidth}
          height={220}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
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

      {/* SAÍDAS 6 MESES */}
      <Text style={styles.graphTitle}>Saída de animais (6 meses)</Text>

      <View style={styles.chartCard}>
        <BarChart
          data={{
            labels: ["Mai", "Jun", "Jul", "Ago", "Set", "Out"],
            datasets: [{ data: [10, 14, 20, 18, 22, 9] }]
          }}
          width={screenWidth}
          height={220}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: () => "#1A3C6E",
            labelColor: () => "#1A3C6E",
          }}
          style={{ borderRadius: 12 }}
        />
      </View>

      {/* SAÍDAS 1 SEMANA */}
      <Text style={styles.graphTitle}>Saída (1 semana) - (05/10 - 11/10)</Text>

      <View style={styles.chartCard}>
        <LineChart
          data={{
            labels: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
            datasets: [{ data: [1, 1, 2, 2, 3, 1, 1] }]
          }}
          width={screenWidth}
          height={220}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
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

      <View style={{ height: 40 }} />
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
    alignItems: "center",
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A3C6E",
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
    marginBottom: 25,
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
  },

  petImg: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  petInfo: {
    flex: 1,
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
  },

  petDetails: {
    fontSize: 14,
    color: "#1A3C6E",
    marginTop: 5,
  },

  graphTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3C6E",
    marginBottom: 10,
    marginTop: 5,
  },

  chartCard: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 20,
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
});
