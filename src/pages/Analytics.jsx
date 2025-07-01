import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useData } from '@/contexts/DataContext';
// Adicionado 'LabelList' à importação de recharts
import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon, ArrowRight, Target, Globe } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, Pie, PieChart, LineChart, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Analytics = () => {
  const { carbonData, communityStats, loading } = useData();

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
              <BarChartIcon className="mx-auto h-16 w-16 text-primary" />
              <CardTitle className="mt-4">Sem dados para analisar</CardTitle>
              <CardDescription>
                Faça seu primeiro cálculo para que possamos gerar suas análises de progresso.
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
  
  const userAverage = carbonData.reduce((acc, item) => acc + item.totalFootprint, 0) / carbonData.length;

  const comparisonData = [
    { name: 'Sua Média', valor: userAverage, fill: '#8884d8' },
    { name: 'Média da Comunidade', valor: communityStats.averageFootprint, fill: '#82ca9d' }
  ];

  const formattedData = carbonData.map(d => ({
    date: new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    total: d.totalFootprint,
    ...d.categories
  })).reverse();

  const categoryDistribution = Object.keys(carbonData[0].categories).map(key => {
    const nomes = { transport: 'Transporte', energy: 'Energia', food: 'Alimentação', consumption: 'Consumo' };
    return {
      name: nomes[key] || key,
      value: carbonData.reduce((acc, item) => acc + item.categories[key], 0)
    };
  });
  
  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

  return (
    <>
      <Helmet>
        <title>Análises - EcoTracker</title>
        <meta name="description" content="Analise seu progresso e compare com a comunidade." />
      </Helmet>
      <div className="min-h-screen pt-20 px-4 py-8 aurora-bg">
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight"><span className="gradient-text">Suas Análises</span></h1>
            <p className="text-muted-foreground text-lg">Visualize seu progresso e entenda seu impacto.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center"><Globe className="mr-2 text-primary"/>Comparação com a Comunidade</CardTitle>
                <CardDescription>Veja como sua pegada de carbono se compara com a média de todos os usuários.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={comparisonData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={150} />
                    <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}/>
                    <Bar dataKey="valor" barSize={40} radius={[0, 4, 4, 0]}>
                       {/* AQUI ESTÁ A MUDANÇA: adiciona os números nas barras */}
                       <LabelList 
                         dataKey="valor" 
                         position="right" 
                         formatter={(value) => `${value.toFixed(1)} kg`}
                         className="fill-foreground font-semibold"
                       />
                       {comparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                       ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center"><LineChartIcon className="mr-2 text-primary"/>Evolução da Pegada</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formattedData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" name="Total (kg CO₂)" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center"><PieChartIcon className="mr-2 text-primary"/>Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                           {categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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