/**
 * Tableau de bord Transporteur.
 * RESPONSABLE : B
 *
 * COMMENT COMPLÉTER AVEC L'IA :
 * "Ajoute un useEffect qui appelle getAvailableLots() et affiche les lots
 *  de groupage disponibles sur les routes du transporteur.
 *  Chaque lot montre : produit, quantité totale, point de départ, destination."
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../../utils/theme';

const TransporterDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topBar}>
          <Text style={styles.userName}>🚚 {user?.fullName || 'Transporteur'}</Text>
        </View>

        <TouchableOpacity style={styles.primaryBtn}
          onPress={() => navigation.navigate('DeclareTrip')}>
          <Text style={styles.primaryBtnIcon}>➕</Text>
          <View>
            <Text style={styles.primaryBtnLabel}>Déclarer un trajet</Text>
            <Text style={styles.primaryBtnSub}>Rentabilisez votre espace libre</Text>
          </View>
        </TouchableOpacity>

        {/* TODO B : Scanner QR Code pour valider chargement */}
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => {}}>
          <Text style={styles.secondaryBtnText}>📷 Scanner QR Code de chargement</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lots disponibles sur vos routes</Text>
          {/* TODO B : Liste des lots de groupage disponibles */}
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Déclarez un trajet pour voir les lots disponibles.</Text>
          </View>
        </View>

        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.md, gap: SPACING.md },
  topBar: { backgroundColor: COLORS.primaryDark, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  userName: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, ...SHADOW.medium,
  },
  primaryBtnIcon: { fontSize: 32 },
  primaryBtnLabel: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  primaryBtnSub: { color: COLORS.primaryLight, fontSize: 12 },
  secondaryBtn: {
    backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  secondaryBtnText: { color: COLORS.text, fontSize: 15, fontWeight: '500' },
  section: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, ...SHADOW.small },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  emptyBox: { alignItems: 'center', padding: SPACING.lg },
  emptyText: { color: COLORS.textMuted, textAlign: 'center' },
  logoutBtn: { alignItems: 'center', padding: SPACING.sm },
  logoutText: { color: COLORS.danger, fontSize: 14 },
});

export default TransporterDashboard;
