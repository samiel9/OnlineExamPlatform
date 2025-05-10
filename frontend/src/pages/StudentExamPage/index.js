import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
    ExamPageWrapper,
    ExamContent,
    StudentExamCard,
    QuestionHeader,
    QuestionNumber,
    TimerDisplay,
    QuestionText,
    OptionsList,
    OptionLabel,
    AnswerInput,
    ActionButton,
    ResultDisplay,
    LoadingMessage,
    ErrorMessage,
    AttachmentWrapper,
    AttachmentImage,
    AttachmentVideo,
    AttachmentAudio
} from './styles';

export default function StudentExamPage() {
    const { link } = useParams();
    const navigate = useNavigate();
    const [examTitle, setExamTitle] = useState('');
    const [questList, setQuestList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState(''); // string for direct, array of indices for QCM
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [examId, setExamId] = useState(null);
    const [examStartTime, setExamStartTime] = useState(null);
    const [geolocation, setGeolocation] = useState(null); // Added for geolocation

    const timerRef = useRef(null);

    // Function to get geolocation
    const getGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setGeolocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                    });
                },
                (err) => {
                    console.warn(`Geolocation ERROR(${err.code}): ${err.message}`);
                    // Optionally set a default or handle the error more visibly
                    setGeolocation({ error: err.message }); 
                }
            );
        } else {
            console.warn("Geolocation is not supported by this browser.");
            setGeolocation({ error: "Geolocation not supported" });
        }
    };

    // Fetch exam data function defined before useEffect
    const fetchExam = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get(`/exams/link/${link}`);
            setExamTitle(res.data.titre);
            setQuestList(res.data.questions || []);
            setExamId(res.data._id);
            if (res.data.questions && res.data.questions.length > 0) {
                setTimeLeft(res.data.questions[0].duration);
                setCurrentAnswer(res.data.questions[0].type === 'qcm' ? [] : '');
                setExamStartTime(new Date());
            } else {
                setError('Cet examen ne contient aucune question.');
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Erreur lors du chargement de l\'examen.');
        }
        setLoading(false);
    }, [link]);

    useEffect(() => {
        fetchExam();
        getGeolocation(); // Fetch geolocation when component mounts
    }, [fetchExam]);

    useEffect(() => {
        if (result || !questList[currentIndex] || timeLeft <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (timeLeft <= 0 && questList[currentIndex] && !result) {
                 // Automatically move to next question if timer runs out
                handleNextQuestion();
            }
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [timeLeft, currentIndex, questList, result]);

    const handleNextQuestion = useCallback(() => {
        if (!questList[currentIndex]) return;

        const newAnswer = {
            question: questList[currentIndex]._id,
            answer: currentAnswer,
        };
        setAnswers(prevAnswers => [...prevAnswers, newAnswer]);

        const nextIndex = currentIndex + 1;
        if (nextIndex < questList.length) {
            setCurrentIndex(nextIndex);
            setTimeLeft(questList[nextIndex].duration);
            setCurrentAnswer(questList[nextIndex].type === 'qcm' ? [] : '');
        } else {
            submitAnswers([...answers, newAnswer]);
        }
    }, [currentIndex, questList, currentAnswer, answers, examId]);

    const submitAnswers = async (finalAnswers) => {
        if (!examId || result) return;
        setLoading(true);
        setError('');
        try {
            // Calculate time spent on exam
            const timeSpent = examStartTime ? Math.floor((new Date() - examStartTime) / 1000) : null;
            
            // Prepare payload with answers, time tracking, and geolocation
            const payload = { 
                answers: finalAnswers,
                startTime: examStartTime ? examStartTime.toISOString() : null,
                timeSpent,
                geolocation // Added geolocation to payload
            };
            
            const res = await api.post(`/exams/${examId}/submissions`, payload);
            setResult(res.data); // Assuming res.data contains { score, percentage, totalQuestions, correctAnswersCount }
            if (timerRef.current) clearInterval(timerRef.current);
        } catch (err) {
            setError(err.response?.data?.msg || 'Erreur lors de la soumission des réponses.');
        }
        setLoading(false);
    };

    const handleQCMChange = (optionIndex) => {
        setCurrentAnswer(prevAnswers => 
            prevAnswers.includes(optionIndex) 
                ? prevAnswers.filter(idx => idx !== optionIndex) 
                : [...prevAnswers, optionIndex]
        );
    };

    if (loading && questList.length === 0) {
        return (
            <ExamPageWrapper>
                <ExamContent>
                    <LoadingMessage>Chargement de l'examen...</LoadingMessage>
                </ExamContent>
            </ExamPageWrapper>
        );
    }

    if (error && questList.length === 0) {
        return (
            <ExamPageWrapper>
                <ExamContent>
                    <StudentExamCard>
                        <ErrorMessage>{error}</ErrorMessage>
                    </StudentExamCard>
                </ExamContent>
            </ExamPageWrapper>
        );
    }

    if (result) {
        return (
            <ExamPageWrapper>
                <ExamContent>
                    <StudentExamCard>
                        <ResultDisplay>
                            <h2>Examen Terminé !</h2>
                            <p>Votre score : {result.score} / {result.totalScorePossible} ({result.percentage}%)</p>
                            <p>Vous avez répondu correctement à {result.correctAnswersCount} question(s) sur {result.totalQuestions}.</p>
                            <ActionButton onClick={() => navigate('/student/dashboard')} style={{ marginTop: '2rem' }}>
                              Retour au tableau de bord
                            </ActionButton>
                        </ResultDisplay>
                    </StudentExamCard>
                </ExamContent>
            </ExamPageWrapper>
        );
    }

    const currentQuestion = questList[currentIndex];

    if (!currentQuestion) {
        return (
            <ExamPageWrapper>
                <ExamContent>
                    <StudentExamCard>
                        <ErrorMessage>Aucune question à afficher pour le moment ou l'examen est terminé.</ErrorMessage>
                    </StudentExamCard>
                </ExamContent>
            </ExamPageWrapper>
        );
    }

    return (
        <ExamPageWrapper>
            <ExamContent>
                <StudentExamCard>
                    <QuestionHeader>
                        <QuestionNumber>Question {currentIndex + 1} / {questList.length}</QuestionNumber>
                        <TimerDisplay>Temps: {timeLeft}s</TimerDisplay>
                    </QuestionHeader>
                    <QuestionText>{currentQuestion.text}</QuestionText>
                    
                    {questList[currentIndex].file && (
                        <AttachmentWrapper>
                            <strong>Pièce jointe :</strong>
                            {questList[currentIndex].file.mimetype.startsWith('image/') && (
                                <AttachmentImage
                                    src={`data:${questList[currentIndex].file.mimetype};base64,${questList[currentIndex].file.data}`}
                                    alt={questList[currentIndex].file.filename}
                                />
                            )}
                            {questList[currentIndex].file.mimetype.startsWith('video/') && (
                                <AttachmentVideo controls>
                                    <source
                                        src={`data:${questList[currentIndex].file.mimetype};base64,${questList[currentIndex].file.data}`}
                                        type={questList[currentIndex].file.mimetype}
                                    />
                                    Votre navigateur ne supporte pas la lecture de cette vidéo.
                                </AttachmentVideo>
                            )}
                            {questList[currentIndex].file.mimetype.startsWith('audio/') && (
                                <AttachmentAudio controls>
                                    <source
                                        src={`data:${questList[currentIndex].file.mimetype};base64,${questList[currentIndex].file.data}`}
                                        type={questList[currentIndex].file.mimetype}
                                    />
                                    Votre navigateur ne supporte pas la lecture de cet audio.
                                </AttachmentAudio>
                            )}
                        </AttachmentWrapper>
                    )}

                    {currentQuestion.type === 'direct' ? (
                        <AnswerInput
                            type="text"
                            placeholder="Votre réponse..."
                            value={currentAnswer}
                            onChange={e => setCurrentAnswer(e.target.value)}
                        />
                    ) : (
                        <OptionsList>
                            {currentQuestion.options.map((optionText, optionIndex) => (
                                <OptionLabel key={optionIndex}>
                                    <input
                                        type="checkbox"
                                        value={optionIndex} // Value is the index
                                        checked={currentAnswer.includes(optionIndex)}
                                        onChange={() => handleQCMChange(optionIndex)}
                                    />
                                    <span>{optionText}</span>
                                </OptionLabel>
                            ))}
                        </OptionsList>
                    )}
                    <ActionButton onClick={handleNextQuestion} disabled={loading || timeLeft <= 0}>
                        {loading ? 'Envoi...' : (currentIndex === questList.length - 1 ? 'Terminer et Envoyer' : 'Question Suivante')}
                    </ActionButton>
                    {error && <ErrorMessage style={{marginTop: '1rem'}}>{error}</ErrorMessage>} 
                </StudentExamCard>
            </ExamContent>
        </ExamPageWrapper>
    );
}