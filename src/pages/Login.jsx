import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Mail, Lock, Eye, EyeOff, Leaf } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Agora esperamos a função login terminar antes de continuar
    await login({ email: formData.email, password: formData.password });
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>Login - EcoTracker</title>
        <meta name="description" content="Faça login na sua conta EcoTracker e continue monitorando sua pegada de carbono." />
      </Helmet>
      <div className="min-h-screen pt-20 flex items-center justify-center px-4 aurora-bg">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="professional-card">
              <CardHeader className="text-center space-y-4 p-8">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto w-20 h-20 eco-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
                >
                  <Leaf className="h-10 w-10 text-white" />
                </motion.div>
                <CardTitle className="text-3xl font-bold gradient-text">
                  Entrar na sua conta
                </CardTitle>
                <p className="text-muted-foreground">
                  Continue sua jornada sustentável.
                </p>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        className="pl-10 h-12 bg-secondary/80 border-border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-12 bg-secondary/80 border-border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full eco-gradient hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary/20"
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground">
                    Não tem uma conta?{' '}
                    <Link
                      to="/register"
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Cadastre-se aqui
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;