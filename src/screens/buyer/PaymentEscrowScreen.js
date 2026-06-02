/**
 * Écran de paiement sécurisé Escrow — 3 étapes.
 * RESPONSABLE : D
 *
 * COMMENT COMPLÉTER AVEC L'IA :
 * "Étape 1 : affiche le récapitulatif de la commande (appelle l'API pour les
 *  détails du harvestId). Deux gros boutons : 'Payer MTN MoMo' et 'Payer Orange Money'.
 *  Au clic, appelle initiateEscrow(harvestId, provider).
 *  Étape 2 : animation de cadenas (un simple emoji 🔐 avec un Text qui pulses)
 *  et message de confirmation. Le bouton 'Confirmer la réception' n'apparaît
 *  que quand on clique dessus (simuler le délai de livraison).
 *  Étape 3 : appelle confirmReceipt(txId) et affiche une animation de succès."
 */
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Animated, 
  ActivityIndicator, Image, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { initiateEscrow, confirmReceipt } from '../../api/paymentApi';
import { getAvailableHarvests } from '../../api/harvestApi';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../../utils/theme';

const STEPS = ['💳 Paiement', '🔐 Sécurisé', '✅ Confirmé'];

const PaymentEscrowScreen = ({ route, navigation }) => {
  const { harvestId } = route.params;
  const [step, setStep] = useState(0);
  const [txId, setTxId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [harvest, setHarvest] = useState(null);

  // Animation pour le cadenas
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Charger les détails du lot
    getAvailableHarvests({}).then(r => {
      const item = r.data.find(h => h.id === harvestId);
      setHarvest(item);
    });
  }, [harvestId]);

  useEffect(() => {
    if (step === 1) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [step]);

  const handlePay = async (provider) => {
    setLoading(true);
    try {
      // Simulation appel API
      const res = await initiateEscrow(harvestId, provider);
      setTxId(res.data?.transactionId || 'TX-' + Math.random().toString(36).substr(2, 9));
      setStep(1);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'initier le paiement.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceipt = async () => {
    setLoading(true);
    try {
      await confirmReceipt(txId);
      setStep(2);
    } catch (e) {
      Alert.alert('Erreur', 'Validation de réception échouée.');
    } finally {
      setLoading(false);
    }
  };

  if (!harvest && step === 0) return (
    <View style={styles.centered}><ActivityIndicator color={COLORS.primary} /></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Stepper */}
      <View style={styles.stepper}>
        {STEPS.map((s, i) => (
          <View key={i} style={styles.stepItem}>
            <View style={[styles.stepCircle, i <= step && styles.stepCircleActive]}>
              {i < step ? (
                <Ionicons name="checkmark" size={16} color={COLORS.white} />
              ) : (
                <Text style={styles.stepNum}>{i + 1}</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, i <= step && styles.stepLabelActive]}>{s}</Text>
          </View>
        ))}
      </View>

      <View style={styles.content}>
        {step === 0 && (
          <>
            <Text style={styles.sectionTitle}>Récapitulatif de la commande</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Produit :</Text>
                <Text style={styles.summaryValue}>{harvest.productType}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Quantité :</Text>
                <Text style={styles.summaryValue}>{harvest.quantityKg} Kg</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Prix unitaire :</Text>
                <Text style={styles.summaryValue}>{harvest.pricePerKgFcfa} FCFA/kg</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total à payer :</Text>
                <Text style={styles.totalValue}>
                  {harvest.quantityKg * harvest.pricePerKgFcfa} FCFA
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Moyen de paiement</Text>
            <TouchableOpacity 
              style={[styles.payBtn, { backgroundColor: '#FFCC00' }]}
              onPress={() => handlePay('MTN_MOMO')}
              disabled={loading}
            >
              <Text style={styles.payBtnText}>📱 Payer avec MTN MoMo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.payBtn, { backgroundColor: '#FF6600', marginTop: SPACING.sm }]}
              onPress={() => handlePay('ORANGE_MONEY')}
              disabled={loading}
            >
              <Text style={[styles.payBtnText, { color: COLORS.white }]}>📱 Payer avec Orange Money</Text>
            </TouchableOpacity>

            <View style={styles.securityNote}>
              <Ionicons name="shield-checkmark" size={18} color={COLORS.success} />
              <Text style={styles.securityText}> Ndjan-Soko protège votre argent jusqu'à la livraison.</Text>
            </View>
          </>
        )}

        {step === 1 && (
          <View style={styles.escrowBox}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Text style={styles.lockEmoji}>🔐</Text>
            </Animated.View>
            <Text style={styles.escrowTitle}>Fonds sécurisés (Escrow)</Text>
            <Text style={styles.escrowSub}>
              Votre argent est maintenant bloqué sur un compte tiers Ndjan-Soko. 
              {"\n\n"}Il ne sera versé à l'agriculteur que quand vous confirmerez avoir bien reçu le produit.
            </Text>
            <View style={styles.txBox}>
              <Text style={styles.txLabel}>ID Transaction :</Text>
              <Text style={styles.txValue}>{txId}</Text>
            </View>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmReceipt} disabled={loading}>
              {loading ? <ActivityIndicator color={COLORS.white} /> : (
                <Text style={styles.confirmBtnText}>Confirmer la réception ✓</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.hint}>Ne confirmez qu'une fois le produit en votre possession.</Text>
          </View>
        )}

        {step === 2 && (
          <View style={styles.successBox}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark-circle" size={100} color={COLORS.success} />
            </View>
            <Text style={styles.successTitle}>Paiement terminé !</Text>
            <Text style={styles.successSub}>
              Merci de votre confiance. L'agriculteur a été payé. 
              Retrouvez l'historique dans votre tableau de bord.
            </Text>
            <TouchableOpacity 
              style={styles.doneBtn} 
              onPress={() => navigation.navigate('BuyerDashboard')}
            >
              <Text style={styles.doneBtnText}>Retour au menu</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  stepper: { 
    flexDirection: 'row', justifyContent: 'space-around', 
    padding: SPACING.md, backgroundColor: COLORS.white,
    ...SHADOW.small 
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  stepCircleActive: { backgroundColor: COLORS.primary },
  stepNum: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  stepLabel: { fontSize: 11, color: COLORS.textMuted },
  stepLabelActive: { color: COLORS.primary, fontWeight: '600' },
  
  content: { flex: 1, padding: SPACING.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md, marginTop: SPACING.sm },
  
  summaryCard: { 
    backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md, 
    padding: SPACING.lg, marginBottom: SPACING.xl, ...SHADOW.small 
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: COLORS.textSecondary, fontSize: 14 },
  summaryValue: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  totalLabel: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  totalValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  
  payBtn: { borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center', ...SHADOW.small },
  payBtnText: { fontSize: 16, fontWeight: '700', color: '#333' },
  
  securityNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: SPACING.xl, gap: 4 },
  securityText: { fontSize: 12, color: COLORS.success, fontWeight: '500' },

  escrowBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.md },
  lockEmoji: { fontSize: 80, marginBottom: SPACING.lg },
  escrowTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  escrowSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginVertical: SPACING.lg, lineHeight: 22 },
  txBox: { backgroundColor: COLORS.white, padding: SPACING.md, borderRadius: BORDER_RADIUS.sm, width: '100%', alignItems: 'center', marginBottom: SPACING.xl },
  txLabel: { fontSize: 11, color: COLORS.textMuted },
  txValue: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  confirmBtn: { backgroundColor: COLORS.success, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, width: '100%', alignItems: 'center' },
  confirmBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  hint: { fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.md, textAlign: 'center' },

  successBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  successCircle: { marginBottom: SPACING.lg },
  successTitle: { fontSize: 24, fontWeight: '700', color: COLORS.success, textAlign: 'center' },
  successSub: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.md, lineHeight: 22 },
  doneBtn: { marginTop: SPACING.xl, padding: SPACING.md },
  doneBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 16, textDecorationLine: 'underline' },
});

export default PaymentEscrowScreen;
