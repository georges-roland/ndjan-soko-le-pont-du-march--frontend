/**
 * Tableau de bord Acheteur.
 * RESPONSABLE : R (bourse) + D (paiement)
 */
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, ScrollView, 
  ActivityIndicator, RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getTodayPrices } from '../../api/pricingApi';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../../utils/theme';

const BuyerDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const r = await getTodayPrices();
      setPrices(r.data.slice(0, 3)); // Top 3 produits
    } catch (e) {
      console.log('Error buyer dash fetch');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} colors={[COLORS.primary]} />
        }
      >
        {/* En-tête Profil */}
        <View style={styles.header}>
          <View style={styles.userProfile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.fullName?.charAt(0) || 'A'}</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Bonjour 👋</Text>
              <Text style={styles.userName}>{user?.fullName || 'Acheteur'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Actions Principales */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: COLORS.primary }]}
            onPress={() => navigation.navigate('HarvestCatalog')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="search" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.actionLabel}>Catalogue</Text>
            <Text style={styles.actionSub}>Acheter en direct</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: COLORS.warning }]}
            onPress={() => navigation.navigate('MarketPrice')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="stats-chart" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.actionLabel}>Bourse</Text>
            <Text style={styles.actionSub}>Prix du jour</Text>
          </TouchableOpacity>
        </View>

        {/* Mini-Bourse Widget */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tendances du jour</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MarketPrice')}>
              <Text style={styles.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? <ActivityIndicator color={COLORS.primary} style={{ margin: 10 }} /> : (
            prices.map((p, i) => (
              <View key={i} style={styles.priceMiniRow}>
                <Text style={styles.priceEmoji}>🍅</Text>
                <Text style={styles.priceName}>{p.productType}</Text>
                <Text style={styles.priceVal}>{p.avgPriceFcfa} FCFA/kg</Text>
                <Ionicons name="caret-down" size={12} color={COLORS.success} />
              </View>
            ))
          )}
        </View>

        {/* Transactions récentes */}
        <View style={[styles.section, { marginTop: SPACING.md }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes commandes</Text>
          </View>
          <View style={styles.emptyBox}>
            <Ionicons name="receipt-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Aucune commande récente.</Text>
          </View>
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
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.primaryDark, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.medium,
  },
  userProfile: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: '700', color: COLORS.primaryDark },
  greeting: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  userName: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  notifBtn: { padding: 8 },

  actionRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  actionCard: { flex: 1, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, ...SHADOW.small },
  actionIcon: { marginBottom: SPACING.sm },
  actionLabel: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  actionSub: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },

  section: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, ...SHADOW.small },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  seeAll: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },

  priceMiniRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  priceEmoji: { fontSize: 18 },
  priceName: { flex: 1, fontSize: 14, color: COLORS.text },
  priceVal: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginRight: 4 },

  emptyBox: { alignItems: 'center', padding: SPACING.lg },
  emptyText: { color: COLORS.textMuted, fontSize: 13, marginTop: SPACING.sm },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: SPACING.xl, padding: SPACING.sm },
  logoutText: { color: COLORS.danger, fontSize: 14, fontWeight: '600' },
});

export default BuyerDashboard;
