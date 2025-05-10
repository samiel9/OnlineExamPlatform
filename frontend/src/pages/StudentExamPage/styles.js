import styled, { css } from 'styled-components';
import { PageWrapper, MainContent } from '../Auth/styles'; // Re-use PageWrapper and MainContent
import { AuthCard, AuthInput as BaseAuthInput, AuthButton as BaseAuthButton, AuthError as BaseAuthError } from '../Auth/styles';

export const ExamPageWrapper = styled(PageWrapper)``;

export const ExamContent = styled(MainContent)`
  display: flex;
  justify-content: center;
  align-items: flex-start; // Align card to the top
  padding-top: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const StudentExamCard = styled(AuthCard)`
  max-width: 700px; // Allow wider card for exam content
  width: 100%;
`;

export const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const QuestionNumber = styled.h2`
    font-size: ${({ theme }) => theme.fontSizes.h4};
    color: ${({ theme }) => theme.colors.neutral[700]};
    margin: 0;
`;

export const TimerDisplay = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.brand.primary};
  background-color: ${({ theme }) => theme.colors.brand.primaryLight};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  min-width: 120px; // Ensure timer has some width
  text-align: center;
`;

export const QuestionText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg}; // Larger text for question
  color: ${({ theme }) => theme.colors.semantic.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.6;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: ${({ theme }) => theme.radii.md};
`;

export const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.neutral[0]};
  border: 1px solid ${({ theme }) => theme.colors.semantic.border};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out; // Added box-shadow to transition

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: ${({ theme }) => theme.shadows.sm}; // Added subtle box-shadow on hover
  }

  input[type="checkbox"] {
    margin-right: ${({ theme }) => theme.spacing.md};
    height: 1.3em;
    width: 1.3em;
    accent-color: ${({ theme }) => theme.colors.brand.primary};
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.semantic.text};
  }
`;

export const AnswerInput = styled(BaseAuthInput)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const ActionButton = styled(BaseAuthButton)`
  width: 100%; // Make button full width of its container
  margin-top: ${({ theme }) => theme.spacing.md};
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.brand.primaryDark};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

export const ResultDisplay = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  
  h2 {
    font-size: ${({ theme }) => theme.fontSizes.h2};
    color: ${({ theme }) => theme.colors.brand.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  p {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.neutral[700]};
  }
`;

export const LoadingMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.neutral[600]};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const ErrorMessage = styled(BaseAuthError)`
  margin-top: 0; // Reset margin if used as a standalone message
`;

export const GeolocationRequest = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.brand.accentLight};
  border: 1px solid ${({ theme }) => theme.colors.brand.accent};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.brand.accentDark};
`;

// Attachments display
export const AttachmentWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const AttachmentImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const AttachmentVideo = styled.video`
  max-width: 100%;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const AttachmentAudio = styled.audio`
  width: 100%;
`;
