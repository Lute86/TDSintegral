// Importamos el módulo 'express', que es un framework para Node.js
// que facilita la creación de servidores web y APIs.
const express = require("express");

// Cargamos las variables de entorno desde un archivo .env.
// Esto permite guardar configuraciones sensibles (como contraseñas, claves, puertos)
// fuera del código fuente.
require("dotenv").config();

// Importamos el archivo de rutas principal.
// Las rutas definen qué debe hacer el servidor cuando recibe una petición
// en una URL específica (ejemplo: "/usuarios").
const routes = require("./routes/index.routes");

// Importamos un middleware personalizado para manejar CORS (Cross-Origin Resource Sharing).
// CORS es un mecanismo que permite o restringe las solicitudes de recursos en un servidor
// desde un origen externo (por ejemplo, un frontend en otro dominio).
const corsMiddleware = require("./middleware/cors.mdw");

// Importamos un middleware personalizado para parsear (leer) las cookies de las solicitudes HTTP.
// Las cookies son pequeños fragmentos de datos que el servidor envía al navegador del cliente
// y que el navegador devuelve en cada solicitud.
const parseCookies = require("./middleware/cookieParser.mdw");

// Importamos funciones para inicializar la conexión a bases de datos:
// - SQLite: una base de datos ligera que guarda los datos en un archivo local.
// - MongoDB: una base de datos NoSQL orientada a documentos.
const { initSQLite } = require("./config/sqlite.config");
const { initMongo } = require("./config/mongo.config");

// Obtenemos el puerto del servidor desde las variables de entorno.
// Si no está definido, el servidor no sabrá en qué puerto escuchar.
const PORT = process.env.PORT;

// Creamos una instancia de una aplicación Express.
// Esta instancia ('app') será la que configuremos y usemos para definir el comportamiento del servidor.
const app = express();

// --- Middleware ---
// Middleware son funciones que se ejecutan en cada solicitud HTTP.
// Pueden modificar la solicitud o la respuesta, o terminar el ciclo de solicitud-respuesta.

// Middleware para parsear el cuerpo de las solicitudes HTTP como JSON.
// Esto permite que el servidor entienda los datos enviados en formato JSON.
app.use(express.json());

// Aplicamos el middleware de CORS.
// Esto permite que el servidor acepte solicitudes desde otros dominios (útil para APIs públicas o frontends separados).
app.use(corsMiddleware());

// Desactivamos el header 'X-Powered-By' por seguridad.
// Este header indica qué tecnología está usando el servidor, y es mejor no exponerlo.
app.disable("x-powered-by");

// Aplicamos el middleware para parsear cookies.
// Ahora, en cada solicitud, podremos acceder a las cookies enviadas por el cliente.
app.use(parseCookies);

// --- Rutas ---
// Registramos las rutas definidas en el archivo './routes/index.routes'.
// Las rutas determinan qué función se ejecuta cuando se accede a una URL específica.
app.use(routes);

// --- Iniciar el servidor ---
// Iniciamos el servidor para que escuche en el puerto definido.
// El servidor estará "escuchando" solicitudes HTTP en ese puerto.
app.listen(PORT, async () => {
  // Antes de iniciar el servidor, verificamos qué base de datos usar según la variable de entorno.
  // Si DB_CLIENT es "sqlite", inicializamos la conexión a SQLite.
  if (process.env.DB_CLIENT === "sqlite") await initSQLite();
  // Si DB_CLIENT es "mongo", inicializamos la conexión a MongoDB.
  if (process.env.DB_CLIENT === "mongo") await initMongo();

  // Mensaje de confirmación en la consola para saber que el servidor está funcionando.
  console.log(`Server running on port: ${PORT}`);
});
