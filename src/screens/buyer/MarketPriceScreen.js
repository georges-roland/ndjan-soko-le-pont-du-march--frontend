/**
 * Bourse des prix en temps réel.
 * RESPONSABLE : R
 *
 * COMMENT COMPLÉTER AVEC L'IA :
 * "Ajoute une tendance colorée par produit (▲ vert si hausse, ▼ rouge si baisse)
 *  en comparant avec priceYesterday si disponible dans l'API."
 */
import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  RefreshControl, ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getTodayPrices } from '../../api/pricingApi';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../../utils/theme';

const PRODUCT_EMOJI = {
  Tomate: '🍅', Piment: '🌶️', Maïs: '🌽', Manioc: '🌿', Oignon: '🧅', Autre: '📦',
};

const PriceRow = ({ item }) => {
  const isUp = item.avgPriceFcfa > (item.priceYesterday || 0);
  const isStable = item.avgPriceFcfa === (item.priceYesterday || 0);

  return (
    <View style={styles.row}>
      <Text style={styles.rowEmoji}>{PRODUCT_EMOJI[item.productType] || '📦'}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowName}>{item.productType}</Text>
        <Text style={styles.rowMarket}>{item.market}</Text>
      </View>
      <View style={styles.priceBox}>
        <Text style={styles.priceAvg}>{item.avgPriceFcfa} FCFA/kg</Text>
        <View style={styles.trendRow}>
          {isStable ? (
            <Text style={styles.trendStable}>= stable</Text>
          ) : (
            <>
              <Ionicons 
                name={isUp ? 'caret-up' : 'caret-down'} 
                size={14} 
                color={isUp ? COLORS.danger : COLORS.success} 
              />
              <Text style={[styles.trendText, { color: isUp ? COLORS.danger : COLORS.success }]}>
                {isUp ? 'Hausse' : 'Baisse'}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const MarketPriceScreen = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const today = new Date().toLocaleDateString('fr-CM', { day: 'numeric', month: 'long' });

  const fetchPrices = async () => {
    try {
      const r = await getTodayPrices();
      setPrices(r.data);
    } catch (e) {
      console.log('Erreur fetch prices');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  if (loading && !refreshing) return (
    <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Bourse des prix</Text>
          <Text style={styles.headerSub}>{today} · Yaoundé / Douala</Text>
        </View>
        <Ionicons name="stats-chart" size={24} color={COLORS.white} />
      </View>

      <FlatList
        data={prices}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => <PriceRow item={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPrices(); }} colors={[COLORS.primary]} />
        }
        ListHeaderComponent={
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>💡 Les prix sont collectés chaque matin auprès de nos délégués de marché.</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Aucun prix disponible pour aujourd'hui.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    backgroundColor: COLORS.primary, 
    padding: SPACING.md, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  headerSub: { color: COLORS.primaryLight, fontSize: 12, marginTop: 2 },
  list: { padding: SPACING.md, gap: SPACING.sm },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, ...SHADOW.small,
  },
  rowEmoji: { fontSize: 32 },
  rowName: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  rowMarket: { fontSize: 12, color: COLORS.textSecondary },
  priceBox: { alignItems: 'flex-end' },
  priceAvg: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  trendText: { fontSize: 11, fontWeight: '600', marginLeft: 2 },
  trendStable: { fontSize: 11, color: COLORS.textMuted },
  infoBox: { backgroundColor: '#E3F2FD', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.md },
  infoText: { fontSize: 12, color: COLORS.info, textAlign: 'center' },
  emptyText: { color: COLORS.textMuted },
});

export default MarketPriceScreen;
