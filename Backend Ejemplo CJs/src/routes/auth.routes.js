// Importamos el módulo 'express' para crear rutas y manejar solicitudes HTTP.
const express = require("express");

// Importamos los controladores que contienen la lógica de negocio:
// - authController: funciones relacionadas con la autenticación (ejemplo: validar usuario).
// - userController: funciones relacionadas con los usuarios (ejemplo: crear un usuario).
const { authController, userController } = require("../controllers/index.controller");

// Importamos middlewares de validación:
// - validateLogin: valida los datos enviados al hacer login (ejemplo: que el email y contraseña cumplan ciertos requisitos).
// - validateRegistration: valida los datos enviados al registrar un usuario.
const { validateLogin, validateRegistration } = require("../middleware/validations/loginValidation.mdw");

// Importamos un middleware de autenticación:
// - authenticateToken: verifica que el token JWT enviado por el cliente sea válido.
//   Se usa para proteger rutas que requieren autenticación.
const { authenticateToken } = require("../middleware/auth.mdw");

// Importamos un manejador de respuestas HTTP personalizado.
// HttpResponse: proporciona métodos estandarizados para enviar respuestas al cliente
// (ejemplo: éxito, error, etc.), evitando repetir código.
const HttpResponse = require("../handlers/HttpResponse");

// Creamos un router de Express.
// Un router es un objeto que permite definir rutas y middlewares de forma modular.
// Aquí definiremos todas las rutas relacionadas con la autenticación.
const authRouter = express.Router();

// --- Definición de rutas ---

// Ruta para el login (POST /login):
// - Cuando se hace una petición POST a "/login", primero se ejecuta el middleware `validateLogin`.
// - Si la validación es exitosa, se ejecuta la función `authController.validateUser`.
//   Esta función se encarga de verificar las credenciales del usuario y devolver una respuesta.
authRouter.post("/login", validateLogin, authController.validateUser);

// Ruta para el registro de usuarios (POST /register):
// - Cuando se hace una petición POST a "/register", primero se ejecuta el middleware `validateRegistration`.
// - Si la validación es exitosa, se ejecuta la función `userController.createUser`.
//   Esta función se encarga de crear un nuevo usuario en la base de datos.
authRouter.post("/register", validateRegistration, userController.createUser);

// Ruta para validar el token (GET /token):
// - Cuando se hace una petición GET a "/token", primero se ejecuta el middleware `authenticateToken`.
// - Si el token es válido, se ejecuta la función anónima que devuelve una respuesta de éxito.
//   Esto es útil para que el cliente verifique si su token sigue siendo válido.
authRouter.get("/token", authenticateToken, (req, res) => {
  // Usamos el manejador de respuestas para enviar una respuesta de éxito al cliente.
  return HttpResponse.success(res);
});

// Exportamos el router para que pueda ser usado en otros archivos,
// como el archivo principal donde se configura la aplicación Express.
module.exports = authRouter;
