import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { BarChart3, Calculator, TrendingDown, Leaf, Users, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { carbonData, globalData } = useData();

  const userTotal = carbonData.reduce((sum, item) => sum + item.totalFootprint, 0);
  const userAverage = carbonData.length > 0 ? userTotal / carbonData.length : 0;
  const globalAverage = globalData.length > 0 ? 
    globalData.reduce((sum, item) => sum + item.totalFootprint, 0) / globalData.length : 0;

  const stats = [
    {
      title: 'Pegada Total',
      value: `${userTotal.toFixed(1)} kg CO₂`,
      icon: Leaf,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Média Mensal',
      value: `${userAverage.toFixed(1)} kg CO₂`,
      icon: TrendingDown,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Cálculos Feitos',
      value: carbonData.length,
      icon: Calculator,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Vs. Média Global',
      value: userAverage < globalAverage ? 'Abaixo' : 'Acima',
      icon: Users,
      color: userAverage < globalAverage ? 'text-green-400' : 'text-orange-400',
      bgColor: userAverage < globalAverage ? 'bg-green-500/10' : 'bg-orange-500/10'
    }
  ];

  const quickActions = [
    {
      title: 'Nova Calculadora',
      description: 'Calcule sua pegada de carbono atual',
      icon: Calculator,
      link: '/calculator',
      color: 'eco-gradient'
    },
    {
      title: 'Ver Análises',
      description: 'Visualize seus dados em gráficos',
      icon: BarChart3,
      link: '/analytics',
      color: 'bg-gradient-to-r from-blue-500 to-purple-500'
    },
    {
      title: 'Dar Feedback',
      description: 'Compartilhe sua experiência',
      icon: Target,
      link: '/feedback',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - EcoTracker</title>
        <meta name="description" content="Acompanhe sua pegada de carbono e veja estatísticas detalhadas no seu dashboard pessoal." />
      </Helmet>

      <div className="min-h-screen pt-20 px-4 py-8 aurora-bg">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Olá, <span className="gradient-text">{user?.name}</span>! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Aqui está um resumo da sua jornada sustentável.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="professional-card hover:-translate-y-1 transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                          <Icon className={`h-7 w-7 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-foreground">Ações Rápidas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} to={action.link}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="professional-card h-full cursor-pointer group"
                    >
                      <CardContent className="p-8 text-center space-y-4">
                        <div className={`mx-auto w-20 h-20 ${action.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className="h-10 w-10 text-white" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-foreground">{action.title}</h3>
                          <p className="text-muted-foreground">{action.description}</p>
                        </div>
                      </CardContent>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-foreground">Atividade Recente</h2>
            
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-foreground">Últimos Cálculos</CardTitle>
              </CardHeader>
              <CardContent>
                {carbonData.length > 0 ? (
                  <div className="space-y-4">
                    {carbonData.slice(-3).reverse().map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                        <div className="space-y-1">
                          <p className="text-foreground font-medium">
                            {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Pegada calculada
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary font-bold text-lg">
                            {item.totalFootprint.toFixed(1)} kg CO₂
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg">Nenhum cálculo realizado ainda.</p>
                    <Link to="/calculator">
                      <Button className="mt-6 eco-gradient shadow-lg shadow-primary/20">
                        Fazer Primeiro Cálculo
                      </Button>
                    </Link>
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

export default Dashboard;