const errorHandler = (err, req, res, next) => {
  // Errores de validación de Sequelize (campos requeridos, valores duplicados)
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map((e) => e.message);
    console.warn(`[WARN] Validation error: ${errors.join(', ')}`);
    return res.status(400).json({
      message: 'Validation error',
      errors,
    });
  }

  // ID con formato inválido (por ejemplo, un UUID mal escrito)
  if (err.name === 'SequelizeDatabaseError') {
    console.warn(`[WARN] Database error: ${err.message}`);
    return res.status(400).json({ message: 'Invalid request data' });
  }

  // Errores con código definido (400, 401, 404...) o inesperados (500)
  const statusCode = err.status || 500;

  if (statusCode >= 500) {
    console.error(`[ERROR] ${err.stack}`);
  } else {
    console.warn(`[WARN] ${err.message}`);
  }

  return res.status(statusCode).json({
    message: statusCode >= 500 ? 'Internal server error' : err.message,
  });
};

module.exports = errorHandler; 