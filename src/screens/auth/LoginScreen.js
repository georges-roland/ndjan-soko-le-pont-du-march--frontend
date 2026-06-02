/**
 * Écran de connexion OTP SMS.
 * RESPONSABLE : F
 *
 * COMMENT COMPLÉTER AVEC L'IA :
 * "Dans ce composant React Native, implémente handleSendOtp() :
 *  appeler sendOtp(phone) de authApi.js, en cas de succès passer setStep(2).
 *  Implémente handleVerifyOtp() : appeler verifyOtp(phone, code, selectedRole),
 *  récupérer le token dans la réponse, appeler login(token) du AuthContext.
 *  Le RootNavigator redirigera automatiquement selon le rôle dans le JWT."
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
  Modal, Pressable, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { sendOtp, verifyOtp } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../../utils/theme';

const ROLES = [
  {
    key: 'FARMER',
    emoji: '👨‍🌾',
    label: 'Agriculteur / GIC',
    desc: 'Je produis des récoltes à vendre',
    color: COLORS.success,
  },
  {
    key: 'BUYER',
    emoji: '🛒',
    label: 'Acheteur',
    desc: 'Bayam-Sellam, Grossiste, Supermarché',
    color: COLORS.info,
  },
  {
    key: 'TRANSPORTER',
    emoji: '🚚',
    label: 'Transporteur',
    desc: 'Je transporte des marchandises',
    color: COLORS.warning,
  },
  {
    key: 'HUB_MANAGER',
    emoji: '🏪',
    label: 'Gérant de Hub',
    desc: 'Je gère un entrepôt partenaire',
    color: COLORS.accent,
  },
];

const LoginScreen = ({ navigation, route }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { login } = useAuth();

  useEffect(() => {
    if (route.params?.preSelectedRole) {
      setSelectedRole(route.params.preSelectedRole);
    }
  }, [route.params]);

  // Reset des messages quand on change de numéro ou de step
  const handlePhoneChange = (val) => {
    setPhone(val);
    setError(null);
    setInfo(null);
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setShowRoleModal(false);
    setInfo(null);
  };

  // Implémentation réelle avec les APIs backend
  const handleSendOtp = async () => {
    if (phone.length < 9) {
      setError('Veuillez entrer un numéro camerounais valide.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const formattedPhone = phone.startsWith('237') ? phone : '237' + phone;
      const role = selectedRole || route.params?.preSelectedRole || null;
      
      await sendOtp(formattedPhone, role);
      setStep(2);
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data || '';
      
      if (msg.includes('NEW_USER_REQUIRED_ROLE')) {
        setInfo('C\'est votre première connexion ! Veuillez choisir votre rôle pour créer votre compte.');
        setShowRoleModal(true);
      } else {
        setError('Impossible d\'envoyer le code. Vérifiez votre connexion.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Implémentation réelle de la vérification
  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const formattedPhone = phone.startsWith('237') ? phone : '237' + phone;
      const role = selectedRole || route.params?.preSelectedRole || null;
      
      const response = await verifyOtp(formattedPhone, code, role);
      const token = typeof response.data === 'string' ? response.data : response.data.token;
      await login(token);
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data || '';
      
      if (msg.includes('Première connexion') || msg.includes('précisez votre rôle')) {
        setInfo('Première connexion : veuillez choisir un rôle.');
        setShowRoleModal(true);
      } else {
        setError(msg || 'Le code saisi est invalide ou expiré.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        {/* Logo */}
        <View style={styles.header}>
          <Text style={styles.logo}>🌿</Text>
          <Text style={styles.appName}>Ndjan-Soko</Text>
          <Text style={styles.tagline}>Le Pont du Marché</Text>
        </View>

        {/* Carte formulaire */}
        <View style={styles.card}>
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {info && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>💡 {info}</Text>
              <TouchableOpacity 
                style={styles.infoBtn}
                onPress={() => setShowRoleModal(true)}
              >
                <Text style={styles.infoBtnText}>Choisir mon rôle maintenant</Text>
              </TouchableOpacity>
            </View>
          )}

          {selectedRole && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                Rôle : {ROLES.find(r => r.key === selectedRole)?.label}
              </Text>
              <TouchableOpacity onPress={() => setShowRoleModal(true)}>
                <Text style={styles.roleChangeText}>Modifier</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 1 ? (
            <>
              <Text style={styles.stepTitle}>Votre numéro MTN ou Orange</Text>
              <View style={styles.phoneRow}>
                <View style={styles.prefixBox}>
                  <Text style={styles.prefixText}>🇨🇲 +237</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="6XXXXXXXX"
                  keyboardType="phone-pad"
                  maxLength={9}
                  value={phone}
                  onChangeText={handlePhoneChange}
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
              <TouchableOpacity
                style={[styles.btn, loading && styles.btnDisabled]}
                onPress={handleSendOtp}
                disabled={loading || phone.length < 9}
              >
                {loading
                  ? <ActivityIndicator color={COLORS.white} />
                  : <Text style={styles.btnText}>Recevoir le code SMS</Text>
                }
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowRoleModal(true)}>
                <Text style={styles.link}>Première connexion ? Choisir mon rôle</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.stepTitle}>Code reçu par SMS</Text>
              <Text style={styles.stepSub}>Envoyé au +237 {phone}</Text>
              <TextInput
                style={styles.otpInput}
                placeholder="• • • • • •"
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={setCode}
                placeholderTextColor={COLORS.textMuted}
              />
              <TouchableOpacity
                style={[styles.btn, loading && styles.btnDisabled]}
                onPress={handleVerifyOtp}
                disabled={loading || code.length < 6}
              >
                {loading
                  ? <ActivityIndicator color={COLORS.white} />
                  : <Text style={styles.btnText}>Se connecter</Text>
                }
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep(1)}>
                <Text style={styles.link}>← Modifier le numéro</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Modal de choix du rôle */}
        <Modal
          visible={showRoleModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowRoleModal(false)}
        >
          <Pressable 
            style={styles.modalOverlay} 
            onPress={() => setShowRoleModal(false)}
          >
            <Pressable style={styles.modalContent} onPress={() => {}}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowRoleModal(false)}>
                  <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Créer un compte</Text>
                <View style={{ width: 24 }} />
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalSub}>
                  Vous n'avez pas de compte ? Veuillez choisir votre rôle pour continuer.
                </Text>

                <View style={styles.roleGrid}>
                  {ROLES.map((r) => (
                    <TouchableOpacity
                      key={r.key}
                      style={[
                        styles.roleCard,
                        selectedRole === r.key && { borderColor: r.color, borderWidth: 2 },
                      ]}
                      onPress={() => handleRoleSelect(r.key)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.iconCircle, { backgroundColor: r.color + '22' }]}>
                        <Text style={styles.emoji}>{r.emoji}</Text>
                      </View>
                      <Text style={styles.roleLabel}>{r.label}</Text>
                      <Text style={styles.roleDesc}>{r.desc}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryDark },
  inner: { flex: 1, justifyContent: 'center', padding: SPACING.lg },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  logo: { fontSize: 64 },
  appName: { fontSize: 32, fontWeight: '700', color: COLORS.white, marginTop: SPACING.sm },
  tagline: { fontSize: 16, color: COLORS.primaryLight, marginTop: SPACING.xs },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOW.medium,
  },
  errorBox: {
    backgroundColor: '#FFE5E5',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  errorText: { color: COLORS.danger, fontSize: 14, fontWeight: '500' },
  infoBox: {
    backgroundColor: '#E5F1FF',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  infoText: { color: COLORS.info, fontSize: 14, fontWeight: '500' },
  infoBtn: {
    backgroundColor: COLORS.info,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.sm,
    alignItems: 'center',
  },
  infoBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '600' },
  roleBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  roleBadgeText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  roleChangeText: { fontSize: 12, color: COLORS.textMuted, textDecorationLine: 'underline' },
  stepTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  stepSub: { fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.md },
  phoneRow: { flexDirection: 'row', marginBottom: SPACING.md, gap: SPACING.sm },
  prefixBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  prefixText: { fontSize: 14, color: COLORS.primary, fontWeight: '500' },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    fontSize: 18,
    color: COLORS.text,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 28,
    letterSpacing: 12,
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', color: COLORS.primary, marginTop: SPACING.md, fontSize: 14 },

  // Styles Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '100%',
    maxHeight: '80%',
    ...SHADOW.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  modalSub: { fontSize: 15, color: COLORS.textSecondary, marginBottom: SPACING.xl, textAlign: 'center' },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, justifyContent: 'center' },
  roleCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    width: '46%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.small,
  },
  iconCircle: {
    width: 50, height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  emoji: { fontSize: 24 },
  roleLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  roleDesc: { fontSize: 10, color: COLORS.textSecondary, textAlign: 'center', marginTop: 2 },
});

export default LoginScreen;
