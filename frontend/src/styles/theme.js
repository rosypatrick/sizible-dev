/**
 * Sizible brand theme configuration
 * 
 * This file defines the color palette, typography, spacing, and other
 * design tokens used throughout the application to maintain consistent
 * styling aligned with Sizible's brand identity.
 */

export const theme = {
  colors: {
    primary: '#ff5ea3',     // Sizible pink
    secondary: '#ffffff',   // White
    text: '#333333',        // Dark gray/black
    background: '#f8f9fa',  // Light gray
    accent: '#f0f0f0'       // Very light gray
  },
  typography: {
    fontFamily: {
      primary: "'Poppins', sans-serif",
      secondary: "'Montserrat Alternates', 'Manrope', sans-serif"
    },
    fontSize: {
      small: '0.875rem',    // 14px
      medium: '1rem',       // 16px
      large: '1.25rem',     // 20px
      xlarge: '1.5rem',     // 24px
      xxlarge: '2rem'       // 32px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  spacing: {
    unit: '8px',
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px',
    xxlarge: '48px'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    round: '50%'
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.1)',
    large: '0 8px 16px rgba(0,0,0,0.1)'
  },
  transitions: {
    default: 'all 0.2s ease-in-out'
  }
};

export default theme;