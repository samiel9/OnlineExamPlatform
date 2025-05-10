import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styled from 'styled-components';
import { DashboardPageWrapper, DashboardContent, SectionTitle } from './styles';

// Styled Components
const ResultsContainer = styled.div`
  margin: 20px 0;
`;

const StudentCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 15px;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const StudentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const StudentName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #333;
`;

const StudentEmail = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const StudentInfo = styled.p`
  margin: 5px 0 0;
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
`;

const StudentBadge = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xxs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.brand.primaryLight};
  color: ${({ theme }) => theme.colors.brand.primaryDark};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-right: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  white-space: nowrap;
  font-weight: 500;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: #333;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  min-width: 150px;
`;

const FilterButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.neutral[0]};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  align-self: flex-end;
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.1s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.brand.primaryDark};
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const AttemptsContainer = styled.div`
  margin-top: 10px;
`;

const AttemptRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const AttemptInfo = styled.div`
  flex: 1;
`;

const AttemptDate = styled.span`
  font-size: 0.85rem;
  color: #666;
`;

const AttemptScore = styled.span`
  font-weight: ${props => props.highlight ? 'bold' : 'normal'};
  color: ${props => {
    if (props.percentage >= 80) return props.theme.colors.brand.success;
    if (props.percentage >= 60) return props.theme.colors.brand.accent;
    if (props.percentage >= 40) return props.theme.colors.warning;
    return props.theme.colors.brand.error;
  }};
`;

const ViewDetailsButton = styled.button`
  background-color: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.neutral[0]};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.brand.primaryDark};
  }
`;

const BackButton = styled.button`
  background-color: ${({ theme }) => theme.colors.neutral[600]};
  color: ${({ theme }) => theme.colors.neutral[0]};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[700]};
  }
`;

const LoadingText = styled.p`
  text-align: center;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.colors.neutral[600]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.brand.error};
  text-align: center;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => `${theme.colors.brand.error}15`};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => `${theme.colors.brand.error}40`};
`;

const ExamTitle = styled.h2`
  margin: 20px 0 5px;
  color: #333;
`;

const ExamDescription = styled.p`
  color: #666;
  margin: 0 0 20px;
  font-style: italic;
`;

const NoDataText = styled.p`
  text-align: center;
  margin: 40px 0;
  color: #666;
  font-style: italic;
`;

