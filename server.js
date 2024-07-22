const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config(); // Charge les variables d'environnement

const app = express();

// Middleware
app.use(express.json()); // Middleware pour parser le JSON

// Connexion à la base de données
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Démarrage du serveur
app.listen(5000, () => console.log('Server running on port 5000'));
