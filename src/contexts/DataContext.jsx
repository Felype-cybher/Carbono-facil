import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

<<<<<<< HEAD
const API_URL = 'http://localhost:3001/api';
=======
// A variável de ambiente para Vite PRECISA começar com VITE_
// Corrigimos a porta local para 3001 para corresponder ao seu backend.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
>>>>>>> b574b2aa93a1d58d1b0d5e09b71482eb573b2ddf

export const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [carbonData, setCarbonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
=======
  
  const getToken = () => localStorage.getItem('token');

  const fetchData = useCallback(async () => {
    const token = getToken();
>>>>>>> b574b2aa93a1d58d1b0d5e09b71482eb573b2ddf
    if (!token) {
      setCarbonData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
<<<<<<< HEAD
      const response = await axios.get(`${API_URL}/carbon`, {
=======
      const response = await axios.get(`${API_URL}/api/carbon`, {
>>>>>>> b574b2aa93a1d58d1b0d5e09b71482eb573b2ddf
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
<<<<<<< HEAD
=======

  useEffect(() => {
    fetchData();
  }, [fetchData]);
>>>>>>> b574b2aa93a1d58d1b0d5e09b71482eb573b2ddf

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
<<<<<<< HEAD
      const response = await axios.post(`${API_URL}/carbon`, newData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Recarrega os dados após salvar um novo
=======
      const response = await axios.post(`${API_URL}/api/carbon`, newData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCarbonData(prevData => [response.data, ...prevData]);
>>>>>>> b574b2aa93a1d58d1b0d5e09b71482eb573b2ddf
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
<<<<<<< HEAD
=======
    fetchData,
>>>>>>> b574b2aa93a1d58d1b0d5e09b71482eb573b2ddf
    addCarbonData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
