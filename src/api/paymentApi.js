/** Appels API paiements. RESPONSABLE : D */
import apiClient from './apiClient';
export const initiateEscrow = (harvestId, provider) =>
  apiClient.post('/payments/escrow', null, { params: { harvestId, provider } });
export const confirmReceipt = (transactionId) =>
  apiClient.post(`/payments/${transactionId}/confirm`);
export const verifyChain = () => apiClient.get('/payments/verify-chain');
