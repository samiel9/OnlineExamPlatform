import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import Layout from './components/Layout';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeModeProvider, useThemeMode } from './contexts/ThemeContext';

// Global style resets and typography - Les valeurs seront prises du thème actif via ThemeProvider
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { 
    font-family: ${({ theme }) => theme.fonts.body}; 
    background: ${({ theme }) => theme.colors.semantic.background}; 
    color: ${({ theme }) => theme.colors.semantic.text}; 
    scroll-behavior: smooth; 
  }
  body { min-height: 100vh; line-height: ${({ theme }) => theme.lineHeights.body}; }
  a { text-decoration: none; color: inherit; }
  button { font-family: inherit; }
`;

// Composant contenant le contenu de l'application avec accès au thème
const AppContent = () => {
  const { theme } = useThemeMode();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <ThemeModeProvider>
      <AppContent />
    </ThemeModeProvider>
  );
}
