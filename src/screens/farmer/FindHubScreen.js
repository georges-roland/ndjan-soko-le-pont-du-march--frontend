/**
 * Écran de recherche de hubs à proximité.
 * RESPONSABLE : B (logistique)
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../../utils/theme';

// Simulation de données de hubs au Cameroun
const MOCK_HUBS = [
  { id: 1, name: 'Hub Yaoundé - Mvan', village: 'Mvan', lat: 3.821, lng: 11.512, capacity: 'Grande', phone: '677000001' },
  { id: 2, name: 'Hub Douala - Bassa', village: 'Zone Industrielle Bassa', lat: 4.053, lng: 9.765, capacity: 'Moyenne', phone: '677000002' },
  { id: 3, name: 'Collecteur Obala', village: 'Obala Centre', lat: 4.167, lng: 11.533, capacity: 'Petite', phone: '677000003' },
  { id: 4, name: 'Dépôt Foumbot', village: 'Marché Foumbot', lat: 5.483, lng: 10.633, capacity: 'Moyenne', phone: '677000004' },
];

const FindHubScreen = () => {
  const [loading, setLoading] = useState(true);
  const [hubs, setHubs] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      }
      // Simulation chargement API
      setTimeout(() => {
        setHubs(MOCK_HUBS);
        setLoading(false);
      }, 1000);
    })();
  }, []);

  const openInMaps = (hub) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${hub.lat},${hub.lng}`;
    const label = hub.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    Linking.openURL(url);
  };

  const renderHub = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.hubName}>{item.name}</Text>
        <Text style={styles.hubVillage}>📍 {item.village}</Text>
        <View style={styles.capacityBadge}>
          <Text style={styles.capacityText}>Capacité : {item.capacity}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`tel:${item.phone}`)}>
          <Ionicons name="call" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.primary }]} onPress={() => openInMaps(item)}>
          <Ionicons name="map" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trouver un Hub 🏪</Text>
        <Text style={styles.sub}>Déposez vos récoltes dans l'entrepôt le plus proche pour un groupage rapide.</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Recherche des hubs à proximité...</Text>
        </View>
      ) : (
        <FlatList
          data={hubs}
          renderItem={renderHub}
          keyExtractor={h => h.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Aucun hub trouvé dans cette zone.</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  sub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4, lineHeight: 20 },
  list: { padding: SPACING.md, gap: SPACING.md },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: SPACING.md, color: COLORS.textSecondary },
  card: { 
    backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...SHADOW.small 
  },
  cardInfo: { flex: 1 },
  hubName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  hubVillage: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  capacityBadge: { 
    backgroundColor: COLORS.primaryLight, paddingHorizontal: 8, paddingVertical: 2, 
    borderRadius: 4, alignSelf: 'flex-start', marginTop: 8 
  },
  capacityText: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: SPACING.sm },
  actionBtn: { 
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.background, 
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border 
  },
  empty: { textAlign: 'center', color: COLORS.textMuted, marginTop: SPACING.xl },
});

export default FindHubScreen;
