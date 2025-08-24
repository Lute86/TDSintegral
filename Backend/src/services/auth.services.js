// Importa el proveedor de usuarios para interactuar con la base de datos.
const UserProvider = require("../providers/user.provider");
// Importa bcrypt para comparar contraseñas encriptadas de forma segura.
const bcrypt = require("bcrypt");

// Valida si el email y la contraseña de un usuario son correctos.
const validateUser = async (body) => {
  try {
    const query = { email: body.email };
    const foundUser = await UserProvider.findOne(query);
    if (!foundUser) return null;
    const compare = await bcrypt.compare(body.password, foundUser.password);
    if (!compare) return "PasswordError";
    return foundUser; // El usuario ya está normalizado
  } catch (error) {
    console.error("Error en validateUser:", error.message);
    throw new Error(error.message);
  }
};

// Exporta la función para ser usada en los servicios de autenticación.
module.exports = { validateUser };

