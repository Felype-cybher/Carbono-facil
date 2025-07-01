// backend/routes/community.js
const express = require('express');
const router = express.Router();
const CarbonData = require('../models/Carbon');

// Rota para buscar os dados agregados da comunidade
// GET /api/community/stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await CarbonData.aggregate([
      {
        $group: {
          _id: null, // Agrupa todos os documentos em um único grupo
          averageFootprint: { $avg: "$totalFootprint" }, // Calcula a média do campo totalFootprint
          totalCalculations: { $sum: 1 } // Conta o número total de documentos (cálculos)
        }
      }
    ]);

    if (stats.length > 0) {
      res.json({
        averageFootprint: stats[0].averageFootprint,
        totalCalculations: stats[0].totalCalculations
      });
    } else {
      // Se não houver nenhum cálculo no banco de dados ainda
      res.json({
        averageFootprint: 0,
        totalCalculations: 0
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;