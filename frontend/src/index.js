import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';
import { ThemeModeProvider } from './contexts/ThemeContext';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root.

root.render(
  <React.StrictMode>
    <ThemeModeProvider>
      <App />
    </ThemeModeProvider>
  </React.StrictMode>
);
