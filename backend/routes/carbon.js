const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/middleware/authMiddleware');
const CarbonData = require('../models/Carbon');

// Rota para buscar todos os dados de carbono do usuário logado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const data = await CarbonData.find({ user: req.user.id }).sort({ date: -1 });
    res.json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para salvar um novo cálculo de carbono
router.post('/', authMiddleware, async (req, res) => {
  const {
    totalFootprint, // Corrigido de "total" para corresponder ao frontend
    categories,      // Corrigido de "details" para corresponder ao frontend
    recommendations
  } = req.body;

  if (totalFootprint === undefined) {
    return res.status(400).json({ message: 'O campo "totalFootprint" é obrigatório.' });
  }

  try {
    const newData = new CarbonData({
      user: req.user.id,
      totalFootprint: totalFootprint,
      categories: categories,
      recommendations: recommendations,
    });

    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;