import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
    ProfilePageWrapper,
    ProfileContent,
    ProfileCard,
    ProfileTitle,
    ProfileForm,
    FormGroup,
    FormLabel,
    ProfileInput,
    ProfileSelect,
    SubmitButton,
    LogoutButton,
    SuccessMessage,
    DoubleFieldRow,
    ErrorMessage,
    LoadingMessage
} from './styles';

export default function ProfilePage() {
  const { user, logout } = useAuth(); // Assuming useAuth provides the current user object
  const [formData, setFormData] = useState({
    email: '',
    nom: '',
    prenom: '',
    naissance: '',
    sexe: 'Autre', // Default value
    etablissement: '',
    filiere: '',
    annee: '',
    semestre: '',
    groupe: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await api.get('/auth/me');
      // Ensure all fields in initial state are present, even if null/undefined from API
      setFormData({
        email: res.data.email || '',
        nom: res.data.nom || '',
        prenom: res.data.prenom || '',
        naissance: res.data.naissance ? res.data.naissance.split('T')[0] : '',
        sexe: res.data.sexe || 'Autre',
        etablissement: res.data.etablissement || '',
        filiere: res.data.filiere || '',
        annee: res.data.annee || '',
        semestre: res.data.semestre || '',
        groupe: res.data.groupe || ''
      });
    } catch (err) {
      setError(err.response?.data?.msg || 'Impossible de charger le profil.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMessage(''); // Clear success message on form change
    setError(''); // Clear error message on form change
  }

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      // Filter out empty string for naissance before sending if backend expects null or no field
      const payload = { ...formData };
      if (payload.naissance === '') {
        delete payload.naissance; // Or set to null, depending on backend
      }
      await api.put('/auth/me', payload);
      setSuccessMessage('Profil mis à jour avec succès !');
    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de la mise à jour du profil.');
    }
    setLoading(false);
  };

  if (loading && !formData.email) { // Show loading only on initial fetch
    return (
        <ProfilePageWrapper>
            <ProfileContent>
                <LoadingMessage>Chargement du profil...</LoadingMessage>
            </ProfileContent>
        </ProfilePageWrapper>
    );
  }

  return (
    <ProfilePageWrapper>
      <ProfileContent>
        <ProfileCard>
          <ProfileTitle>Mon Profil</ProfileTitle>
          <ProfileForm onSubmit={onSubmit}>
            <FormGroup>
              <FormLabel htmlFor="email">Email</FormLabel>
              <ProfileInput id="email" name="email" value={formData.email} disabled />
            </FormGroup>
            
            <DoubleFieldRow>
                <FormGroup>
                <FormLabel htmlFor="nom">Nom</FormLabel>
                <ProfileInput id="nom" name="nom" placeholder="Votre nom" value={formData.nom} onChange={onChange} />
                </FormGroup>
                <FormGroup>
                <FormLabel htmlFor="prenom">Prénom</FormLabel>
                <ProfileInput id="prenom" name="prenom" placeholder="Votre prénom" value={formData.prenom} onChange={onChange} />
                </FormGroup>
            </DoubleFieldRow>

            <FormGroup>
              <FormLabel htmlFor="naissance">Date de naissance</FormLabel>
              <ProfileInput id="naissance" type="date" name="naissance" value={formData.naissance} onChange={onChange} />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="sexe">Sexe</FormLabel>
              <ProfileSelect id="sexe" name="sexe" value={formData.sexe} onChange={onChange}>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Autre">Autre</option>
              </ProfileSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="etablissement">Établissement</FormLabel>
              <ProfileInput id="etablissement" name="etablissement" placeholder="Votre établissement" value={formData.etablissement} onChange={onChange} />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="filiere">Filière</FormLabel>
              <ProfileInput id="filiere" name="filiere" placeholder="Votre filière" value={formData.filiere} onChange={onChange} />
            </FormGroup>
            
            {user && user.role === 'etudiant' && (
              <>
                <DoubleFieldRow>
                  <FormGroup>
                    <FormLabel htmlFor="annee">Année d'études</FormLabel>
                    <ProfileInput 
                      id="annee" 
                      name="annee" 
                      placeholder="ex: 2e année MIP" 
                      value={formData.annee} 
                      onChange={onChange} 
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel htmlFor="semestre">Semestre</FormLabel>
                    <ProfileSelect id="semestre" name="semestre" value={formData.semestre} onChange={onChange}>
                      <option value="">Sélectionnez un semestre</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </ProfileSelect>
                  </FormGroup>
                </DoubleFieldRow>
                
                <FormGroup>
                  <FormLabel htmlFor="groupe">Groupe</FormLabel>
                  <ProfileInput 
                    id="groupe" 
                    name="groupe" 
                    placeholder="ex: Groupe A" 
                    value={formData.groupe} 
                    onChange={onChange} 
                  />
                </FormGroup>
              </>
            )}
            
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </SubmitButton>
          </ProfileForm>
          <LogoutButton onClick={logout} disabled={loading}>
            Déconnexion
          </LogoutButton>
        </ProfileCard>
      </ProfileContent>
    </ProfilePageWrapper>
  );
}