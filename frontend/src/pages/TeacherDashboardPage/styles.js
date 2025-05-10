import styled, { css } from 'styled-components';
import { PageWrapper as GlobalPageWrapper, MainContent as GlobalMainContent } from '../Auth/styles';
import { NavLink } from 'react-router-dom';

export const DashboardPageWrapper = styled(GlobalPageWrapper)`
  /* Teacher Dashboard specific overrides for PageWrapper if needed */
`;

export const DashboardContent = styled(GlobalMainContent)`
  padding-top: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const DashboardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.neutral[50]}; /* Cleaner background */
  padding: ${({ theme }) => theme.spacing.lg};\n  border-radius: ${({ theme }) => theme.radii.xl}; /* Softer radius */
  box-shadow: ${({ theme }) => theme.shadows.sm}; /* Subtle shadow */
`;

export const DashboardHeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const WelcomeMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.neutral[700]}; /* Darker for better readability */
  margin-bottom: 0;
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.h3};\n  color: ${({ theme }) => theme.colors.neutral[800]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};\n  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[300]}; /* Lighter, more subtle border */
  font-weight: 600; /* Modern boldness */

  &:first-of-type {
    margin-top: 0;
  }
`;

export const ExamList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const ExamListItem = styled.li`
  background-color: ${({ theme }) => theme.colors.semantic.surface};
  padding: ${({ theme }) => theme.spacing.lg};\n  border-radius: ${({ theme }) => theme.radii.lg}; /* Consistent radius */
  box-shadow: ${({ theme }) => theme.shadows.md};\n  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]}; /* Subtle border */

  &:hover {
    transform: translateY(-4px); /* Slightly less movement */
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export const StatusIndicator = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ theme, colorToken }) => theme.colors.status[colorToken] || theme.colors.neutral[400]};
  margin-left: ${({ theme }) => theme.spacing.sm};
`;

export const ExamStatusLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme, colorToken }) => theme.colors.status[colorToken] || theme.colors.neutral[700]};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const ExamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ExamTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.h4};\n  color: ${({ theme }) => theme.colors.brand.primary};
  margin-top: 0;\n  margin-bottom: ${({ theme }) => theme.spacing.sm}; /* Increased bottom margin */
  flex-grow: 1;
  font-weight: 600; /* Emphasize title */
`;

export const ExamDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.semantic.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: ${({ theme }) => theme.lineHeights.body};
`;

export const ExamPublicCible = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-style: italic;
`;

