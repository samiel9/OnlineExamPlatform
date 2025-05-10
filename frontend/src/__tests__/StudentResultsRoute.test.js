import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import AppRoutes from '../routes/index';
import theme from '../assets/styles/theme';
import { AuthContext } from '../contexts/AuthContext';
import apiService from '../services/api'; // Import the module to be mocked

// Mock the entire services/api module
jest.mock('../services/api');

// Silence console.error logs
jest.spyOn(console, 'error').mockImplementation(() => {});

// Updated renderWithAuth to wrap AppRoutes with MemoryRouter
const renderWithAuth = (authValue, initialEntries = ['/student/results/123']) => {
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

describe('Protected Routes for Student Results Page', () => {
  beforeEach(() => {
    apiService.get.mockReset(); // Reset mock state before each test
    apiService.get.mockImplementation(url => {
      if (url.startsWith('/exams/submissions/')) {
        return Promise.resolve({
          data: {
            _id: 'submission123',
            exam: { _id: 'exam1', titre: 'Exam1' },
            student: 'studentId1',
            answers: [
              { _id: 'ans1', question: { _id: 'q1', text: 'Question 1 Text', score: 10, type: 'direct', options: [''], answer: 'Correct Answer for Q1' }, answer: 'Student Answer 1', scoreAwarded: 10 },
              { _id: 'ans2', question: { _id: 'q2', text: 'Question 2 Text', score: 15, type: 'qcm', options: ['Option A', 'Option B', 'Option C'], correct: [0, 2] }, answer: [0], scoreAwarded: 5 }
            ],
            totalScore: 15, percentage: 60, submittedAt: new Date('2023-01-15T10:30:00Z').toISOString(),
          }
        });
      }
      // Fallback for /auth/me, though AuthContext is provided directly
      if (url === '/auth/me') {
        return Promise.resolve({ data: { user: { _id: 'testuser', role: 'etudiant', prenom: 'TestStudent' } } });
      }
      return Promise.reject(new Error(`Unhandled URL in StudentResultsRoute mock: ${url}`));
    });
  });

  it('renders StudentResultsPage for authenticated student', async () => {
    renderWithAuth({ user: { role: 'etudiant' }, isAuthenticated: true, loading: false });
    expect(await screen.findByText(/Résultat d'examen : Exam1/i)).toBeInTheDocument();
    
    // Wait for the page to load completely
    await screen.findByText(/Question 1 Text/i);
    
    // Use getAllByText with a function matcher to handle text split across elements
    // Then select the first matching element (the paragraph containing the score)
    const scoreTotalElements = screen.getAllByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && 
             element.textContent.includes('Score Total:') && 
             element.textContent.includes('15');
    });
    expect(scoreTotalElements.length).toBeGreaterThan(0);
    expect(scoreTotalElements[0]).toBeInTheDocument();
    
    expect(screen.getByText(/Question 1 Text/i)).toBeInTheDocument();
    expect(screen.getByText(/Votre réponse: Student Answer 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Réponse attendue: Correct Answer for Q1/i)).toBeInTheDocument();
    expect(screen.getByText(/Score obtenu: 10/i)).toBeInTheDocument();
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
