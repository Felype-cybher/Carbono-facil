import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

// A variável de ambiente para Vite PRECISA começar com VITE_
// Corrigimos a porta local para 3001 para corresponder ao seu backend.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [carbonData, setCarbonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const getToken = () => localStorage.getItem('token');

  const fetchData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setCarbonData([]);
      setLoading(false);
      return;
    };

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/carbon`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCarbonData(response.data);
    } catch (err) {
      setError('Falha ao buscar os dados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addCarbonData = async (newData) => {
    const token = getToken();
    if (!token) {
        setError('Você precisa estar logado para salvar os dados.');
        return null;
    }

    try {
      const response = await axios.post(`${API_URL}/api/carbon`, newData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCarbonData(prevData => [response.data, ...prevData]);
      return response.data;
    } catch (err) {
      setError('Falha ao salvar os dados.');
      console.error(err);
      return null;
    }
  };
  
  const value = {
    carbonData,
    loading,
    error,
    fetchData,
    addCarbonData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
