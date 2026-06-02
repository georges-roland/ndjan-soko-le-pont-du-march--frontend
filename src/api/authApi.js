/** Appels API authentification. RESPONSABLE : F */
import apiClient from './apiClient';
export const sendOtp = (phoneNumber, role) => apiClient.post('/auth/send-otp', { phoneNumber, role });
export const verifyOtp = (phoneNumber, code, role) =>
  apiClient.post('/auth/verify-otp', { phoneNumber, code, role });
