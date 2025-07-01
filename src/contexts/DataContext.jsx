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
  const [communityStats, setCommunityStats] = useState({ averageFootprint: 0, totalCalculations: 0 }); // Novo estado para os dados da comunidade
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
      // Faz as duas chamadas à API em paralelo para ser mais rápido
      const [userResponse, communityResponse] = await Promise.all([
        axios.get(`${API_URL}/carbon`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/community/stats`)
      ]);
      
      setCarbonData(userResponse.data);
      setCommunityStats(communityResponse.data);

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
      // Após salvar um novo cálculo, recarrega TODOS os dados (do usuário e da comunidade)
      fetchData(); 
      return response.data;
    } catch (err) {
      setError('Falha ao salvar os dados.');
      console.error(err);
      return null;
    }
  };

  const value = {
    carbonData,
    communityStats, // Exporta os novos dados
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