// Importamos el módulo 'express' para crear y manejar rutas.
const express = require('express');

// Importamos un middleware de logging.
// loggingMdw: registra información sobre cada solicitud HTTP que llega al servidor,
// como la URL, el método, la hora, etc. Es útil para depuración y monitoreo.
const loggingMdw = require('../middleware/logger.mdw');

// Importamos los routers específicos para cada área del proyecto:
// - userRouter: maneja todas las rutas relacionadas con usuarios (ejemplo: /user/profile).
// - authRouter: maneja rutas de autenticación (ejemplo: /auth/login, /auth/register).
// - adminRouter: maneja rutas de administración (ejemplo: /admin/dashboard).
const userRouter = require('./user.routes');
const authRouter = require('./auth.routes');
const adminRouter = require('./admin.routes');

// Creamos una instancia de un router de Express.
// Aunque aquí se usa `express()` (que normalmente se usa para crear una app),
// en este contexto se está usando como un router principal para agrupar todas las rutas del proyecto.
const routes = express();

// --- Middleware ---
// Aplicamos el middleware de logging a todas las rutas.
// Esto significa que cada vez que llegue una solicitud, se registrará información antes de procesarla.
routes.use(loggingMdw);

// --- Definición de rutas ---
// Montamos los routers específicos en rutas base:
// - Todas las rutas definidas en `userRouter` estarán disponibles bajo `/user`.
//   Por ejemplo, si `userRouter` tiene una ruta `/profile`, la URL completa será `/user/profile`.
routes.use('/user', userRouter);

// Todas las rutas definidas en `authRouter` estarán disponibles bajo `/auth`.
// Por ejemplo, si `authRouter` tiene una ruta `/login`, la URL completa será `/auth/login`.
routes.use('/auth', authRouter);

// Todas las rutas definidas en `adminRouter` estarán disponibles bajo `/admin`.
// Por ejemplo, si `adminRouter` tiene una ruta `/dashboard`, la URL completa será `/admin/dashboard`.
routes.use('/admin', adminRouter);

// Ruta de prueba: GET /ping
// Devuelve un mensaje simple para verificar que el servidor está funcionando.
// Es común usar esta ruta para hacer pruebas rápidas de conectividad.
routes.use('/ping', (req, res) => {
  res.status(200).json({ status: 200, message: "Pong" });
});

// Manejo de rutas no encontradas (404):
// Si ninguna de las rutas anteriores coincide con la solicitud,
// se ejecuta este middleware y devuelve un mensaje de "Recurso no encontrado".
// El `'*'` actúa como comodín para cualquier ruta no definida.
routes.use('*', (req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

// Exportamos el router principal para que pueda ser usado en el archivo principal de la aplicación Express.
module.exports = routes;
