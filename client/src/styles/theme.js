// Calm, classy color palette for healthcare
const theme = {
  colors: {
    // Primary calm tones
    primary: {
      main: '#4A90E2',      // Soft blue - trustworthy, calm
      light: '#6BA5E8',
      dark: '#2C5282',
      gradient: 'linear-gradient(135deg, #4A90E2 0%, #6BA5E8 100%)'
    },
    secondary: {
      main: '#48BB78',      // Soft green - health, growth
      light: '#9AE6B4',
      dark: '#276749',
      gradient: 'linear-gradient(135deg, #48BB78 0%, #9AE6B4 100%)'
    },
    accent: {
      main: '#F6AD55',      // Warm peach - gentle warning
      light: '#FEEBC8',
      dark: '#C05621'
    },
    // Neutral calm tones
    neutral: {
      white: '#FFFFFF',
      offWhite: '#F7FAFC',
      lightGray: '#EDF2F7',
      mediumGray: '#CBD5E0',
      gray: '#A0AEC0',
      darkGray: '#4A5568',
      black: '#2D3748'
    },
    // Status colors (softened)
    success: '#48BB78',
    warning: '#F6AD55',
    error: '#FC8181',
    info: '#4A90E2'
  },
  
  // Typography
  typography: {
    fontFamily: {
      main: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      heading: "'Poppins', 'Inter', sans-serif"
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem'  // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  
  // Spacing
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
    '2xl': '4rem'   // 64px
  },
  
  // Border radius
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    full: '9999px'
  },
  
  // Shadows (soft)
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
  },
  
  // Transitions
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.45s ease'
  }
};

export default theme;