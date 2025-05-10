import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import LoginPage from '../pages/LoginPage';
import theme from '../assets/styles/theme';

// Mock AuthContext useAuth for this test
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(async (email, password) => ({ role: 'etudiant', prenom: 'Alice' })),
    isAuthenticated: false,
    loading: false
  })
}));
jest.mock('../components/HomePage/Header', () => () => <div data-testid="header-mock" />);

describe('Login Page', () => {
  beforeEach(() => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </ThemeProvider>
    );
  });

  it('renders email and password inputs and submit button', () => {
    expect(screen.getByPlaceholderText(/exemple@domaine.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
  });
});