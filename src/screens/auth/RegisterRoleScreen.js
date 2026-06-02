/**
 * Écran de choix du rôle (première inscription).
 * RESPONSABLE : F
 */
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../../utils/theme';

const ROLES = [
  {
    key: 'FARMER',
    emoji: '👨‍🌾',
    label: 'Agriculteur / GIC',
    desc: 'Je produis des récoltes à vendre',
    color: COLORS.success,
  },
  {
    key: 'BUYER',
    emoji: '🛒',
    label: 'Acheteur',
    desc: 'Bayam-Sellam, Grossiste, Supermarché',
    color: COLORS.info,
  },
  {
    key: 'TRANSPORTER',
    emoji: '🚚',
    label: 'Transporteur',
    desc: 'Je transporte des marchandises',
    color: COLORS.warning,
  },
  {
    key: 'HUB_MANAGER',
    emoji: '🏪',
    label: 'Gérant de Hub',
    desc: 'Je gère un entrepôt partenaire',
    color: COLORS.accent,
  },
];

const RegisterRoleScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);

  const handleConfirm = () => {
    if (!selected) return;
    // Passer le rôle à LoginScreen pour l'inclure dans verifyOtp
    navigation.navigate('Login', { preSelectedRole: selected });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.logo}>🌿</Text>
          <Text style={styles.title}>Bienvenue sur Ndjan-Soko</Text>
          <Text style={styles.subtitle}>Quel est votre rôle ?</Text>
        </View>

        <View style={styles.grid}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.key}
              style={[
                styles.card,
                selected === r.key && { borderColor: r.color, borderWidth: 2 },
              ]}
              onPress={() => setSelected(r.key)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconCircle, { backgroundColor: r.color + '22' }]}>
                <Text style={styles.emoji}>{r.emoji}</Text>
              </View>
              <Text style={styles.cardLabel}>{r.label}</Text>
              <Text style={styles.cardDesc}>{r.desc}</Text>
              {selected === r.key && (
                <View style={[styles.checkBadge, { backgroundColor: r.color }]}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, !selected && styles.confirmDisabled]}
          onPress={handleConfirm}
          disabled={!selected}
        >
          <Text style={styles.confirmText}>Continuer →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  logo: { fontSize: 48, marginBottom: SPACING.sm },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginTop: SPACING.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, justifyContent: 'center' },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '46%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.small,
  },
  iconCircle: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  emoji: { fontSize: 28 },
  cardLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  cardDesc: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 },
  checkBadge: {
    position: 'absolute', top: 10, right: 10,
    width: 22, height: 22, borderRadius: 11,
    justifyContent: 'center', alignItems: 'center',
  },
  checkText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  confirmDisabled: { opacity: 0.4 },
  confirmText: { color: COLORS.white, fontSize: 17, fontWeight: '600' },
});

export default RegisterRoleScreen;
