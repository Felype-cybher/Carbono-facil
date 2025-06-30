import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Removido o BrowserRouter daqui
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Calculator from '@/pages/Calculator';
import Analytics from '@/pages/Analytics';
import Feedback from '@/pages/Feedback';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>EcoTracker - Calculadora de Pegada de Carbono</title>
        <meta name="description" content="Calcule e monitore sua pegada de carbono com nossa plataforma inteligente. Descubra como suas ações impactam o meio ambiente e encontre maneiras de ser mais sustentável." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/calculator" element={
            <ProtectedRoute>
              <Calculator />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      <Footer />
    </div>
    // Os <AuthProvider>, <DataProvider>, <Router> e <Toaster> foram removidos daqui
    // porque agora eles estão no arquivo main.jsx, envolvendo o <App />.
  );
}

export default App;