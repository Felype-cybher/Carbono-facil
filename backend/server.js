const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// --- Conexão com o Banco de Dados (usando Mongoose) ---
const uri = process.env.MONGO_URI;
if (!uri) {
    console.error("❌ Erro: A variável MONGO_URI não está definida no arquivo .env");
    process.exit(1);
}

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Conectado ao MongoDB com sucesso via Mongoose!");
  })
  .catch(err => {
    console.error("❌ Falha ao conectar ao MongoDB", err);
    process.exit(1);
  });


// --- Rotas da Aplicação ---
const authRoutes = require('./routes/auth');
const carbonRoutes = require('./routes/carbon');


app.use('/api/auth', authRoutes);
app.use('/api/carbon', carbonRoutes);
app.use('/api/feedback', require('./routes/feedback'));


// --- Inicialização do Servidor ---
app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});