/** Appels API logistique. RESPONSABLE : B */
import apiClient from './apiClient';
export const declareTrip = (data) => apiClient.post('/trips', data);
export const getMyTrips = () => apiClient.get('/trips/my');
export const validateQrCode = (qrCode) => apiClient.post(`/logistics/qr/${qrCode}`);
export const getAvailableLots = () => apiClient.get('/logistics/lots/available');
