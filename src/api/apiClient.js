/**
 * Client HTTP Axios centralisé — version React Native.
 * Utilise expo-secure-store au lieu de localStorage (web).
 * NE PAS MODIFIER sans consulter F.
 *
 * COMMENT UTILISER :
 *   import apiClient from '../api/apiClient';
 *   const response = await apiClient.get('/harvests');
 */
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ⚠️ En développement : mettez l'IP locale de votre machine, pas "localhost"
// Adresse IP de votre machine (Wi-Fi) : 172.20.10.3
const BASE_URL = 'http://192.168.100.6:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Injecte automatiquement le JWT dans chaque requête
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('ndjan_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gère l'expiration du token (401)
apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('ndjan_token');
      // Le AuthContext détectera le token absent au prochain render
    }
    return Promise.reject(error);
  }
);

export default apiClient;
