import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Welcome from '../pages/Welcome';
import theme from '../assets/styles/theme';
import { AuthProvider } from '../contexts/AuthContext';

describe('Welcome Page', () => {
  it('renders hero heading', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <AuthProvider>
            <Welcome />
          </AuthProvider>
        </MemoryRouter>
      </ThemeProvider>
    );
    // The main hero heading is split into two spans but should concatenate correctly
    expect(
      screen.getByRole('heading', { level: 1, name: /ExamLink : Simplifiez Vos Évaluations en Ligne/i })
    ).toBeInTheDocument();
  });
});