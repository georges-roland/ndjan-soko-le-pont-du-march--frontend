/** Appels API récoltes. RESPONSABLE : R */
import apiClient from './apiClient';
export const createHarvest = (data) => apiClient.post('/harvests', data);
export const getMyHarvests = () => apiClient.get('/harvests/my');
export const getAvailableHarvests = (params) => apiClient.get('/harvests', { params });
export const suggestPrice = (qualityCategory, productType) =>
  apiClient.get('/harvests/suggest-price', { params: { qualityCategory, productType } });
