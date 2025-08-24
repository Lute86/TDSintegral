// Importa la función para generar tokens JWT, usada en la autenticación.
const { createToken } = require("../middleware/auth.mdw");
// Importa el manejador de errores para centralizar el manejo de excepciones.
const errorHandler = require("../handlers/ErrorHandler");
// Importa el manejador de respuestas HTTP para estandarizar las respuestas al cliente.
const HttpResponse = require("../handlers/HttpResponse");
// Importa el servicio de autenticación, que contiene la lógica para validar usuarios.
const { authService } = require("../services/index.services");

// Valida las credenciales de un usuario y genera un token JWT si son correctas.
const validateUser = async (req, res) => {
  const action = "Validar usuario";
  try {
    const user = await authService.validateUser(req.body);
    if (!user) return HttpResponse.notFound(res, { action, message: "Usuario no encontrado" });
    if (user === "PasswordError") return HttpResponse.badRequest(res, { action, message: "Contraseña incorrecta" });

    const generatedToken = createToken(user); // El usuario ya está normalizado
    res.cookie('jwt', generatedToken, { httpOnly: true });
    return HttpResponse.success(res, { user, token: generatedToken });
  } catch (error) {
    return errorHandler(error, res, action);
  }
};

// Exporta la función para ser usada en las rutas de autenticación.
module.exports = { validateUser };

