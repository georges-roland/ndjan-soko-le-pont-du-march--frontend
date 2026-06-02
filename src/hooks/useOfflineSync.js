/**
 * Hook de synchronisation hors-ligne.
 * RESPONSABLE : R (à utiliser dans CreateHarvestScreen)
 *
 * COMMENT ÇA MARCHE :
 * - Sauvegarde les annonces en attente dans SQLite local.
 * - Surveille la connexion réseau avec NetInfo.
 * - Dès que le réseau revient, envoie automatiquement les annonces en attente.
 *
 * COMMENT UTILISER :
 *   import { useOfflineSync } from '../hooks/useOfflineSync';
 *   const { saveOffline, pendingCount } = useOfflineSync();
 *   // Au moment de créer une récolte sans réseau :
 *   await saveOffline({ productType: 'TOMATO', quantityKg: 200, ... });
 */
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import * as SQLite from 'expo-sqlite';
import { createHarvest } from '../api/harvestApi';

const db = SQLite.openDatabaseSync('ndjan_offline.db');

// Crée la table si elle n'existe pas
db.execSync(`
  CREATE TABLE IF NOT EXISTS pending_harvests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export const useOfflineSync = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Compte les annonces en attente au démarrage
  useEffect(() => {
    refreshCount();
  }, []);

  // Surveille la connexion et synchronise dès que le réseau revient
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected && state.isInternetReachable) {
        await syncPending();
      }
    });
    return unsubscribe;
  }, []);

  const refreshCount = () => {
    const result = db.getAllSync('SELECT COUNT(*) as cnt FROM pending_harvests;');
    setPendingCount(result[0]?.cnt ?? 0);
  };

  /**
   * Sauvegarde une récolte localement quand il n'y a pas de réseau.
   * @param {Object} harvestData - Les données du formulaire
   */
  const saveOffline = async (harvestData) => {
    db.runSync(
      'INSERT INTO pending_harvests (data) VALUES (?);',
      [JSON.stringify(harvestData)]
    );
    refreshCount();
  };

  /**
   * Envoie toutes les annonces en attente vers le serveur.
   * Appelé automatiquement quand le réseau revient.
   */
  const syncPending = async () => {
    if (isSyncing) return;
    const pending = db.getAllSync('SELECT * FROM pending_harvests;');
    if (pending.length === 0) return;

    setIsSyncing(true);
    for (const row of pending) {
      try {
        const data = JSON.parse(row.data);
        await createHarvest(data);
        db.runSync('DELETE FROM pending_harvests WHERE id = ?;', [row.id]);
      } catch (e) {
        // Garder en base si l'envoi échoue, réessayer au prochain cycle
        console.log('Sync échouée pour id:', row.id, e.message);
      }
    }
    setIsSyncing(false);
    refreshCount();
  };

  return { saveOffline, syncPending, pendingCount, isSyncing };
};
