import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import api from '../../services/api';
import {
  DashboardPageWrapper,
  DashboardContent,
  SectionTitle,
  ExamList,
  ExamListItem,
  ActionButton,
} from './styles';
import { AuthTitle, AuthError, AuthForm, FormGroup, FormLabel, AuthInput, AuthTextarea, AuthButton } from '../Auth/styles';
import styled, { useTheme } from 'styled-components';

// Helper function to parse public cible string into structured data
function parsePublicCible(publicCibleString) {
  const details = { formation: '', annee: '', semestre: '', groupe: '' };
  if (!publicCibleString) return details;
  const formationMatch = publicCibleString.match(/^([A-Za-z]+)/);
  if (formationMatch) details.formation = formationMatch[1];
  const anneeMatch = publicCibleString.match(/(\d+[eè]? ?ann[ée]e|[LMD]\d+)/i);
  if (anneeMatch) details.annee = anneeMatch[1];
  const semestreMatch = publicCibleString.match(/S(\d+)/i);
  if (semestreMatch) details.semestre = semestreMatch[1];
  const groupeMatch = publicCibleString.match(/groupe ([A-Z0-9]+)/i);
  if (groupeMatch) details.groupe = groupeMatch[1];
  return details;
}

const ExamDetailsWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.semantic.surface};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  p {
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.neutral[700]};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    line-height: 1.6;
  }
  strong {
    color: ${({ theme }) => theme.colors.neutral[800]};
  }
`;

const QuestionInfo = styled.div`
  flex-grow: 1;
  p {
    margin: ${({ theme }) => theme.spacing.xs} 0;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.neutral[700]};
  }
  strong {
    color: ${({ theme }) => theme.colors.neutral[800]};
  }
`;

const QuestionActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
  align-items: center;
`;

