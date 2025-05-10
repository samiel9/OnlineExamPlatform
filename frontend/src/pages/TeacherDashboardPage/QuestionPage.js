import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
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
  AuthTextarea, // Using AuthTextarea for question text
  AuthButton,
  AuthError,
  CheckboxLabel // For QCM options
} from '../Auth/styles';
import { FaPlusCircle, FaTrash } from 'react-icons/fa'; // Icons for QCM options
import styled from 'styled-components';

// Styled component for QCM option row
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
  width: auto; // Don't make it full width
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

export default function QuestionPage() {
  const { examId } = useParams(); // Correctly get examId from route parameters
  const navigate = useNavigate();
  const [type, setType] = useState('direct');
  const [text, setText] = useState('');
  const [answer, setAnswer] = useState('');
  const [tolerance, setTolerance] = useState(0);
  const [options, setOptions] = useState([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
  const [duration, setDuration] = useState(60);
  const [score, setScore] = useState(1);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
      if (file) formData.append('file', file);

      if (type === 'direct') {
        formData.append('answer', answer);
        formData.append('tolerance', tolerance);
      } else { // QCM
        const qcmOptions = options.map(opt => opt.text);
        const correctAnswers = options.reduce((acc, opt, idx) => {
          if (opt.isCorrect) acc.push(idx);
          return acc;
        }, []);
        
        if (qcmOptions.some(opt => opt.trim() === '')) {
          setError('Toutes les options QCM doivent être remplies.');
          setLoading(false);
          return;
        }
        if (correctAnswers.length === 0) {
          setError('Veuillez sélectionner au moins une réponse correcte pour le QCM.');
          setLoading(false);
          return;
        }

        qcmOptions.forEach((opt, idx) => formData.append(`options[${idx}]`, opt));
        correctAnswers.forEach(idx => formData.append('correct', idx));
      }

      await api.post(`/exams/${examId}/questions`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccessMessage('Question ajoutée avec succès !');
      // Reset form fields
      setText('');
      setAnswer('');
      setTolerance(0);
      setOptions([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
      setDuration(60);
      setScore(1);
      setFile(null);
      // Optionally clear file input if it's a controlled component or by resetting the form element via a ref
      if (document.getElementById('file-input')) {
        document.getElementById('file-input').value = null;
      }

    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de l’ajout de la question.');
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

  return (
    <DashboardPageWrapper>
      <DashboardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <AuthCard style={{maxWidth: '700px'}}>
          <AuthTitle>Ajouter une Nouvelle Question à l'Examen</AuthTitle>
          <AuthForm onSubmit={onSubmit} encType="multipart/form-data">
            <FormGroup>
              <FormLabel htmlFor="type">Type de question</FormLabel>
              <AuthSelect id="type" value={type} onChange={e => setType(e.target.value)}>
                <option value="direct">Question Directe</option>
                <option value="qcm">Choix Multiple (QCM)</option>
              </AuthSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="text">Énoncé de la question</FormLabel>
              <AuthTextarea id="text" placeholder="Saisissez l'énoncé complet de la question ici..." value={text} onChange={e => setText(e.target.value)} required />
            </FormGroup>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <FormGroup>
                <FormLabel htmlFor="duration">Durée (secondes)</FormLabel>
                <AuthInput id="duration" type="number" placeholder="Ex: 60" value={duration} onChange={e => setDuration(parseInt(e.target.value, 10))} min="10" required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="score">Score (points)</FormLabel>
                <AuthInput id="score" type="number" placeholder="Ex: 1" value={score} onChange={e => setScore(parseInt(e.target.value, 10))} min="1" required />
              </FormGroup>
            </div>

            {type === 'direct' ? (
              <>
                <FormGroup>
                  <FormLabel htmlFor="answer">Réponse attendue</FormLabel>
                  <AuthInput id="answer" placeholder="Réponse exacte pour les questions directes" value={answer} onChange={e => setAnswer(e.target.value)} required />
                </FormGroup>
                <FormGroup>
                  <FormLabel htmlFor="tolerance">Tolérance pour la réponse (en %)</FormLabel>
                  <AuthInput id="tolerance" type="number" placeholder="0 pour une correspondance exacte" value={tolerance} onChange={e => setTolerance(parseInt(e.target.value, 10))} min="0" max="100" />
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
                        onChange={() => handleOptionChange(i, 'isCorrect', !opt.isCorrect)} 
                    />
                    <AuthInput 
                        placeholder={`Option ${i + 1}`} 
                        value={opt.text} 
                        onChange={e => handleOptionChange(i, 'text', e.target.value)} 
                        required 
                    />
                    {options.length > 2 && (
                        <RemoveOptionButton type="button" onClick={() => removeOption(i)} title="Supprimer cette option">
                            <FaTrash />
                        </RemoveOptionButton>
                    )}
                  </OptionRow>
                ))}
                {options.length < 6 && (
                    <AddOptionButton type="button" onClick={addOption}>
                        <FaPlusCircle style={{marginRight: '0.5em'}} /> Ajouter une option
                    </AddOptionButton>
                )}
              </FormGroup>
            )}

            <FormGroup>
              <FormLabel htmlFor="file-input">Fichier joint (optionnel)</FormLabel>
              <AuthInput id="file-input" type="file" onChange={e => setFile(e.target.files[0])} />
              {file && <small>Fichier sélectionné : {file.name}</small>}
            </FormGroup>

            <AuthButton type="submit" disabled={loading} style={{marginTop: '1rem'}}>
              {loading ? 'Ajout en cours...' : 'Ajouter la Question'}
            </AuthButton>

            {error && <AuthError>{error}</AuthError>}
            {successMessage && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e6f9f0', border: '1px solid #28a745', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{color: '#28a745', margin: 0}}>{successMessage}</p>
                <AuthButton 
                  onClick={() => navigate(`/teacher/exams/${examId}/edit`)} 
                  style={{backgroundColor: '#17A2B8', marginTop: '1rem'}}
                >
                  Retour à la gestion de l'examen
                </AuthButton>
              </div>
            )}
          </AuthForm>
        </AuthCard>
      </DashboardContent>
    </DashboardPageWrapper>
  );
}