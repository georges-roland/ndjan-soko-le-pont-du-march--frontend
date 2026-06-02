/**
 * Tableau de bord Gérant de Hub.
 * RESPONSABLE : A (ou membre désigné)
 * ⚠️ Ce module était ABSENT du squelette original — ajout requis.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../../utils/theme';

const HubDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topBar}>
          <Text style={styles.userName}>🏪 Hub — {user?.fullName || 'Gérant'}</Text>
        </View>

        <TouchableOpacity style={styles.primaryBtn}
          onPress={() => navigation.navigate('ScanArrival')}>
          <Text style={styles.btnIcon}>📦</Text>
          <View>
            <Text style={styles.btnLabel}>Scanner une arrivée</Text>
            <Text style={styles.btnSub}>Valider le dépôt d'une récolte</Text>
          </View>
        </TouchableOpacity>

        {/* TODO : Ajouter la liste du stock actuel du hub */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stock actuel du hub</Text>
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Aucun produit en stock actuellement.</Text>
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
  topBar: { backgroundColor: COLORS.accent, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  userName: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, ...SHADOW.medium,
  },
  btnIcon: { fontSize: 32 },
  btnLabel: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  btnSub: { color: COLORS.primaryLight, fontSize: 12 },
  section: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, ...SHADOW.small },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  emptyBox: { alignItems: 'center', padding: SPACING.lg },
  emptyText: { color: COLORS.textMuted, textAlign: 'center' },
  logoutBtn: { alignItems: 'center', padding: SPACING.sm },
  logoutText: { color: COLORS.danger, fontSize: 14 },
});

export default HubDashboard;
