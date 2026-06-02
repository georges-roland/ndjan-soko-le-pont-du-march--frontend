/**
 * Catalogue des récoltes disponibles (vue acheteur).
 * RESPONSABLE : R
 *
 * COMMENT COMPLÉTER AVEC L'IA :
 * "Ajoute des filtres en haut : un horizontal ScrollView de chips cliquables
 *  pour filtrer par productType. Ajoute aussi la quantité totale groupée disponible."
 */
import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  ActivityIndicator, ScrollView, RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAvailableHarvests } from '../../api/harvestApi';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../../utils/theme';

const PRODUCT_MAPPING = {
  'ALL':      { label: 'Tous',    emoji: '🍱' },
  'TOMATO':   { label: 'Tomate',  emoji: '🍅' },
  'PEPPER':   { label: 'Piment',  emoji: '🌶️' },
  'PLANTAIN': { label: 'Plantain', emoji: '🍌' },
  'CASSAVA':  { label: 'Manioc',  emoji: '🌿' },
  'ONION':    { label: 'Oignon',  emoji: '🧅' },
  'OTHER':    { label: 'Autres',  emoji: '📦' },
};

const HarvestCard = ({ item, onBuy }) => {
  const product = PRODUCT_MAPPING[item.productType] || PRODUCT_MAPPING['OTHER'];
  
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.emojiContainer}>
          <Text style={styles.cardEmoji}>{product.emoji}</Text>
          <View style={styles.qualityBadge}>
            <Text style={styles.qualityText}>{item.qualityCategory || 'A'}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{product.label}</Text>
          <Text style={styles.cardRegion}>📍 {item.villageName || 'Région inconnue'}</Text>
          <Text style={styles.cardDate}>Publié il y a 2h</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.cardPrice}>{item.pricePerKgFcfa} FCFA/kg</Text>
          <Text style={styles.cardQty}>{item.quantityKg} kg dispos</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View style={styles.stockInfo}>
          <Ionicons name="cube-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.stockText}>Disponibilité immédiate</Text>
        </View>
        <TouchableOpacity style={styles.buyBtn} onPress={() => onBuy(item.id)}>
          <Text style={styles.buyBtnText}>Voir & Acheter</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HarvestCatalogScreen = ({ navigation }) => {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const fetchHarvests = async (filter) => {
    try {
      const params = filter === 'ALL' ? {} : { productType: filter };
      const r = await getAvailableHarvests(params);
      setHarvests(r.data);
    } catch (e) {
      console.log('Error fetching catalog');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHarvests(activeFilter);
  }, [activeFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHarvests(activeFilter);
  };

  const totalVolume = harvests.reduce((sum, h) => sum + (h.quantityKg || 0), 0);

  if (loading && !refreshing) return (
    <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Barre de filtres */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {Object.keys(PRODUCT_MAPPING).map((key) => (
            <TouchableOpacity 
              key={key}
              style={[styles.filterChip, activeFilter === key && styles.filterChipActive]}
              onPress={() => { setLoading(true); setActiveFilter(key); }}
            >
              <Text style={styles.filterEmoji}>{PRODUCT_MAPPING[key].emoji}</Text>
              <Text style={[styles.filterText, activeFilter === key && styles.filterTextActive]}>
                {PRODUCT_MAPPING[key].label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats Rapides */}
      {harvests.length > 0 && (
        <View style={styles.statsBar}>
          <Text style={styles.statsText}>
            🔥 <Text style={{fontWeight: '700'}}>{harvests.length}</Text> lots trouvés · <Text style={{fontWeight: '700'}}>{totalVolume} kg</Text> au total
          </Text>
        </View>
      )}

      <FlatList
        data={harvests}
        keyExtractor={h => String(h.id)}
        renderItem={({ item }) => (
          <HarvestCard item={item} onBuy={(id) => navigation.navigate('PaymentEscrow', { harvestId: id })} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Aucune récolte de ce type pour le moment.</Text>
            <TouchableOpacity style={styles.resetBtn} onPress={() => setActiveFilter('ALL')}>
              <Text style={styles.resetBtnText}>Voir toutes les récoltes</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  filterSection: { backgroundColor: COLORS.white, paddingVertical: SPACING.md, ...SHADOW.small },
  filterScroll: { paddingHorizontal: SPACING.md, gap: SPACING.sm },
  filterChip: { 
    flexDirection: 'row', alignItems: 'center', gap: 6, 
    paddingHorizontal: SPACING.md, paddingVertical: 8, 
    borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.background,
    borderWidth: 1, borderColor: COLORS.border
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterEmoji: { fontSize: 14 },
  filterText: { fontSize: 13, color: COLORS.text, fontWeight: '500' },
  filterTextActive: { color: COLORS.white, fontWeight: '700' },

  statsBar: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md },
  statsText: { fontSize: 13, color: COLORS.textSecondary },

  list: { padding: SPACING.md, gap: SPACING.md },
  card: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, ...SHADOW.medium },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  emojiContainer: { position: 'relative' },
  cardEmoji: { fontSize: 40 },
  qualityBadge: { 
    position: 'absolute', bottom: -2, right: -2, 
    backgroundColor: COLORS.success, width: 20, height: 20, 
    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.white
  },
  qualityText: { color: COLORS.white, fontSize: 10, fontWeight: '900' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  cardRegion: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  cardDate: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  priceContainer: { alignItems: 'flex-end' },
  cardPrice: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  cardQty: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stockInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stockText: { fontSize: 12, color: COLORS.textSecondary },
  buyBtn: { 
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, 
    paddingHorizontal: SPACING.md, paddingVertical: 8 
  },
  buyBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 100 },
  emptyText: { color: COLORS.textMuted, fontSize: 15, textAlign: 'center', marginTop: SPACING.md, paddingHorizontal: SPACING.xl },
  resetBtn: { marginTop: SPACING.lg, padding: SPACING.md },
  resetBtnText: { color: COLORS.primary, fontWeight: '700', textDecorationLine: 'underline' },
});

export default HarvestCatalogScreen;
