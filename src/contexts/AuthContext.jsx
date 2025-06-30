import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// A URL da API agora será lida da variável de ambiente.
// Para o ambiente de produção (Vercel), usará a URL definida lá.
// Para o ambiente local, usará 'http://localhost:3001' como padrão.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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
          // A rota /me que criamos no backend é usada para validar o token
          // e obter os dados do usuário ao recarregar a página.
          const { data } = await axios.get(`${API_URL}/api/auth/me`);
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
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      
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
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
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
