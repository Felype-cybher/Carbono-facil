import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Car, Home, Utensils, ShoppingBag, Calculator as CalcIcon, Leaf } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';

const Calculator = () => {
  const [formData, setFormData] = useState({
    transport: { carKm: [0], publicTransport: [0], flights: [0] },
    energy: { electricity: [100], gas: [50], heating: [30] },
    food: { meat: [3], dairy: [2], vegetables: [5] },
    consumption: { shopping: [2], waste: [1], recycling: [3] }
  });

  const [result, setResult] = useState(null);
  const { addCarbonData } = useData();
  const { toast } = useToast();

  const categories = [
    { key: 'transport', title: 'Transporte', icon: Car, color: 'text-blue-400', bgColor: 'bg-blue-500/20', fields: [ { key: 'carKm', label: 'Km de carro por semana', max: 500, unit: 'km' }, { key: 'publicTransport', label: 'Viagens de transporte público por semana', max: 20, unit: 'viagens' }, { key: 'flights', label: 'Voos por ano', max: 10, unit: 'voos' } ] },
    { key: 'energy', title: 'Energia', icon: Home, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', fields: [ { key: 'electricity', label: 'Consumo de eletricidade mensal', max: 500, unit: 'kWh' }, { key: 'gas', label: 'Consumo de gás mensal', max: 200, unit: 'm³' }, { key: 'heating', label: 'Aquecimento mensal', max: 100, unit: 'unidades' } ] },
    { key: 'food', title: 'Alimentação', icon: Utensils, color: 'text-green-400', bgColor: 'bg-green-500/20', fields: [ { key: 'meat', label: 'Refeições com carne por semana', max: 14, unit: 'refeições' }, { key: 'dairy', label: 'Porções de laticínios por dia', max: 5, unit: 'porções' }, { key: 'vegetables', label: 'Porções de vegetais por dia', max: 10, unit: 'porções' } ] },
    { key: 'consumption', title: 'Consumo', icon: ShoppingBag, color: 'text-purple-400', bgColor: 'bg-purple-500/20', fields: [ { key: 'shopping', label: 'Compras não essenciais por mês', max: 10, unit: 'vezes' }, { key: 'waste', label: 'Sacos de lixo por semana', max: 5, unit: 'sacos' }, { key: 'recycling', label: 'Nível de reciclagem (1-5)', max: 5, unit: 'nível' } ] }
  ];

  const calculateFootprint = async () => {
    const factors = {
      transport: { carKm: 0.21, publicTransport: 0.05, flights: 500 },
      energy: { electricity: 0.5, gas: 2.0, heating: 1.5 },
      food: { meat: 6.0, dairy: 1.5, vegetables: -0.5 },
      consumption: { shopping: 10, waste: 5, recycling: -2 }
    };

    const categoryResults = {};
    let total = 0;

    Object.keys(formData).forEach(categoryKey => {
      let categoryTotal = 0;
      Object.keys(formData[categoryKey]).forEach(fieldKey => {
        const value = formData[categoryKey][fieldKey][0];
        const factor = factors[categoryKey][fieldKey];
        categoryTotal += value * factor;
      });
      categoryResults[categoryKey] = Math.max(0, categoryTotal);
      total += categoryTotal;
    });
    
    const recommendations = generateRecommendations(formData);
    const footprintLevel = getFootprintLevel(Math.max(0, total));

    const dataForBackend = {
      totalFootprint: Math.max(0, total),
      categories: categoryResults,
      recommendations,
    };
    
    setResult(dataForBackend);
    
    const savedData = await addCarbonData(dataForBackend);

    if (savedData) {
      toast({
        title: "Cálculo salvo com sucesso!",
        description: `Sua pegada de carbono é ${dataForBackend.totalFootprint.toFixed(1)} kg CO₂`,
      });
    } else {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar seu cálculo. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const generateRecommendations = (data) => {
    const recommendations = [];
    if (data.transport.carKm[0] > 100) recommendations.push("Considere usar mais transporte público ou bicicleta.");
    if (data.energy.electricity[0] > 300) recommendations.push("Tente reduzir o consumo de energia desligando aparelhos não utilizados.");
    if (data.food.meat[0] > 7) recommendations.push("Reduzir o consumo de carne vermelha pode diminuir sua pegada.");
    if (data.consumption.recycling[0] < 3) recommendations.push("Aumente seus esforços de reciclagem e compostagem.");
    if (recommendations.length === 0) recommendations.push("Parabéns! Você já tem hábitos muito sustentáveis!");
    return recommendations;
  };

  const updateValue = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const getFootprintLevel = (value) => {
    if (value < 50) return { level: 'Excelente', color: 'text-green-400', bg: 'eco-gradient' };
    if (value < 100) return { level: 'Bom', color: 'text-blue-400', bg: 'bg-gradient-to-r from-blue-500 to-green-500' };
    if (value < 200) return { level: 'Moderado', color: 'text-yellow-400', bg: 'warning-gradient' };
    return { level: 'Alto', color: 'text-red-400', bg: 'danger-gradient' };
  };
  
  return (
    <>
      <Helmet>
        <title>Calculadora - EcoTracker</title>
        <meta name="description" content="Calcule sua pegada de carbono com nossa calculadora inteligente e descubra como reduzir seu impacto ambiental." />
      </Helmet>

      <div className="min-h-screen pt-20 px-4 py-8 aurora-bg">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="gradient-text">Calculadora</span> de Pegada de Carbono
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Ajuste os valores para refletir seus hábitos e veja o impacto em tempo real.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              {categories.map((category, categoryIndex) => {
                const Icon = category.icon;
                return (
                  <motion.div key={category.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: categoryIndex * 0.1 }}>
                    <Card className="professional-card">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3">
                          <div className={`p-3 rounded-lg ${category.bgColor}`}>
                            <Icon className={`h-6 w-6 ${category.color}`} />
                          </div>
                          <span className="text-foreground">{category.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        {category.fields.map((field) => (
                          <div key={field.key} className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Label className="text-foreground">{field.label}</Label>
                              <span className="text-primary font-medium text-lg">
                                {formData[category.key][field.key][0]} {field.unit}
                              </span>
                            </div>
                            <Slider value={formData[category.key][field.key]} onValueChange={(value) => updateValue(category.key, field.key, value)} max={field.max} step={1} className="w-full" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center">
                <Button onClick={calculateFootprint} size="lg" className="eco-gradient hover:scale-105 transition-transform duration-200 pulse-green shadow-lg shadow-primary/20">
                  <CalcIcon className="mr-2 h-5 w-5" />
                  Calcular e Salvar
                </Button>
              </motion.div>
            </div>

            <div className="space-y-6 lg:sticky lg:top-24">
              {result && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  <Card className="professional-card">
                    <CardHeader className="text-center">
                      <CardTitle className="text-foreground">Sua Pegada de Carbono</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className={`mx-auto w-24 h-24 ${getFootprintLevel(result.totalFootprint).bg} rounded-full flex items-center justify-center shadow-lg`}>
                        <Leaf className="h-12 w-12 text-white" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-4xl font-bold text-foreground">
                          {result.totalFootprint.toFixed(1)} kg CO₂
                        </p>
                        <p className={`text-xl font-medium ${getFootprintLevel(result.totalFootprint).color}`}>
                          {getFootprintLevel(result.totalFootprint).level}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="professional-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">Por Categoria</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(result.categories).map(([key, value]) => {
                        const category = categories.find(c => c.key === key);
                        const Icon = category.icon;
                        return (
                          <div key={key} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Icon className={`h-5 w-5 ${category.color}`} />
                              <span className="text-muted-foreground">{category.title}</span>
                            </div>
                            <span className="text-foreground font-medium">
                              {value.toFixed(1)} kg CO₂
                            </span>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  <Card className="professional-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">Recomendações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                          <Leaf className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-muted-foreground text-sm">{rec}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calculator;