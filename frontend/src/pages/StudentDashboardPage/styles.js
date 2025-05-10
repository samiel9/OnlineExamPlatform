import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';
import { PageWrapper as GlobalPageWrapper, MainContent as GlobalMainContent, AuthError } from '../Auth/styles'; // Reusing AuthError for error messages

// General Page Layout
export const StudentDashboardPageWrapper = styled(GlobalPageWrapper)`
  /* Student dashboard specific overrides for PageWrapper if needed */
`;

export const StudentDashboardContent = styled(GlobalMainContent)`
  padding-top: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
`;

// Typography
export const WelcomeMessage = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.h2}; // Adjusted for consistency
  color: ${({ theme }) => theme.colors.neutral[800]};
  margin-bottom: ${({ theme }) => theme.spacing.lg}; // Increased margin
  text-align: left; // Align to left, more common for dashboards
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.h3};
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.h3};
  color: ${({ theme }) => theme.colors.neutral[800]};
  margin-top: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.brand.primaryLight};

  &:first-of-type {
    margin-top: 0; 
  }
`;

// Card Layout
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); // Slightly adjusted minmax
  gap: ${({ theme }) => theme.spacing.lg}; // Increased gap
`;

export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.semantic.surface};
  border-radius: ${({ theme }) => theme.radii.lg}; // Larger radius
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column; // Stack content vertically

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.h4}; // Adjusted
  color: ${({ theme }) => theme.colors.brand.primary};
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md}; // Increased margin
`;

export const CardContent = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base}; // Base size
  color: ${({ theme }) => theme.colors.semantic.text};
  line-height: ${({ theme }) => theme.lineHeights.body};
  flex-grow: 1; // Allow content to fill space
`;

export const ExamInfoText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.semantic.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: ${({ theme }) => theme.lineHeights.body};
`;

// Button Styles (adapted from TeacherDashboardPage/styles.js for consistency)
export const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
  &:active:not(:disabled) {
    transform: translateY(0px);
    box-shadow: none;
  }
  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral[300]} !important;
    color: ${({ theme }) => theme.colors.neutral[500]} !important;
    cursor: not-allowed !important;
    box-shadow: none !important;
    transform: none !important;
    border-color: ${({ theme }) => theme.colors.neutral[300]} !important;
  }
`;

export const StyledButton = styled.button`
  ${buttonStyles}
  background-color: ${({ theme, primary, success, danger }) => 
    danger ? theme.colors.brand.error : 
    success ? theme.colors.brand.success : // Assuming success color exists
    primary ? theme.colors.brand.primary : 
    theme.colors.neutral[200]};
  color: ${({ theme, primary, success, danger }) => 
    primary || success || danger ? theme.colors.neutral[0] : 
    theme.colors.neutral[700]};
  border-color: ${({ theme, primary, success, danger }) => 
    danger ? theme.colors.brand.error :
    success ? theme.colors.brand.success :
    primary ? theme.colors.brand.primary : 
    theme.colors.neutral[300]};

  &:hover:not(:disabled) {
    background-color: ${({ theme, primary, success, danger }) => 
      danger ? theme.colors.brand.error : // Darken error on hover
      success ? theme.colors.brand.successDark : // Darken success on hover
      primary ? theme.colors.brand.primaryDark : // Darken primary on hover
      theme.colors.neutral[300]};
    color: ${({ theme, primary, success, danger }) => 
      primary || success || danger ? theme.colors.neutral[0] : 
      theme.colors.neutral[800]};
    border-color: ${({ theme, primary, success, danger }) => 
      danger ? theme.colors.brand.error :
      success ? theme.colors.brand.successDark :
      primary ? theme.colors.brand.primaryDark : 
      theme.colors.neutral[400]};
  }
`;

export const StyledNavLink = styled(NavLink)`
  ${buttonStyles}
  background-color: ${({ theme, primary, success, danger }) => 
    danger ? theme.colors.brand.error :
    success ? theme.colors.brand.success :
    primary === "true" || primary === true ? theme.colors.brand.primary : 
    theme.colors.neutral[200]};
  color: ${({ theme, primary, success, danger }) => 
    primary === "true" || primary === true || success || danger ? theme.colors.neutral[0] : 
    theme.colors.neutral[700]};
  border-color: ${({ theme, primary, success, danger }) => 
    danger ? theme.colors.brand.error :
    success ? theme.colors.brand.success :
    primary === "true" || primary === true ? theme.colors.brand.primary : 
    theme.colors.neutral[300]};

  &:hover:not(:disabled) {
    background-color: ${({ theme, primary, success, danger }) => 
      danger ? theme.colors.brand.error :
      success ? theme.colors.brand.successDark :
      primary === "true" || primary === true ? theme.colors.brand.primaryDark : 
      theme.colors.neutral[300]};
    color: ${({ theme, primary, success, danger }) => 
      primary === "true" || primary === true || success || danger ? theme.colors.neutral[0] : 
      theme.colors.neutral[800]};
    border-color: ${({ theme, primary, success, danger }) => 
      danger ? theme.colors.brand.error :
      success ? theme.colors.brand.successDark :
      primary === "true" || primary === true ? theme.colors.brand.primaryDark : 
      theme.colors.neutral[400]};
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-top: auto; // Push actions to the bottom of the card
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]}; // Separator line
`;

// Placeholder and Message Styles
export const PlaceholderText = styled.div` // Changed to div
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.neutral[600]};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 2px dashed ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.neutral[100]}33; // Light tint
`;

export const LoadingText = styled(PlaceholderText)`
  border-style: solid; // Differentiate from "no data" placeholder
  border-color: ${({ theme }) => theme.colors.brand.primaryLight};
  color: ${({ theme }) => theme.colors.brand.primary};
`;

export const ErrorText = styled(AuthError)` // Re-use AuthError styling
  margin-top: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;


// Attempts Details Styles
export const AttemptsDetailsWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.neutral[50]}; // Slightly different background
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  overflow-x: auto; // Add this line to handle potential overflow
`;

export const AttemptsTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const AttemptsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.fontSizes.sm};

  th, td {
    text-align: left;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  }

  th {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.neutral[700]};
  }

  td {
    color: ${({ theme }) => theme.colors.semantic.text};
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background-color: ${({ theme }) => theme.colors.neutral[50]};
  }
`;
