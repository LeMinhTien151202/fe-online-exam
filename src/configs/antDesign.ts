import { ThemeConfig } from "antd";

export const APP_COLORS = {
  primary: "#1a365d",
  secondary: "#1a365d",
  // Accent phụ cùng họ navy (thay cho xanh dương #2563eb mặc định)
  accent: "#3b5b8c",
  success: "#52c41a",
  warning: "#faad14",
  error: "#ff4d4f",
  info: "#3b5b8c",
  background: "#f0f2f5",
  text: "#000000d9",
  textSecondary: "#00000073",
};

// Thang bo góc thống nhất toàn dự án (SHAPE CONSISTENCY LOCK)
export const RADIUS = {
  sm: 8,
  md: 10,
  lg: 14,
  pill: 999,
};

// Đổ bóng nhẹ, ám theo nền (không dùng đen thuần) — làm phẳng card
export const SHADOW = {
  card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 6px 16px rgba(15, 23, 42, 0.06)",
  soft: "0 1px 3px rgba(15, 23, 42, 0.05)",
};

export const FONT_FAMILY =
  '"Outfit", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export const antThemeConfig: ThemeConfig = {
  token: {
    colorPrimary: APP_COLORS.primary,
    colorInfo: APP_COLORS.info,
    colorSuccess: APP_COLORS.success,
    colorWarning: APP_COLORS.warning,
    colorError: APP_COLORS.error,
    colorLink: APP_COLORS.accent,
    borderRadius: RADIUS.md,
    borderRadiusLG: RADIUS.lg,
    borderRadiusSM: RADIUS.sm,
    fontFamily: FONT_FAMILY,
    // Giảm rung động bóng mặc định của antd cho cảm giác phẳng, hiện đại
    boxShadow: SHADOW.card,
    boxShadowSecondary: SHADOW.card,
  },
  components: {
    Button: {
      fontWeight: 600,
      controlHeight: 36,
      // Nút phẳng: bỏ bóng mặc định, tương tác bằng hover/active (xem index.css)
      primaryShadow: "none",
      defaultShadow: "none",
      dangerShadow: "none",
    },
    Table: {
      headerBg: "#fafafa",
      headerColor: APP_COLORS.text,
      headerSortActiveBg: "#f0f0f0",
    },
    Card: {
      colorBorderSecondary: "#e2e8f0",
      boxShadowTertiary: SHADOW.card,
      borderRadiusLG: RADIUS.lg,
    },
    Modal: {
      borderRadiusLG: RADIUS.lg,
    },
    Input: {
      borderRadius: RADIUS.sm,
    },
    Select: {
      borderRadius: RADIUS.sm,
    },
  },
};
