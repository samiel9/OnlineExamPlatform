import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // True when initially loading or during auth operations

  useEffect(() => {
    let isMounted = true;
    const loadUser = async () => {
      setLoading(true);
      if (token) {
        api.defaults.headers.common['x-auth-token'] = token;
        try {
          // Fetch current user data from backend
          const { data: currentUser } = await api.get('/auth/me');
          if (isMounted) {
            setUser(currentUser);
          }
        } catch (error) {
          console.error('Error fetching current user:', error);
          if (isMounted) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            if (api.defaults && api.defaults.headers && api.defaults.headers.common) {
                delete api.defaults.headers.common['x-auth-token'];
            }
          }
        }
      } else {
        if (api.defaults && api.defaults.headers && api.defaults.headers.common) {
            delete api.defaults.headers.common['x-auth-token'];
        }
        if (isMounted) setUser(null);
      }
      if (isMounted) setLoading(false);
    };

    loadUser();
    return () => { isMounted = false; };
  }, [token]); // Re-run if token changes

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      // Assuming backend login response includes: { token, userId, role, prenom, email }
      // Adjust if backend sends different fields for user details
      const userData = {
        id: data.userId,
        role: data.role,
        prenom: data.prenom, // Ensure 'prenom' is returned by your backend
        email: data.email    // Ensure 'email' is returned by your backend
        // nom: data.nom,    // Add if 'nom' is returned and needed
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['x-auth-token'] = data.token;
      
      setUser(userData); // Update user state
      setToken(data.token); // Update token state (this will trigger the useEffect above)
      
      // The useEffect will set loading to true then false.
      // To ensure login itself controls its loading cycle precisely:
      setLoading(false); // Explicitly set loading to false after login process is complete.
      return userData;
    } catch (error) {
      console.error('Login API error:', error);
      localStorage.removeItem('token'); // Clear potentially partial login artifacts
      localStorage.removeItem('user');
      delete api.defaults.headers.common['x-auth-token'];
      setUser(null);
      setToken(null);
      setLoading(false);
      throw error; // Re-throw for the calling component to handle
    }
  };

  const register = async (userData) => {
    // setLoading(true); // Optional: if registration implies an auth state change
    const { data } = await api.post('/auth/register', userData);
    // setLoading(false);
    return data;
  };

  const logout = () => {
    setLoading(true);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (api.defaults && api.defaults.headers && api.defaults.headers.common) {
        delete api.defaults.headers.common['x-auth-token'];
    }
    setUser(null);
    setToken(null); // This triggers useEffect, which will set setLoading(false)
  };

  // isAuthenticated is true if token and user are present AND not in a loading state.
  const isAuthenticated = !!token && !!user && !loading;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
