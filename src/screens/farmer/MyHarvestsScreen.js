/**
 * Liste des récoltes de l'agriculteur connecté.
 * RESPONSABLE : R
 *
 * COMMENT COMPLÉTER AVEC L'IA :
 * "Ajoute un état d'erreur et un bouton Réessayer. Les statuts ont ces couleurs :
 *  PENDING_TRANSPORT=orange, GROUPED=bleu, IN_TRANSIT=violet, DELIVERED=vert."
 */
import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  TouchableOpacity, RefreshControl, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getMyHarvests } from '../../api/harvestApi';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../../utils/theme';

const STATUS_CONFIG = {
  PENDING_TRANSPORT: { label: 'En attente', color: COLORS.warning },
  GROUPED:           { label: 'Lot groupé ✓', color: COLORS.info },
  IN_TRANSIT:        { label: 'En route 🚚', color: '#8E44AD' },
  DELIVERED:         { label: 'Livré ✓', color: COLORS.success },
};

const PRODUCT_EMOJI = {
  Tomate: '🍅', Piment: '🌶️', Maïs: '🌽', Manioc: '🌿', Oignon: '🧅', Autre: '📦',
};

const HarvestCard = ({ item }) => {
  const status = STATUS_CONFIG[item.status] || { label: item.status, color: COLORS.textMuted };
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.cardEmoji}>{PRODUCT_EMOJI[item.productType] || '📦'}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.productType}</Text>
          <Text style={styles.cardSub}>{item.quantityKg} kg · {item.pricePerKg} FCFA/kg</Text>
          <Text style={styles.cardLocation}>📍 {item.village}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: status.color + '22' }]}>
          <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>
    </View>
  );
};

const MyHarvestsScreen = () => {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchHarvests = async () => {
    try {
      setError(null);
      const r = await getMyHarvests();
      setHarvests(r.data);
    } catch (e) {
      setError('Impossible de charger vos annonces.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHarvests();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHarvests();
  };

  if (loading && !refreshing) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchHarvests}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={harvests}
        keyExtractor={h => String(h.id)}
        renderItem={({ item }) => <HarvestCard item={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
        ListEmptyComponent={
          !error && (
            <View style={styles.centered}>
              <Ionicons name="leaf-outline" size={64} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Vous n'avez pas encore d'annonces.</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.md, gap: SPACING.sm },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  card: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, ...SHADOW.small },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  cardEmoji: { fontSize: 32 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  cardSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  cardLocation: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  badge: { borderRadius: BORDER_RADIUS.full, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  emptyText: { color: COLORS.textMuted, fontSize: 15, marginTop: SPACING.md },
  errorBox: { backgroundColor: '#FFE5E5', margin: SPACING.md, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  errorText: { color: COLORS.danger, fontWeight: '500', marginBottom: SPACING.sm },
  retryBtn: { backgroundColor: COLORS.danger, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full },
  retryText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },
});

export default MyHarvestsScreen;
