/**
 * Point d'entrée React Native — Ndjan-Soko.
 * RESPONSABLE : F — NE PAS MODIFIER.
 */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" backgroundColor="#0F4A33" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
