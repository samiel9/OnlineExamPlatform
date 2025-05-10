import React, { useState } from 'react';
import api from '../../services/api';
import {
  DashboardPageWrapper, 
  DashboardContent
} from './styles'; // Assuming styles.js is in the same folder
import {
  AuthCard, // Re-use AuthCard for the form container
  AuthTitle,
  AuthForm,
  FormGroup,
  FormLabel,
  AuthInput,
  AuthTextarea, // Use new AuthTextarea
  AuthButton,
  AuthError
} from '../Auth/styles'; // Common auth form elements
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // For navigation after creation

export default function CreateExamPage() {
  const [form, setForm] = useState({ 
    titre: '', 
    description: '', 
    publicCible: '',
    publicCibleDetails: {
      annee: '',
      semestre: '',
      groupe: '',
      formation: ''
    }
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [createdExamLink, setCreatedExamLink] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = e => {
    const { name, value } = e.target;
    
    // Check if the field is one of the publicCibleDetails fields
    if (name.startsWith('publicCibleDetails.')) {
      const detailField = name.split('.')[1]; // Get the specific field (annee, semestre, etc.)
      setForm({
        ...form,
        publicCibleDetails: {
          ...form.publicCibleDetails,
          [detailField]: value
        }
      });
    } else {
      // Regular field update
      setForm({ ...form, [name]: value });
    }
  };

  // Update publicCible before submission based on the detailed fields
  const updatePublicCible = () => {
    const { annee, semestre, groupe, formation } = form.publicCibleDetails;
    const details = [];
    
    if (formation) details.push(formation);
    if (annee) details.push(annee);
    if (semestre) details.push(`S${semestre}`);
    if (groupe) details.push(`Groupe ${groupe}`);
    
    const formattedPublicCible = details.join(', ');
    return { ...form, publicCible: formattedPublicCible || form.publicCible };
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setCreatedExamLink('');
    setLoading(true);
    try {
      // Update the publicCible field based on detailed inputs before submitting
      const formToSubmit = updatePublicCible();
      const { data } = await api.post('/exams', formToSubmit);
      setSuccessMessage('Examen créé avec succès !');
      setCreatedExamLink(`${window.location.origin}/exam/${data.lienExamen}`);
      // Optionally, clear form or navigate
      setForm({ 
        titre: '', 
        description: '', 
        publicCible: '',
        publicCibleDetails: {
          annee: '',
          semestre: '',
          groupe: '',
          formation: ''
        }
      }); 
      // setTimeout(() => navigate('/teacher/dashboard'), 3000); // Navigate back after 3s
    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de la création de l’examen.');
    }
    setLoading(false);
  };

  return (
    <DashboardPageWrapper>
      <DashboardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <AuthCard style={{maxWidth: '600px'}}> {/* Override max-width for this form if needed */}
          <AuthTitle>Créer un Nouvel Examen</AuthTitle>
          <AuthForm onSubmit={onSubmit}>
            <FormGroup>
              <FormLabel htmlFor="titre">Titre de l'examen</FormLabel>
              <AuthInput 
                id="titre"
                placeholder="Ex: Examen de Mathématiques S1" 
                name="titre" 
                value={form.titre} 
                onChange={onChange} 
                required 
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="description">Description</FormLabel>
              <AuthTextarea 
                id="description"
                placeholder="Brève description du contenu de l'examen, des chapitres concernés, etc." 
                name="description" 
                value={form.description} 
                onChange={onChange} 
                required 
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="publicCible">Public Ciblé</FormLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '8px' }}>
                <div>
                  <FormLabel htmlFor="publicCibleDetails.formation" style={{ fontSize: '0.9em' }}>Formation</FormLabel>
                  <AuthInput 
                    id="publicCibleDetails.formation"
                    placeholder="Ex: MIP, INFO, BIO" 
                    name="publicCibleDetails.formation" 
                    value={form.publicCibleDetails.formation} 
                    onChange={onChange} 
                  />
                </div>
                <div>
                  <FormLabel htmlFor="publicCibleDetails.annee" style={{ fontSize: '0.9em' }}>Année</FormLabel>
                  <AuthInput 
                    id="publicCibleDetails.annee"
                    placeholder="Ex: 2e année, L2, M1" 
                    name="publicCibleDetails.annee" 
                    value={form.publicCibleDetails.annee} 
                    onChange={onChange} 
                  />
                </div>
                <div>
                  <FormLabel htmlFor="publicCibleDetails.semestre" style={{ fontSize: '0.9em' }}>Semestre</FormLabel>
                  <AuthInput 
                    id="publicCibleDetails.semestre"
                    placeholder="Ex: 4" 
                    name="publicCibleDetails.semestre" 
                    value={form.publicCibleDetails.semestre} 
                    onChange={onChange}
                  />
                </div>
                <div>
                  <FormLabel htmlFor="publicCibleDetails.groupe" style={{ fontSize: '0.9em' }}>Groupe</FormLabel>
                  <AuthInput 
                    id="publicCibleDetails.groupe"
                    placeholder="Ex: A, B, C" 
                    name="publicCibleDetails.groupe" 
                    value={form.publicCibleDetails.groupe} 
                    onChange={onChange}
                  />
                </div>
              </div>
              <div style={{ fontSize: '0.9em', color: '#666', marginTop: '8px' }}>
                <p style={{ margin: '0' }}>
                  Format résultant: <strong>{updatePublicCible().publicCible || 'Veuillez remplir les champs ci-dessus'}</strong>
                </p>
              </div>
              <AuthInput 
                id="publicCible"
                placeholder="Ou saisissez directement le public ciblé" 
                name="publicCible" 
                value={form.publicCible} 
                onChange={onChange} 
                style={{ marginTop: '8px' }}
              />
              <p style={{ fontSize: '0.8em', color: '#666', marginTop: '4px' }}>
                Note: Si vous remplissez les champs détaillés ci-dessus, ce champ sera automatiquement mis à jour.
              </p>
            </FormGroup>
            <AuthButton type="submit" disabled={loading} style={{marginTop: '1rem'}}>
              {loading ? 'Création en cours...' : 'Créer l\'Examen'}
            </AuthButton>
            {error && <AuthError>{error}</AuthError>}
            {successMessage && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e6f9f0', border: '1px solid #28a745', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{color: '#28a745', margin: 0}}>{successMessage}</p>
                {createdExamLink && (
                  <p style={{marginTop: '0.5rem', fontSize: '0.9em'}}>
                    Lien unique pour les étudiants : <RouterLink to={createdExamLink.replace(window.location.origin, '')} target="_blank" rel="noopener noreferrer" style={{color: '#0A4C95', fontWeight:'bold'}}>{createdExamLink}</RouterLink>
                  </p>
                )}
                <AuthButton 
                  onClick={() => navigate('/teacher/dashboard')} 
                  style={{backgroundColor: '#17A2B8', marginTop: '1rem'}}
                >
                  Retour au Tableau de Bord
                </AuthButton>
              </div>
            )}
          </AuthForm>
        </AuthCard>
      </DashboardContent>
    </DashboardPageWrapper>
  );
}