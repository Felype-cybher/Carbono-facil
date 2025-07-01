// backend/routes/feedback.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/middleware/authMiddleware');
const Feedback = require('../models/Feedback');

// Rota para salvar um novo feedback
// POST /api/feedback
router.post('/', authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating) {
    return res.status(400).json({ message: 'A avaliação (rating) é obrigatória.' });
  }

  try {
    const newFeedback = new Feedback({
      user: req.user.id,
      rating,
      comment
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;