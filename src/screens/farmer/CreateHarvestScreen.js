/**
 * Écran de création d'une récolte — multi-étapes.
 * RESPONSABLE : R
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, Image, ActivityIndicator, Alert, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { createHarvest } from '../../api/harvestApi';
import { useOfflineSync } from '../../hooks/useOfflineSync';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../../utils/theme';

const STEPS = ['📸 Photo', '📋 Détails', '📍 Localisation', '✅ Confirmation'];

const PRODUCT_TYPES = ['Tomate', 'Piment', 'Maïs', 'Manioc', 'Oignon', 'Banane Plantain', 'Autre'];

const UNITS = [
  { id: 'KG', label: 'Kg' },
  { id: 'SAC_LG', label: 'Grand Sac (100L)', icon: 'bag-outline' },
  { id: 'SAC_STD', label: 'Sac Standard', icon: 'bag-outline' },
  { id: 'FILET', label: 'Filet', icon: 'grid-outline' },
  { id: 'CAISSE', label: 'Caisse / Cageot', icon: 'cube-outline' },
  { id: 'REGIME', label: 'Régime', icon: 'leaf-outline' },
  { id: 'BASSINE', label: 'Bassine', icon: 'color-fill-outline' },
];

const UNIT_CONVERSIONS = {
  'Tomate': { 'CAISSE': 22, 'BASSINE': 15, 'FILET': 10 },
  'Piment': { 'SAC_STD': 45, 'BASSINE': 10, 'FILET': 5 },
  'Maïs': { 'SAC_LG': 90, 'SAC_STD': 50 },
  'Manioc': { 'SAC_LG': 90, 'SAC_STD': 50 },
  'Oignon': { 'SAC_STD': 45, 'FILET': 25 },
  'Banane Plantain': { 'REGIME': 20 },
  'Autre': { 'SAC_LG': 80, 'SAC_STD': 40, 'CAISSE': 20, 'BASSINE': 12, 'FILET': 10 }
};

// Mapping vers l'Enum du backend
const PRODUCT_ENUM_MAP = {
  'Tomate': 'TOMATO',
  'Piment': 'PEPPER',
  'Maïs': 'OTHER',
  'Manioc': 'CASSAVA',
  'Oignon': 'ONION',
  'Banane Plantain': 'PLANTAIN',
  'Autre': 'OTHER'
};

const CreateHarvestScreen = ({ navigation }) => {
  const { saveOffline } = useOfflineSync();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [image, setImage] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [productType, setProductType] = useState('Tomate');
  const [otherProductType, setOtherProductType] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('KG');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState(''); // Prix par Unité (ex: 5000 / sac)
  const [locationName, setLocationName] = useState('');
  const [coords, setCoords] = useState(null);

  // Logic State
  const cameraRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  // Validation checks
  const isStep1Valid = quantity.trim() !== '' && 
                       pricePerUnit.trim() !== '' && 
                       (productType !== 'Autre' || otherProductType.trim() !== '');
  
  const isStep2Valid = locationName.trim() !== '' && coords !== null;

  // Calcul du poids d'une seule unité
  const getUnitWeight = () => {
    if (selectedUnit === 'KG') return 1;
    const prod = productType === 'Autre' ? 'Autre' : productType;
    return UNIT_CONVERSIONS[prod]?.[selectedUnit] || 1;
  };

  // Calcul du poids total en KG
  const getTotalKg = () => {
    const qty = parseFloat(quantity) || 0;
    return qty * getUnitWeight();
  };

  // Conversion du prix unitaire en prix au KG pour le backend
  const getPricePerKg = () => {
    const price = parseFloat(pricePerUnit) || 0;
    return price / getUnitWeight();
  };

  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        analyzeImage();
      }
    } else {
      Alert.alert('Permission refusée', 'L\'accès à l\'appareil photo est nécessaire.');
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        analyzeImage();
      }
    } else {
      Alert.alert('Permission refusée', 'L\'accès à votre galerie est nécessaire.');
    }
  };

  const analyzeImage = () => {
    setLoading(true);
    setTimeout(async () => {
      const result = { category: 'A', maturity: '85%', confidence: 0.98 };
      setAiAnalysis(result);
      const mockPrices = { 'Tomate': 450, 'Piment': 800, 'Maïs': 250, 'Manioc': 300, 'Oignon': 600, 'Banane Plantain': 350, 'Autre': 500 };
      const suggestedPricePerKg = mockPrices[productType] || 400;
      const suggestedPricePerUnit = suggestedPricePerKg * getUnitWeight();
      setPricePerUnit(suggestedPricePerUnit.toString());
      setLoading(false);
    }, 2000);
  };

  const getLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'L\'accès à la localisation est nécessaire.');
        setLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCoords(location.coords);
      setLocationName('Ma position actuelle');
    } catch (e) {
      Alert.alert('Erreur GPS', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    const data = {
      productType: PRODUCT_ENUM_MAP[productType] || 'OTHER',
      variety: productType === 'Autre' ? otherProductType : null,
      quantityKg: getTotalKg(),
      pricePerKgFcfa: getPricePerKg(),
      villageName: locationName,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      qualityCategory: aiAnalysis?.category || 'A',
      maturityPercent: 85,
      createdOffline: false
    };

    try {
      await createHarvest(data);
      Alert.alert('Succès', 'Votre récolte a été publiée !', [
        { text: 'OK', onPress: () => navigation.navigate('FarmerDashboard') }
      ]);
    } catch (e) {
      if (!e.response || e.message === 'Network Error') {
        data.createdOffline = true;
        await saveOffline(data);
        Alert.alert(
          'Mode Hors-ligne',
          'Réseau indisponible. Votre annonce a été sauvegardée localement et sera publiée automatiquement dès que vous aurez du réseau.',
          [{ text: 'OK', onPress: () => navigation.navigate('FarmerDashboard') }]
        );
      } else {
        const status = e.response?.status;
        let msg = "Une erreur est survenue lors de la communication avec le serveur.";
        if (status === 403) msg = "Accès refusé (403). Session expirée ?";
        else if (status === 400) msg = "Données invalides. Vérifiez les champs.";
        Alert.alert('Erreur de publication', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const unitLabel = UNITS.find(u => u.id === selectedUnit)?.label || 'Unité';

    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Ajoutez une photo de votre produit</Text>
            <Text style={styles.stepSub}>Analyse IA (Simulation) : détermine la qualité et suggère un prix.</Text>
            
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <View style={styles.imageActions}>
                  <TouchableOpacity style={styles.miniActionBtn} onPress={handleOpenCamera}>
                    <Ionicons name="camera" size={18} color={COLORS.white} />
                    <Text style={styles.miniActionText}>Refaire</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.miniActionBtn} onPress={pickImageFromGallery}>
                    <Ionicons name="images" size={18} color={COLORS.white} />
                    <Text style={styles.miniActionText}>Galerie</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.photoSourceRow}>
                <TouchableOpacity style={styles.photoSourceBtn} onPress={handleOpenCamera}>
                  <Ionicons name="camera" size={40} color={COLORS.primary} />
                  <Text style={styles.photoSourceText}>Prendre photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoSourceBtn} onPress={pickImageFromGallery}>
                  <Ionicons name="images" size={40} color={COLORS.primary} />
                  <Text style={styles.photoSourceText}>Depuis galerie</Text>
                </TouchableOpacity>
              </View>
            )}

            {loading && (
              <View style={styles.aiBox}>
                <ActivityIndicator color={COLORS.primary} />
                <Text style={styles.aiText}>Analyse IA (Simulation) en cours...</Text>
              </View>
            )}

            {aiAnalysis && !loading && (
              <View style={styles.resultBox}>
                <Text style={styles.resultTitle}>✅ Analyse terminée</Text>
                <View style={styles.resultRow}>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Qualité</Text>
                    <Text style={styles.resultValue}>Catégorie {aiAnalysis.category}</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Maturité</Text>
                    <Text style={styles.resultValue}>{aiAnalysis.maturity}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Détails de la récolte</Text>
            
            <Text style={styles.inputLabel}>Type de produit</Text>
            <View style={styles.pickerContainer}>
              {PRODUCT_TYPES.map(type => (
                <TouchableOpacity 
                  key={type}
                  style={[styles.pickerItem, productType === type && styles.pickerItemActive]}
                  onPress={() => setProductType(type)}
                >
                  <Text style={[styles.pickerText, productType === type && styles.pickerTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {productType === 'Autre' && (
              <TextInput
                style={[styles.input, { marginTop: SPACING.sm }]}
                placeholder="Précisez le produit (ex: Avocat)"
                value={otherProductType}
                onChangeText={setOtherProductType}
              />
            )}

            <Text style={styles.inputLabel}>Unité de mesure</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
              <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                {UNITS.map(unit => {
                  if (unit.id === 'REGIME' && productType !== 'Banane Plantain') return null;
                  if (unit.id === 'CAISSE' && productType !== 'Tomate' && productType !== 'Autre') return null;
                  if (unit.id === 'FILET' && !['Tomate', 'Piment', 'Oignon', 'Autre'].includes(productType)) return null;

                  return (
                    <TouchableOpacity 
                      key={unit.id}
                      style={[styles.unitItem, selectedUnit === unit.id && styles.unitItemActive]}
                      onPress={() => setSelectedUnit(unit.id)}
                    >
                      <Ionicons name={unit.icon || 'scale-outline'} size={18} color={selectedUnit === unit.id ? COLORS.white : COLORS.textSecondary} />
                      <Text style={[styles.unitText, selectedUnit === unit.id && styles.unitTextActive]}>{unit.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <Text style={styles.inputLabel}>Quantité (nombre de {unitLabel}) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 10"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />

            {selectedUnit !== 'KG' && quantity !== '' && (
              <View style={styles.kgEstimation}>
                <Ionicons name="information-circle" size={16} color={COLORS.primary} />
                <Text style={styles.kgEstimationText}>
                  Poids total estimé : <Text style={{fontWeight: '700'}}>{getTotalKg()} Kg</Text>
                </Text>
              </View>
            )}

            <Text style={styles.inputLabel}>Prix par {unitLabel} (FCFA) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 5000"
              keyboardType="numeric"
              value={pricePerUnit}
              onChangeText={setPricePerUnit}
            />
            {pricePerUnit ? (
              <Text style={styles.hint}>
                Soit environ {Math.round(getPricePerKg())} FCFA / Kg
              </Text>
            ) : null}
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Où se trouve la récolte ?</Text>
            <Text style={styles.stepSub}>Position GPS requise pour la collecte.</Text>

            <TouchableOpacity 
              style={[styles.locationBtn, coords && styles.locationBtnActive]} 
              onPress={getLocation}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color={COLORS.primary} /> : (
                <>
                  <Ionicons name="location" size={24} color={coords ? COLORS.white : COLORS.primary} />
                  <Text style={[styles.locationBtnText, coords && styles.locationBtnTextActive]}>
                    {coords ? 'Position GPS capturée' : 'Ma position GPS actuelle'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Nom du village ou quartier *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Mbankomo"
              value={locationName}
              onChangeText={setLocationName}
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Résumé de l'annonce</Text>
            
            <View style={styles.summaryCard}>
              <Image source={{ uri: image }} style={styles.summaryImage} />
              <View style={styles.summaryInfo}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Produit :</Text>
                  <Text style={styles.summaryValue}>{productType === 'Autre' ? otherProductType : productType}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Quantité :</Text>
                  <Text style={styles.summaryValue}>{getTotalKg()} Kg ({quantity} {unitLabel})</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Prix total :</Text>
                  <Text style={styles.summaryValue}>{parseInt(quantity || 0) * parseInt(pricePerUnit || 0)} FCFA</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Lieu :</Text>
                  <Text style={styles.summaryValue}>{locationName}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Qualité :</Text>
                  <Text style={styles.summaryValueText}>Catégorie {aiAnalysis?.category || 'A'}</Text>
                </View>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (step === 0) return !image;
    if (step === 1) return !isStep1Valid;
    if (step === 2) return !isStep2Valid;
    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stepBar}>
        {STEPS.map((s, i) => (
          <View key={i} style={[styles.stepDot, i <= step && styles.stepDotActive]}>
            <Text style={[styles.stepDotText, i <= step && styles.stepDotTextActive]}>
              {i + 1}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.stepLabel}>{STEPS[step]}</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.navRow}>
        {step > 0 && (
          <TouchableOpacity style={styles.btnBack} onPress={() => setStep(s => s - 1)}>
            <Text style={styles.btnBackText}>← Retour</Text>
          </TouchableOpacity>
        )}
        {step < STEPS.length - 1 ? (
          <TouchableOpacity 
            style={[styles.btnNext, isNextDisabled() && styles.btnDisabled]} 
            onPress={() => setStep(s => s + 1)}
            disabled={isNextDisabled()}
          >
            <Text style={styles.btnNextText}>Suivant →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.btnPublish, loading && styles.btnDisabled]} 
            onPress={handlePublish}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.btnNextText}>Publier l'annonce</Text>}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  stepBar: { flexDirection: 'row', justifyContent: 'center', gap: 24, padding: SPACING.md },
  stepDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center',
  },
  stepDotActive: { backgroundColor: COLORS.primary },
  stepDotText: { color: COLORS.textSecondary, fontWeight: '600' },
  stepDotTextActive: { color: COLORS.white },
  stepLabel: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  scroll: { padding: SPACING.md, flexGrow: 1 },
  stepContainer: { flex: 1 },
  stepTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  stepSub: { fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.xl },
  photoSourceRow: { flexDirection: 'row', gap: SPACING.md, justifyContent: 'center', marginTop: SPACING.xl },
  photoSourceBtn: { 
    width: 140, height: 140, backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, 
    justifyContent: 'center', alignItems: 'center', ...SHADOW.small, borderWidth: 1, borderColor: COLORS.border
  },
  photoSourceText: { marginTop: SPACING.sm, color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  imagePreviewContainer: { position: 'relative' },
  imagePreview: { height: 300, borderRadius: BORDER_RADIUS.lg, width: '100%' },
  imageActions: {
    position: 'absolute', bottom: SPACING.md, right: SPACING.md,
    flexDirection: 'row', gap: SPACING.xs
  },
  miniActionBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, 
    borderRadius: BORDER_RADIUS.md, flexDirection: 'row', alignItems: 'center', gap: 4
  },
  miniActionText: { color: COLORS.white, fontSize: 11, fontWeight: '600' },
  aiBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.lg, padding: SPACING.md, backgroundColor: '#E8F5E9', borderRadius: BORDER_RADIUS.md },
  aiText: { color: COLORS.success, fontSize: 14, fontWeight: '500' },
  resultBox: { marginTop: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md, ...SHADOW.small },
  resultTitle: { fontSize: 16, fontWeight: '600', color: COLORS.success, marginBottom: SPACING.sm },
  resultRow: { flexDirection: 'row', justifyContent: 'space-around' },
  resultItem: { alignItems: 'center' },
  resultLabel: { fontSize: 12, color: COLORS.textSecondary },
  resultValue: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  inputLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginTop: SPACING.md, marginBottom: SPACING.xs },
  input: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, fontSize: 16 },
  hint: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, fontStyle: 'italic' },
  pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginVertical: SPACING.xs },
  pickerItem: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
  pickerItemActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  pickerText: { fontSize: 13, color: COLORS.textSecondary },
  pickerTextActive: { color: COLORS.white, fontWeight: '600' },
  unitItem: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
  unitItemActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  unitText: { fontSize: 12, color: COLORS.textSecondary },
  unitTextActive: { color: COLORS.white, fontWeight: '600' },
  kgEstimation: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E3F2FD', padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm, marginTop: SPACING.xs },
  kgEstimationText: { fontSize: 13, color: COLORS.info },
  locationBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.lg, backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.primary, marginVertical: SPACING.md },
  locationBtnActive: { backgroundColor: COLORS.primary },
  locationBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 16 },
  locationBtnTextActive: { color: COLORS.white },
  summaryCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', ...SHADOW.medium },
  summaryImage: { height: 180, width: '100%' },
  summaryInfo: { padding: SPACING.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: COLORS.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  summaryValueText: { fontSize: 14, fontWeight: '700', color: COLORS.success },
  infoBox: { flexDirection: 'row', gap: SPACING.sm, backgroundColor: '#E3F2FD', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.lg },
  infoText: { flex: 1, fontSize: 12, color: COLORS.info, lineHeight: 18 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.md, backgroundColor: COLORS.white, gap: SPACING.sm, ...SHADOW.medium },
  btnBack: { flex: 1, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  btnBackText: { color: COLORS.textSecondary, fontWeight: '500' },
  btnNext: { flex: 2, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, alignItems: 'center' },
  btnPublish: { flex: 2, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.success, alignItems: 'center' },
  btnDisabled: { opacity: 0.5 },
  btnNextText: { color: COLORS.white, fontWeight: '600', fontSize: 15 },
});

export default CreateHarvestScreen;
