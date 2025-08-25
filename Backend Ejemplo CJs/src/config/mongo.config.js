// Importa Mongoose para interactuar con MongoDB.
const mongoose = require("mongoose");
// Carga las variables de entorno desde el archivo .env.
require("dotenv").config();

// Función asíncrona para inicializar la conexión a MongoDB.
const initMongo = async () => {
  try {
    // Conecta a MongoDB usando la URI definida en las variables de entorno.
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Usa el nuevo parser de URL de MongoDB.
      useUnifiedTopology: true, // Usa el nuevo motor de gestión de conexiones.
    });
    console.log("Conexión a MongoDB establecida con éxito."); // Mensaje de éxito.
  } catch (err) {
    console.error("Error al conectar a MongoDB:", err); // Mensaje de error si falla la conexión.
  }
};

// Exporta la función para inicializar MongoDB.
module.exports = { initMongo };
