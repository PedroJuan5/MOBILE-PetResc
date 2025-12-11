import React, { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, 
  ActivityIndicator, FlatList, Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";
import api from "@/lib/axios"; // Confirme se o caminho do seu axios está assim

// Interface para tipar os dados que vamos usar na tela
interface AnimalHistorico {
  id: number;
  nome: string;
  status: string;
  detalhes: string;
  estagioTitulo: string;
  estagioDesc: string;
  img: string | null;
  categoria: "Adotados" | "Registrados" | "Lar temporário";
}

export default function HistoricoCliente() {
  const router = useRouter();
  const [filtro, setFiltro] = useState<"Adotados" | "Registrados" | "Lar temporário">("Adotados");
  const [animais, setAnimais] = useState<AnimalHistorico[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca dados da API ao abrir a tela
  useEffect(() => {
    async function fetchHistorico() {
      try {
        // Usando o mesmo endpoint da Web
        const response = await api.get("/animais/gerenciar/lista");

        const dadosFormatados = response.data.map((p: any) => {
            // 1. Lógica de Categorização (Igual à Web)
            let cat: "Adotados" | "Registrados" | "Lar temporário" = "Registrados";
            
            if (p.status === 'ADOTADO') cat = "Adotados";
            else if (p.status === 'LAR_TEMPORARIO' || p.status === 'EM_LAR_TEMPORARIO') cat = "Lar temporário";
            else if (p.status === 'DISPONIVEL' || p.status === 'ENCONTRADO') cat = "Registrados";

            // 2. Textos Explicativos
            let tituloEstagio = "Processo em Aberto";
            let descEstagio = p.descricao || "Aguardando candidatos.";

            if (p.status === 'ADOTADO') {
                tituloEstagio = "Adoção Concluída";
                descEstagio = "Animal entregue à nova família.";
            } else if (p.status.includes('LAR')) {
                tituloEstagio = "Lar Temporário";
                descEstagio = "Aguardando adoção definitiva.";
            }

            // 3. Formata Objeto
            return {
                id: p.id,
                nome: p.nome,
                status: p.status === 'DISPONIVEL' ? 'Disponível' : (p.status === 'ADOTADO' ? 'Adotado' : p.status),
                img: p.photoURL,
                detalhes: `${p.sexo || '?'} • ${p.idade != null ? p.idade + ' anos' : 'Idade N/A'} • ${p.raca || 'SRD'}`,
                estagioTitulo: tituloEstagio,
                estagioDesc: descEstagio,
                categoria: cat
            };
        });

        setAnimais(dadosFormatados);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        Alert.alert("Erro", "Não foi possível carregar o histórico.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistorico();
  }, []);

  // Filtra a lista com base na aba selecionada
  const listaFiltrada = animais.filter(a => a.categoria === filtro);

  // Renderiza cada card de animal
  const renderItem = ({ item }: { item: AnimalHistorico }) => {
    // Define cor do badge baseada no status
    let badgeColor = "#26a54cff"; // Verde (padrão)
    if (item.status === 'Disponível') badgeColor = "#2c6eb9ff"; // Azul
    if (item.status.includes('Lar')) badgeColor = "#F59E0B"; // Laranja

    // Imagem: se não tiver photoURL, usa uma placeholder da internet ou local
    const imagemSource = item.img 
      ? { uri: item.img } 
      : { uri: "https://placehold.co/400x400/png?text=Sem+Foto" };

    return (
      <View style={styles.card}>
        <Image source={imagemSource} style={styles.imagem} />

        <View style={styles.info}>
          <View style={styles.linhaTopo}>
            <Text style={styles.nome}>{item.nome}</Text>
            <View style={[styles.status, { backgroundColor: badgeColor }]}>
              <Text style={styles.statusTexto}>{item.status}</Text>
            </View>
          </View>

          <Text style={styles.detalhes}>{item.detalhes}</Text>

          <View style={styles.divider} />

          <Text style={styles.descricaoTitulo}>{item.estagioTitulo}</Text>
          <Text style={styles.descricao} numberOfLines={3}>
            {item.estagioDesc}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
            <ActivityIndicator size="large" color="#2c6eb9ff" />
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
             <Ionicons name="arrow-back" size={24} color="#2c6eb9ff" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Histórico</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* FILTROS (Abas) */}
      <View style={styles.filtrosContainer}>
        {["Adotados", "Registrados", "Lar temporário"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.botaoFiltro,
              filtro === item && styles.filtroAtivo,
            ]}
            onPress={() => setFiltro(item as any)}
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

      {/* LISTA */}
      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="paw-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>Nenhum animal nesta categoria.</Text>
            </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 16, // Ajuste para status bar se necessário
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 16,
    height: 50,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2c6eb9ff",
  },
  filtrosContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    justifyContent: "flex-start", // Alinha à esquerda
    gap: 10
  },
  botaoFiltro: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  filtroAtivo: {
    backgroundColor: "#DBEAFE",
  },
  textoFiltro: {
    fontSize: 13,
    color: "#6B7280",
  },
  textoFiltroAtivo: {
    color: "#2c6eb9ff",
    fontWeight: "700",
  },
  
  // ESTILOS DO CARD
  card: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    alignItems: "flex-start",
    width: "100%",
  },
  imagem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#ddd' // Cor de fundo enquanto carrega
  },
  info: {
    flex: 1,
  },
  linhaTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Alinha topo para nomes longos
    marginBottom: 4,
  },
  nome: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c6eb9ff",
    flex: 1, // Permite quebra de linha se nome for grande
    marginRight: 5
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusTexto: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textTransform: 'uppercase'
  },
  detalhes: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#DCE9F5',
    marginVertical: 6,
    width: '100%'
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
    lineHeight: 16
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
  emptyText: {
    color: '#999',
    marginTop: 10,
    fontSize: 14
  }
});