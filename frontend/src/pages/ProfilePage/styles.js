import styled from 'styled-components';
import { PageWrapper, MainContent } from '../Auth/styles'; // Re-use PageWrapper and MainContent
import {
    AuthCard as BaseAuthCard,
    AuthTitle as BaseAuthTitle,
    AuthForm as BaseAuthForm,
    FormGroup as BaseFormGroup,
    FormLabel as BaseFormLabel,
    AuthInput as BaseAuthInput,
    AuthSelect as BaseAuthSelect,
    AuthButton as BaseAuthButton,
    AuthError as BaseAuthError
} from '../Auth/styles';

export const ProfilePageWrapper = styled(PageWrapper)``;

export const ProfileContent = styled(MainContent)`
  display: flex;
  justify-content: center;
  align-items: flex-start; // Align card to the top
  padding-top: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const ProfileCard = styled(BaseAuthCard)`
  max-width: 600px; // Profile card can be a bit wider
`;

export const ProfileTitle = styled(BaseAuthTitle)``;

export const ProfileForm = styled(BaseAuthForm)``;

export const FormGroup = styled(BaseFormGroup)``;

export const FormLabel = styled(BaseFormLabel)``;

export const ProfileInput = styled(BaseAuthInput)``;

export const ProfileSelect = styled(BaseAuthSelect)``;

export const SubmitButton = styled(BaseAuthButton)`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const LogoutButton = styled(BaseAuthButton)`
  margin-top: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.brand.error};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.neutral[700]}; // More neutral hover color for logout button
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

export const SuccessMessage = styled.p`
  color: ${({ theme }) => theme.colors.brand.successDark};
  background-color: ${({ theme }) => `${theme.colors.brand.success}15`}; // Light success background with consistent opacity format
  border: 1px solid ${({ theme }) => `${theme.colors.brand.success}40`}; // Subtler border with consistent opacity format
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const ErrorMessage = styled(BaseAuthError)``;

export const LoadingMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.neutral[600]};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const DoubleFieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;
