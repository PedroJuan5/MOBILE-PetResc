import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HistoricoCliente() {
  const router = useRouter();
  const [filtro, setFiltro] = useState("Adotados");

  // Dados dos pets para cada filtro
  const petsPorFiltro: Record<string, {
    nome: string;
    status: string;
    detalhes: string;
    acompanhamento: string;
    descricaoTitulo: string;
    descricao: string;
    imagem: any;
  }> = {
    "Adotados": {
      nome: "Neguinho",
      status: "Adotado",
      detalhes: "Macho • Filhote • SP",
      acompanhamento: "Acompanhamento inicial",
      descricaoTitulo: "Estágios de adoção:",
      descricao: "Após a chegada do animal ao lar, a ONG entra em contato para acompanhar a adaptação, pedindo notícias.",
      imagem: require("../../assets/images/pets/neguinho.png"),
    },
    "Registrados": {
      nome: "Branquinho",
      status: "Registrado",
      detalhes: "Fêmea • Adulto • RJ",
      acompanhamento: "Aguardando visita",
      descricaoTitulo: "Processo de registro:",
      descricao: "O animal foi registrado e está aguardando a visita de um possível adotante.",
      imagem: require("../../assets/images/pets/branquinho.png"),
    },
    "Lar temporário": {
      nome: "Caramelo",
      status: "Em lar temporário",
      detalhes: "Macho • Jovem • MG",
      acompanhamento: "Em adaptação",
      descricaoTitulo: "Sobre o lar temporário:",
      descricao: "O animal está em lar temporário enquanto aguarda adoção definitiva.",
      imagem: require("../../assets/images/pets/caramelo.png"),
    },
  };

  const pet = petsPorFiltro[filtro];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("seguranca" as any)}>
          <Ionicons name="arrow-back" size={22} color="#2c6eb9ff" />
        </TouchableOpacity>

        <Text style={styles.titulo}>Segurança</Text>

        <View style={{ width: 22 }} />
      </View>

      <Text style={styles.subtitulo}>Histórico</Text>

      {/* FILTROS */}
      <View style={styles.filtros}>
        {["Adotados", "Registrados", "Lar temporário"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.botaoFiltro,
              filtro === item && styles.filtroAtivo,
            ]}
            onPress={() => setFiltro(item)}
          >
            <Text
              style={[
                styles.textoFiltro,
                filtro === item && styles.textoFiltroAtivo,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CARD */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 16 }}>
        <View style={styles.card}>
          <Image
            source={pet.imagem}
            style={styles.imagem}
          />

          <View style={styles.info}>
            <View style={styles.linhaTopo}>
              <Text style={styles.nome}>{pet.nome}</Text>

              <View style={styles.status}>
                <Text style={styles.statusTexto}>{pet.status}</Text>
              </View>
            </View>

            <Text style={styles.detalhes}>{pet.detalhes}</Text>

            <TouchableOpacity style={styles.botaoAcompanhamento}>
              <Text style={styles.textoAcompanhamento}>
                {pet.acompanhamento}
              </Text>
            </TouchableOpacity>

            <Text style={styles.descricaoTitulo}>
              {pet.descricaoTitulo}
            </Text>

            <Text style={styles.descricao}>
              {pet.descricao}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ================== ESTILOS ================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 0,
    paddingVertical: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    color: "#2c6eb9ff",
    paddingHorizontal: 16,
    height: 80,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2c6eb9ff",
   
  },

  subtitulo: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2c6eb9ff",
    marginBottom: 12,
    paddingHorizontal: 16,
  },

  filtros: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },

  botaoFiltro: {
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    marginRight: 8,
    flex: 1,
    alignItems: "center",
    minWidth: 100,
    marginBottom: 8,
    marginLeft: 0,
    marginTop: 0,
  },

  filtroAtivo: {
    backgroundColor: "#DBEAFE",
  },

  textoFiltro: {
    fontSize: 12,
    color: "#374151",
  },

  textoFiltroAtivo: {
    color: "#2c6eb9ff",
    fontWeight: "600",
  },

  card: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 10,
    color: "#2c6eb9ff",
    alignItems: "flex-start",
    width: "100%",
    minWidth: 0,
  },

  imagem: {
    width: "28%",
    aspectRatio: 0.82,
    borderRadius: 12,
    marginRight: 10,
    minWidth: 70,
    maxWidth: 120,
    resizeMode: "cover",
  },

  info: {
    flex: 1,
    minWidth: 0,
  },

  linhaTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },

  nome: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2c6eb9ff",
  },

  status: {
    backgroundColor: "#26a54cff",
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 999,
  },

  statusTexto: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },

  detalhes: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 1,
  },

  botaoAcompanhamento: {
    
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignSelf: "flex-start",
    
  },

  textoAcompanhamento: {
    color: "#2c6eb9ff",
    fontSize: 11,
    fontWeight: "600",
  },

  descricaoTitulo: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F2933",
    marginBottom: 2,
  },

  descricao: {
    fontSize: 11,
    color: "#374151",
  },
});
