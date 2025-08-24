// Importa el manejador de errores para centralizar el manejo de excepciones en la API.
const errorHandler = require("../handlers/ErrorHandler");
// Importa el manejador de respuestas HTTP para estandarizar las respuestas al cliente.
const HttpResponse = require("../handlers/HttpResponse");
// Importa el servicio de usuarios, que contiene la lógica de negocio para interactuar con la base de datos.
const { userService } = require("../services/index.services");

// Crea un nuevo usuario con los datos enviados en el cuerpo de la solicitud.
const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body); // Llama al servicio para crear el usuario.
    return HttpResponse.created(res, newUser); // Devuelve una respuesta 201 con el usuario creado.
  } catch (error) {
    return errorHandler(error, res, "Crear usuario"); // Maneja cualquier error durante la creación.
  }
};

// Busca y devuelve un usuario específico por su ID.
const getUser = async (req, res) => {
  const action = "Buscar usuario";
  try {
    const user = await userService.getUser(req.params.userId); // Busca el usuario por ID.
    if (!user) return HttpResponse.notFound(res, { action: action, error: "Usuario no encontrado" }); // 404 si no existe.
    return HttpResponse.success(res, user); // Devuelve el usuario encontrado.
  } catch (error) {
    return errorHandler(error, res, action); // Maneja errores durante la búsqueda.
  }
};

// Devuelve una lista de todos los usuarios registrados.
const getAllUsers = async (req, res) => {
  const action = "Buscar usuarios";
  try {
    const users = await userService.getAllUsers(); // Obtiene todos los usuarios.
    if (!users) return HttpResponse.notFound(res, { action: action, message: "No se encontraron usuarios" }); // 404 si no hay usuarios.
    return HttpResponse.success(res, users); // Devuelve la lista de usuarios.
  } catch (error) {
    return errorHandler(error, res, action); // Maneja errores durante la consulta.
  }
};

// Actualiza los datos de un usuario, solo si el ID del usuario coincide con el usuario autenticado.
const updateUser = async (req, res) => {
  const action = "Actualizar usuario";
  try {
    if (req.params.userId == req.user.id) { // Verifica que el usuario solo pueda actualizar su propio perfil.
      const updatedUser = await userService.updateUser(req.params.userId, req.body, req.user); // Actualiza el usuario.
      if (updatedUser == "PasswordError") return HttpResponse.badRequest(res, { action, message: "Contraseña incorrecta" }); // 400 si la contraseña es incorrecta.
      if (!updatedUser) return HttpResponse.notFound(res, { action, message: "Usuario no encontrado" }); // 404 si no existe.
      return HttpResponse.success(res, updatedUser); // Devuelve el usuario actualizado.
    }
    return HttpResponse.forbidden(res); // 403 si intenta actualizar otro usuario.
  } catch (error) {
    return errorHandler(error, res, action); // Maneja errores durante la actualización.
  }
};

// Elimina un usuario, solo si el ID del usuario coincide con el usuario autenticado.
const deleteUser = async (req, res) => {
  const action = "Eliminar usuario";
  try {
    if (req.params.userId == req.user.id) { // Verifica que el usuario solo pueda eliminarse a sí mismo.
      const deletedUser = await userService.deleteUser(req.params.userId); // Elimina el usuario.
      if (!deletedUser) return HttpResponse.notFound(res, { action, message: "Usuario no encontrado" }); // 404 si no existe.
      return HttpResponse.noContent(res, action); // Devuelve una respuesta 204 (sin contenido) si se elimina correctamente.
    }
    return HttpResponse.forbidden(res); // 403 si intenta eliminar otro usuario.
  } catch (error) {
    return errorHandler(error, res, action); // Maneja errores durante la eliminación.
  }
};

// Recupera un usuario previamente eliminado.
const recoverUser = async (req, res) => {
  const action = "Recuperar usuario";
  try {
    const user = await userService.recoverUser(req.params.userId); // Recupera el usuario por ID.
    if (!user) return HttpResponse.notFound(res, { action, message: "Usuario no encontrado" }); // 404 si no existe.
    return HttpResponse.success(res, user); // Devuelve el usuario recuperado.
  } catch (error) {
    return errorHandler(error, res, action); // Maneja errores durante la recuperación.
  }
};

// Exporta todas las funciones del controlador para ser usadas en las rutas.
module.exports = { createUser, getUser, getAllUsers, updateUser, deleteUser, recoverUser };
