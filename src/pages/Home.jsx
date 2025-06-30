import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Leaf, BarChart3, Users, Target, ArrowRight, Calculator, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const features = [
    {
      icon: Calculator,
      title: 'Calculadora Inteligente',
      description: 'Calcule sua pegada de carbono com base em transporte, energia, alimentação e consumo.'
    },
    {
      icon: BarChart3,
      title: 'Análises Detalhadas',
      description: 'Visualize seus dados com gráficos interativos e acompanhe seu progresso.'
    },
    {
      icon: Globe,
      title: 'Dados Globais',
      description: 'Compare seus resultados com dados agregados de toda a comunidade.'
    },
    {
      icon: Target,
      title: 'Metas Sustentáveis',
      description: 'Defina objetivos e receba dicas personalizadas para reduzir seu impacto.'
    }
  ];

  const testimonials = [
    {
      quote: "O EcoTracker mudou minha perspectiva sobre o impacto ambiental. É fácil de usar e muito informativo!",
      name: "Ana Silva",
      role: "Usuária Ativa"
    },
    {
      quote: "Finalmente uma ferramenta que torna o rastreamento de carbono acessível e até divertido. Recomendo!",
      name: "Carlos Souza",
      role: "Entusiasta de Sustentabilidade"
    },
    {
      quote: "A interface é linda e os gráficos são super claros. Me sinto mais motivada a ser sustentável.",
      name: "Juliana Pereira",
      role: "Designer"
    }
  ];

  return (
    <>
      <Helmet>
        <title>EcoTracker - Calculadora de Pegada de Carbono</title>
        <meta name="description" content="Calcule e monitore sua pegada de carbono com nossa plataforma inteligente. Descubra como suas ações impactam o meio ambiente e encontre maneiras de ser mais sustentável." />
      </Helmet>

      <div className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative aurora-bg py-24 lg:py-32">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8 z-10"
              >
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center space-x-2 bg-primary/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium"
                  >
                    <Leaf className="h-4 w-4" />
                    <span>Sustentabilidade em Ação</span>
                  </motion.div>

                  <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
                    Monitore sua{' '}
                    <span className="gradient-text">Pegada de Carbono</span>
                  </h1>

                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Descubra como suas ações diárias impactam o meio ambiente e encontre maneiras inteligentes de reduzir sua pegada de carbono com nossa plataforma avançada.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={user ? "/dashboard" : "/register"}>
                    <Button size="lg" className="eco-gradient hover:scale-105 transition-transform duration-200 group shadow-lg shadow-primary/20">
                      {user ? "Ir para o Dashboard" : "Começar Agora"}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  {!user && (
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="border-primary/50 text-primary-foreground hover:bg-primary/10">
                        Já tenho conta
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>+1000 usuários</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span>100% gratuito</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative z-10">
                  <img
                    alt="Visualização 3D de um ecossistema digital em um globo"
                    className="w-full h-auto rounded-2xl shadow-2xl floating-animation"
                    src="https://images.unsplash.com/photo-1576403103737-dc646cbf7de5" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                Recursos <span className="gradient-text">Poderosos</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Nossa plataforma oferece ferramentas avançadas para você entender e reduzir seu impacto ambiental.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="professional-card hover:-translate-y-2 transition-all duration-300 h-full">
                      <CardHeader>
                        <div className="mx-auto w-16 h-16 eco-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent className="text-center space-y-4">
                        <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                O que nossos <span className="gradient-text">usuários</span> dizem
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A confiança da nossa comunidade é o nosso maior ativo.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="professional-card h-full">
                    <CardContent className="p-8 flex flex-col justify-between h-full">
                      <blockquote className="text-lg text-foreground italic">"{testimonial.quote}"</blockquote>
                      <div className="mt-6">
                        <p className="font-semibold text-primary-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 aurora-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                Pronto para fazer a <span className="gradient-text">diferença</span>?
              </h2>

              <p className="text-xl text-muted-foreground">
                Junte-se a milhares de pessoas que já estão monitorando e reduzindo sua pegada de carbono.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="eco-gradient hover:scale-105 transition-transform duration-200 pulse-green shadow-lg shadow-primary/30">
                    Criar Conta Gratuita
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;