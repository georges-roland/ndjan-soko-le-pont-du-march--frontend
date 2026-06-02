# 🌿 Ndjan-Soko — Frontend React Native (Expo)

## ⚠️ Migration depuis React Web

Ce dossier **remplace** l'ancien `frontend/` (React Web/Create React App).
Le backend Spring Boot reste **identique** — aucune modification nécessaire côté backend.

---

## 🔑 Différences clés Web → React Native

| Web (ancien) | React Native (nouveau) |
|---|---|
| `<div>` | `<View>` |
| `<p>`, `<h1>` | `<Text>` |
| `<input>` | `<TextInput>` |
| `<button>` | `<TouchableOpacity>` |
| `localStorage` | `expo-secure-store` |
| `react-router-dom` | `@react-navigation/native` |
| `useNavigate()` | `navigation.navigate('ScreenName')` |
| `navigator.geolocation` | `expo-location` |
| CSS fichier | `StyleSheet.create({})` |

---

## ⚡ Démarrage rapide

```bash
# Installer Expo CLI (une seule fois)
npm install -g expo-cli

# Dans le dossier ndjan-soko-mobile/
npm install

# Lancer le projet
npx expo start

# Scanner le QR code avec l'app Expo Go sur votre téléphone
# OU appuyer sur 'a' pour Android Emulator, 'i' pour iOS Simulator
```

## 📡 Configuration réseau (IMPORTANT)

Ouvrir `src/api/apiClient.js` et adapter `BASE_URL` :

```js
// Android Emulator
const BASE_URL = 'http://10.0.2.2:8080/api';

// Appareil physique (remplacer par l'IP de votre machine)
const BASE_URL = 'http://192.168.1.XX:8080/api';

// iOS Simulator
const BASE_URL = 'http://localhost:8080/api';
```

---

## 👥 Répartition de l'équipe

| Membre | Fichiers à compléter |
|--------|---------------------|
| **F** | `AuthContext.js`, `LoginScreen.js`, `RegisterRoleScreen.js`, `RootNavigator.js` + créer `JwtService.java` backend |
| **R** | `CreateHarvestScreen.js` (4 étapes), `MyHarvestsScreen.js`, `MarketPriceScreen.js`, `HarvestCatalogScreen.js` |
| **B** | `TransporterDashboard.js`, `DeclareTripScreen.js`, `LogisticsService.java` backend |
| **D** | `PaymentEscrowScreen.js`, `LedgerService.java` (SHA-256) backend |
| **A** | `AdminSecurityScreen.js` (simulateur USSD), `UssdService.java` backend, `HubDashboard.js`, `ScanArrivalScreen.js` |

## 📋 Règles d'intégration (identiques à l'ancien projet)

1. Ne jamais toucher au code d'un autre membre sans le prévenir
2. `apiClient.js` : ne pas modifier (géré par F)
3. `AuthContext.js` : ne pas modifier sans F
4. `RootNavigator.js` : ne pas modifier sans F
5. `theme.js` : ne pas modifier sans consensus d'équipe
6. Chaque module est indépendant → pas de conflits Git

## 🗂️ Structure du projet

```
ndjan-soko-mobile/
├── App.js                          ← Point d'entrée (F)
├── app.json                        ← Config Expo
├── package.json
└── src/
    ├── api/
    │   ├── apiClient.js            ← Client HTTP (F)
    │   ├── authApi.js              ← (F)
    │   ├── harvestApi.js           ← (R)
    │   ├── pricingApi.js           ← (R)
    │   ├── paymentApi.js           ← (D)
    │   └── logisticsApi.js         ← (B)
    ├── context/
    │   └── AuthContext.js          ← (F)
    ├── navigation/
    │   └── RootNavigator.js        ← (F)
    ├── hooks/
    │   └── useOfflineSync.js       ← (R, pour mode hors-ligne)
    ├── utils/
    │   └── theme.js                ← Couleurs et styles globaux
    └── screens/
        ├── auth/
        │   ├── LoginScreen.js      ← (F)
        │   └── RegisterRoleScreen.js ← (F)
        ├── farmer/
        │   ├── FarmerDashboard.js  ← (R)
        │   ├── CreateHarvestScreen.js ← (R) ← IA TFLite ici
        │   └── MyHarvestsScreen.js ← (R)
        ├── buyer/
        │   ├── BuyerDashboard.js   ← (R+D)
        │   ├── MarketPriceScreen.js ← (R)
        │   ├── HarvestCatalogScreen.js ← (R)
        │   └── PaymentEscrowScreen.js ← (D)
        ├── transporter/
        │   ├── TransporterDashboard.js ← (B)
        │   └── DeclareTripScreen.js ← (B)
        ├── hub/
        │   ├── HubDashboard.js     ← (A)
        │   └── ScanArrivalScreen.js ← (A)
        └── admin/
            └── AdminSecurityScreen.js ← (A)
```
