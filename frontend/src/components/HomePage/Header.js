import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeMode } from '../../contexts/ThemeContext';

const HeaderBar = styled.header`
  position: sticky; /* Changed from fixed to sticky */
  top: 0;
  left: 0;
  width: 100%;
  padding: 0; /* Remove vertical padding to eliminate extra space */
  background: ${({ theme }) => theme.colors.neutral[0]}; 
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: 1000; // Ensure header is above other content
  height: ${({ theme }) => theme.headerHeight};
  display: flex;
  align-items: center;
`;

const HeaderContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg}; /* Horizontal padding */
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoLink = styled(NavLink)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.brand.primary};
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StyledNavLink = styled(NavLink)`
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.neutral[700]};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.brand.primary};
    background-color: ${({ theme }) => theme.colors.brand.primaryLight};
  }

  &.active {
    color: ${({ theme }) => theme.colors.brand.primary};
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.brand.primaryLight};
  }
`;

const AuthButton = styled.button`
  /* Using global button styles, but can override if needed */
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  border: 1px solid ${({ theme }) => theme.colors.brand.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.neutral[0]};
  }
`;

const UserDisplay = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin-right: ${({ theme }) => theme.spacing.md};
`;

// Avatar and dropdown styles
const AvatarWrapper = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 40px; // Increased from 36px
  height: 40px; // Increased from 36px
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.neutral[0]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: ${({ theme }) => theme.colors.neutral[0]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  z-index: 1100;
`;

const DropdownItem = styled.div`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.neutral[700]};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.xl}; // Increased icon size
  padding: ${({ theme }) => theme.spacing.xs}; // Added padding for better click area
  border-radius: ${({ theme }) => theme.radii.md}; // Consistent border radius
  margin-right: ${({ theme }) => theme.spacing.sm}; // Adjusted margin
  color: ${({ theme }) => theme.colors.neutral[700]};
  display: flex; // To center icon if it's text
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.brand.primary};
    background-color: ${({ theme }) => theme.colors.brand.primaryLight};
  }
`;

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggle } = useThemeMode();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  return (
    <HeaderBar>
      <HeaderContainer>
        <LogoLink to="/">ExamLink</LogoLink>
        <Nav>
          {/* Dark/Light toggle */}
          <ToggleButton onClick={toggle} aria-label="Toggle theme">
            {darkMode ? '🌙' : '☀️'}
          </ToggleButton>
          {isAuthenticated ? (
            <AvatarWrapper ref={wrapperRef}>
              {/* Display initials: first of prenom and first of nom if available */}
              <Avatar onClick={() => setMenuOpen(open => !open)}>
                {user?.prenom?.[0] || ''}{user?.nom?.[0] || ''}
              </Avatar>
              {menuOpen && (
                <DropdownMenu>
                  {/* Dashboard link depending on role */}
                  <DropdownItem onClick={() => {
                    setMenuOpen(false);
                    navigate(user.role === 'enseignant' ? '/teacher/dashboard' : '/student/dashboard');
                  }}>
                    Tableau de Bord
                  </DropdownItem>
                  <DropdownItem onClick={() => {
                    setMenuOpen(false);
                    navigate('/profile');
                  }}>
                    Profil
                  </DropdownItem>
                  <DropdownItem onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}>
                    Déconnexion
                  </DropdownItem>
                </DropdownMenu>
              )}
            </AvatarWrapper>
          ) : (
            <>
              <StyledNavLink to="/login">Connexion</StyledNavLink>
              <StyledNavLink to="/register">Inscription</StyledNavLink>
            </>
          )}
        </Nav>
      </HeaderContainer>
    </HeaderBar>
  );
}
