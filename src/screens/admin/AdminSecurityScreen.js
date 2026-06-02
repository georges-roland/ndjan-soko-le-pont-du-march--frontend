/**
 * Écran Admin — Sécurité SHA-256 + Simulateur USSD.
 * RESPONSABLE : A
 *
 * COMMENT COMPLÉTER AVEC L'IA :
 * "Implémente la logique du simulateur USSD :
 *  chaque touche du clavier envoie une requête POST à /api/ussd avec
 *  { sessionId, phoneNumber, text: inputSoFar } et affiche la réponse.
 *  Utilise apiClient.post('/ussd', ...) pour les appels."
 */
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { verifyChain } from '../../api/paymentApi';
import apiClient from '../../api/apiClient';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../../utils/theme';

const KEYPAD = ['1','2','3','4','5','6','7','8','9','*','0','#'];

const AdminSecurityScreen = () => {
  const [chainStatus, setChainStatus] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const [ussdScreen, setUssdScreen] = useState('Bienvenue sur Ndjan-Soko\n\nAppuyez sur * pour commencer');
  const [ussdInput, setUssdInput] = useState('');
  const [sessionId] = useState('SIM-' + Date.now());

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const r = await verifyChain();
      setChainStatus(r.data);
    } catch {
      setChainStatus({ valid: false, error: 'Erreur de connexion' });
    } finally {
      setVerifying(false);
    }
  };

  // TODO A : Implémenter la vraie logique USSD avec l'aide de l'IA
  const handleUssdKey = async (key) => {
    const newInput = ussdInput + key;
    setUssdInput(newInput);
    try {
      const res = await apiClient.post('/ussd', {
        sessionId,
        phoneNumber: '237600000000',
        text: newInput,
      });
      setUssdScreen(res.data.message || res.data);
    } catch {
      setUssdScreen(`[Simulation] Touche pressée : ${newInput}\n\nTODO A : Connecter au backend USSD`);
    }
  };

  const handleUssdClear = () => {
    setUssdInput('');
    setUssdScreen('Bienvenue sur Ndjan-Soko\n\nAppuyez sur * pour commencer');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ===== Section SHA-256 ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔗 Registre SHA-256</Text>
          <Text style={styles.cardSub}>Vérifier l'intégrité de la chaîne de transactions</Text>
          <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify} disabled={verifying}>
            {verifying
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={styles.verifyBtnText}>Lancer la vérification</Text>
            }
          </TouchableOpacity>
          {chainStatus && (
            <View style={[styles.resultBox, { backgroundColor: chainStatus.valid ? '#E8F8EE' : '#FEECEC' }]}>
              <Text style={{ fontSize: 32 }}>{chainStatus.valid ? '✅' : '🚨'}</Text>
              <Text style={{ fontWeight: '700', color: chainStatus.valid ? COLORS.success : COLORS.danger }}>
                {chainStatus.valid ? 'Registre intègre' : 'FRAUDE DÉTECTÉE !'}
              </Text>
              {!chainStatus.valid && chainStatus.corruptedIds?.map(id => (
                <Text key={id} style={styles.corruptedTx}>Transaction #{id} compromise</Text>
              ))}
            </View>
          )}
        </View>

        {/* ===== Simulateur USSD ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📱 Simulateur USSD</Text>
          <Text style={styles.cardSub}>Démonstration Nokia pour le jury</Text>

          {/* Écran Nokia */}
          <View style={styles.nokiaPhone}>
            <View style={styles.nokiaScreen}>
              <Text style={styles.nokiaText}>{ussdScreen}</Text>
              {ussdInput.length > 0 && (
                <Text style={styles.nokiaInput}>Saisie: {ussdInput}</Text>
              )}
            </View>

            {/* Clavier */}
            <View style={styles.keypad}>
              {KEYPAD.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.key}
                  onPress={() => handleUssdKey(key)}
                >
                  <Text style={styles.keyText}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.clearKey} onPress={handleUssdClear}>
              <Text style={styles.clearKeyText}>✕ Effacer</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.md, gap: SPACING.md },
  card: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, ...SHADOW.small },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  cardSub: { fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.md },
  verifyBtn: { backgroundColor: COLORS.primaryDark, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  verifyBtnText: { color: COLORS.white, fontWeight: '600' },
  resultBox: { borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginTop: SPACING.md, alignItems: 'center', gap: SPACING.xs },
  corruptedTx: { color: COLORS.danger, fontSize: 13 },

  nokiaPhone: { backgroundColor: '#2a2a2a', borderRadius: 16, padding: SPACING.md, alignItems: 'center' },
  nokiaScreen: {
    backgroundColor: '#1a2e1a', width: '100%', borderRadius: 8,
    padding: SPACING.md, minHeight: 140, marginBottom: SPACING.md,
  },
  nokiaText: { color: '#4ade80', fontFamily: 'monospace', fontSize: 13, lineHeight: 20 },
  nokiaInput: { color: '#86efac', fontFamily: 'monospace', fontSize: 12, marginTop: SPACING.sm, borderTopWidth: 1, borderTopColor: '#2d5a2d', paddingTop: 6 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 192, gap: 8, justifyContent: 'center' },
  key: { width: 52, height: 44, backgroundColor: '#444', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  keyText: { color: COLORS.white, fontSize: 18, fontWeight: '600' },
  clearKey: { marginTop: SPACING.sm, backgroundColor: COLORS.danger, borderRadius: 8, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  clearKeyText: { color: COLORS.white, fontWeight: '600' },
});

export default AdminSecurityScreen;
