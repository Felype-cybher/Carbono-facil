import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import App from './App';
import './index.css';
import { Toaster } from "@/components/ui/toaster";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <DataProvider>
          <App />
          <Toaster />
        </DataProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);