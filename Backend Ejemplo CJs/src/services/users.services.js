// Importa el proveedor de usuarios, que interactúa directamente con la base de datos (SQLite, MongoDB, etc.).
const UserProvider = require("../providers/user.provider");
// Importa bcrypt para encriptar y comparar contraseñas de forma segura.
const bcrypt = require("bcrypt");

// Convierte objetos de ORM/ODM (Sequelize, Mongoose) a objetos JavaScript simples.
function normalize(user) {
  if (!user) return null;
  if (user.dataValues) return user.dataValues;   // Para instancias de Sequelize.
  if (typeof user.toObject === "function") return user.toObject(); // Para documentos de Mongoose.
  return user; // Si ya es un objeto simple.
}

// Crea un nuevo usuario, encriptando su contraseña antes de guardarlo.
const createUser = async (user) => {
  user.password = await bcrypt.hash(user.password, 10); // Encripta la contraseña con un "salt" de 10 rondas.
  const created = await UserProvider.create(user); // Guarda el usuario en la base de datos.
  return normalize(created); // Normaliza el resultado antes de devolverlo.
};

// Busca y devuelve un usuario por su ID.
const getUser = async (id) => {
  const user = await UserProvider.findById(id); // Consulta el usuario por ID.
  return normalize(user); // Normaliza el resultado.
};

// Devuelve todos los usuarios registrados en la base de datos.
const getAllUsers = async () => {
  const users = await UserProvider.findAll(); // Obtiene todos los usuarios.
  return users.map(normalize); // Normaliza cada usuario en la lista.
};

// Actualiza un usuario, validando permisos y contraseñas según corresponda.
const updateUser = async (id, updates, currentUser) => {
  const existing = await UserProvider.findById(id); // Busca el usuario existente.
  if (!existing) return null; // Devuelve null si no existe.
  const user = normalize(existing); // Normaliza el usuario existente.

  // Evita que usuarios no administradores modifiquen roles.
  if (updates.role && currentUser.role !== "Admin") delete updates.role;

  // Valida la contraseña actual si se proporciona.
  if (updates.currentPassword) {
    const isValid = await bcrypt.compare(updates.currentPassword, user.password); // Compara contraseñas.
    if (!isValid) return "PasswordError"; // Devuelve error si la contraseña actual es incorrecta.
  }

  // Encripta la nueva contraseña si se proporciona.
  if (updates.newPassword) {
    updates.password = await bcrypt.hash(updates.newPassword, 10); // Encripta la nueva contraseña.
    delete updates.newPassword; // Elimina el campo temporal.
  }

  const updated = await UserProvider.update(id, updates); // Actualiza el usuario en la base de datos.
  return normalize(updated); // Normaliza el resultado.
};

// Elimina un usuario de la base de datos.
const deleteUser = async (id) => {
  const deleted = await UserProvider.delete(id); // Elimina el usuario por ID.
  return deleted; // Devuelve el resultado de la operación.
};

// Restaura un usuario previamente eliminado (solo para SQLite con "soft delete").
const recoverUser = async (id) => {
  const recovered = await UserProvider.restore(id); // Restaura el usuario por ID.
  return normalize(recovered); // Normaliza el resultado.
};

// Exporta todas las funciones del servicio para ser usadas en los controladores.
module.exports = { createUser, getUser, getAllUsers, updateUser, deleteUser, recoverUser };
