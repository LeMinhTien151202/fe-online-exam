import { APP_COLORS, FONT_FAMILY, RADIUS, SHADOW } from "@/configs/antDesign";

export const ADMIN_COLORS = {
  sidebarBg: "#0D2245",
  sidebarActive: "#1d2d44",
  sidebarText: "#94a3b8",
  sidebarTextActive: "#ffffff",
  primary: APP_COLORS.primary,
  primaryHover: "#244b80",
  contentBg: "#ffffff",
  cardBg: "#ffffff",
  headerBg: "#ffffff",
  border: "#e2e8f0",
  textPrimary: APP_COLORS.text || "#0f172a",
  textSecondary: APP_COLORS.textSecondary || "#64748b",

  badgeEasyBg: "#dcfce7",
  badgeEasyText: "#15803d",
  badgeMedBg: "#fef9c3",
  badgeMedText: "#a16207",
  badgeHardBg: "#ffedd5",
  badgeHardText: "#c2410c",
  badgeVeryHardBg: "#fce7f3",
  badgeVeryHardText: "#9d174d",

  success: "#16a34a",
  warning: "#f97316",
  danger: "#dc2626",
  info: "#0ea5e9",
};

export const ADMIN_THEME = {
  token: {
    colorPrimary: ADMIN_COLORS.primary,
    colorSuccess: ADMIN_COLORS.success,
    colorWarning: ADMIN_COLORS.warning,
    colorError: ADMIN_COLORS.danger,
    colorInfo: ADMIN_COLORS.info,
    // Đồng bộ hệ thống thiết kế chung: font Outfit, thang bo góc & bóng tinted
    borderRadius: RADIUS.md,
    borderRadiusLG: RADIUS.lg,
    borderRadiusSM: RADIUS.sm,
    fontFamily: FONT_FAMILY,
    boxShadow: SHADOW.card,
    boxShadowSecondary: SHADOW.card,
  },
  components: {
    Button: {
      fontWeight: 600,
      controlHeight: 36,
      primaryShadow: "none",
      defaultShadow: "none",
      dangerShadow: "none",
    },
    Card: {
      colorBorderSecondary: "#e2e8f0",
      boxShadowTertiary: SHADOW.card,
      borderRadiusLG: RADIUS.lg,
    },
  },
};
