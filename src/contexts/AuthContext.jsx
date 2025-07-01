import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          // Valida o token e busca os dados do usuário ao recarregar a página
          const { data } = await axios.get(`${API_URL}/auth/me`);
          setUser(data);
        } catch (error) {
          // Se o token for inválido, limpa tudo
          localStorage.removeItem('token');
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    validateToken();
  }, []);


  const signup = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      const { token, user: loggedInUser } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(loggedInUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no cadastro:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Erro ao tentar cadastrar.");
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, user: loggedInUser } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(loggedInUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Credenciais inválidas.");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const value = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};