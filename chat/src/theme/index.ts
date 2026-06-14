export const colors = {
  userBubble: '#2563EB',
  userText: '#FFFFFF',
  botBubbleLight: '#F3F4F6',
  botBubbleDark: '#1F2937',
  botTextLight: '#111827',
  botTextDark: '#F9FAFB',
  background: {
    light: '#FFFFFF',
    dark: '#111827',
  },
  inputBorder: {
    light: '#E5E7EB',
    dark: '#374151',
  },
  placeholder: {
    light: '#9CA3AF',
    dark: '#6B7280',
  },
  statusOnline: '#10B981',
  statusConnecting: '#F59E0B',
  statusError: '#EF4444',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 20,
  full: 9999,
} as const;
