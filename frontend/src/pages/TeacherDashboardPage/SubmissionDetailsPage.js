import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styled from 'styled-components';
import { DashboardPageWrapper, DashboardContent, SectionTitle } from './styles';

// Styled Components
const BackButton = styled.button`
  background-color: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.neutral[0]};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.brand.primaryDark};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:active {
    transform: translateY(1px);
  }
`;

const SubmissionContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.semantic.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SubmissionHeader = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ExamTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.fontSizes.h4};
`;

const StudentInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const StudentName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const StudentEmail = styled.div`
  color: ${({ theme }) => theme.colors.neutral[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ScoreInfo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: bold;
  color: ${({ theme, percentage }) => {
    if (percentage >= 80) return theme.colors.brand.success;
    if (percentage >= 60) return theme.colors.brand.accent;
    if (percentage >= 40) return theme.colors.warning;
    return theme.colors.brand.error;
  }};
`;

const SubmissionInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoItem = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const QuestionsContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const QuestionCard = styled.div`
  background-color: ${({ theme, isCorrect }) =>
    isCorrect ? theme.colors.semantic.successBackground : theme.colors.semantic.errorBackground};
  border-left: 4px solid ${({ theme, isCorrect }) =>
    isCorrect ? theme.colors.brand.success : theme.colors.brand.error};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const QuestionText = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const AnswerSection = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
`;

const AnswerLabel = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #666;
`;

const Answer = styled.div`
  margin-bottom: 10px;
  padding: 5px;
  background-color: ${props => props.isCorrect ? 'rgba(76, 175, 80, 0.1)' : props.isSelected ? 'rgba(244, 67, 54, 0.1)' : 'transparent'};
  border-radius: 4px;
`;

const CorrectAnswer = styled.div`
  margin-top: 10px;
  font-weight: bold;
  color: #4caf50;
`;

const LoadingText = styled.p`
  text-align: center;
  margin: 20px 0;
  color: #666;
`;

const ErrorText = styled.p`
  color: #f44336;
  text-align: center;
  margin: 20px 0;
`;

const SubmissionDetailsPage = () => {
  const { examId, submissionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/exams/${examId}/submissions/${submissionId}`);
        setSubmission(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching submission details:', err);
        setError('Impossible de récupérer les détails de cette soumission. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    if (examId && submissionId) {
      fetchSubmissionDetails();
    }
  }, [examId, submissionId]);

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

  const renderAnswerBasedOnType = (question, studentAnswer) => {
    switch (question.type.toLowerCase()) {
      case 'qcm':
        return (
          <>
            <AnswerLabel>Réponses de l'étudiant:</AnswerLabel>
            {question.options.map((option, i) => (
              <Answer 
                key={i} 
                isSelected={studentAnswer === i}
                isCorrect={i === question.correctAnswer && studentAnswer === i}
              >
                {i + 1}. {option}
                {i === question.correctAnswer && studentAnswer === i && ' ✓'}
                {i !== question.correctAnswer && studentAnswer === i && ' ✗'}
              </Answer>
            ))}
            <CorrectAnswer>
              Réponse correcte: {question.options[question.correctAnswer]}
            </CorrectAnswer>
          </>
        );
      case 'qcu':
        return (
          <>
            <AnswerLabel>Réponse de l'étudiant:</AnswerLabel>
            {question.options.map((option, i) => (
              <Answer 
                key={i} 
                isSelected={Array.isArray(studentAnswer) && studentAnswer.includes(i)}
                isCorrect={question.correctAnswer.includes(i) && Array.isArray(studentAnswer) && studentAnswer.includes(i)}
              >
                {i + 1}. {option}
                {question.correctAnswer.includes(i) && Array.isArray(studentAnswer) && studentAnswer.includes(i) && ' ✓'}
                {!question.correctAnswer.includes(i) && Array.isArray(studentAnswer) && studentAnswer.includes(i) && ' ✗'}
              </Answer>
            ))}
            <CorrectAnswer>
              Réponses correctes: {question.correctAnswer.map(i => question.options[i]).join(', ')}
            </CorrectAnswer>
          </>
        );
      case 'text':
      case 'direct':
        return (
          <>
            <AnswerLabel>Réponse de l'étudiant:</AnswerLabel>
            <Answer 
              isSelected={true} 
              isCorrect={studentAnswer?.toString().toLowerCase() === (question.correctAnswer || question.answer)?.toString().toLowerCase()}
            >
              {studentAnswer || 'Pas de réponse'}
            </Answer>
            <CorrectAnswer>
              Réponse correcte: {question.correctAnswer || question.answer}
            </CorrectAnswer>
          </>
        );
      default:
        return (
          <>
            <AnswerLabel>Type de question: {question.type}</AnswerLabel>
            <Answer isSelected={true} isCorrect={false}>
              Réponse de l'étudiant: {JSON.stringify(studentAnswer) || 'Pas de réponse'}
            </Answer>
            <CorrectAnswer>
              Réponse attendue: {JSON.stringify(question.correctAnswer || question.answer || "Non spécifiée")}
            </CorrectAnswer>
          </>
        );
    }
  };

  const isAnswerCorrect = (question, studentAnswer) => {
    switch (question.type.toLowerCase()) {
      case 'qcm':
        return studentAnswer === question.correctAnswer;
      case 'qcu':
        if (!Array.isArray(studentAnswer) || !Array.isArray(question.correctAnswer)) {
          return false;
        }
        return (
          question.correctAnswer.length === studentAnswer.length &&
          question.correctAnswer.every(ans => studentAnswer.includes(ans))
        );
      case 'text':
      case 'direct':
        const correctAnswer = question.correctAnswer || question.answer;
        if (!correctAnswer || !studentAnswer) return false;
        return studentAnswer.toString().toLowerCase() === correctAnswer.toString().toLowerCase();
      default:
        // Pour tous les autres types, on vérifie si le score attribué est maximal
        return question.scoreAwarded === question.score;
    }
  };

  return (
    <DashboardPageWrapper>
      <DashboardContent>
        <BackButton onClick={() => navigate(`/teacher/exams/${examId}/results`)}>
          &larr; Retour aux résultats
        </BackButton>
        
        {loading && <LoadingText>Chargement des détails...</LoadingText>}
        {error && <ErrorText>{error}</ErrorText>}
        
        {!loading && !error && submission && (
          <SubmissionContainer>
            <SubmissionHeader>
              <ExamTitle>{submission.exam.titre}</ExamTitle>
              
              <StudentInfo>
                <div>
                  <StudentName>
                    {submission.student.prenom} {submission.student.nom}
                  </StudentName>
                  <StudentEmail>{submission.student.email}</StudentEmail>
                </div>
                <ScoreInfo percentage={submission.percentage}>
                  Score: {submission.totalScore}/{submission.totalScorePossible} ({submission.percentage}%)
                </ScoreInfo>
              </StudentInfo>
              
              <SubmissionInfo>
                <InfoItem><strong>Essai #:</strong> {submission.attemptNumber}</InfoItem>
                <InfoItem><strong>Date de soumission:</strong> {formatDate(submission.submittedAt)}</InfoItem>
                <InfoItem><strong>Questions correctes:</strong> {submission.correctAnswersCount}/{submission.totalQuestions}</InfoItem>
                {submission.startTime && (
                  <InfoItem><strong>Heure de début:</strong> {formatDate(submission.startTime)}</InfoItem>
                )}
                {submission.timeSpent && (
                  <InfoItem>
                    <strong>Temps passé:</strong> {Math.floor(submission.timeSpent / 60)} min {submission.timeSpent % 60} sec
                  </InfoItem>
                )}
              </SubmissionInfo>

              {submission.location && (
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <h4 style={{ marginBottom: '8px' }}>Localisation</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {submission.location.city && submission.location.country && (
                      <div><strong>Lieu:</strong> {submission.location.city}, {submission.location.country}</div>
                    )}
                    {submission.location.latitude && submission.location.longitude && (
                      <div>
                        <strong>Coordonnées:</strong> {submission.location.latitude.toFixed(6)}, {submission.location.longitude.toFixed(6)}
                        <a 
                          href={`https://www.google.com/maps?q=${submission.location.latitude},${submission.location.longitude}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ marginLeft: '8px', fontSize: '0.9rem' }}
                        >
                          Voir sur la carte
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </SubmissionHeader>
            
            <SectionTitle>Réponses détaillées</SectionTitle>
            
            <QuestionsContainer>
              {submission.answers.map((answer, index) => (
                <QuestionCard 
                  key={index} 
                  isCorrect={isAnswerCorrect(answer.question, answer.answer)}
                >
                  <QuestionText>
                    Question {index + 1}: {answer.question.text}
                  </QuestionText>
                  
                  <AnswerSection>
                    {renderAnswerBasedOnType(answer.question, answer.answer)}
                  </AnswerSection>
                  
                  <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
                    Points: {answer.scoreAwarded}/{answer.question.score}
                  </div>
                </QuestionCard>
              ))}
            </QuestionsContainer>
          </SubmissionContainer>
        )}
      </DashboardContent>
    </DashboardPageWrapper>
  );
};

export default SubmissionDetailsPage;
