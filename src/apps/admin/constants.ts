export const ADMIN_COLORS = {
  sidebarBg: '#0D2245',
  sidebarActive: '#1d2d44',
  sidebarText: '#94a3b8',
  sidebarTextActive: '#ffffff',
  primary: '#1a365d',
  primaryHover: '#244b80',
  contentBg: '#ffffff',
  cardBg: '#ffffff',
  headerBg: '#ffffff',
  border: '#e2e8f0',
  textPrimary: '#0f172a',
  textSecondary: '#64748b',

  badgeEasyBg: '#dcfce7',
  badgeEasyText: '#15803d',
  badgeMedBg: '#fef9c3',
  badgeMedText: '#a16207',
  badgeHardBg: '#ffedd5',
  badgeHardText: '#c2410c',
  badgeVeryHardBg: '#fce7f3',
  badgeVeryHardText: '#9d174d',

  success: '#16a34a',
  warning: '#f97316',
  danger: '#dc2626',
  info: '#0ea5e9',
};

export const ADMIN_THEME = {
  token: {
    colorPrimary: ADMIN_COLORS.primary,
    colorSuccess: ADMIN_COLORS.success,
    colorWarning: ADMIN_COLORS.warning,
    colorError: ADMIN_COLORS.danger,
    colorInfo: ADMIN_COLORS.info,
    borderRadius: 12,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  components: {
    Card: {
      colorBorderSecondary: '#cbd5e1',
      boxShadowTertiary: '0 4px 20px rgba(0, 0, 0, 0.08)',
    },
  },
};
