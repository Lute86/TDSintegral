// Importamos el módulo 'express' para crear un router y manejar rutas.
const express = require('express');

// Importamos el controlador de usuarios.
// userController: contiene las funciones que manejan la lógica de negocio para las operaciones de usuario,
// como obtener, actualizar o eliminar un usuario.
const { userController } = require('../controllers/index.controller');

// Importamos middlewares de autenticación y autorización:
// - authenticateToken: verifica que el token JWT enviado por el cliente sea válido.
// - authorizeToken: verifica que el usuario tenga los permisos necesarios para acceder a la ruta.
// Ambos se usan para proteger rutas que requieren autenticación y autorización.
const { authenticateToken, authorizeToken } = require('../middleware/auth.mdw');

// Importamos un middleware de validación para la actualización de usuarios.
// validateUserUpdate: valida que los datos enviados para actualizar un usuario cumplan con los requisitos.
// Por ejemplo, que el email sea válido o que la contraseña tenga un formato correcto.
const { validateUserUpdate } = require('../middleware/validations/userValidation.mdw');

// Creamos un router de Express para definir rutas relacionadas con los usuarios.
const userRouter = express.Router();

// Definimos un array de middlewares de autenticación y autorización.
// authMdw: es un arreglo que contiene los middlewares `authenticateToken` y `authorizeToken`.
// Esto permite aplicarlos juntos a las rutas que lo requieran.
const authMdw = [authenticateToken, authorizeToken];

// --- Rutas para información personal del usuario ---

// Ruta para obtener el perfil de un usuario (GET /profile/:userId):
// - `:userId` es un parámetro de ruta que captura el ID del usuario.
// - `authMdw`: se aplican los middlewares de autenticación y autorización.
// - `userController.getUser`: función que maneja la lógica para obtener y devolver la información del usuario.
userRouter.get('/profile/:userId', authMdw, userController.getUser);

// Ruta para actualizar un usuario (PUT /:userId):
// - `:userId`: parámetro de ruta que indica qué usuario se va a actualizar.
// - `[authMdw, validateUserUpdate]`: se aplican los middlewares de autenticación, autorización y validación.
//   El orden es importante: primero se autentica y autoriza, luego se valida la información enviada.
// - `userController.updateUser`: función que maneja la lógica para actualizar la información del usuario.
userRouter.put('/:userId', [authMdw, validateUserUpdate], userController.updateUser);

// Ruta para eliminar un usuario (DELETE /:userId):
// - `:userId`: parámetro de ruta que indica qué usuario se va a eliminar.
// - `authMdw`: se aplican los middlewares de autenticación y autorización.
// - `userController.deleteUser`: función que maneja la lógica para eliminar un usuario.
userRouter.delete('/:userId', authMdw, userController.deleteUser);

// Exportamos el router para que pueda ser usado en el archivo principal de rutas.
module.exports = userRouter;
