/**
 * Global styles for the Sizible Fashion Style Advice application
 * 
 * This component defines global styles using styled-components to ensure
 * consistent styling across the entire application, including font imports,
 * base element styling, and reset CSS.
 */

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Reset CSS */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Base styles */
  html, body {
    font-family: ${props => props.theme.typography.fontFamily.primary};
    font-size: 16px;
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.background};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.typography.fontFamily.primary};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    margin-bottom: ${props => props.theme.spacing.medium};
  }

  h1 {
    font-size: ${props => props.theme.typography.fontSize.xxlarge};
  }

  h2 {
    font-size: ${props => props.theme.typography.fontSize.xlarge};
  }

  h3 {
    font-size: ${props => props.theme.typography.fontSize.large};
  }

  p {
    margin-bottom: ${props => props.theme.spacing.medium};
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: ${props => props.theme.transitions.default};

    &:hover {
      text-decoration: underline;
    }
  }

  /* Form elements */
  button, .button {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${props => props.theme.borderRadius.medium};
    padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
    font-family: ${props => props.theme.typography.fontFamily.primary};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: ${props => props.theme.transitions.default};

    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  input, textarea, select {
    font-family: ${props => props.theme.typography.fontFamily.primary};
    font-size: ${props => props.theme.typography.fontSize.medium};
    padding: ${props => props.theme.spacing.small};
    border: 1px solid #ddd;
    border-radius: ${props => props.theme.borderRadius.small};
    width: 100%;
    margin-bottom: ${props => props.theme.spacing.medium};

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }

  /* Container */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${props => props.theme.spacing.medium};
  }

  /* Utility classes */
  .text-center {
    text-align: center;
  }

  .mt-1 { margin-top: ${props => props.theme.spacing.small}; }
  .mt-2 { margin-top: ${props => props.theme.spacing.medium}; }
  .mt-3 { margin-top: ${props => props.theme.spacing.large}; }
  .mt-4 { margin-top: ${props => props.theme.spacing.xlarge}; }

  .mb-1 { margin-bottom: ${props => props.theme.spacing.small}; }
  .mb-2 { margin-bottom: ${props => props.theme.spacing.medium}; }
  .mb-3 { margin-bottom: ${props => props.theme.spacing.large}; }
  .mb-4 { margin-bottom: ${props => props.theme.spacing.xlarge}; }
`;

export default GlobalStyles;