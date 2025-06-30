import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useData } from '@/contexts/DataContext';
import { BarChart, LineChart, PieChart, TrendingUp, Target, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, Legend, Line, Pie } from 'recharts';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Analytics = () => {
  const { carbonData, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasData = carbonData && carbonData.length > 0;

  if (!hasData) {
    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-4 aurora-bg">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="professional-card text-center p-8">
                <CardHeader>
                  <BarChart className="mx-auto h-16 w-16 text-primary" />
                  <CardTitle className="mt-4">Sem dados para analisar</CardTitle>
                  <CardDescription>
                    Faça seu primeiro cálculo na calculadora para que possamos gerar suas análises de progresso.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/calculator">
                    <Button size="lg" className="eco-gradient hover:scale-105 transition-transform duration-200">
                      Ir para a Calculadora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
        </div>
    );
  }
  
  // Preparação dos dados para os gráficos
  const formattedData = carbonData.map(d => ({
    date: new Date(d.date).toLocaleDateString('pt-BR'),
    total: d.totalFootprint,
    ...d.categories
  })).reverse();

  const categoryDistribution = Object.keys(carbonData[0].categories).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: carbonData.reduce((acc, item) => acc + item.categories[key], 0)
  }));
  
  const COLORS = ['#3b82f6', '#facc15', '#4ade80', '#a78bfa'];

  return (
    <>
      <Helmet>
        <title>Análises - EcoTracker</title>
        <meta name="description" content="Analise seu progresso de sustentabilidade com gráficos interativos e insights detalhados sobre sua pegada de carbono." />
      </Helmet>

      <div className="min-h-screen pt-20 px-4 py-8 aurora-bg">
        <div className="max-w-7xl mx-auto space-y-8">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="gradient-text">Suas Análises</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Visualize seu progresso e entenda seu impacto.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center"><LineChart className="mr-2 text-primary"/>Evolução da Pegada de Carbono</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formattedData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center"><PieChart className="mr-2 text-primary"/>Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                           {categoryDistribution.map((entry, index) => (
                              <cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;