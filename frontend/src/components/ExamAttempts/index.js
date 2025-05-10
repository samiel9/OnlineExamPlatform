import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AttemptsContainer = styled.div`
  margin-top: 1rem;
`;

const AttemptsTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.neutral[800]};
  margin-bottom: 0.5rem;
`;

const AttemptsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  
  th, td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  }
  
  th {
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const ViewButton = styled(Link)`
  padding: 0.3rem 0.5rem;
  background-color: ${({ theme }) => theme.colors.brand.primary};
  color: white;
  border-radius: ${({ theme }) => theme.radii.sm};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  display: inline-block;
  margin-right: 0.5rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.brand.primaryDark};
  }
`;

const ViewAllButton = styled.button`
  padding: 0.3rem 0.5rem;
  background-color: ${({ theme }) => theme.colors.neutral[600]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[700]};
  }
`;

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

const ExamAttempts = ({ examAttempts, condensed = false }) => {
  const navigate = useNavigate();
  
  if (!examAttempts || examAttempts.length === 0) {
    return <p>Aucun essai trouvé.</p>;
  }

  const viewAllAttempts = (examId) => {
    navigate(`/student/dashboard?showAttempts=${examId}`);
  };

  return (
    <AttemptsContainer>
      {!condensed && <AttemptsTitle>Historique des essais</AttemptsTitle>}
      
      {examAttempts.map((exam) => (
        <div key={exam.examId} style={{ marginBottom: '1.5rem' }}>
          {!condensed && <h4 style={{ marginBottom: '0.5rem' }}>{exam.examTitle}</h4>}
          {condensed && exam.attempts.length > 0 && <h5>{exam.examTitle}</h5>}
          
          {exam.attempts.length > 0 ? (
            <>
              <AttemptsTable>
                <thead>
                  <tr>
                    <th>Essai #</th>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Pourcentage</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exam.attempts.map((attempt) => (
                    <tr key={attempt.submissionId}>
                      <td>{attempt.attemptNumber}</td>
                      <td>{formatDate(attempt.submittedAt)}</td>
                      <td>{attempt.totalScore}/{attempt.totalScorePossible}</td>
                      <td>{attempt.percentage}%</td>
                      <td>
                        <ViewButton to={`/student/results/${attempt.submissionId}`}>
                          Voir le détail
                        </ViewButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </AttemptsTable>
              
              {condensed && exam.attempts.length === 3 && (
                <div style={{ textAlign: 'right' }}>
                  <ViewAllButton onClick={() => viewAllAttempts(exam.examId)}>
                    Voir tous les essais ({exam.attempts.length})
                  </ViewAllButton>
                </div>
              )}
            </>
          ) : (
            <p>Aucun essai disponible pour cet examen.</p>
          )}
        </div>
      ))}
    </AttemptsContainer>
  );
};

export default ExamAttempts;
