import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, ScrollView, 
  ActivityIndicator, RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getMyHarvests } from '../../api/harvestApi';
import { useOfflineSync } from '../../hooks/useOfflineSync';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../../utils/theme';

const TILES = [
  { id: 1, icon: 'camera', label: 'Publier', sub: 'Scanner + IA', screen: 'CreateHarvest', color: COLORS.primary },
  { id: 2, icon: 'list', label: 'Mes annonces', sub: 'Suivi ventes', screen: 'MyHarvests', color: COLORS.info },
  { id: 3, icon: 'trending-up', label: 'Prix du jour', sub: 'Bourse locale', screen: 'MarketPrice', color: COLORS.warning },
  { id: 4, icon: 'business', label: 'Trouver un hub', sub: 'Dépôt récolte', screen: 'FindHub', color: COLORS.accent },
];

const FarmerDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { pendingCount, isSyncing } = useOfflineSync();
  const [lastHarvests, setLastHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await getMyHarvests();
      setLastHarvests(response.data.slice(0, 3));
    } catch (e) {
      console.log('Erreur dashboard fetch');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {/* Badge de synchronisation hors-ligne */}
        {pendingCount > 0 && (
          <View style={[styles.syncBadge, isSyncing && { backgroundColor: COLORS.info }]}>
            <Ionicons name={isSyncing ? 'sync' : 'cloud-offline'} size={14} color={COLORS.white} />
            <Text style={styles.syncBadgeText}>
              {isSyncing ? 'Synchronisation en cours...' : `${pendingCount} annonce(s) en attente de réseau`}
            </Text>
          </View>
        )}

        {/* En-tête avec Profil */}
        <View style={styles.topBar}>
          <View style={styles.userProfile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.fullName?.charAt(0) || 'A'}</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Bonjour 👋</Text>
              <Text style={styles.userName}>{user?.fullName || 'Agriculteur'}</Text>
            </View>
          </View>
          <View style={styles.ratingBox}>
            <View style={styles.stars}>
              {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={12} color={COLORS.accent} />)}
            </View>
            <Text style={styles.ratingLabel}>Confiance : 100%</Text>
          </View>
        </View>

        {/* Menu Principal (Tuiles) */}
        <View style={styles.grid}>
          {TILES.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.tile, { borderLeftColor: t.color, borderLeftWidth: 4 }]}
              onPress={() => t.screen && navigation.navigate(t.screen)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconCircle, { backgroundColor: t.color + '15' }]}>
                <Ionicons name={t.icon} size={24} color={t.color} />
              </View>
              <View>
                <Text style={styles.tileLabel}>{t.label}</Text>
                <Text style={styles.tileSub}>{t.sub}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dernières activités */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes dernières récoltes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyHarvests')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={COLORS.primary} style={{ margin: 20 }} />
          ) : lastHarvests.length > 0 ? (
            lastHarvests.map((h, i) => (
              <View key={h.id || i} style={styles.harvestMiniCard}>
                <View style={styles.harvestMiniInfo}>
                  <Text style={styles.harvestMiniEmoji}>🍅</Text>
                  <View>
                    <Text style={styles.harvestMiniTitle}>{h.productType}</Text>
                    <Text style={styles.harvestMiniSub}>{h.quantityKg} Kg · {h.village}</Text>
                  </View>
                </View>
                <View style={styles.statusPoint} />
              </View>
            ))
          ) : (
            <View style={styles.emptyBox}>
              <Ionicons name="leaf-outline" size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Aucune récolte publiée pour le moment.</Text>
              <TouchableOpacity 
                style={styles.emptyBtn}
                onPress={() => navigation.navigate('CreateHarvest')}
              >
                <Text style={styles.emptyBtnText}>Publier ma première récolte</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.md },
  syncBadge: { 
    flexDirection: 'row', alignItems: 'center', gap: 8, 
    backgroundColor: COLORS.warning, padding: 10, borderRadius: BORDER_RADIUS.md, 
    marginBottom: SPACING.md, justifyContent: 'center' 
  },
  syncBadgeText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.medium,
  },
  userProfile: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  userName: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  ratingBox: { alignItems: 'flex-end' },
  stars: { flexDirection: 'row', gap: 2 },
  ratingLabel: { color: COLORS.accent, fontSize: 10, fontWeight: '600', marginTop: 2 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  tile: {
    backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, width: '48.5%', ...SHADOW.small,
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm
  },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  tileLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  tileSub: { fontSize: 10, color: COLORS.textSecondary, marginTop: 1 },
  
  section: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, ...SHADOW.small },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  seeAll: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  
  harvestMiniCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  harvestMiniInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  harvestMiniEmoji: { fontSize: 24 },
  harvestMiniTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  harvestMiniSub: { fontSize: 11, color: COLORS.textSecondary },
  statusPoint: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.warning },

  emptyBox: { alignItems: 'center', padding: SPACING.lg },
  emptyText: { color: COLORS.textMuted, fontSize: 13, textAlign: 'center', marginVertical: SPACING.sm },
  emptyBtn: { backgroundColor: COLORS.primaryLight, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  emptyBtnText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: SPACING.xl, padding: SPACING.sm },
  logoutText: { color: COLORS.danger, fontSize: 14, fontWeight: '600' },
});

export default FarmerDashboard;
