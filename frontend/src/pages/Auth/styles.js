import styled, { css } from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Make it fill the Layout's Main area */
  width: 100%;
`;

export const MainContent = styled.main`
  flex-grow: 1;
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1; /* Take remaining space in PageWrapper */
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md}; /* Minimal padding for small viewports */
`;

export const AuthCard = styled.div`
  background: ${({ theme }) => theme.colors.semantic.surface};
  padding: ${({ theme }) => theme.spacing.xl}; // Keep xl padding all around
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 100%;
  max-width: 480px; // Increased from 450px

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
    margin-top: ${({ theme }) => theme.spacing.lg}; // Add some margin on small screens if needed
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

export const AuthTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.h2}; // Increased from h3
  color: ${({ theme }) => theme.colors.neutral[800]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const AuthInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md}; // Consistent padding with global
  font-size: ${({ theme }) => theme.fontSizes.base};
  border: 1px solid ${({ theme }) => theme.colors.semantic.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.neutral[0]};
  color: ${({ theme }) => theme.colors.semantic.text};
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out; // Added transition

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brand.primaryLight}; // Consistent with global (3px)
  }
`;

export const AuthTextarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md}; // Consistent padding
  font-size: ${({ theme }) => theme.fontSizes.base};
  border: 1px solid ${({ theme }) => theme.colors.semantic.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.neutral[0]};
  color: ${({ theme }) => theme.colors.semantic.text};
  resize: vertical;
  min-height: 80px; // Ensure a decent default size
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out; // Added transition

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brand.primaryLight}; // Consistent with global (3px)
  }
`;

export const AuthSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  border: 1px solid ${({ theme }) => theme.colors.semantic.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.neutral[0]};
  color: ${({ theme }) => theme.colors.semantic.text};
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5z%22%20fill%3D%22%236C757D%22/%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing.md} center;
  background-size: 1em;
  padding-right: ${({ theme }) => `calc(${theme.spacing.md} + 1.5em)`};
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out; // Added transition

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brand.primaryLight}; // Consistent with global (3px)
  }
`;

export const AuthButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[0]};
  background-color: ${({ theme }) => theme.colors.brand.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.brand.primaryDark};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.brand.primaryDark};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral[300]};
    color: ${({ theme }) => theme.colors.neutral[500]};
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

export const AuthError = styled.p`
  color: ${({ theme }) => theme.colors.brand.error};
  background-color: ${({ theme }) => `${theme.colors.brand.error}15`}; // Light error background with consistent opacity format
  border: 1px solid ${({ theme }) => `${theme.colors.brand.error}40`}; // Subtler border with consistent opacity format
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const AuthFooter = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};

  a {
    color: ${({ theme }) => theme.colors.brand.primary};
    font-weight: 600;
    &:hover {
      color: ${({ theme }) => theme.colors.brand.accent};
      text-decoration: underline;
    }
  }
`;

export const FormLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: block;
`;

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.neutral[700]};
  cursor: pointer;

  input[type="checkbox"] {
    width: auto; // Override global input width
    margin-right: ${({ theme }) => theme.spacing.sm};
    height: 1.2em;
    width: 1.2em;
    accent-color: ${({ theme }) => theme.colors.brand.primary};
  }
`;
