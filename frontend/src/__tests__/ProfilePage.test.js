import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeModeProvider, ThemeContext } from '../contexts/ThemeContext'; // Adjust path as needed
import { AuthContext } from '../contexts/AuthContext';
import ProfilePage from '../pages/ProfilePage'; // Adjust path as needed
import api from '../services/api'; // Adjust path as needed
import lightTheme from '../assets/styles/theme'; // Adjust path as needed
import darkTheme from '../assets/styles/darkTheme'; // Adjust path as needed

// Mock the api module
jest.mock('../services/api');

// Mock the Header component as it's not the focus of these tests
jest.mock('../components/HomePage/Header', () => () => <div data-testid="mock-header">Mock Header</div>);

const mockUser = {
  email: 'test@example.com',
  nom: 'Doe',
  prenom: 'John',
  naissance: '1990-01-01T00:00:00.000Z',
  sexe: 'Homme',
  etablissement: 'Test University',
  filiere: 'Computer Science',
};

const renderWithProviders = (ui, { authProviderProps, themeProviderProps } = {}) => {
  const currentTheme = themeProviderProps?.theme === 'dark' ? darkTheme : lightTheme;
  return render(
    <AuthContext.Provider value={authProviderProps}>
      <ThemeModeProvider initialTheme={themeProviderProps?.theme || 'light'}>
        <StyledThemeProvider theme={currentTheme}>
          {ui}
        </StyledThemeProvider>
      </ThemeModeProvider>
    </AuthContext.Provider>
  );
};

describe('ProfilePage', () => {
  let mockAuthProviderProps;

  beforeEach(() => {
    // Reset mocks before each test
    api.get.mockReset();
    api.put.mockReset();

    mockAuthProviderProps = {
      user: mockUser,
      logout: jest.fn(),
      isAuthenticated: true,
      loading: false,
    };

    // Mock successful initial profile fetch
    api.get.mockResolvedValue({ data: mockUser });
  });

  test('renders profile page and loads user data', async () => {
    renderWithProviders(<ProfilePage />, { authProviderProps: mockAuthProviderProps });

    expect(screen.getByText('Chargement du profil...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toHaveValue(mockUser.email);
    });
    expect(screen.getByLabelText(/^nom$/i)).toHaveValue(mockUser.nom);
    expect(screen.getByLabelText(/^prénom$/i)).toHaveValue(mockUser.prenom);
    expect(screen.getByLabelText(/date de naissance/i)).toHaveValue('1990-01-01');
    expect(screen.getByLabelText(/sexe/i)).toHaveValue(mockUser.sexe);
    expect(screen.getByLabelText(/établissement/i)).toHaveValue(mockUser.etablissement);
    expect(screen.getByLabelText(/filière/i)).toHaveValue(mockUser.filiere);
    expect(api.get).toHaveBeenCalledWith('/auth/me');
  });

  test('allows user to update profile fields', async () => {
    renderWithProviders(<ProfilePage />, { authProviderProps: mockAuthProviderProps });
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeInTheDocument()); // Ensure page loaded

    fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText(/filière/i), { target: { value: 'Mathematics' } });

    expect(screen.getByLabelText(/^nom$/i)).toHaveValue('Smith');
    expect(screen.getByLabelText(/filière/i)).toHaveValue('Mathematics');
  });

  test('submits updated profile data and shows success message', async () => {
    api.put.mockResolvedValue({ data: { ...mockUser, nom: 'UpdatedNom' } });
    renderWithProviders(<ProfilePage />, { authProviderProps: mockAuthProviderProps });
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: 'UpdatedNom' } });
    fireEvent.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/auth/me', expect.objectContaining({
        nom: 'UpdatedNom',
        // naissance should be in YYYY-MM-DD format or undefined if empty
        naissance: '1990-01-01', 
      }));
    });
    expect(await screen.findByText('Profil mis à jour avec succès !')).toBeInTheDocument();
  });

  test('handles profile update failure and shows error message', async () => {
    const errorMessage = 'Erreur lors de la mise à jour';
    api.put.mockRejectedValue({ response: { data: { msg: errorMessage } } });
    renderWithProviders(<ProfilePage />, { authProviderProps: mockAuthProviderProps });
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/auth/me', expect.any(Object));
    });
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
  
  test('handles initial profile fetch failure', async () => {
    const fetchErrorMessage = 'Impossible de charger le profil.';
    api.get.mockRejectedValueOnce({ response: { data: { msg: fetchErrorMessage } } });
    
    renderWithProviders(<ProfilePage />, { authProviderProps: mockAuthProviderProps });

    expect(screen.getByText('Chargement du profil...')).toBeInTheDocument();
    expect(await screen.findByText(fetchErrorMessage)).toBeInTheDocument();
  });

  test('calls logout function when logout button is clicked', async () => {
    renderWithProviders(<ProfilePage />, { authProviderProps: mockAuthProviderProps });
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /déconnexion/i }));
    expect(mockAuthProviderProps.logout).toHaveBeenCalled();
  });
  
  test('clears success/error messages on form change', async () => {
    api.put.mockResolvedValue({ data: { ...mockUser, nom: 'UpdatedNom' } });
    renderWithProviders(<ProfilePage />, { authProviderProps: mockAuthProviderProps });
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeInTheDocument());

    // Submit to show success
    fireEvent.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));
    expect(await screen.findByText('Profil mis à jour avec succès !')).toBeInTheDocument();

    // Change a field
    fireEvent.change(screen.getByLabelText(/^nom$/i), { target: { value: 'AnotherName' } });
    expect(screen.queryByText('Profil mis à jour avec succès !')).not.toBeInTheDocument();

    // Submit with error
    const errorMessage = 'Update failed again';
    api.put.mockRejectedValueOnce({ response: { data: { msg: errorMessage } } });
    fireEvent.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    
    // Change a field again
    fireEvent.change(screen.getByLabelText(/^prénom$/i), { target: { value: 'AnotherFirstName' } });
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

});
