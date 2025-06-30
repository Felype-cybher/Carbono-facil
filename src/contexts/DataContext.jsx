import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const DataContext = createContext();

// Adicionamos a exportação do hook para facilitar o uso
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [carbonData, setCarbonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Em vez de pegar o token do AuthContext, lemos ele do localStorage.
  // Isso nos dá o valor mais recente sempre que a função for chamada.
  const getToken = () => localStorage.getItem('token');

  const fetchData = useCallback(async () => {
    const token = getToken(); // Pega o token no momento da execução
    if (!token) {
      setCarbonData([]); // Limpa os dados se não houver token
      setLoading(false);
      return;
    };

    setLoading(true);
    setError(null);
    try {
      // Configura o cabeçalho de autorização para esta chamada específica
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
  }, []); // O array de dependências agora está vazio

  // O useEffect agora só roda uma vez quando o componente é montado.
  // A função fetchData será chamada sempre que for necessária.
  useEffect(() => {
    fetchData();
  }, []);

  const addCarbonData = async (newData) => {
    const token = getToken();
    if (!token) {
        setError('Você precisa estar logado para salvar os dados.');
        return null;
    }

    try {
      // Adiciona o cabeçalho de autorização para a chamada POST
      const response = await axios.post(`${API_URL}/carbon`, newData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Atualiza os dados locais para refletir a mudança imediatamente
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
    fetchData, // Exportamos a função para poder recarregar os dados de outras páginas se necessário
    addCarbonData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};