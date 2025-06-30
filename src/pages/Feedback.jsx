import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Star, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast({ title: "Avaliação incompleta", description: "Por favor, selecione uma nota de 1 a 5 estrelas.", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    // Aqui você pode adicionar a lógica para enviar o feedback para o backend no futuro
    console.log({
      userId: user?.id,
      rating,
      comment
    });
    
    setTimeout(() => {
        toast({ title: "Feedback enviado!", description: "Obrigado por nos ajudar a melhorar!" });
        setRating(0);
        setComment('');
        setLoading(false);
    }, 1000);
  };
  
  return (
    <>
      <Helmet>
        <title>Feedback - EcoTracker</title>
        <meta name="description" content="Deixe sua avaliação e nos ajude a melhorar a plataforma EcoTracker." />
      </Helmet>
      <div className="min-h-screen pt-20 px-4 py-8 aurora-bg">
        <div className="max-w-4xl mx-auto space-y-8">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="gradient-text">Seu Feedback</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Sua opinião é muito importante para nós.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Deixe sua avaliação</CardTitle>
                <CardDescription>Como você avalia sua experiência com o EcoTracker?</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center space-x-2">
                        {[...Array(5)].map((star, index) => {
                            const ratingValue = index + 1;
                            return (
                                <label key={index}>
                                    <input type="radio" name="rating" value={ratingValue} onClick={() => setRating(ratingValue)} className="hidden" />
                                    <Star 
                                        className="cursor-pointer transition-colors"
                                        size={40}
                                        color={ratingValue <= (hover || rating) ? "#facc15" : "#e4e4e7"}
                                        fill={ratingValue <= (hover || rating) ? "#facc15" : "none"}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                </label>
                            );
                        })}
                    </div>
                    <div>
                        <Textarea 
                            placeholder="Deixe um comentário (opcional)..." 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="bg-secondary/80 border-border"
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full eco-gradient">
                        {loading ? 'Enviando...' : <><Send className="mr-2 h-4 w-4"/> Enviar Feedback</>}
                    </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Feedback;