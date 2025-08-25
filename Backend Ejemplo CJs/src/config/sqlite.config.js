// Importa Sequelize para interactuar con SQLite.
const { Sequelize } = require("sequelize");
// Carga las variables de entorno desde el archivo .env.
require("dotenv").config();

// Crea una instancia de Sequelize configurada para SQLite.
const sequelize = new Sequelize({
  dialect: "sqlite", // Especifica que se usará SQLite.
  storage: process.env.DB_STORAGE || "dev.sqlite", // Ruta del archivo de la base de datos (por defecto: "dev.sqlite").
  logging: false, // Desactiva los logs de Sequelize para evitar saturación en consola.
});

// Función asíncrona para inicializar la conexión a SQLite.
const initSQLite = async () => {
  try {
    await sequelize.authenticate(); // Verifica que la conexión a la base de datos sea válida.
    await sequelize.sync({ alter: true }); // Sincroniza los modelos con la base de datos (solo para desarrollo).
    console.log("Conexión a SQLite establecida con éxito."); // Mensaje de éxito.
  } catch (err) {
    console.error("Error al conectar a SQLite:", err); // Mensaje de error si falla la conexión.
  }
};

// Exporta la instancia de Sequelize y la función de inicialización.
module.exports = { sequelize, initSQLite };
