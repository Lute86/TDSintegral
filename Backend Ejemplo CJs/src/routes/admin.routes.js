// Importamos el módulo 'express' para crear un router y manejar rutas.
const express = require('express');

// Importamos el controlador de usuarios.
const { userController } = require('../controllers/index.controller');

// Importamos middlewares de autenticación y autorización
const { isAdmin, authenticateToken } = require('../middleware/auth.mdw');

// Creamos un router de Express para definir rutas relacionadas con la administración de usuarios.
const adminRouter = express.Router();

// Definimos un array de middlewares de autenticación y autorización.
// Primero autenticamos (validar JWT), luego verificamos si es Admin
const authMdw = [authenticateToken, isAdmin];

// --- Rutas de administración ---

// Obtener todos los usuarios
adminRouter.get('/users', authMdw, userController.getAllUsers);

// Recuperar un usuario eliminado
// adminRouter.put('/recover/:userId', authMdw, userController.recoverUser);

module.exports = adminRouter;
