/**
 * Écran de scan d'arrivée de marchandise au Hub.
 * RESPONSABLE : A (ou membre désigné)
 *
 * COMMENT COMPLÉTER AVEC L'IA :
 * "Utilise expo-camera pour scanner un QR Code.
 *  Quand le QR est détecté, appelle validateQrCode(qrCode) de logisticsApi.
 *  Affiche une confirmation : nom de l'agriculteur, produit, quantité stockée au hub."
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { validateQrCode } from '../../api/logisticsApi';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/theme';

const ScanArrivalScreen = ({ navigation }) => {
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState(null);

  const handleScan = async (code) => {
    try {
      const res = await validateQrCode(code);
      setResult(res.data);
    } catch {
      Alert.alert('Erreur', 'QR Code invalide ou récolte introuvable.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* TODO A : Intégrer expo-camera ici pour le vrai scan QR */}
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraText}>📷</Text>
          <Text style={styles.cameraLabel}>Zone de scan QR Code</Text>
          <Text style={styles.cameraSub}>TODO A : Intégrer expo-camera</Text>
        </View>

        <Text style={styles.orText}>— ou saisir manuellement —</Text>

        <TextInput
          style={styles.input}
          placeholder="Code QR (ex: QR-2024-001)"
          value={manualCode}
          onChangeText={setManualCode}
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="characters"
        />
        <TouchableOpacity style={styles.btn} onPress={() => handleScan(manualCode)}>
          <Text style={styles.btnText}>Valider l'arrivée</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>✅ Arrivée validée</Text>
            <Text style={styles.resultText}>Agriculteur : {result.farmerName}</Text>
            <Text style={styles.resultText}>Produit : {result.productType}</Text>
            <Text style={styles.resultText}>Quantité : {result.quantityKg} kg</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SPACING.md },
  cameraPlaceholder: {
    backgroundColor: '#111', borderRadius: BORDER_RADIUS.lg,
    height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md,
  },
  cameraText: { fontSize: 48 },
  cameraLabel: { color: COLORS.white, fontSize: 14, marginTop: SPACING.sm },
  cameraSub: { color: '#888', fontSize: 12, marginTop: 4 },
  orText: { textAlign: 'center', color: COLORS.textMuted, marginVertical: SPACING.sm },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md, fontSize: 15, color: COLORS.text, backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
  },
  btn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  btnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  resultCard: {
    backgroundColor: COLORS.primaryLight, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, marginTop: SPACING.md, borderLeftWidth: 4, borderLeftColor: COLORS.primary,
  },
  resultTitle: { fontSize: 16, fontWeight: '700', color: COLORS.primary, marginBottom: SPACING.sm },
  resultText: { fontSize: 14, color: COLORS.text, marginBottom: 4 },
});

export default ScanArrivalScreen;
