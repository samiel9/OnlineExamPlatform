// ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import lightTheme from '../assets/styles/theme';
import darkTheme from '../assets/styles/darkTheme';

const ThemeModeContext = createContext({ darkMode: false, toggle: () => {}, theme: lightTheme });

export const ThemeModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggle = () => setDarkMode(prev => !prev);

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeModeContext.Provider value={{ darkMode, toggle, theme }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeModeContext);
