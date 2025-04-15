// Color palette for the app
export const colors = {
  // Primary colors
  primary: '#3B82F6', // Soft blue
  primaryLight: '#93C5FD',
  primaryDark: '#2563EB',
  
  // Secondary colors
  secondary: '#EC4899', // Pink
  secondaryLight: '#F9A8D4',
  secondaryDark: '#DB2777',
  
  // Neutrals
  background: '#F8FAFC', // Very light blue-gray
  card: '#FFFFFF',
  text: '#1E293B', // Dark blue-gray
  textSecondary: '#64748B', // Medium blue-gray
  border: '#E2E8F0', // Light blue-gray
  
  // Feedback colors
  success: '#10B981', // Emerald
  error: '#EF4444', // Red
  warning: '#F59E0B', // Amber
  info: '#0EA5E9', // Sky blue
  
  // Misc
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Mastery levels
  mastery0: '#E2E8F0', // Not started
  mastery1: '#FCD34D', // Just started
  mastery2: '#FBBF24', // Learning
  mastery3: '#F59E0B', // Familiar
  mastery4: '#10B981', // Proficient
  mastery5: '#0EA5E9', // Mastered
};

// Theme configuration
export const theme = {
  colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

export default theme;