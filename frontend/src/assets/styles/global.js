import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.base};
    line-height: ${({ theme }) => theme.lineHeights.body};
    background: ${({ theme }) => theme.colors.semantic.background};
    color: ${({ theme }) => theme.colors.semantic.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    color: ${({ theme }) => theme.colors.neutral[900]};
    line-height: ${({ theme }) => theme.lineHeights.heading};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  h1 { font-size: ${({ theme }) => theme.fontSizes.h1}; }
  h2 { font-size: ${({ theme }) => theme.fontSizes.h2}; }
  h3 { font-size: ${({ theme }) => theme.fontSizes.h3}; }
  h4 { font-size: ${({ theme }) => theme.fontSizes.h4}; }
  h5 { font-size: ${({ theme }) => theme.fontSizes.h5}; }
  h6 { font-size: ${({ theme }) => theme.fontSizes.h6}; }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.semantic.textLight};
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.brand.primary};
    font-weight: 500;
    transition: color 0.2s ease-in-out;
    &:hover {
      color: ${({ theme }) => theme.colors.brand.accent};
      text-decoration: underline;
    }
  }

  ul, ol {
    list-style: none;
    padding-left: 0; /* Reset default padding */
  }

  button, input, select, textarea {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.semantic.text};
  }

  button {
    font-family: inherit;
    background-color: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.neutral[0]};
    border-radius: ${({ theme }) => theme.radii.full};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme.colors.brand.primaryDark};
    }

    &:active {
      background-color: ${({ theme }) => theme.colors.brand.primaryDarker};
    }

    &:disabled {
      background-color: ${({ theme }) => theme.colors.neutral[300]};
      cursor: not-allowed;
    }
  }

  input, select, textarea {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${({ theme }) => theme.colors.neutral[0]};
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.brand.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brand.primaryLight};
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  /* Utility classes (optional, but can be helpful) */
  .container {
    width: 100%;
    max-width: ${({ theme }) => theme.maxWidth};
    margin-left: auto;
    margin-right: auto;
    padding-left: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ theme }) => theme.spacing.md};
  }

  .text-center {
    text-align: center;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;
