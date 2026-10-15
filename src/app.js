const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/v1', apiRoutes);

// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Middleware centralizado de errores (siempre al final)
app.use(errorHandler);

module.exports = app;