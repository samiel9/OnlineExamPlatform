const theme = {
  colors: {
    brand: {
      primary: '#3366FF',        // Bright blue for primary actions
      primaryLight: '#E6F0FF',   // Light blue background
      primaryDark: '#264DCC',    // Darker hover color
      accent: '#00C48C',         // Teal accent for highlights
      accentDark: '#009F75',     // Darker accent
      success: '#28A745',        // Green success messages
      successDark: '#218838',    // Darker green for success hover
      warning: '#FFC107',        // Yellow warnings
      warningDark: '#E0A800',    // Darker yellow for warning hover
      warningDarker: '#C69500',  // Even darker for warning active
      error: '#DC3545',          // Red errors // Assuming 'error' is used for 'danger'
      errorDark: '#C82333',      // Darker red for error/danger hover
      errorDarker: '#B21F2C',    // Even darker for error/danger active
    },
    neutral: {
      0: '#FFFFFF',
      100: '#F5F7FA',
      200: '#E4E8EF',
      300: '#CED4DE',
      400: '#ADB5BD',
      500: '#6C757D',
      600: '#495057',
      700: '#343A40',
      800: '#212529',
      900: '#121416',
    },
    semantic: {
      text: '#212529',       // Primary text
      textLight: '#495057',  // Secondary text
      background: '#F5F7FA', // Light background
      surface: '#FFFFFF',    // Card backgrounds
      onSurface: '#212529',  // Text on cards
      border: '#E4E8EF',
    },
    status: { // Added status colors
      actif: '#28A745', // Green for active (maps to brand.success)
      enPause: '#FFC107', // Yellow for paused (maps to brand.warning)
      archivé: '#6C757D', // Grey for archived (maps to neutral.500)
      neutral: '#6C757D', // Default/neutral status color
      success: '#28A745', // Explicitly success for status context
      warning: '#FFC107', // Explicitly warning for status context
      danger: '#DC3545',  // Explicitly danger for status context (maps to brand.error)
    }
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif"
  },
  fontSizes: {
    xs: '0.75rem',  // 12px
    sm: '0.875rem', // 14px
    base: '1rem',    // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem',  // 20px
    xxl: '1.5rem', // 24px
    h1: '2.25rem', // 36px
    h2: '1.875rem',// 30px
    h3: '1.5rem',  // 24px
    h4: '1.25rem', // 20px
    h5: '1.125rem',// 18px
    h6: '1rem'     // 16px
  },
  lineHeights: {
    body: 1.6,
    heading: 1.3,
    normal: 1.5, // kept for compatibility if used elsewhere
  },
  spacing: {
    xxs: '0.25rem', // 4px
    xs: '0.5rem',  // 8px
    sm: '0.75rem', // 12px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
    xxl: '3rem',   // 48px
    section: '4rem' // 64px for larger section spacing
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%'
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.05)',
    md: '0 3px 6px rgba(0,0,0,0.07)',
    lg: '0 10px 20px rgba(0,0,0,0.07)',
    xl: '0 20px 40px rgba(0,0,0,0.1)'
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  maxWidth: '1200px', // Max width for main content container
  headerHeight: '70px'
};

// Backward compatibility aliases for styled-components referencing older theme paths
// Provide theme.colors.background.paper and theme.colors.background.disabled
theme.colors.background = {
  paper: theme.colors.semantic.surface,
  disabled: theme.colors.neutral[200],
};

// Provide theme.borderRadius.default
theme.borderRadius = theme.radii;

export default theme;
