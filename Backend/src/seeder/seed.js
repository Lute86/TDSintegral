const mongoose = require('mongoose');
const { sequelize } = require('../config/sqlite.config');
const UserProvider = require('../providers/user.provider');
const bcrypt = require('bcrypt');

// Datos de usuarios a crear
const users = [
  {
    nombre: 'Admin',
    apellido: 'User',
    email: 'admin@example.com',
    dni: '111111111',
    role: 'Admin',
    password: 'adminPassword123'
  },
  {
    nombre: 'Common',
    apellido: 'User',
    email: 'user@example.com',
    dni: '222222222',
    role: 'User',
    password: 'userPassword123'
  }
];

// Función para crear usuarios
async function seedUsers() {
  try {
    console.log('Iniciando seed de usuarios...');

    // Si usas MongoDB
    if (process.env.DB_CLIENT === 'mongo') {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Conexión a MongoDB establecida.');
    }
    // Si usas SQLite
    else if (process.env.DB_CLIENT === 'sqlite') {
      await sequelize.authenticate();
      await sequelize.sync({ force: true }); // ¡Cuidado! Esto borra los datos existentes en SQLite
      console.log('Conexión a SQLite establecida.');
    }

    // Crea los usuarios
    for (const userData of users) {
      // Verifica si el usuario ya existe
      const existingUser = await UserProvider.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`El usuario ${userData.email} ya existe. Saltando...`);
        continue;
      }

      // Encripta la contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Crea el usuario
      const user = await UserProvider.create({
        ...userData,
        password: hashedPassword
      });

      console.log(`Usuario creado: ${user.email} (ID: ${user._id || user.id})`);
    }

    console.log('Seed de usuarios completado.');
  } catch (error) {
    console.error('Error al ejecutar el seed:', error);
  } finally {
    // Cierra la conexión a la base de datos
    if (process.env.DB_CLIENT === 'mongo') {
      await mongoose.disconnect();
      console.log('Conexión a MongoDB cerrada.');
    }
  }
}

// Ejecuta el seed
seedUsers();
