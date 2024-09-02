import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to handle user login
  const login = async (email, password) => {
    try {
      const res = await axios.post('https://docease-ovq2.onrender.com/api/auth/login', { email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      setUser(userData);
      navigate('/documents');
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  // Check if user is already logged in when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('https://docease-ovq2.onrender.com/api/auth/me', {
        headers: { 'x-auth-token': token },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch user data:', err);
        logout();
      });
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
