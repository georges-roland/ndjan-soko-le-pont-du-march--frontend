/**
 * Context d'authentification global — version React Native.
 * Utilise expo-secure-store (stockage chiffré sur le téléphone).
 * RESPONSABLE : F — NE PAS MODIFIER sans consulter F.
 *
 * COMMENT UTILISER :
 *   import { useAuth } from '../context/AuthContext';
 *   const { user, role, login, logout } = useAuth();
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { decode } from 'base-64';

const AuthContext = createContext(null);

const decodeJwt = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = decode(payload);
    return JSON.parse(decoded);
  } catch (e) { 
    console.error('JWT Decode Error:', e);
    return null; 
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync('ndjan_token');
      if (token) {
        const decoded = decodeJwt(token);
        if (decoded) { setUser(decoded); setRole(decoded.role); }
        else await SecureStore.deleteItemAsync('ndjan_token');
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (token) => {
    await SecureStore.setItemAsync('ndjan_token', token);
    const decoded = decodeJwt(token);
    setUser(decoded);
    setRole(decoded?.role);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('ndjan_token');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
