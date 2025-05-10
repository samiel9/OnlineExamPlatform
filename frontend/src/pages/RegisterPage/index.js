import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  PageWrapper,
  AuthContainer,
  AuthCard,
  AuthTitle,
  AuthForm,
  FormGroup,
  FormLabel,
  AuthInput,
  AuthSelect,
  AuthButton,
  AuthError,
  AuthFooter
} from '../Auth/styles';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    nom: '',
    prenom: '',
    naissance: '',
    sexe: 'Homme',
    etablissement: '',
    filiere: '',
    annee: '',
    semestre: '',
    groupe: '',
    password: '',
    role: 'etudiant',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { email, nom, prenom, naissance, sexe, etablissement, filiere, annee, semestre, groupe, password, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.msg || 'Échec de l\'inscription. Veuillez réessayer.');
      console.error('Registration error:', err.response || err.message || err);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <PageWrapper>
      <AuthContainer>
        <AuthCard>
          <AuthTitle>Créer un compte</AuthTitle>
          {error && <AuthError>{error}</AuthError>}
          <AuthForm onSubmit={onSubmit}>
            <FormGroup>
              <FormLabel htmlFor="prenom">Prénom</FormLabel>
              <AuthInput id="prenom" type="text" placeholder="Votre prénom" name="prenom" value={prenom} onChange={onChange} required />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="nom">Nom</FormLabel>
              <AuthInput id="nom" type="text" placeholder="Votre nom" name="nom" value={nom} onChange={onChange} required />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="email">Adresse Email</FormLabel>
              <AuthInput id="email" type="email" placeholder="exemple@domaine.com" name="email" value={email} onChange={onChange} required />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="password">Mot de passe</FormLabel>
              <AuthInput id="password" type="password" placeholder="Minimum 6 caractères" name="password" value={password} onChange={onChange} required minLength="6" />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="naissance">Date de naissance</FormLabel>
              <AuthInput id="naissance" type="date" name="naissance" value={naissance} onChange={onChange} required />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="sexe">Sexe</FormLabel>
              <AuthSelect id="sexe" name="sexe" value={sexe} onChange={onChange}>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Autre">Autre</option>
              </AuthSelect>
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="etablissement">Établissement</FormLabel>
              <AuthInput id="etablissement" type="text" placeholder="Nom de votre établissement" name="etablissement" value={etablissement} onChange={onChange} required />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="filiere">Filière / Domaine d'étude</FormLabel>
              <AuthInput id="filiere" type="text" placeholder="Ex: MIP, Informatique, Biologie..." name="filiere" value={filiere} onChange={onChange} required />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="annee">Année d'études</FormLabel>
              <AuthInput id="annee" type="text" placeholder="Ex: 1ère année, 2e année, L3..." name="annee" value={annee} onChange={onChange} />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="semestre">Semestre</FormLabel>
              <AuthInput id="semestre" type="text" placeholder="Ex: 1, 2, 3, 4..." name="semestre" value={semestre} onChange={onChange} />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="groupe">Groupe</FormLabel>
              <AuthInput id="groupe" type="text" placeholder="Ex: A, B, 1, 2..." name="groupe" value={groupe} onChange={onChange} />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="role">Je suis un</FormLabel>
              <AuthSelect id="role" name="role" value={role} onChange={onChange}>
                <option value="etudiant">Étudiant</option>
                <option value="enseignant">Enseignant</option>
              </AuthSelect>
            </FormGroup>
            
            <AuthButton type="submit" disabled={loading}>
              {loading ? 'Inscription en cours...' : "S'inscrire"}
            </AuthButton>
          </AuthForm>
          <AuthFooter>
            Déjà un compte? <Link to="/login">Connectez-vous ici</Link>
          </AuthFooter>
        </AuthCard>
      </AuthContainer>
    </PageWrapper>
  );
}

export default RegisterPage;
