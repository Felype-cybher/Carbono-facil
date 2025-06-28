import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingDown, TrendingUp, Users, Target } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Analytics = () => {
  const { carbonData, getAggregatedData } = useData();
  const { monthlyData, categoryData } = getAggregatedData();

  const userMonthlyData = carbonData.reduce((acc, item) => {
    const month = new Date(item.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' });
    if (!acc[month]) acc[month] = 0;
    acc[month] += item.totalFootprint;
    return acc;
  }, {});

  const userChartData = Object.entries(userMonthlyData).map(([month, value]) => ({
    month,
    pegada: value.toFixed(1),
    valor: parseFloat(value.toFixed(1))
  }));

  const globalChartData = Object.entries(monthlyData).map(([month, value]) => ({
    month,
    pegada: (value / 10).toFixed(1),
    valor: parseFloat((value / 10).toFixed(1))
  }));

  const categoryChartData = Object.entries(categoryData).map(([category, value]) => ({
    name: getCategoryName(category),
    value: parseFloat(value.toFixed(1)),
    color: getCategoryColor(category)
  }));

  const userCategoryData = carbonData.reduce((acc, item) => {
    Object.entries(item.categories).forEach(([category, value]) => {
      if (!acc[category]) acc[category] = 0;
      acc[category] += value;
    });
    return acc;
  }, {});

  const userCategoryChartData = Object.entries(userCategoryData).map(([category, value]) => ({
    name: getCategoryName(category),
    value: parseFloat(value.toFixed(1)),
    color: getCategoryColor(category)
  }));

  function getCategoryName(category) {
    const names = { transport: 'Transporte', energy: 'Energia', food: 'Alimentação', consumption: 'Consumo' };
    return names[category] || category;
  }

  function getCategoryColor(category) {
    const colors = { transport: '#3b82f6', energy: '#f59e0b', food: '#10b981', consumption: '#8b5cf6' };
    return colors[category] || '#6b7280';
  }

  const userTotal = carbonData.reduce((sum, item) => sum + item.totalFootprint, 0);
  const globalTotal = Object.values(monthlyData).reduce((sum, value) => sum + value, 0);
  const userAverage = carbonData.length > 0 ? userTotal / carbonData.length : 0;
  const globalAverage = Object.keys(monthlyData).length > 0 ? globalTotal / Object.keys(monthlyData).length / 10 : 0;

  const stats = [
    { title: 'Sua Média Mensal', value: `${userAverage.toFixed(1)} kg CO₂`, icon: Target, color: 'text-primary' },
    { title: 'Média Global', value: `${globalAverage.toFixed(1)} kg CO₂`, icon: Users, color: 'text-blue-400' },
    { title: 'Diferença', value: `${Math.abs(userAverage - globalAverage).toFixed(1)} kg CO₂`, icon: userAverage < globalAverage ? TrendingDown : TrendingUp, color: userAverage < globalAverage ? 'text-primary' : 'text-red-400' }
  ];

  return (
    <>
      <Helmet>
        <title>Análises - EcoTracker</title>
        <meta name="description" content="Visualize suas análises de pegada de carbono com gráficos detalhados e compare com dados globais." />
      </Helmet>

      <div className="min-h-screen pt-20 px-4 py-8 aurora-bg">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="gradient-text">Análises</span> Detalhadas
            </h1>
            <p className="text-muted-foreground text-lg">
              Visualize seus dados e compare com a comunidade global.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="professional-card">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-secondary/50">
                        <Icon className={`h-7 w-7 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Sua Evolução Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {userChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={userChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} labelStyle={{ color: 'hsl(var(--foreground))' }} />
                          <Line type="monotone" dataKey="valor" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5, fill: 'hsl(var(--primary))' }} activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : <div className="flex items-center justify-center h-full text-muted-foreground">Nenhum dado disponível</div>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Comparação Global (Média)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {globalChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={globalChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} labelStyle={{ color: 'hsl(var(--foreground))' }} />
                          <Bar dataKey="valor" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : <div className="flex items-center justify-center h-full text-muted-foreground">Nenhum dado global disponível</div>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Suas Categorias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {userCategoryChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={userCategoryChartData} cx="50%" cy="50%" outerRadius={110} dataKey="value" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={12} fill="hsl(var(--foreground))">
                            {userCategoryChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : <div className="flex items-center justify-center h-full text-muted-foreground">Nenhum dado de categoria</div>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Categorias Globais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {categoryChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={categoryChartData} cx="50%" cy="50%" outerRadius={110} dataKey="value" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={12} fill="hsl(var(--foreground))">
                            {categoryChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : <div className="flex items-center justify-center h-full text-muted-foreground">Nenhum dado global de categoria</div>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-foreground">Insights e Recomendações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userAverage < globalAverage ? (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <h3 className="text-primary font-semibold mb-2">🎉 Parabéns!</h3>
                    <p className="text-muted-foreground">Sua pegada de carbono está {((1 - userAverage / globalAverage) * 100).toFixed(0)}% abaixo da média global. Continue com os bons hábitos sustentáveis!</p>
                  </div>
                ) : (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <h3 className="text-orange-400 font-semibold mb-2">💡 Oportunidade de Melhoria</h3>
                    <p className="text-muted-foreground">Sua pegada está {((userAverage / globalAverage - 1) * 100).toFixed(0)}% acima da média global. Pequenas mudanças podem fazer uma grande diferença!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Analytics;