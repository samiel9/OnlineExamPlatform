import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Header from '../../components/HomePage/Header';
import {
  DashboardPageWrapper,
  DashboardContent
} from './styles'; // Styles from the TeacherDashboardPage folder
import {
  AuthCard,
  AuthTitle,
  AuthForm,
  FormGroup,
  FormLabel,
  AuthInput,
  AuthSelect,
  AuthTextarea,
  AuthButton,
  AuthError,
} from '../Auth/styles';
import { FaPlusCircle, FaTrash } from 'react-icons/fa';
import styled from 'styled-components';

// Styled components for QCM options (similar to QuestionPage.js)
const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  input[type="checkbox"] {
    height: 1.3em;
    width: 1.3em;
    accent-color: ${({ theme }) => theme.colors.brand.primary};
  }
`;

const AddOptionButton = styled(AuthButton)`
  background-color: ${({ theme }) => theme.colors.brand.accent};
  width: auto; 
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.1s ease;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.brand.accentDark};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const RemoveOptionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.brand.error};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: background-color 0.2s ease, color 0.2s ease;
  width: 28px;
  height: 28px;

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.brand.error}15`};
    color: ${({ theme }) => theme.colors.brand.error};
  }
  
  &:active {
    background-color: ${({ theme }) => `${theme.colors.brand.error}25`};
  }
`;

const FileInfoContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  button {
    margin-left: ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSizes.xs} !important;
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm} !important;
    width: auto !important; // Override AuthButton full width
    background-color: ${({ theme }) => theme.colors.brand.error} !important;
    color: ${({ theme }) => theme.colors.neutral[0]} !important;
    border-radius: ${({ theme }) => theme.radii.md} !important;
    transition: background-color 0.2s ease !important;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.brand.error}DD !important;
    }
    
    &:active {
      transform: translateY(1px);
    }
  }
`;

const SuccessMessageContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => `${theme.colors.brand.success}15`};
  border: 1px solid ${({ theme }) => `${theme.colors.brand.success}40`};
  border-radius: ${({ theme }) => theme.radii.md};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  p {
    color: ${({ theme }) => theme.colors.brand.successDark};
    margin: 0;
    font-weight: 500;
  }
`;

