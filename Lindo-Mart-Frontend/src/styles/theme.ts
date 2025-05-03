export const theme = {
  colors: {
    brand: {
      primary: "var(--brand-primary)",
      primaryLight: "var(--brand-primary-light)",
      primaryDark: "var(--brand-primary-dark)",
      secondary: "var(--brand-secondary)",
      secondaryLight: "var(--brand-secondary-light)",
      secondaryDark: "var(--brand-secondary-dark)",
    },
    neutral: {
      50: "var(--neutral-50)",
      100: "var(--neutral-100)",
      200: "var(--neutral-200)",
      300: "var(--neutral-300)",
      400: "var(--neutral-400)",
      500: "var(--neutral-500)",
      600: "var(--neutral-600)",
      700: "var(--neutral-700)",
      800: "var(--neutral-800)",
      900: "var(--neutral-900)",
    },
    semantic: {
      success: {
        light: "var(--success-50)",
        base: "var(--success-500)",
        dark: "var(--success-700)",
      },
      warning: {
        light: "var(--warning-50)",
        base: "var(--warning-500)",
        dark: "var(--warning-700)",
      },
      error: {
        light: "var(--error-50)",
        base: "var(--error-500)",
        dark: "var(--error-700)",
      },
      info: {
        light: "var(--info-50)",
        base: "var(--info-500)",
        dark: "var(--info-700)",
      },
    },
    status: {
      pending: "var(--status-pending)",
      approved: "var(--status-approved)",
      rejected: "var(--status-rejected)",
      draft: "var(--status-draft)",
      inProgress: "var(--status-in-progress)",
    },
    background: {
      primary: "var(--bg-primary)",
      secondary: "var(--bg-secondary)",
      tertiary: "var(--bg-tertiary)",
    },
    text: {
      primary: "var(--text-primary)",
      secondary: "var(--text-secondary)",
      tertiary: "var(--text-tertiary)",
      inverted: "var(--text-inverted)",
    },
    border: {
      light: "var(--border-light)",
      medium: "var(--border-medium)",
      dark: "var(--border-dark)",
    },
  },
  shadows: {
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
  },
} as const;

// Type helpers
type ThemeColors = typeof theme.colors;
type ThemeShadows = typeof theme.shadows;

export type { ThemeColors, ThemeShadows };

// Helper function to get status color
export function getStatusColor(status: string): string {
  const statusMap: Record<string, keyof typeof theme.colors.status> = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
    draft: "draft",
    "in-progress": "inProgress",
  };

  const key = statusMap[status.toLowerCase()];
  return key ? theme.colors.status[key] : theme.colors.neutral[500];
}

// Helper function to get status background color
export function getStatusBackgroundColor(status: string): string {
  const statusMap: Record<string, keyof typeof theme.colors.semantic> = {
    pending: "warning",
    approved: "success",
    rejected: "error",
    draft: "info",
    "in-progress": "info",
  };

  const key = statusMap[status.toLowerCase()];
  return key ? theme.colors.semantic[key].light : theme.colors.neutral[100];
}