// Sous-composant pour les résultats d'un étudiant
const StudentResultCard = ({ student, examId, formatDate, handleViewSubmission }) => {
  const [showAllAttempts, setShowAllAttempts] = useState(false);
  
  // Trier les tentatives par ordre chronologique (première tentative en premier)
  const sortedAttempts = [...student.attempts].sort((a, b) => 
    new Date(a.submittedAt) - new Date(b.submittedAt)
  );
  
  // La première tentative est toujours affichée
  const firstAttempt = sortedAttempts.length > 0 ? sortedAttempts[0] : null;
  
  return (
    <StudentCard key={student.student.id}>
      <StudentHeader>
        <div>
          <StudentName>
            {student.student.prenom} {student.student.nom}
          </StudentName>
          <StudentEmail>{student.student.email}</StudentEmail>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '5px' }}>
            {student.student.annee && (
              <StudentBadge>{student.student.annee}</StudentBadge>
            )}
            {student.student.filiere && (
              <StudentBadge>{student.student.filiere}</StudentBadge>
            )}
            {student.student.semestre && (
              <StudentBadge>Semestre {student.student.semestre}</StudentBadge>
            )}
            {student.student.groupe && (
              <StudentBadge>Groupe {student.student.groupe}</StudentBadge>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span><strong>{student.attempts.length}</strong> essai(s)</span>
          
          {student.attempts.length > 1 && (
            <button 
              onClick={() => setShowAllAttempts(!showAllAttempts)}
              style={{
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '3px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {showAllAttempts ? '▲' : '▼'}
            </button>
          )}
        </div>
      </StudentHeader>
      
      <AttemptsContainer>
        {/* Première tentative toujours affichée */}
        {firstAttempt && (
          <AttemptRow key={firstAttempt.submissionId}>
            <AttemptInfo>
              <div>
                <strong>Essai #1</strong> - <AttemptDate>{formatDate(firstAttempt.submittedAt)}</AttemptDate>
              </div>
              <div>
                <AttemptScore percentage={firstAttempt.percentage} highlight={true}>
                  Score: {firstAttempt.totalScore}/{firstAttempt.totalScorePossible} ({firstAttempt.percentage}%)
                </AttemptScore>
                 - {firstAttempt.correctAnswersCount}/{firstAttempt.totalQuestions} question(s) correcte(s)
              </div>
            </AttemptInfo>
            <ViewDetailsButton onClick={() => handleViewSubmission(firstAttempt.submissionId)}>
              Voir les détails
            </ViewDetailsButton>
          </AttemptRow>
        )}
        
        {/* Autres tentatives (visibles uniquement si showAllAttempts est vrai) */}
        {showAllAttempts && sortedAttempts.slice(1).map((attempt, index) => (
          <AttemptRow 
            key={attempt.submissionId}
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <AttemptInfo>
              <div>
                <strong>Essai #{index + 2}</strong> - <AttemptDate>{formatDate(attempt.submittedAt)}</AttemptDate>
              </div>
              <div>
                <AttemptScore percentage={attempt.percentage} highlight={false}>
                  Score: {attempt.totalScore}/{attempt.totalScorePossible} ({attempt.percentage}%)
                </AttemptScore>
                 - {attempt.correctAnswersCount}/{attempt.totalQuestions} question(s) correcte(s)
              </div>
            </AttemptInfo>
            <ViewDetailsButton onClick={() => handleViewSubmission(attempt.submissionId)}>
              Voir les détails
            </ViewDetailsButton>
          </AttemptRow>
        ))}
      </AttemptsContainer>
    </StudentCard>
  );
};

const ExamResultsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [examResults, setExamResults] = useState(null);
  const [filteredResults, setFilteredResults] = useState(null);
  const [filters, setFilters] = useState({
    annee: '',
    filiere: '',
    semestre: '',
    groupe: ''
  });
  const [availableFilters, setAvailableFilters] = useState({
    annees: [],
    filieres: [],
    semestres: [],
    groupes: []
  });

  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/exams/${examId}/results`);
        setExamResults(response.data);
        setFilteredResults(response.data);
        
        // Extraire les valeurs uniques pour les filtres
        if (response.data && response.data.studentResults) {
          const annees = new Set();
          const filieres = new Set();
          const semestres = new Set();
          const groupes = new Set();
          
          response.data.studentResults.forEach(student => {
            if (student.student.annee) annees.add(student.student.annee);
            if (student.student.filiere) filieres.add(student.student.filiere);
            if (student.student.semestre) semestres.add(student.student.semestre);
            if (student.student.groupe) groupes.add(student.student.groupe);
          });
          
          setAvailableFilters({
            annees: [...annees].sort(),
            filieres: [...filieres].sort(),
            semestres: [...semestres].sort((a, b) => a - b),
            groupes: [...groupes].sort()
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching exam results:', err);
        setError('Impossible de récupérer les résultats de l\'examen. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    if (examId) {
      fetchExamResults();
    }
  }, [examId]);

  const handleViewSubmission = (submissionId) => {
    navigate(`/teacher/exams/${examId}/submissions/${submissionId}`);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    if (!examResults || !examResults.studentResults) return;
    
    const filtered = {
      ...examResults,
      studentResults: examResults.studentResults.filter(student => {
        // Vérifier chaque filtre actif
        if (filters.annee && student.student.annee !== filters.annee) return false;
        if (filters.filiere && student.student.filiere !== filters.filiere) return false;
        if (filters.semestre && student.student.semestre !== filters.semestre) return false;
        if (filters.groupe && student.student.groupe !== filters.groupe) return false;
        return true;
      })
    };
    
    setFilteredResults(filtered);
  };
  
  const resetFilters = () => {
    setFilters({
      annee: '',
      filiere: '',
      semestre: '',
      groupe: ''
    });
    setFilteredResults(examResults);
  };

  return (
    <DashboardPageWrapper>
      <DashboardContent>
        <BackButton onClick={() => navigate('/teacher/dashboard')}>
          &larr; Retour au tableau de bord
        </BackButton>
        
        {loading && <LoadingText>Chargement des résultats...</LoadingText>}
        {error && <ErrorText>{error}</ErrorText>}
        
        {!loading && !error && examResults && (
          <>
            <ExamTitle>{examResults.exam.title}</ExamTitle>
            {examResults.exam.description && (
              <ExamDescription>{examResults.exam.description}</ExamDescription>
            )}
            
            <SectionTitle>Résultats des étudiants</SectionTitle>
            
            {/* Filtres d'affichage */}
            <FiltersContainer>
              <FilterGroup>
                <FilterLabel htmlFor="annee">Année</FilterLabel>
                <FilterSelect 
                  id="annee" 
                  name="annee" 
                  value={filters.annee} 
                  onChange={handleFilterChange}
                >
                  <option value="">Toutes les années</option>
                  {availableFilters.annees.map(annee => (
                    <option key={annee} value={annee}>{annee}</option>
                  ))}
                </FilterSelect>
              </FilterGroup>
              
              <FilterGroup>
                <FilterLabel htmlFor="filiere">Filière</FilterLabel>
                <FilterSelect 
                  id="filiere" 
                  name="filiere" 
                  value={filters.filiere} 
                  onChange={handleFilterChange}
                >
                  <option value="">Toutes les filières</option>
                  {availableFilters.filieres.map(filiere => (
                    <option key={filiere} value={filiere}>{filiere}</option>
                  ))}
                </FilterSelect>
              </FilterGroup>
              
              <FilterGroup>
                <FilterLabel htmlFor="semestre">Semestre</FilterLabel>
                <FilterSelect 
                  id="semestre" 
                  name="semestre" 
                  value={filters.semestre} 
                  onChange={handleFilterChange}
                >
                  <option value="">Tous les semestres</option>
                  {availableFilters.semestres.map(semestre => (
                    <option key={semestre} value={semestre}>Semestre {semestre}</option>
                  ))}
                </FilterSelect>
              </FilterGroup>
              
              <FilterGroup>
                <FilterLabel htmlFor="groupe">Groupe</FilterLabel>
                <FilterSelect 
                  id="groupe" 
                  name="groupe" 
                  value={filters.groupe} 
                  onChange={handleFilterChange}
                >
                  <option value="">Tous les groupes</option>
                  {availableFilters.groupes.map(groupe => (
                    <option key={groupe} value={groupe}>Groupe {groupe}</option>
                  ))}
                </FilterSelect>
              </FilterGroup>
              
              <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-end', marginTop: 'auto' }}>
                <FilterButton onClick={applyFilters}>
                  Appliquer les filtres
                </FilterButton>
                <FilterButton onClick={resetFilters} style={{ backgroundColor: '#757575' }}>
                  Réinitialiser
                </FilterButton>
              </div>
            </FiltersContainer>
            
            {filteredResults && filteredResults.studentResults.length === 0 ? (
              <NoDataText>
                {examResults.studentResults.length === 0 
                  ? "Aucun étudiant n'a encore passé cet examen." 
                  : "Aucun résultat ne correspond aux critères de filtrage."}
              </NoDataText>
            ) : (
              <ResultsContainer>
                {filteredResults && filteredResults.studentResults.map(student => (
                  <StudentResultCard 
                    key={student.student.id}
                    student={student}
                    examId={examId}
                    formatDate={formatDate}
                    handleViewSubmission={handleViewSubmission}
                  />
                ))}
              </ResultsContainer>
            )}
          </>
        )}
      </DashboardContent>
    </DashboardPageWrapper>
  );
};

export default ExamResultsPage;
