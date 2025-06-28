import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { MessageSquare, Star, Send, Heart } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Feedback = () => {
  const [formData, setFormData] = useState({ rating: 0, category: '', message: '', suggestion: '' });
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const { saveFeedback, feedbacks } = useData();
  const { toast } = useToast();

  const categories = [
    { id: 'usability', label: 'Usabilidade', icon: '🎯' },
    { id: 'accuracy', label: 'Precisão', icon: '📊' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'features', label: 'Funcionalidades', icon: '⚡' },
    { id: 'performance', label: 'Performance', icon: '🚀' },
    { id: 'general', label: 'Geral', icon: '💬' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.rating || !formData.category || !formData.message) {
      toast({ title: "Campos obrigatórios", description: "Por favor, preencha todos os campos obrigatórios.", variant: "destructive" });
      return;
    }
    saveFeedback(formData);
    toast({ title: "Feedback enviado com sucesso!", description: "Obrigado por compartilhar sua opinião conosco." });
    setFormData({ rating: 0, category: '', message: '', suggestion: '' });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= (hoveredRating || formData.rating);
      return (
        <motion.button
          key={index}
          type="button"
          onClick={() => handleChange('rating', starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className={`text-4xl transition-colors duration-200 ${isActive ? 'text-yellow-400' : 'text-gray-600'}`}
        >
          <Star className={`h-10 w-10 ${isActive ? 'fill-current' : ''}`} />
        </motion.button>
      );
    });
  };

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    return (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbacks.forEach(f => { distribution[f.rating]++; });
    return distribution;
  };

  const distribution = getRatingDistribution();
  const totalFeedbacks = feedbacks.length;

  return (
    <>
      <Helmet>
        <title>Feedback - EcoTracker</title>
        <meta name="description" content="Compartilhe sua experiência com o EcoTracker e ajude-nos a melhorar nossa plataforma." />
      </Helmet>

      <div className="min-h-screen pt-20 px-4 py-8 aurora-bg">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Seu <span className="gradient-text">Feedback</span> é Importante
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Compartilhe sua experiência e ajude-nos a tornar o EcoTracker ainda melhor.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="professional-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-foreground">
                      <MessageSquare className="h-6 w-6 text-primary" />
                      <span>Enviar Feedback</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="space-y-3">
                        <Label className="text-foreground text-lg">Como você avalia sua experiência? *</Label>
                        <div className="flex items-center space-x-2">{renderStars()}</div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-foreground text-lg">Categoria do feedback *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {categories.map((cat) => (
                            <button key={cat.id} type="button" onClick={() => handleChange('category', cat.id)}
                              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                                formData.category === cat.id
                                  ? 'border-primary bg-primary/20 text-primary-foreground'
                                  : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50'
                              }`}>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{cat.icon}</span>
                                <span className="font-medium">{cat.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="message" className="text-foreground text-lg">Sua opinião *</Label>
                        <Textarea id="message" value={formData.message} onChange={(e) => handleChange('message', e.target.value)} placeholder="Conte-nos sobre sua experiência..." className="min-h-[120px] bg-secondary/80 border-border text-foreground placeholder:text-muted-foreground" required />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="suggestion" className="text-foreground text-lg">Sugestões de melhoria (opcional)</Label>
                        <Textarea id="suggestion" value={formData.suggestion} onChange={(e) => handleChange('suggestion', e.target.value)} placeholder="Como podemos melhorar?" className="min-h-[100px] bg-secondary/80 border-border text-foreground placeholder:text-muted-foreground" />
                      </div>

                      <Button type="submit" size="lg" className="w-full eco-gradient hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary/20">
                        <Send className="mr-2 h-5 w-5" />
                        Enviar Feedback
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="space-y-6 lg:sticky lg:top-24">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card className="professional-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Avaliação Geral</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="text-5xl font-bold text-yellow-400">{getAverageRating()}</div>
                    <div className="flex justify-center">
                      {Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-6 w-6 ${i < Math.round(getAverageRating()) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />)}
                    </div>
                    <p className="text-muted-foreground text-sm">Baseado em {totalFeedbacks} avaliações</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Card className="professional-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Distribuição</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = distribution[rating];
                      const percentage = totalFeedbacks > 0 ? (count / totalFeedbacks) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center space-x-3">
                          <span className="text-muted-foreground text-sm w-8">{rating}★</span>
                          <div className="flex-1 bg-secondary rounded-full h-2.5"><div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${percentage}%` }} /></div>
                          <span className="text-muted-foreground text-sm w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Card className="professional-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Feedbacks Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {feedbacks.length > 0 ? (
                      <div className="space-y-4">
                        {feedbacks.slice(-2).reverse().map((fb, i) => (
                          <div key={i} className="p-3 bg-secondary/50 rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">{Array.from({ length: fb.rating }, (_, j) => <Star key={j} className="h-4 w-4 text-yellow-400 fill-current" />)}</div>
                              <span className="text-muted-foreground text-xs">{new Date(fb.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <p className="text-foreground text-sm line-clamp-2">{fb.message}</p>
                            <p className="text-muted-foreground text-xs">por {fb.userName}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Heart className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground text-sm">Seja o primeiro a deixar um feedback!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedback;