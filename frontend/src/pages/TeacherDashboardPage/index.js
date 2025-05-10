import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  DashboardPageWrapper,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderContent,
  WelcomeMessage,
  SectionTitle,
  ExamList,
  ExamListItem,
  ExamHeader,
  ExamTitle,
  ExamDescription,
  ExamPublicCible,
  ExamActions,
  ActionButton,
  ActionButtonStyledAsNavLink,
  CreateExamButtonStyledAsNavLink,
  ExamLinkContainer,
  NoExamsMessage,
  LogoutButton,
  CopyLinkButton,
  StatusIndicator,
  ExamStatusLabel
} from './styles';
import { AuthError } from '../Auth/styles';

function TeacherDashboardPage() {
  const { user, logout } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // For success feedback
  const [copiedLink, setCopiedLink] = useState(null);

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  useEffect(() => {
    setLoading(true);
    api.get('/exams')
      .then(res => {
        setExams(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch exams error', err);
        setError(err.response?.data?.msg || 'Impossible de charger les examens. Veuillez réessayer plus tard.');
        setLoading(false);
        setTimeout(clearMessages, 5000);
      });
  }, []);

  const handleRefreshExams = () => {
    setLoading(true);
    clearMessages();
    api.get('/exams')
      .then(res => {
        setExams(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch exams error', err);
        setError(err.response?.data?.msg || 'Impossible de charger les examens. Veuillez réessayer plus tard.');
        setLoading(false);
        setTimeout(clearMessages, 5000);
      });
  };

  const LoadingMessage = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.semantic.textLight};
    padding: ${({ theme }) => theme.spacing.lg} 0;
  `;

  const handleCopyLink = useCallback((link, examId) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(examId);
      setTimeout(() => setCopiedLink(null), 2000);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  }, []);

  const getStatusDisplayInfo = (status) => {
    switch (status) {
      case 'actif':
        return { text: 'Actif', icon: 'fas fa-play-circle', colorToken: 'success' };
      case 'enPause':
        return { text: 'En Pause', icon: 'fas fa-pause-circle', colorToken: 'warning' };
      default:
        return { text: status || 'Inconnu', icon: 'fas fa-question-circle', colorToken: 'neutral' };
    }
  };

  return (
    <DashboardPageWrapper>
      <DashboardContent>
        <DashboardHeader>
          <DashboardHeaderContent>
            <div>
              <SectionTitle style={{ marginTop: 0, marginBottom: '0.5rem' }}>Tableau de Bord Enseignant</SectionTitle>
              <WelcomeMessage>Bienvenue, {user?.prenom || user?.nom || user?.email} !</WelcomeMessage>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <LogoutButton onClick={logout}>
                <i className="fas fa-sign-out-alt"></i> Déconnexion
              </LogoutButton>
              <CreateExamButtonStyledAsNavLink primary="true" to="/teacher/exams/new">
                <i className="fas fa-plus"></i> Créer un Nouvel Examen
              </CreateExamButtonStyledAsNavLink>
            </div>
          </DashboardHeaderContent>
        </DashboardHeader>

        {successMessage && <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>} {/* Display success messages */}
        {error && <AuthError>{error}</AuthError>} {/* Display errors */}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <SectionTitle>Mes Examens</SectionTitle>
          <ActionButton onClick={handleRefreshExams} disabled={loading}>
            <i className="fas fa-sync-alt"></i> {loading ? 'Chargement...' : 'Rafraîchir'}
          </ActionButton>
        </div>
        
        {loading && <LoadingMessage>Chargement des examens...</LoadingMessage>}
        {/* Error message is now displayed above */}
        {!loading && !error && exams.length === 0 && (
          <NoExamsMessage>
            Vous n'avez pas encore créé d'examen. <br />
            Commencez par en créer un !
          </NoExamsMessage>
        )}
        {!loading && /* Removed !error here as error is displayed above */ exams.length > 0 && (
          <ExamList>
            {exams.map(exam => {
              const statusInfo = getStatusDisplayInfo(exam.status);
              return (
                <ExamListItem 
                  key={exam._id} 
                >
                  <ExamHeader>
                    <ExamTitle>{exam.titre}</ExamTitle>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StatusIndicator colorToken={statusInfo.colorToken} aria-label={`Statut: ${statusInfo.text}`} />
                      <ExamStatusLabel colorToken={statusInfo.colorToken}>{statusInfo.text}</ExamStatusLabel>
                    </div>
                  </ExamHeader>
                  <ExamDescription><strong>Description:</strong> {exam.description || 'N/A'}</ExamDescription>
                  <ExamPublicCible><strong>Public:</strong> {exam.publicCibleDetails ? `${exam.publicCibleDetails.niveau} - ${exam.publicCibleDetails.filiere} - ${exam.publicCibleDetails.annee}` : (exam.publicCible || 'N/A')}</ExamPublicCible>
                  <ExamLinkContainer>
                    <span>
                      Lien étudiant : <a href={`${window.location.origin}/exam/${exam.lienExamen}`} target="_blank" rel="noopener noreferrer">{`${window.location.origin}/exam/${exam.lienExamen}`}</a>
                    </span>
                    <CopyLinkButton 
                      onClick={() => handleCopyLink(`${window.location.origin}/exam/${exam.lienExamen}`, exam._id)}
                      className={copiedLink === exam._id ? 'copied' : ''}
                    >
                      {copiedLink === exam._id ? 'Copié !' : 'Copier'}
                    </CopyLinkButton>
                  </ExamLinkContainer>
                  <ExamActions>
                    <ActionButtonStyledAsNavLink to={`/teacher/exams/${exam._id}/edit`} title="Gérer les détails et questions">
                      <i className="fas fa-edit"></i> Gérer
                    </ActionButtonStyledAsNavLink>
                    
                    <ActionButtonStyledAsNavLink 
                      to={`/teacher/exams/${exam._id}/results`} 
                      title="Voir les résultats des soumissions"
                    >
                      <i className="fas fa-chart-bar"></i> Résultats
                    </ActionButtonStyledAsNavLink>
                  </ExamActions>
                </ExamListItem>
              );
            })}
          </ExamList>
        )}
      </DashboardContent>
    </DashboardPageWrapper>
  );
}

export default TeacherDashboardPage;
