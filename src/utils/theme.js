/**
 * Thème global Ndjan-Soko.
 * Importez ces constantes dans tous vos écrans pour une UI cohérente.
 * NE PAS MODIFIER sans consulter F.
 */
export const COLORS = {
  primary: '#1D6B4E',       // Vert forêt principal
  primaryLight: '#E1F5EE',  // Fond vert clair
  primaryDark: '#0F4A33',   // Vert foncé (header)
  accent: '#F7A825',        // Orange marché
  accentLight: '#FFF3D6',

  success: '#27AE60',
  warning: '#F39C12',
  danger: '#E74C3C',
  info: '#2980B9',

  white: '#FFFFFF',
  background: '#F5F7F5',    // Fond général légèrement vert
  card: '#FFFFFF',
  border: '#E0E7E3',
  text: '#1A2E1F',          // Texte principal
  textSecondary: '#6B7F72', // Texte secondaire
  textMuted: '#A0B0A5',     // Texte désactivé

  // Statuts des récoltes
  statusPending: '#F39C12',
  statusGrouped: '#2980B9',
  statusInTransit: '#8E44AD',
  statusDelivered: '#27AE60',
};

export const FONTS = {
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  bold: { fontWeight: '700' },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 999,
};

export const SHADOW = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};