const StyledQuestionItem = styled(ExamListItem)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PageActions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ExamManagementActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  flex-wrap: wrap;
`;


function EditExamPage() {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme(); // Add this line to get the theme object
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // For action feedback
  const [loading, setLoading] = useState(true);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [formDetails, setFormDetails] = useState({
    titre: '',
    description: '',
    publicCible: '',
    status: '', // Add status to formDetails if you plan to display/edit it directly
    publicCibleDetails: {
      formation: '',
      annee: '',
      semestre: '',
      groupe: ''
    }
  });

  const fetchExamDetails = useCallback(async () => {
    setLoading(true);
    try {
      const examRes = await api.get(`/exams/${examId}`);
      setExam(examRes.data);
      setQuestions(examRes.data.questions || []);
      setError('');
      setSuccessMessage(''); // Clear previous success messages on fetch
      const parsed = parsePublicCible(examRes.data.publicCible);
      setFormDetails({
        titre: examRes.data.titre,
        description: examRes.data.description,
        publicCible: examRes.data.publicCible,
        status: examRes.data.status, // Initialize status
        publicCibleDetails: parsed
      });
    } catch (err) {
      console.error("Error fetching exam details:", err);
      setError(err.response?.data?.msg || 'Erreur lors de la récupération des détails de l’examen.');
      if (err.response?.status === 404) {
        setExam(null);
      }
    }
    setLoading(false);
  }, [examId]);

  useEffect(() => {
    fetchExamDetails();
  }, [fetchExamDetails]);

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      try {
        setError('');
        await api.delete(`/exams/questions/${questionId}`);
        setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== questionId));
      } catch (err) {
        console.error("Error deleting question:", err);
        setError(err.response?.data?.msg || 'Erreur lors de la suppression de la question.');
      }
    }
  };

  const handleDetailsChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('publicCibleDetails.')) {
      const field = name.split('.')[1];
      setFormDetails(prev => ({
        ...prev,
        publicCibleDetails: { ...prev.publicCibleDetails, [field]: value }
      }));
    } else {
      setFormDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const updatePublicCibleField = () => {
    const { formation, annee, semestre, groupe } = formDetails.publicCibleDetails;
    const parts = [];
    if (formation) parts.push(formation);
    if (annee) parts.push(annee);
    if (semestre) parts.push(`S${semestre}`);
    if (groupe) parts.push(`Groupe ${groupe}`);
    return parts.join(', ');
  };

  const handleDetailsSubmit = async e => {
    e.preventDefault();
    try {
      const publicCible = updatePublicCibleField() || formDetails.publicCible;
      const payload = { 
        titre: formDetails.titre,
        description: formDetails.description,
        publicCible
      };
      await api.put(`/exams/${examId}`, payload);
      // Refresh view
      setIsEditingDetails(false);
      fetchExamDetails();
    } catch (err) {
      console.error('Error updating exam details:', err);
      setError(err.response?.data?.msg || 'Erreur lors de la mise à jour des détails de l’examen.');
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const handleUpdateStatus = async (newStatus) => {
    clearMessages();
    try {
      const response = await api.put(`/exams/${examId}/status`, { status: newStatus });
      setExam(prevExam => ({ ...prevExam, status: response.data.status })); // Update local exam state
      setFormDetails(prev => ({ ...prev, status: response.data.status })); // Also update formDetails if it holds status
      setSuccessMessage(`L'examen a été ${newStatus === 'actif' ? 'repris' : 'mis en pause'} avec succès.`);
      setTimeout(clearMessages, 3000);
    } catch (err) {
      console.error(`Error updating exam status to ${newStatus}`, err);
      setError(err.response?.data?.msg || `Impossible de mettre à jour le statut de l'examen.`);
      setTimeout(clearMessages, 5000);
    }
  };

  const handleArchiveExam = async () => {
    clearMessages();
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Êtes-vous sûr de vouloir archiver cet examen ? Cette action est irréversible via l'interface actuelle et l'examen ne sera plus accessible pour modification ou consultation des résultats directs.")) {
      try {
        await api.delete(`/exams/${examId}`);
        setSuccessMessage("L'examen a été archivé avec succès. Vous allez être redirigé.");
        setTimeout(() => {
          navigate('/teacher/dashboard');
        }, 2000);
      } catch (err) {
        console.error('Error archiving exam', err);
        setError(err.response?.data?.msg || `Impossible d'archiver l'examen.`);
        setTimeout(clearMessages, 5000);
      }
    }
  };
  
  // Minimal getStatusDisplayInfo, can be expanded if icons/colors are needed directly on buttons
  const getStatusButtonInfo = (status) => {
    switch (status) {
      case 'actif':
        return { actionText: 'Pause', nextStatus: 'enPause', buttonProps: { warning: true, title: "Mettre l'examen en pause" } };
      case 'enPause':
        return { actionText: 'Reprendre', nextStatus: 'actif', buttonProps: { success: true, title: "Reprendre l'examen" } }; // Assuming 'success' prop is styled for ActionButton
      default: // Should not happen for an exam being edited if it's not archived
        return { actionText: 'Statut Inconnu', nextStatus: '', buttonProps: { disabled: true } };
    }
  };

  if (loading) {
    return (
      <DashboardPageWrapper>
        <DashboardContent>
          <p>Chargement des détails de l'examen...</p>
        </DashboardContent>
      </DashboardPageWrapper>
    );
  }

  if (!exam && error) {
    return (
      <DashboardPageWrapper>
        <DashboardContent>
          <AuthTitle>Erreur</AuthTitle>
          <AuthError>{error}</AuthError>
          <ActionButton onClick={() => navigate('/teacher/dashboard')} style={{ marginTop: '20px' }}>
            Retour au tableau de bord
          </ActionButton>
        </DashboardContent>
      </DashboardPageWrapper>
    );
  }

  if (!exam) {
    return (
      <DashboardPageWrapper>
        <DashboardContent>
          <AuthTitle>Examen non trouvé.</AuthTitle>
          <ActionButton onClick={() => navigate('/teacher/dashboard')} style={{ marginTop: '20px' }}>
            Retour au tableau de bord
          </ActionButton>
        </DashboardContent>
      </DashboardPageWrapper>
    );
  }

  return (
    <DashboardPageWrapper>
      <DashboardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <AuthTitle>Modifier l'examen : {exam.titre}</AuthTitle>
          {/* Display current status */}
          <p style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
            Statut actuel : <span style={{ color: exam.status === 'actif' ? theme.colors.status.actif : theme.colors.status.enPause }}>
              {exam.status === 'actif' ? 'Actif' : 'En Pause'}
            </span>
          </p>
        </div>

        {successMessage && <p style={{ color: 'green', textAlign: 'center', margin: '1rem 0' }}>{successMessage}</p>}
        {error && !successMessage && <AuthError style={{ marginBottom: '1rem' }}>{error}</AuthError>}


        <ExamManagementActions>
          <ActionButton onClick={() => setIsEditingDetails(prev => !prev)}>
            <i className={`fas ${isEditingDetails ? 'fa-times' : 'fa-edit'}`}></i> {isEditingDetails ? 'Annuler la modification des détails' : 'Modifier les détails'}
          </ActionButton>
          {exam.status !== 'archivé' && ( /* Ensure exam is not archived before showing these actions */
            <>
              {(() => {
                const { actionText, nextStatus, buttonProps } = getStatusButtonInfo(exam.status);
                return (
                  <ActionButton onClick={() => handleUpdateStatus(nextStatus)} {...buttonProps}>
                    <i className={`fas ${exam.status === 'actif' ? 'fa-pause' : 'fa-play'}`}></i> {actionText}
                  </ActionButton>
                );
              })()}
              <ActionButton onClick={handleArchiveExam} danger title="Archiver l'examen (irréversible)">
                <i className="fas fa-archive"></i> Archiver
              </ActionButton>
            </>
          )}
        </ExamManagementActions>

        {isEditingDetails && (
          <AuthForm onSubmit={handleDetailsSubmit} style={{ marginBottom: '2rem' }}>
            <FormGroup>
              <FormLabel htmlFor="titre">Titre de l'examen</FormLabel>
              <AuthInput name="titre" id="titre" value={formDetails.titre} onChange={handleDetailsChange} required />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="description">Description</FormLabel>
              <AuthTextarea name="description" id="description" value={formDetails.description} onChange={handleDetailsChange} required />
            </FormGroup>
            <SectionTitle>Public Ciblé Détails</SectionTitle>
            <FormGroup>
              <FormLabel htmlFor="publicCibleDetails.formation">Formation</FormLabel>
              <AuthInput name="publicCibleDetails.formation" id="publicCibleDetails.formation" value={formDetails.publicCibleDetails.formation} onChange={handleDetailsChange} />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="publicCibleDetails.annee">Année</FormLabel>
              <AuthInput name="publicCibleDetails.annee" id="publicCibleDetails.annee" value={formDetails.publicCibleDetails.annee} onChange={handleDetailsChange} />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="publicCibleDetails.semestre">Semestre</FormLabel>
              <AuthInput name="publicCibleDetails.semestre" id="publicCibleDetails.semestre" value={formDetails.publicCibleDetails.semestre} onChange={handleDetailsChange} />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="publicCibleDetails.groupe">Groupe</FormLabel>
              <AuthInput name="publicCibleDetails.groupe" id="publicCibleDetails.groupe" value={formDetails.publicCibleDetails.groupe} onChange={handleDetailsChange} />
            </FormGroup>
            <FormGroup>
              <FormLabel>Résultat Public Ciblé</FormLabel>
              <p><strong>{updatePublicCibleField() || formDetails.publicCible}</strong></p>
            </FormGroup>
            <AuthButton type="submit">Enregistrer</AuthButton>
          </AuthForm>
        )}

        <ExamDetailsWrapper>
          <p><strong>Description :</strong> {exam.description}</p>
          <p><strong>Public Cible :</strong> {exam.publicCible}</p>
        </ExamDetailsWrapper>

        <SectionTitle>Questions</SectionTitle>
        {error && <AuthError>{error}</AuthError>}
        
        <ExamList>
          {questions.length > 0 ? questions.map(q => (
            <StyledQuestionItem key={q._id}>
              <QuestionInfo>
                <p><strong>Texte :</strong> {q.text.length > 100 ? `${q.text.substring(0, 100)}...` : q.text}</p>
                <p><strong>Type :</strong> {q.type === 'qcm' ? 'QCM' : 'Directe'}</p>
                <p><strong>Durée :</strong> {q.duration}s, <strong>Score :</strong> {q.score} pts</p>
              </QuestionInfo>
              <QuestionActions>
                <ActionButton 
                  as={NavLink} 
                  to={`/teacher/exams/${examId}/questions/${q._id}/edit`}
                >
                  Modifier
                </ActionButton>
                <ActionButton 
                  onClick={() => handleDeleteQuestion(q._id)}
                  danger 
                >
                  Supprimer
                </ActionButton>
              </QuestionActions>
            </StyledQuestionItem>
          )) : <p>Aucune question pour cet examen. Ajoutez-en une !</p>}
        </ExamList>

        <PageActions>
          <div> {/* Group for primary actions */}
            <ActionButton 
              as={NavLink} 
              to={`/teacher/exams/${examId}/questions/new`}
              primary
            >
              <i className="fas fa-plus"></i> Ajouter une question
            </ActionButton>
          </div>
          <div> {/* Group for navigation / less critical actions */}
            <ActionButton onClick={() => navigate('/teacher/dashboard')} >
              <i className="fas fa-arrow-left"></i> Retour au tableau de bord
            </ActionButton>
          </div>
        </PageActions>

      </DashboardContent>
    </DashboardPageWrapper>
  );
}

export default EditExamPage;