export default function EditQuestionPage() {
  const { examId, questionId } = useParams();
  const navigate = useNavigate();

  const [type, setType] = useState('direct');
  const [text, setText] = useState('');
  const [answer, setAnswer] = useState('');
  const [tolerance, setTolerance] = useState(0);
  // QCM options: array of objects { text: string, isCorrect: boolean }
  const [options, setOptions] = useState([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
  const [duration, setDuration] = useState(60);
  const [score, setScore] = useState(1);
  const [file, setFile] = useState(null); // For new file upload
  const [existingFile, setExistingFile] = useState(null); // To store info about current file
  const [removeFile, setRemoveFile] = useState(false); // Flag to remove existing file
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // For form submission
  const [initialLoading, setInitialLoading] = useState(true); // For fetching initial data

  const fetchQuestionDetails = useCallback(async () => {
    setInitialLoading(true);
    setError('');
    try {
      const examRes = await api.get(`/exams/${examId}`);
      const questionData = examRes.data.questions.find(q => q._id === questionId);

      if (!questionData) {
        setError('Question non trouvée.');
        setInitialLoading(false);
        return;
      }

      setText(questionData.text);
      setType(questionData.type);
      setDuration(questionData.duration);
      setScore(questionData.score);
      
      if (questionData.type === 'direct') {
        setAnswer(questionData.answer || '');
        setTolerance(questionData.tolerance || 0);
      } else { // QCM
        // Transform fetched options and correct answers into the new state structure
        const formattedOptions = (questionData.options || []).map((optText, index) => ({
          text: optText,
          isCorrect: (questionData.correct || []).includes(index)
        }));
        setOptions(formattedOptions.length > 0 ? formattedOptions : [{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
      }
      
      if (questionData.file && questionData.file.filename) {
        setExistingFile(questionData.file);
      }

    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de la récupération de la question.');
    }
    setInitialLoading(false);
  }, [examId, questionId]);

  useEffect(() => {
    fetchQuestionDetails();
  }, [fetchQuestionDetails]);


  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('type', type);
      formData.append('duration', duration);
      formData.append('score', score);
      
      if (file) { // New file selected
        formData.append('file', file);
      } else if (removeFile && existingFile) { // Existing file marked for removal
        formData.append('removeFile', 'true');
      }

      if (type === 'direct') {
        formData.append('answer', answer);
        formData.append('tolerance', tolerance);
      } else { // QCM
        const qcmOptionsTexts = options.map(opt => opt.text);
        const correctAnswersIndices = options.reduce((acc, opt, idx) => {
          if (opt.isCorrect) acc.push(idx);
          return acc;
        }, []);

        if (qcmOptionsTexts.some(opt => opt.trim() === '')) {
          setError('Toutes les options QCM doivent être remplies.');
          setLoading(false);
          return;
        }
        if (correctAnswersIndices.length === 0) {
          setError('Veuillez sélectionner au moins une réponse correcte pour le QCM.');
          setLoading(false);
          return;
        }

        qcmOptionsTexts.forEach((opt, idx) => formData.append(`options[${idx}]`, opt));
        correctAnswersIndices.forEach(idx => formData.append('correct', idx.toString()));
      }
      
      await api.put(`/exams/questions/${questionId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccessMessage('Question mise à jour avec succès !');
      if (file) setExistingFile({ filename: file.name }); // Update existing file info if new one uploaded
      if (removeFile) setExistingFile(null);
      setFile(null); // Clear new file input
      setRemoveFile(false);
      // Optionally, re-fetch or delay navigation
      // setTimeout(() => navigate(`/teacher/exams/${examId}/edit`), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de la mise à jour de la question');
    }
    setLoading(false);
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) { // Limit number of options
        setOptions([...options, { text: '', isCorrect: false }]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) { // Keep at least 2 options
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setRemoveFile(false); // If a new file is chosen, don't intend to remove the old one
    setSuccessMessage(''); // Clear success message if user changes something
  };

  const handleRemoveFile = () => {
    setRemoveFile(true);
    setFile(null); // Clear any newly selected file if user decides to remove existing
    setSuccessMessage('');
  };

  if (initialLoading) {
  return (
    <DashboardPageWrapper>
      <DashboardContent><p>Chargement des détails de la question...</p></DashboardContent>
      </DashboardPageWrapper>
    );
  }

  return (
    <DashboardPageWrapper>
      <Header />
      <DashboardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <AuthCard style={{maxWidth: '700px'}}>
          <AuthTitle>Modifier la Question</AuthTitle>
          <AuthForm onSubmit={onSubmit} encType="multipart/form-data">
            <FormGroup>
              <FormLabel htmlFor="type">Type de question</FormLabel>
              <AuthSelect id="type" value={type} onChange={e => { setType(e.target.value); setSuccessMessage(''); }}>
                <option value="direct">Question Directe</option>
                <option value="qcm">Choix Multiple (QCM)</option>
              </AuthSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="text">Énoncé de la question</FormLabel>
              <AuthTextarea id="text" placeholder="Saisissez l'énoncé..." value={text} onChange={e => { setText(e.target.value); setSuccessMessage(''); }} required />
            </FormGroup>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <FormGroup>
                <FormLabel htmlFor="duration">Durée (secondes)</FormLabel>
                <AuthInput id="duration" type="number" placeholder="Ex: 60" value={duration} onChange={e => { setDuration(parseInt(e.target.value, 10)); setSuccessMessage(''); }} min="10" required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="score">Score (points)</FormLabel>
                <AuthInput id="score" type="number" placeholder="Ex: 1" value={score} onChange={e => { setScore(parseInt(e.target.value, 10)); setSuccessMessage(''); }} min="1" required />
              </FormGroup>
            </div>

            {type === 'direct' ? (
              <>
                <FormGroup>
                  <FormLabel htmlFor="answer">Réponse attendue</FormLabel>
                  <AuthInput id="answer" placeholder="Réponse exacte" value={answer} onChange={e => { setAnswer(e.target.value); setSuccessMessage(''); }} required />
                </FormGroup>
                <FormGroup>
                  <FormLabel htmlFor="tolerance">Tolérance (%)</FormLabel>
                  <AuthInput id="tolerance" type="number" placeholder="0 pour exact" value={tolerance} onChange={e => { setTolerance(parseInt(e.target.value, 10)); setSuccessMessage(''); }} min="0" max="100" />
                </FormGroup>
              </>
            ) : ( // QCM options
              <FormGroup>
                <FormLabel>Options de réponse (cochez la/les bonne(s) réponse(s))</FormLabel>
                {options.map((opt, i) => (
                  <OptionRow key={i}>
                    <input 
                        type="checkbox" 
                        id={`correct-${i}`}
                        checked={opt.isCorrect} 
                        onChange={() => { handleOptionChange(i, 'isCorrect', !opt.isCorrect); setSuccessMessage(''); }} 
                    />
                    <AuthInput 
                        placeholder={`Option ${i + 1}`} 
                        value={opt.text} 
                        onChange={e => { handleOptionChange(i, 'text', e.target.value); setSuccessMessage(''); }} 
                        required 
                    />
                    {options.length > 2 && (
                        <RemoveOptionButton type="button" onClick={() => { removeOption(i); setSuccessMessage(''); }} title="Supprimer cette option">
                            <FaTrash />
                        </RemoveOptionButton>
                    )}
                  </OptionRow>
                ))}
                {options.length < 6 && (
                    <AddOptionButton type="button" onClick={() => { addOption(); setSuccessMessage(''); }}>
                        <FaPlusCircle style={{marginRight: '0.5em'}} /> Ajouter une option
                    </AddOptionButton>
                )}
              </FormGroup>
            )}

            <FormGroup>
              <FormLabel htmlFor="file-input">Fichier joint (optionnel)</FormLabel>
              <AuthInput id="file-input" type="file" onChange={handleFileChange} />
              {existingFile && !file && !removeFile && (
                <FileInfoContainer>
                  Fichier actuel : {existingFile.filename}
                  <AuthButton type="button" onClick={handleRemoveFile} style={{marginLeft: '10px'}}>
                    Supprimer le fichier
                  </AuthButton>
                </FileInfoContainer>
              )}
              {file && (
                <FileInfoContainer>
                  Nouveau fichier sélectionné : {file.name}
                </FileInfoContainer>
              )}
              {removeFile && existingFile && (
                <FileInfoContainer style={{borderColor: 'orange'}}>
                  Le fichier "{existingFile.filename}" sera supprimé à la sauvegarde.
                </FileInfoContainer>
              )}
            </FormGroup>

            <AuthButton type="submit" disabled={loading} style={{marginTop: '1rem'}}>
              {loading ? 'Mise à jour en cours...' : 'Mettre à Jour la Question'}
            </AuthButton>

            {error && <AuthError>{error}</AuthError>}
            {successMessage && (
                <SuccessMessageContainer>
                    <p>{successMessage}</p>
                </SuccessMessageContainer>
            )}
          </AuthForm>
          <AuthButton 
            onClick={() => navigate(`/teacher/exams/${examId}/edit`)} 
            style={{marginTop: '1rem', backgroundColor: '${({theme}) => theme.colors.neutral[600]}'}} // Secondary button style
            variant="secondary" // Assuming a secondary variant exists or using inline style
          >
            Retour à la gestion de l'examen
          </AuthButton>
        </AuthCard>
      </DashboardContent>
    </DashboardPageWrapper>
  );
}
