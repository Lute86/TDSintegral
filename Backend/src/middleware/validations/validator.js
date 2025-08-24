// Importa `validationResult` de express-validator para procesar los resultados de las validaciones.
const { validationResult } = require('express-validator');

// Middleware que verifica si hay errores de validación en la solicitud.
function checkValidationResult(req, res, next) {
  const result = validationResult(req); // Obtiene los resultados de las validaciones previas.
  if (result.isEmpty()) return next(); // Si no hay errores, continua con el siguiente middleware o controlador.
  return res.status(400).json({ error: result.array() }); // Si hay errores, devuelve un 400 con los detalles.
}

// Exporta el middleware para ser usado en las rutas y validar solicitudes entrantes.
module.exports = checkValidationResult;
