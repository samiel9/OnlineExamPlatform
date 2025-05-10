import styled from 'styled-components';

export const WelcomePageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const WelcomeMainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
`;

export const AlertMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.warning}33;
  color: ${({ theme }) => theme.colors.neutral[800]};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.warning};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-weight: 500;
  max-width: 800px;
  width: 100%;
  text-align: center;
`;

export const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
  width: 100%;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.brand.primary} 0%, ${theme.colors.brand.accent} 100%)`};
  color: ${({ theme }) => theme.colors.neutral[0]};
  min-height: calc(65vh - ${({ theme }) => theme.headerHeight});

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
    min-height: calc(60vh - ${({ theme }) => theme.headerHeight});
  }
`;

export const HeroContent = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

export const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.h1};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral[0]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: ${({ theme }) => theme.lineHeights.heading};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.h2};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.h3};
  }
`;

export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.neutral[100]};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
  line-height: ${({ theme }) => theme.lineHeights.body};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.base};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const HeroButton = styled.button`
  background-color: ${({ theme }) => theme.colors.brand.accent};
  color: ${({ theme }) => theme.colors.neutral[0]};
  border-radius: ${({ theme }) => theme.radii.full};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.brand.accentDark};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.brand.accentDarker};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral[300]};
    cursor: not-allowed;
  }
`;

export const LinkForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 600px;
  width: 100%;
  margin: ${({ theme }) => theme.spacing.xl} auto 0;
  background: transparent;
  padding: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const LinkInput = styled.input`
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  border: 1px solid ${({ theme }) => theme.colors.neutral[0]};
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(255, 255, 255, 0.15);
  color: ${({ theme }) => theme.colors.neutral[0]};
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[200]};
  }

  &:focus {
    background: rgba(255, 255, 255, 0.25);
    border-color: ${({ theme }) => theme.colors.neutral[0]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brand.primaryLight}4D;
  }
`;

export const LinkSubmitButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  background: ${({ theme }) => theme.colors.brand.accent};
  color: ${({ theme }) => theme.colors.neutral[0]};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  width: 100%;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.brand.accentDark};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: auto;
  }
`;

export const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing.section} ${({ theme }) => theme.spacing.lg};
  width: 100%;
  background-color: ${({ theme }) => theme.colors.semantic.background};
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.h2};
  color: ${({ theme }) => theme.colors.neutral[800]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.h3};
  }
`;

export const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.semantic.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  text-align: left;
`;

export const FeatureItem = styled.div`
  background-color: ${({ theme }) => theme.colors.semantic.surface};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.md};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  svg {
    color: ${({ theme }) => theme.colors.brand.accent};
    font-size: ${({ theme }) => theme.fontSizes.h2};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.semantic.textLight};
    line-height: ${({ theme }) => theme.lineHeights.body};
  }
`;
