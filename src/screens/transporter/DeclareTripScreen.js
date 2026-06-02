/**
 * Formulaire de déclaration de trajet.
 * RESPONSABLE : B
 *
 * COMMENT COMPLÉTER AVEC L'IA :
 * "Remplace les TextInput libres par des Picker (liste déroulante) pour les villes.
 *  Ajoute un DateTimePicker pour la date de départ.
 *  Au submit, appelle declareTrip() et affiche les lots compatibles trouvés."
 */
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { declareTrip } from '../../api/logisticsApi';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../../utils/theme';

const CITIES = ['Bafoussam', 'Yaoundé', 'Douala', 'Dschang', 'Foumbot', 'Mbouda', 'Bangangté'];

const DeclareTripScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    departureCity: '',
    arrivalCity: '',
    departureDate: '',
    totalCapacityKg: '',
    availableCapacityKg: '',
    pricePerKgFcfa: '',
  });

  const handleSubmit = async () => {
    if (!form.departureCity || !form.arrivalCity || !form.availableCapacityKg) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    try {
      const res = await declareTrip({
        ...form,
        totalCapacityKg: Number(form.totalCapacityKg),
        availableCapacityKg: Number(form.availableCapacityKg),
        pricePerKgFcfa: Number(form.pricePerKgFcfa),
      });
      Alert.alert('Trajet déclaré ✓', `${res.data.matchedLots || 0} lot(s) compatible(s) trouvé(s) sur votre route.`);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de déclarer le trajet.');
    }
  };

  const Field = ({ label, field, keyboardType = 'default', placeholder }) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={form[field]}
        onChangeText={v => setForm(f => ({ ...f, [field]: v }))}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {/* TODO B : Remplacer par des Picker de villes */}
          <Field label="Ville de départ *" field="departureCity" placeholder="Ex: Bafoussam" />
          <Field label="Ville d'arrivée *" field="arrivalCity" placeholder="Ex: Douala" />
          <Field label="Date de départ *" field="departureDate" placeholder="JJ/MM/AAAA" />
          <Field label="Capacité totale du camion (kg)" field="totalCapacityKg" keyboardType="number-pad" placeholder="Ex: 10000" />
          <Field label="Espace disponible (kg) *" field="availableCapacityKg" keyboardType="number-pad" placeholder="Ex: 3000" />
          <Field label="Prix par kg (FCFA)" field="pricePerKgFcfa" keyboardType="number-pad" placeholder="Ex: 50" />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Publier mon trajet</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.md },
  card: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, ...SHADOW.small, marginBottom: SPACING.md },
  fieldGroup: { marginBottom: SPACING.md },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm, padding: SPACING.md,
    fontSize: 15, color: COLORS.text,
  },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  submitText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});

export default DeclareTripScreen;
