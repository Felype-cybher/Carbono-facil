import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [carbonData, setCarbonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCarbonData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/carbon`, {
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
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Você precisa estar logado para salvar os dados.');
      return null;
    }

    try {
      const response = await axios.post(`${API_URL}/carbon`, newData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Recarrega os dados após salvar um novo
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
    addCarbonData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};