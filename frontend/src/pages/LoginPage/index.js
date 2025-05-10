import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  PageWrapper,
  AuthContainer,
  AuthCard,
  AuthTitle,
  AuthForm,
  FormGroup,
  FormLabel,
  AuthInput,
  AuthButton,
  AuthError,
  AuthFooter
} from '../Auth/styles';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);
    try {
      const loggedInUser = await login(email, password);
      
      // Check if there was an original navigation attempt to an exam link
      const isExamLink = from.startsWith('/exam/');
      
      // Explicit navigation after login
      if (isExamLink) {
        // Redirect to the originally requested exam page
        navigate(from, { replace: true });
      } else if (loggedInUser.role === 'etudiant') {
        navigate('/student/dashboard', { replace: true });
      } else if (loggedInUser.role === 'enseignant') {
        navigate('/teacher/dashboard', { replace: true });
      } else {
        console.warn('Login successful but role is unexpected:', loggedInUser.role);
        navigate(from === '/login' ? '/' : from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
      console.error('Login error:', err.response || err.message || err);
    }
    setFormLoading(false);
  };

  return (
    <PageWrapper>
      <AuthContainer>
        <AuthCard>
          <AuthTitle>Connexion</AuthTitle>
          {error && <AuthError>{error}</AuthError>}
          <AuthForm onSubmit={onSubmit}>
            <FormGroup>
              <FormLabel htmlFor="email">Adresse Email</FormLabel>
              <AuthInput 
                id="email"
                type="email" 
                placeholder="exemple@domaine.com" 
                name="email" 
                value={email} 
                onChange={onChange} 
                required 
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="password">Mot de passe</FormLabel>
              <AuthInput 
                id="password"
                type="password" 
                placeholder="Votre mot de passe" 
                name="password" 
                value={password} 
                onChange={onChange} 
                required 
              />
            </FormGroup>
            <AuthButton type="submit" disabled={formLoading}>
              {formLoading ? 'Connexion en cours...' : 'Se connecter'}
            </AuthButton>
          </AuthForm>
          <AuthFooter>
            Pas encore de compte? <Link to="/register">Inscrivez-vous ici</Link>
          </AuthFooter>
        </AuthCard>
      </AuthContainer>
    </PageWrapper>
  );
}

export default LoginPage;
