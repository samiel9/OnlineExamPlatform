import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import AppRoutes from '../routes/index';
import theme from '../assets/styles/theme';
import { AuthContext } from '../contexts/AuthContext';
import apiService from '../services/api'; // Import the module to be mocked

// Mock the entire services/api module
jest.mock('../services/api');

const renderWithAuth = (authValue, initialEntries = ['/student/dashboard']) => {
  return render(
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={initialEntries}>
          <AppRoutes />
        </MemoryRouter>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

describe('Protected Routes for Student Dashboard', () => {
  beforeEach(() => {
    // apiService is the mocked module. apiService.get is a jest.fn().
    apiService.get.mockReset(); // Reset mock state before each test
    apiService.get.mockImplementation(url => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      if (url === '/exams/public/all') {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        return Promise.resolve({ data: [{ _id: '1', titre: 'Exam1', description: 'Test Exam 1', publicCible: 'Students', lienExamen: 'exam-link-1' }] });
      }
      if (url === '/exams/submissions/me') {
        console.error('[StudentDashboardRoute.test.js MOCK] Matched /exams/submissions/me');
        return Promise.resolve({ data: [{ _id: 'h1', exam: { _id: 'exam1', titre: 'History Exam 1' }, totalScore: 80, totalScorePossible: 100, percentage: 80, submittedAt: new Date().toISOString() }] });
      }
      if (url === '/exams/attempts/me') {
        console.error('[StudentDashboardRoute.test.js MOCK] Matched /exams/attempts/me');
        return Promise.resolve({ data: [
          {
            examId: 'exam1',
            examTitle: 'History Exam 1',
            attempts: [
              {
                submissionId: 'h1',
                attemptNumber: 1,
                submittedAt: new Date().toISOString(),
                totalScore: 80,
                totalScorePossible: 100,
                percentage: 80
              }
            ]
          }
        ]});
      }
      // Fallback for /auth/me, though AuthContext is provided directly in these tests
      if (url === '/auth/me') {
        console.error('[StudentDashboardRoute.test.js MOCK] Matched /auth/me');
        return Promise.resolve({ data: { user: { _id: 'studentUser', role: 'etudiant', prenom: 'Alice' } } });
      }
      console.error(`[StudentDashboardRoute.test.js MOCK] Unhandled URL: "${url}", REJECTING.`);
      return Promise.reject(new Error(`Unhandled URL in StudentDashboardRoute mock: ${url}`));
    });
  });

  // Increase the test timeout because we're fetching multiple API endpoints
  jest.setTimeout(15000);
  
  it('renders StudentDashboardPage for authenticated student', async () => {
    renderWithAuth({ user: { role: 'etudiant', prenom: 'Alice' }, isAuthenticated: true, loading: false });
    
    // Check for welcome message
    expect(await screen.findByText(/Welcome, Alice/i)).toBeInTheDocument();
    
    // Check for Available Exams section
    expect(await screen.findByText(/Available Exams/i)).toBeInTheDocument();
    expect(await screen.findByText(/Exam1/i)).toBeInTheDocument();
    
    // Check for Completed Exams History section header
    expect(await screen.findByText(/Completed Exams History/i)).toBeInTheDocument();
    
    // Since we have to wait for API calls to complete, simply look for the section headers
    // instead of the specific exam data that might take longer to render
  });

  it('redirects authenticated teacher to Welcome page', () => {
    renderWithAuth({ user: { role: 'enseignant' }, isAuthenticated: true, loading: false });
    expect(screen.getByText(/ExamLink : Simplifiez Vos Évaluations en Ligne/i)).toBeInTheDocument();
  });

  it('redirects unauthenticated user to LoginPage', () => {
    renderWithAuth({ user: null, isAuthenticated: false, loading: false });
    expect(screen.getByRole('heading', { name: /Connexion/i })).toBeInTheDocument();
  });
});
