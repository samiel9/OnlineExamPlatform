import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  WelcomePageWrapper, 
  WelcomeMainContent,
  LinkForm,
  LinkInput,
  LinkSubmitButton
} from './styles';
import {
  HeroSection,
  HeroContent,
  Title,
  Subtitle,
  HeroButton,
  FeaturesSection,
  SectionTitle,
  SectionSubtitle,
  FeatureGrid,
  FeatureItem,
  AlertMessage // Add this to your styles.js file if it doesn't exist
} from './styles';
import { FaCheckCircle, FaEdit, FaUserGraduate, FaLaptopCode, FaShieldAlt, FaLink } from 'react-icons/fa';

export default function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [examLink, setExamLink] = useState('');
  const [message, setMessage] = useState('');
  
  // Check for messages in location state (e.g., from redirects)
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the message from location state to prevent displaying it again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (examLink.trim()) {
      navigate(`/exam/${examLink.trim()}`);
    }
  };
  const features = [
    { 
      icon: <FaEdit />,
      text: "Création d'examens personnalisés (QCM, questions directes)"
    },
    { 
      icon: <FaLaptopCode />,
      text: "Passage d'examens interactif avec timer intégré par question"
    },
    { 
      icon: <FaUserGraduate />,
      text: "Évaluation automatique et affichage instantané des scores"
    },
    { 
      icon: <FaShieldAlt />,
      text: "Interface intuitive et sécurisée pour enseignants et étudiants"
    },
    { 
      icon: <FaLink />,
      text: "Génération de liens d'examen uniques pour un accès facile"
    },
    { 
      icon: <FaCheckCircle />,
      text: "Support pour l'ajout de fichiers multimédias aux questions"
    }
  ];

  return (
    <WelcomePageWrapper>
      <WelcomeMainContent>
        <HeroSection>
          <HeroContent>
            {message && (
              <AlertMessage>
                {message}
              </AlertMessage>
            )}
            <Title>
              ExamLink : Simplifiez Vos Évaluations en Ligne
            </Title>
            <Subtitle>
              Une plateforme moderne et complète pour créer, gérer et passer des examens en toute sérénité. Conçue pour optimiser l'expérience des enseignants et des étudiants.
            </Subtitle>
            <LinkForm onSubmit={handleSubmit}>
              <LinkInput
                type="text"
                placeholder="Collez le lien d'examen ici"
                value={examLink}
                onChange={e => setExamLink(e.target.value)}
              />
              <LinkSubmitButton type="submit">Accéder à l'examen</LinkSubmitButton>
            </LinkForm>
          </HeroContent>
        </HeroSection>
        <FeaturesSection>
          <SectionTitle>Pourquoi Choisir ExamLink ?</SectionTitle>
          <SectionSubtitle>
            Découvrez les fonctionnalités clés qui font d'ExamLink la solution idéale pour vos besoins d'évaluation.
          </SectionSubtitle>
          <FeatureGrid>
            {features.map((feat, i) => (
              <FeatureItem key={i}>
                {feat.icon} 
                <p>{feat.text}</p>
              </FeatureItem>
            ))}
          </FeatureGrid>
        </FeaturesSection>
      </WelcomeMainContent>
    </WelcomePageWrapper>
  );
}
