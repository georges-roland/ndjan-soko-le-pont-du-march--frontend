/**
 * Navigateur racine — gère le routing conditionnel par rôle.
 * RESPONSABLE : F — NE PAS MODIFIER sans consulter F.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/theme';

// ---- Auth ----
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterRoleScreen from '../screens/auth/RegisterRoleScreen';

// ---- Farmer ----
import FarmerDashboard from '../screens/farmer/FarmerDashboard';
import CreateHarvestScreen from '../screens/farmer/CreateHarvestScreen';
import MyHarvestsScreen from '../screens/farmer/MyHarvestsScreen';
import FindHubScreen from '../screens/farmer/FindHubScreen';

// ---- Buyer ----
import BuyerDashboard from '../screens/buyer/BuyerDashboard';
import MarketPriceScreen from '../screens/buyer/MarketPriceScreen';
import HarvestCatalogScreen from '../screens/buyer/HarvestCatalogScreen';
import PaymentEscrowScreen from '../screens/buyer/PaymentEscrowScreen';

// ---- Transporter ----
import TransporterDashboard from '../screens/transporter/TransporterDashboard';
import DeclareTripScreen from '../screens/transporter/DeclareTripScreen';

// ---- Hub ----
import HubDashboard from '../screens/hub/HubDashboard';
import ScanArrivalScreen from '../screens/hub/ScanArrivalScreen';

// ---- Admin ----
import AdminSecurityScreen from '../screens/admin/AdminSecurityScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: COLORS.primaryDark },
  headerTintColor: COLORS.white,
  headerTitleStyle: { fontWeight: '600' },
};

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="RegisterRole" component={RegisterRoleScreen} />
  </Stack.Navigator>
);

const FarmerStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="FarmerDashboard" component={FarmerDashboard} options={{ title: '🌿 Ndjan-Soko' }} />
    <Stack.Screen name="CreateHarvest" component={CreateHarvestScreen} options={{ title: 'Publier une récolte' }} />
    <Stack.Screen name="MyHarvests" component={MyHarvestsScreen} options={{ title: 'Mes annonces' }} />
    <Stack.Screen name="MarketPrice" component={MarketPriceScreen} options={{ title: 'Prix du marché' }} />
    <Stack.Screen name="FindHub" component={FindHubScreen} options={{ title: 'Trouver un Hub' }} />
  </Stack.Navigator>
);

const BuyerStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="BuyerDashboard" component={BuyerDashboard} options={{ title: '🌿 Ndjan-Soko' }} />
    <Stack.Screen name="MarketPrice" component={MarketPriceScreen} options={{ title: 'Bourse des prix' }} />
    <Stack.Screen name="HarvestCatalog" component={HarvestCatalogScreen} options={{ title: 'Catalogue' }} />
    <Stack.Screen name="PaymentEscrow" component={PaymentEscrowScreen} options={{ title: 'Paiement sécurisé' }} />
  </Stack.Navigator>
);

const TransporterStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="TransporterDashboard" component={TransporterDashboard} options={{ title: '🌿 Ndjan-Soko' }} />
    <Stack.Screen name="DeclareTrip" component={DeclareTripScreen} options={{ title: 'Déclarer un trajet' }} />
  </Stack.Navigator>
);

const HubStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="HubDashboard" component={HubDashboard} options={{ title: '🌿 Hub Logistique' }} />
    <Stack.Screen name="ScanArrival" component={ScanArrivalScreen} options={{ title: 'Scanner une arrivée' }} />
  </Stack.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="AdminSecurity" component={AdminSecurityScreen} options={{ title: 'Admin — Sécurité' }} />
  </Stack.Navigator>
);

export const RootNavigator = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : role === 'FARMER' ? (
        <FarmerStack />
      ) : role === 'BUYER' ? (
        <BuyerStack />
      ) : role === 'TRANSPORTER' ? (
        <TransporterStack />
      ) : role === 'HUB_MANAGER' ? (
        <HubStack />
      ) : (
        <AdminStack />
      )}
    </NavigationContainer>
  );
};
