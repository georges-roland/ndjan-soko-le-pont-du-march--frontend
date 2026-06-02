/** Appels API bourse des prix. RESPONSABLE : R */
import apiClient from './apiClient';
export const getTodayPrices = () => apiClient.get('/prices/today');
