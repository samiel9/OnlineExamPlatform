// filepath: src/assets/styles/darkTheme.js
// A simple dark theme based on the light theme
import baseTheme from './theme';

const darkTheme = {
  ...baseTheme,
  colors: {
    // Brand stays consistent with light theme
    brand: {
      ...baseTheme.colors.brand,
    },
    // Semantic roles for dark mode
    semantic: {
      text: '#E0E0E0',       // Primary text
      textLight: '#B0B0B0',  // Secondary text
      background: '#121212', // Page background
      surface: '#1E1E1E',    // Card surfaces
      onSurface: '#E0E0E0',   // Text on surfaces
      border: '#2C2C2C',     // Borders and dividers
    },
    // Neutral gray scale for dark mode
    neutral: {
      0: '#000000',
      100: '#1A1A1A',
      200: '#2C2C2C',
      300: '#3E3E3E',
      400: '#505050',
      500: '#6E6E6E',
      600: '#8C8C8C',
      700: '#A8A8A8',
      800: '#C8C8C8',
      900: '#E6E6E6',
    },
    // Provide background aliases
    background: {
      paper: '#1E1E1E',
      disabled: '#2C2C2C',
    },
  },
};

export default darkTheme;