export const ExamActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md}; /* Increased gap for better separation */
  flex-wrap: wrap;
  margin-top: auto; 
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]}; /* Subtle separator */
`;

// Common Button Styles - Refactored for clarity and correctness
const commonButtonStyles = css`
  border-radius: ${({ theme }) => theme.radii.md}; /* Standardized radius */
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg}; /* Adjusted padding */
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  line-height: 1.5;
  box-shadow: ${({ theme }) => theme.shadows.xs};

  i {
    margin-right: ${({ theme }) => theme.spacing.sm}; /* Consistent icon spacing */
  }

  /* Primary Button Style */
  ${({ primary, theme }) => primary && css`
    background-color: ${theme.colors.brand.primary};
    color: ${theme.colors.neutral[0]};
    border-color: ${theme.colors.brand.primary};

    &:hover {
      background-color: ${theme.colors.brand.primaryDark};
      border-color: ${theme.colors.brand.primaryDark};
      box-shadow: ${({ theme }) => theme.shadows.sm};
    }
    &:active {
      background-color: ${theme.colors.brand.primaryDarker};
      border-color: ${theme.colors.brand.primaryDarker};
    }
  `}

  /* Secondary Button Style (default if 'primary', 'warning', 'danger' are not true) */
  ${({ primary, warning, danger, theme }) => !primary && !warning && !danger && css`
    background-color: ${theme.colors.neutral[0]};
    color: ${theme.colors.neutral[700]};
    border-color: ${theme.colors.neutral[300]};

    &:hover {
      background-color: ${theme.colors.neutral[100]};
      border-color: ${theme.colors.neutral[400]};
      color: ${theme.colors.neutral[800]};
      box-shadow: ${({ theme }) => theme.shadows.sm};
    }
    &:active {
      background-color: ${theme.colors.neutral[200]};
      border-color: ${theme.colors.neutral[500]};
    }
  `}

  /* Warning Button Style */
  ${({ warning, theme }) => warning && css`
    background-color: ${theme.colors.brand.warning}; /* Assuming you have theme.colors.brand.warning */
    color: ${theme.colors.neutral[800]}; /* Adjust text color for contrast */
    border-color: ${theme.colors.brand.warning};

    &:hover {
      background-color: ${theme.colors.brand.warningDark}; /* Assuming theme.colors.brand.warningDark */
      border-color: ${theme.colors.brand.warningDark};
      box-shadow: ${({ theme }) => theme.shadows.sm};
    }
    &:active {
      background-color: ${theme.colors.brand.warningDarker}; /* Assuming theme.colors.brand.warningDarker */
      border-color: ${theme.colors.brand.warningDarker};
    }
  `}

  /* Danger Button Style */
  ${({ danger, theme }) => danger && css`
    background-color: ${theme.colors.brand.danger}; /* Assuming you have theme.colors.brand.danger */
    color: ${theme.colors.neutral[0]};
    border-color: ${theme.colors.brand.danger};

    &:hover {
      background-color: ${theme.colors.brand.dangerDark}; /* Assuming theme.colors.brand.dangerDark */
      border-color: ${theme.colors.brand.dangerDark};
      box-shadow: ${({ theme }) => theme.shadows.sm};
    }
    &:active {
      background-color: ${theme.colors.brand.dangerDarker}; /* Assuming theme.colors.brand.dangerDarker */
      border-color: ${theme.colors.brand.dangerDarker};
    }
  `}

  &:disabled, &[disabled] { /* Handles both button and NavLink disabled states */
    background-color: ${({ theme }) => theme.colors.neutral[200]} !important;
    color: ${({ theme }) => theme.colors.neutral[400]} !important;
    border-color: ${({ theme }) => theme.colors.neutral[200]} !important;
    box-shadow: none !important;
    cursor: not-allowed !important;
    pointer-events: none; /* Important for NavLink */
  }
`;

export const ActionButton = styled.button`
  ${commonButtonStyles}
`;

export const ActionButtonStyledAsNavLink = styled(NavLink)`
  ${commonButtonStyles}
`;

// This was the problematic button. Ensuring it's a NavLink and uses common styles.
export const CreateExamButtonStyledAsNavLink = styled(NavLink)`
  ${commonButtonStyles}
`;

export const LogoutButton = styled.button`
  ${commonButtonStyles}
  /* Specific overrides for logout if needed, e.g., making it look like a secondary button by default */
  /* background-color: ${({ theme }) => theme.colors.neutral[0]}; 
  color: ${({ theme }) => theme.colors.neutral[700]};
  border-color: ${({ theme }) => theme.colors.neutral[300]};

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    border-color: ${({ theme }) => theme.colors.neutral[400]};
  } */
`;


export const ExamLinkContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md}; /* Adjusted padding */
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: ${({ theme }) => theme.radii.md}; /* Consistent radius */
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.neutral[600]}; /* Slightly darker text */
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};

  span {
    word-break: break-all; 
    flex-grow: 1;
  }

  a {
    color: ${({ theme }) => theme.colors.brand.primary};
    text-decoration: none;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const CopyLinkButton = styled.button`
  background-color: ${({ theme }) => theme.colors.neutral[200]};
  color: ${({ theme }) => theme.colors.neutral[700]};
  border: none;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm}; /* Smaller radius for a compact button */
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  transition: background-color 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[300]};
  }

  &.copied {
    background-color: ${({ theme }) => theme.colors.brand.success};
    color: white;
  }
`;

export const NoExamsMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md}; /* Adjusted size */
  color: ${({ theme }) => theme.colors.neutral[600]}; /* Softer color */
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  line-height: 1.6;
`;
