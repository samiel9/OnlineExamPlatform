import React from 'react';
import styled from 'styled-components';

const FooterBar = styled.footer`
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  padding: ${({ theme }) => theme.spacing.lg} 0; // Changed from md to lg
  margin-top: auto;
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]}; // Added a subtle top border
`;

const FooterContainer = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.semantic.textLight}; // Changed from neutral[600]
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export default function Footer() {
  return (
    <FooterBar>
      <FooterContainer>
        © {new Date().getFullYear()} ExamLink. Tous droits réservés.
      </FooterContainer>
    </FooterBar>
  );
}
