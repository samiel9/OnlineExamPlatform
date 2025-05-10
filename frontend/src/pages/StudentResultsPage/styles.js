import styled from 'styled-components';

export const ResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.h4};
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

export const Summary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const ResultCard = styled.div`
  background: ${({ theme }) => theme.colors.semantic.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const QuestionText = styled.p`
  font-weight: 600;
`;

export const AnswerText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const ExpectedAnswer = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-style: italic;
`;

export const ScoreText = styled.p`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.brand.primary};
`;

export const BackButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.neutral[600]};
  color: ${({ theme }) => theme.colors.neutral[0]};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[700]};
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

export const LoadingText = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

export const ErrorText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.brand.error};
`;
