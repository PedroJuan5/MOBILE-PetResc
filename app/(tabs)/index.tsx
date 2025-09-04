// HomeScreen.tsx
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "expo-router"; // <-- Importe o hook de navegação
import { DrawerActions } from "@react-navigation/native"; // <-- Importe as ações do Drawer

const { width, height } = Dimensions.get("window");

const statsData = [
  { number: 63, label: "Animais adotados" },
  { number: 12, label: "ONGs parceiras" },
  { number: 8, label: "Campanhas realizadas" },
];

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const COLORS = {
  primary: "#2D68A6",
  lightBlue: "#E6F0FA",
  cardBg: "#F6FBFF",
  textMuted: "#3A5C7A",
  borderLight: "#D6EAF7",
  pawLight: "#BFE1F7",
  pawLighter: "#CFE8FB",
};

const featureData = [
  {
    icon: "hand-holding-heart",
    title: "Faça sua doação",
    description:
      "Contribua com suprimentos ou recursos e ajude a transformar a vida de animais resgatados.",
    buttonText: "Saiba mais",
  },
  {
    icon: "paw",
    title: "Adoções",
    description:
      "Veja perfis de animais prontos para adoção e agende uma visita.",
    buttonText: "Ver animais",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation(); // <-- Use o hook de navegação
  const [adoptedCount] = React.useState(63);

  const handleOpenDrawer = () => {
    // CORREÇÃO: Chame a função de abrir o menu
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity accessibilityLabel="menu" onPress={handleOpenDrawer}>
            <Ionicons name="menu" size={moderateScale(26)} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity accessibilityLabel="perfil" style={styles.profileBtn}>
            <Ionicons
              name="person-circle-outline"
              size={moderateScale(30)}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Título + patinhas */}
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Conheça seu novo{"\n"}melhor amigo!</Text>

          <View style={styles.paws}>
            <FontAwesome5 name="paw" size={moderateScale(18)} color={COLORS.pawLight} />
            <FontAwesome5
              name="paw"
              size={moderateScale(12)}
              color={COLORS.pawLighter}
              style={{ marginLeft: moderateScale(8), opacity: 0.6 }}
            />
          </View>
        </View>

        {/* Missão */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossa missão</Text>
          <View style={styles.missionBox}>
            <Text style={styles.missionText}>
              Nosso objetivo é otimizar a gestão das organizações, dar mais
              visibilidade aos animais em situação de vulnerabilidade e
              incentivar a participação social, ajudando a reduzir o abandono
              e promovendo a adoção responsável.
            </Text>
          </View>
        </View>

        {/* Funcionalidades em destaque - scroll horizontal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Funcionalidades em destaque</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuresRow}
          >
            {featureData.map((item, index) => (
              <FeatureCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                buttonText={item.buttonText}
                isLast={index === featureData.length - 1}
              />
            ))}
          </ScrollView>
        </View>

        {/* Estatísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossos marcos</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: moderateScale(10), paddingVertical: verticalScale(6) }}
          >
            {statsData.map((item, index) => (
              <StatCard
                key={index}
                number={item.number}
                label={item.label}
                isLast={index === statsData.length - 1}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureCard({ icon, title, description, buttonText, isLast }: any) {
  return (
    <View
      style={[
        styles.featureCard,
        { marginRight: isLast ? 0 : moderateScale(12) },
      ]}
    >
      <View style={styles.featureIcon}>
        <FontAwesome5 name={icon} size={moderateScale(18)} color={COLORS.primary} />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{description}</Text>
      <TouchableOpacity style={styles.linkBtn}>
        <Text style={styles.linkText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

function StatCard({ number, label }: any) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    paddingHorizontal: moderateScale(18),
    paddingBottom: verticalScale(40),
  },
  header: {
    marginTop: verticalScale(6),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(2),
  },
  profileBtn: { padding: moderateScale(6) },
  titleWrapper: {
    marginTop: verticalScale(14),
    marginBottom: verticalScale(8),
    position: "relative",
  },
  title: {
    fontSize: moderateScale(26),
    fontWeight: "700",
    color: COLORS.primary,
    lineHeight: moderateScale(36),
  },
  paws: {
    position: "absolute",
    right: 0,
    top: 0,
    flexDirection: "row",
  },
  section: { marginTop: verticalScale(18) },
  sectionTitle: {
    fontSize: moderateScale(14),
    color: COLORS.textMuted,
    marginBottom: verticalScale(8),
    fontWeight: "600",
  },
  missionBox: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  missionText: {
    fontSize: moderateScale(13),
    color: COLORS.textMuted,
    lineHeight: moderateScale(18),
  },
  featuresRow: {
    paddingVertical: verticalScale(6),
    paddingLeft: moderateScale(10),
  },
  featureCard: {
    width: Math.min(width * 0.8, moderateScale(300)),
    backgroundColor: COLORS.cardBg,
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
    borderWidth: 1,
    borderColor: "#E2F0FB",
  },
  featureIcon: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  featureTitle: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    marginBottom: verticalScale(6),
    color: COLORS.primary,
  },
  featureDesc: {
    fontSize: moderateScale(12),
    color: COLORS.textMuted,
    marginBottom: verticalScale(10),
  },
  linkBtn: { alignSelf: "flex-start", paddingVertical: moderateScale(6) },
  linkText: { fontSize: moderateScale(13), color: COLORS.primary, fontWeight: "600" },
  statCard: {
    width: Math.min(width * 0.4, moderateScale(140)),
    backgroundColor: COLORS.lightBlue,
    marginRight: moderateScale(10),
    paddingVertical: verticalScale(18),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statNumber: {
    fontSize: moderateScale(34),
    fontWeight: "700",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: COLORS.textMuted,
    marginTop: verticalScale(6),
  },
});