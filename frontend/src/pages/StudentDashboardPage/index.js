import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  StudentDashboardPageWrapper,
  StudentDashboardContent,
  WelcomeMessage,
  SectionTitle,
  CardGrid,
  Card,
  CardTitle,
  CardContent,
  ExamInfoText,
  StyledButton,
  StyledNavLink,
  ActionsContainer,
  PlaceholderText,
  LoadingText,
  ErrorText,
  AttemptsDetailsWrapper,
  AttemptsTitle,
  AttemptsTable,
} from './styles';

const StudentDashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [availableExams, setAvailableExams] = useState([]);
  const [examAttemptsHistory, setExamAttemptsHistory] = useState([]);
  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState('');
  const [expandedExam, setExpandedExam] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || user.role !== 'etudiant') return;

      setIsLoadingExams(true);
      setIsLoadingHistory(true);
      setError('');
      let errorsOccurred = [];

      try {
        const examsResponse = await api.get('/exams/public/all');
        setAvailableExams(examsResponse.data || []);
      } catch (err) {
        console.error('Error fetching available exams:', err);
        errorsOccurred.push('Failed to load available exams.');
        setAvailableExams([]);
      }
      setIsLoadingExams(false);

      try {
        const attemptsResponse = await api.get('/exams/attempts/me');
        const processedAttempts = (attemptsResponse.data || []).map((exam) => ({
          ...exam,
          attempts: exam.attempts.sort((a, b) => a.attemptNumber - b.attemptNumber),
        }));
        setExamAttemptsHistory(processedAttempts);
      } catch (err) {
        console.error('Error fetching exam attempts/history:', err);
        errorsOccurred.push('Failed to load exam history.');
        setExamAttemptsHistory([]);
      }
      setIsLoadingHistory(false);

      if (errorsOccurred.length > 0) {
        setError(errorsOccurred.join(' '));
      }
    };

    if (user && user.role === 'etudiant') {
      fetchDashboardData();
    }
  }, [user]);

  const toggleExamDetails = (examId) => {
    setExpandedExam(expandedExam === examId ? null : examId);
  };

  if (authLoading) {
    return (
      <StudentDashboardPageWrapper>
        <StudentDashboardContent>
          <LoadingText>Loading session...</LoadingText>
        </StudentDashboardContent>
      </StudentDashboardPageWrapper>
    );
  }

  if (!user) {
    return (
      <StudentDashboardPageWrapper>
        <StudentDashboardContent>
          <PlaceholderText>Please log in to view your dashboard.</PlaceholderText>
        </StudentDashboardContent>
      </StudentDashboardPageWrapper>
    );
  }

  return (
    <StudentDashboardPageWrapper>
      <StudentDashboardContent>
        <WelcomeMessage>Welcome, {user.name || user.prenom || user.email || 'Student'}!</WelcomeMessage>

        {error && <ErrorText>{error}</ErrorText>}

        <SectionTitle>Available Exams</SectionTitle>
        {isLoadingExams ? (
          <LoadingText>Loading available exams...</LoadingText>
        ) : availableExams.length > 0 ? (
          <CardGrid>
            {availableExams.map((exam) => (
              <Card key={exam._id}>
                <CardTitle>{exam.titre}</CardTitle>
                <CardContent>
                  <ExamInfoText>Description: {exam.description || 'N/A'}</ExamInfoText>
                  <ExamInfoText>
                    Public:{' '}
                    {exam.publicCibleDetails
                      ? `${exam.publicCibleDetails.niveau || ''} - ${exam.publicCibleDetails.filiere || ''}`
                          .trim()
                          .replace(/^-|-$/g, '') || 'N/A'
                      : exam.publicCible || 'N/A'}
                  </ExamInfoText>
                </CardContent>
                <ActionsContainer>
                  <StyledButton
                    primary
                    onClick={() => navigate(`/exam/${exam.lienExamen}`)}
                    style={{ width: '100%' }}
                  >
                    Start Exam
                  </StyledButton>
                </ActionsContainer>
              </Card>
            ))}
          </CardGrid>
        ) : (
          !error && (
            <PlaceholderText>
              No exams currently available. Please check back later or contact your teacher.
            </PlaceholderText>
          )
        )}

        <SectionTitle>Completed Exams History</SectionTitle>
        {isLoadingHistory ? (
          <LoadingText>Loading exam history...</LoadingText>
        ) : examAttemptsHistory.length > 0 ? (
          <CardGrid>
            {examAttemptsHistory.map((exam) => {
              const sortedAttemptsByDateDesc = [...exam.attempts].sort(
                (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
              );
              const latestAttempt =
                sortedAttemptsByDateDesc.length > 0 ? sortedAttemptsByDateDesc[0] : null;

              return (
                <Card key={exam.examId}>
                  <CardTitle>{exam.examTitle}</CardTitle>
                  <CardContent>
                    <ExamInfoText>
                      <strong>Total Attempts:</strong> {exam.attempts.length}
                    </ExamInfoText>
                    {latestAttempt && (
                      <ExamInfoText>
                        <strong>Latest Attempt ({new Date(latestAttempt.submittedAt).toLocaleDateString()}):</strong>{' '}
                        Score: {latestAttempt.totalScore}/{latestAttempt.totalScorePossible} (
                        {latestAttempt.percentage}%)
                      </ExamInfoText>
                    )}
                    {!latestAttempt && <ExamInfoText>No attempts recorded for this exam yet.</ExamInfoText>}
                  </CardContent>
                  <ActionsContainer>
                    <StyledButton
                      onClick={() => toggleExamDetails(exam.examId)}
                      style={{ flexGrow: 1 }}
                    >
                      {expandedExam === exam.examId ? 'Hide Details' : 'View All Attempts'}
                    </StyledButton>
                    {latestAttempt && (
                      <StyledNavLink
                        success="true"
                        to={`/student/results/${latestAttempt.submissionId}`}
                        style={{ flexGrow: 1 }}
                      >
                        View Latest Result
                      </StyledNavLink>
                    )}
                  </ActionsContainer>

                  {expandedExam === exam.examId && (
                    <AttemptsDetailsWrapper>
                      <AttemptsTitle>All Attempts for {exam.examTitle}</AttemptsTitle>
                      {exam.attempts.length > 0 ? (
                        <AttemptsTable>
                          <thead>
                            <tr>
                              <th>Attempt #</th>
                              <th>Date</th>
                              <th>Score</th>
                              <th>Percentage</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {exam.attempts.map((attempt) => (
                              <tr key={attempt.submissionId}>
                                <td>{attempt.attemptNumber}</td>
                                <td>
                                  {new Date(attempt.submittedAt).toLocaleDateString()}{' '}
                                  {new Date(attempt.submittedAt).toLocaleTimeString()}
                                </td>
                                <td>
                                  {attempt.totalScore}/{attempt.totalScorePossible}
                                </td>
                                <td>{attempt.percentage}%</td>
                                <td>
                                  <StyledNavLink to={`/student/results/${attempt.submissionId}`}>
                                    Details
                                  </StyledNavLink>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </AttemptsTable>
                      ) : (
                        <ExamInfoText>No attempts found for this exam.</ExamInfoText>
                      )}
                    </AttemptsDetailsWrapper>
                  )}
                </Card>
              );
            })}
          </CardGrid>
        ) : (
          !error && <PlaceholderText>You have not completed any exams yet.</PlaceholderText>
        )}
      </StudentDashboardContent>
    </StudentDashboardPageWrapper>
  );
};

export default StudentDashboardPage;
