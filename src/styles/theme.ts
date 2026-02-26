import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#FFB533',
    primaryHover: '#FF9500',
    secondary: '#33FFF9',
    success: '#42FF33',
    danger: '#e04428',
    warning: '#FFA500',
    info: '#33A1FF',

    background: '#0a0a0a',
    backgroundSecondary: '#141414',
    backgroundTertiary: '#1a1a1a',
    backgroundCard: '#121212',

    text: '#ffffff',
    textSecondary: '#b0b0b0',
    textMuted: '#666666',

    border: '#2a2a2a',
    borderLight: '#333333',

    rarity: {
      common: '#808080',
      rare: '#33FFF9',
      legendary: '#FFB533',
      mythic: '#e04428',
    },

    glow: {
      primary: '0 0 20px rgba(255, 181, 51, 0.5)',
      secondary: '0 0 20px rgba(51, 255, 249, 0.5)',
      success: '0 0 20px rgba(66, 255, 51, 0.5)',
      danger: '0 0 20px rgba(224, 68, 40, 0.5)',
    },
  },

  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Space Grotesk', 'Inter', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },

  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    card: '0 4px 20px rgba(0, 0, 0, 0.3)',
    glow: '0 0 30px rgba(255, 181, 51, 0.2)',
  },

  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '350ms ease',
    bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    popover: 400,
    tooltip: 500,
    toast: 600,
  },
};

export type Theme = typeof theme;

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }
  
  body {
    font-family: ${theme.fonts.primary};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: 700;
    line-height: 1.2;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
  }
  
  input, textarea, select {
    font-family: inherit;
    border: none;
    outline: none;
  }
  
  ul, ol {
    list-style: none;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  ::selection {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.background};
  }
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${theme.colors.backgroundSecondary};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.borderLight};
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(255, 181, 51, 0.3); }
    50% { box-shadow: 0 0 40px rgba(255, 181, 51, 0.6); }
  }
`;
