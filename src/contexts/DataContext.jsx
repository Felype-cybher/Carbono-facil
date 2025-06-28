
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [carbonData, setCarbonData] = useState([]);
  const [globalData, setGlobalData] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
    loadGlobalData();
    loadFeedbacks();
  }, [user]);

  const loadUserData = () => {
    const data = JSON.parse(localStorage.getItem(`carbon_data_${user.id}`) || '[]');
    setCarbonData(data);
  };

  const loadGlobalData = () => {
    const data = JSON.parse(localStorage.getItem('global_carbon_data') || '[]');
    setGlobalData(data);
  };

  const loadFeedbacks = () => {
    const data = JSON.parse(localStorage.getItem('ecotracker_feedbacks') || '[]');
    setFeedbacks(data);
  };

  const saveCarbonCalculation = (calculation) => {
    if (!user) return;

    const newCalculation = {
      id: Date.now().toString(),
      userId: user.id,
      ...calculation,
      date: new Date().toISOString()
    };

    const updatedData = [...carbonData, newCalculation];
    setCarbonData(updatedData);
    localStorage.setItem(`carbon_data_${user.id}`, JSON.stringify(updatedData));

    // Atualizar dados globais
    const globalData = JSON.parse(localStorage.getItem('global_carbon_data') || '[]');
    globalData.push(newCalculation);
    localStorage.setItem('global_carbon_data', JSON.stringify(globalData));
    setGlobalData(globalData);
  };

  const saveFeedback = (feedback) => {
    if (!user) return;

    const newFeedback = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      ...feedback,
      date: new Date().toISOString()
    };

    const updatedFeedbacks = [...feedbacks, newFeedback];
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem('ecotracker_feedbacks', JSON.stringify(updatedFeedbacks));
  };

  const getAggregatedData = () => {
    const monthlyData = {};
    const categoryData = {};

    globalData.forEach(item => {
      const month = new Date(item.date).toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'short' 
      });

      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += item.totalFootprint;

      Object.keys(item.categories).forEach(category => {
        if (!categoryData[category]) {
          categoryData[category] = 0;
        }
        categoryData[category] += item.categories[category];
      });
    });

    return { monthlyData, categoryData };
  };

  const value = {
    carbonData,
    globalData,
    feedbacks,
    saveCarbonCalculation,
    saveFeedback,
    getAggregatedData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
