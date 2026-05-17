import { ThemeConfig } from 'antd';

export const APP_COLORS = {
  primary: '#00205B',
  secondary: '#2D447F',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff',
  background: '#f0f2f5',
  text: '#000000d9',
  textSecondary: '#00000073',
};

export const antThemeConfig: ThemeConfig = {
  token: {
    colorPrimary: APP_COLORS.primary,
    colorInfo: APP_COLORS.info,
    colorSuccess: APP_COLORS.success,
    colorWarning: APP_COLORS.warning,
    colorError: APP_COLORS.error,
    borderRadius: 8,
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    Button: {
      fontWeight: 600,
      controlHeight: 36,
    },
    Table: {
      headerBg: '#fafafa',
      headerColor: APP_COLORS.text,
      headerSortActiveBg: '#f0f0f0',
    },
    Card: {
      boxShadowTertiary: '0 1px 2px rgba(0,0,0,0.05)',
    },
  },
};
