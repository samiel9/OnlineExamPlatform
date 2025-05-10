import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { PageWrapper, MainContent } from '../Auth/styles';
import {
  ResultsWrapper,
  Title,
  Summary,
  ResultCard,
  QuestionText,
  AnswerText,
  ExpectedAnswer,
  ScoreText,
  BackButton,
  LoadingText,
  ErrorText
} from './styles';

const StudentResultsPage = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/exams/submissions/${submissionId}`);
        setResult(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Erreur lors de la récupération des résultats.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [submissionId]);

  if (loading) {
    return (
      <PageWrapper>
        <MainContent>
          <LoadingText>Chargement des résultats...</LoadingText>
        </MainContent>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <MainContent>
          <ErrorText>{error}</ErrorText>
          <BackButton onClick={() => navigate('/student/dashboard')}>Retour</BackButton>
        </MainContent>
      </PageWrapper>
    );
  }

  if (result) {
    return (
      <PageWrapper>
        <MainContent>
          <ResultsWrapper>
            <BackButton onClick={() => navigate('/student/dashboard')}>← Retour au tableau de bord</BackButton>
            <Title>Résultat d'examen : {result.exam.titre}</Title>
            <Summary>
              {result.attemptNumber && <p><strong>Essai #:</strong> {result.attemptNumber}</p>}
              <p><strong>Score Total:</strong> {result.totalScore} / {result.totalScorePossible} ({result.percentage}%)</p>
              <p><strong>Questions Correctes:</strong> {result.correctAnswersCount} / {result.answers.length}</p>
              <p><strong>Date de soumission:</strong> {new Date(result.submittedAt).toLocaleString()}</p>
            </Summary>

            {result.answers.map((ans, idx) => (
              <ResultCard key={idx}>
                <QuestionText>
                  {idx + 1}. {ans.question.text}
                </QuestionText>
                <AnswerText>
                  Votre réponse: {Array.isArray(ans.answer) ? ans.answer.map(i => ans.question.options[i]).join(', ') : ans.answer || 'Aucune réponse'}
                </AnswerText>
                <ScoreText>Score obtenu: {ans.scoreAwarded} / {ans.question.score}</ScoreText>
                {ans.question.type === 'direct' && (
                  <ExpectedAnswer>Réponse attendue: {ans.question.answer || 'N/A'}</ExpectedAnswer>
                )}
                {ans.question.type === 'qcm' && ans.question.correct && (
                  <ExpectedAnswer>
                    Réponses attendues: {ans.question.correct.map(i => ans.question.options[i]).join(', ')}
                  </ExpectedAnswer>
                )}
              </ResultCard>
            ))}
          </ResultsWrapper>
        </MainContent>
      </PageWrapper>
    );
  }

  return null;
};

export default StudentResultsPage;
