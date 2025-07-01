import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { GaugeCircle, BarChart, FileText, Target, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user } = useAuth();
  const { carbonData, loading } = useData();

  // Enquanto os dados estiverem carregando, exibe um indicador. Isso previne a tela branca.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasData = carbonData && carbonData.length > 0;

  // Calcula as estatísticas apenas se houver dados
  const lastCalculation = hasData ? carbonData[0] : null;
  const averageFootprint = hasData
    ? carbonData.reduce((acc, item) => acc + item.totalFootprint, 0) / carbonData.length
    : 0;
  const calculationCount = carbonData.length;

  return (
    <>
      <Helmet>
        <title>Dashboard - EcoTracker</title>
        <meta name="description" content="Seu painel de controle pessoal para monitorar e analisar sua pegada de carbono." />
      </Helmet>

      <div className="min-h-screen pt-20 px-4 py-8 aurora-bg">
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Olá, <span className="gradient-text">{user?.name || 'Usuário'}</span>!
            </h1>
            <p className="text-muted-foreground text-lg">
              Bem-vindo ao seu painel de sustentabilidade.
            </p>
          </motion.div>

          {/* Se não houver dados, mostra uma mensagem de boas-vindas */}
          {!hasData ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="professional-card text-center p-8">
                <CardHeader>
                  <Target className="mx-auto h-16 w-16 text-primary" />
                  <CardTitle className="mt-4">Comece sua jornada</CardTitle>
                  <CardDescription>
                    Você ainda não fez nenhum cálculo. Use nossa calculadora para descobrir sua pegada de carbono e começar a monitorar seu progresso.
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
          ) : (
            // Se houver dados, mostra as estatísticas
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                <DashboardCard
                  icon={GaugeCircle}
                  title="Última Pegada"
                  value={`${lastCalculation.totalFootprint.toFixed(1)} kg CO₂`}
                  description="Seu cálculo mais recente"
                />
                <DashboardCard
                  icon={BarChart}
                  title="Média Mensal"
                  value={`${averageFootprint.toFixed(1)} kg CO₂`}
                  description="Média de todas as suas medições"
                />
                <DashboardCard
                  icon={FileText}
                  title="Cálculos Feitos"
                  value={calculationCount}
                  description="Total de registros salvos"
                />
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="lg:col-span-2"
                >
                  <Card className="professional-card h-full">
                    <CardHeader>
                      <CardTitle>Ações Rápidas</CardTitle>
                      <CardDescription>Acesse as principais ferramentas com um clique.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link to="/calculator">
                        <Button variant="outline" className="w-full justify-start p-6 text-left h-auto">
                          <div className="flex items-center">
                            <div className="p-3 bg-primary/10 rounded-lg mr-4">
                              <Target className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">Nova Medição</p>
                              <p className="text-sm text-muted-foreground">Calcule sua pegada atual.</p>
                            </div>
                          </div>
                        </Button>
                      </Link>
                      <Link to="/analytics">
                        <Button variant="outline" className="w-full justify-start p-6 text-left h-auto">
                          <div className="flex items-center">
                            <div className="p-3 bg-primary/10 rounded-lg mr-4">
                              <BarChart className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">Ver Análises</p>
                              <p className="text-sm text-muted-foreground">Acompanhe seu progresso.</p>
                            </div>
                          </div>
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="professional-card h-full">
                    <CardHeader>
                      <CardTitle>Último Registro</CardTitle>
                      <CardDescription>Detalhes da sua última medição.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-5 w-5 mr-3" />
                        <span>{new Date(lastCalculation.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="mt-4 space-y-2">
                        {(() => {
                          const nomesDasCategorias = {
                            transport: 'Transporte',
                            energy: 'Energia',
                            food: 'Alimentação',
                            consumption: 'Consumo'
                          };
                          return Object.entries(lastCalculation.categories).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="capitalize">{nomesDasCategorias[key] || key}</span>
                              <span className="font-medium">{value.toFixed(1)} kg CO₂</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Componente auxiliar para os cards de estatísticas
const DashboardCard = ({ icon: Icon, title, value, description }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <Card className="professional-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default Dashboard;