import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the shape of a theme
interface Theme {
  name: string;
  colors: {
    '--color-primary': string; // RGB values like "79 70 229"
    '--color-primary-hover': string;
  };
}

// Define available themes
const themes: Record<string, Theme> = {
  indigo: {
    name: 'Indigo',
    colors: { '--color-primary': '79 70 229', '--color-primary-hover': '67 56 202' }
  },
  blue: {
    name: 'Blue',
    colors: { '--color-primary': '59 130 246', '--color-primary-hover': '37 99 235' }
  },
  green: {
    name: 'Green',
    colors: { '--color-primary': '16 185 129', '--color-primary-hover': '5 150 105' }
  },
  rose: {
    name: 'Rose',
    colors: { '--color-primary': '225 29 72', '--color-primary-hover': '190 18 60' }
  },
  teal: {
    name: 'Teal',
    colors: { '--color-primary': '21 191 233', '--color-primary-hover': '18 172 207' }
  }
};

// Define the context shape
interface ThemeContextType {
  theme: string;
  setTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to apply theme
const applyTheme = (themeName: string) => {
  const theme = themes[themeName] || themes.indigo;
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app-theme') || 'indigo';
    }
    return 'indigo';
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (themeName: string) => {
    if (themes[themeName]) {
      localStorage.setItem('app-theme', themeName);
      setThemeState(themeName);
    }
  };

  const value = { theme, setTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};