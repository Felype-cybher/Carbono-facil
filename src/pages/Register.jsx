import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { User, Mail, Lock, Eye, EyeOff, Leaf } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Corrigido para usar a função "signup" do nosso novo AuthContext
  const { signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    if (formData.password.length < 6) {
      toast({
        title: "Erro no cadastro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Usamos 'await' para esperar a resposta da API
    await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
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
        <title>Cadastro - EcoTracker</title>
        <meta name="description" content="Crie sua conta no EcoTracker e comece a monitorar sua pegada de carbono hoje mesmo." />
      </Helmet>
      <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-8 aurora-bg">
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
                  Criar sua conta
                </CardTitle>
                <p className="text-muted-foreground">
                  Comece a monitorar sua pegada de carbono.
                </p>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Seu nome" className="pl-10 h-12 bg-secondary/80 border-border text-foreground" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" className="pl-10 h-12 bg-secondary/80 border-border text-foreground" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="••••••••" className="pl-10 pr-10 h-12 bg-secondary/80 border-border text-foreground" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground">Confirmar senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="pl-10 pr-10 h-12 bg-secondary/80 border-border text-foreground" required />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} size="lg" className="w-full eco-gradient hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary/20">
                    {loading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                      Faça login aqui
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

export default Register;